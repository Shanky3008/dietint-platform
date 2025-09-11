import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabaseAdapter, getDatabase } from '../../../lib/database';
import { DEFAULT_ROLE } from '../../../lib/roles';

const JWT_SECRET = process.env.JWT_SECRET || 'coachpulse_secret_key_2024';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let { fullName, email, password, role = DEFAULT_ROLE, invite_code } = req.body;
    // Enforce invite-only for CLIENT registrations
    const normalizedRole = String(role || '').toUpperCase();
    if ((normalizedRole === 'CLIENT' || normalizedRole === '' || !normalizedRole) && !invite_code) {
      return res.status(400).json({ error: 'Invite code is required for client registration' });
    }

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields: fullName, email, password' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }

    const db = await getDatabaseAdapter();

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Use transaction for invite code validation and user creation
    const dbConnection = await getDatabase();
    let userId;

    try {
      await dbConnection.query('BEGIN');

      // Validate invite code and get organization_id or coach_id if provided (with FOR UPDATE lock)
      let organizationId = null;
      let coachId = null;
      if (invite_code) {
        const inviteResult = await dbConnection.query(
          'SELECT organization_id, coach_id FROM invite_codes WHERE code = $1 AND used_at IS NULL FOR UPDATE',
          [invite_code]
        );

        if (!inviteResult.rows || inviteResult.rows.length === 0) {
          await dbConnection.query('ROLLBACK');
          return res.status(400).json({ error: 'Invalid or already used invite code' });
        }

        organizationId = inviteResult.rows[0].organization_id;
        coachId = inviteResult.rows[0].coach_id;
        
        // If coach invite code, set role to CLIENT
        if (coachId) {
          role = 'CLIENT';
        } else {
          role = normalizedRole || 'CLIENT';
        }
      }

      // Insert new user with organization_id and coach_id
      const result = await dbConnection.query(
        `INSERT INTO users (fullName, email, password, role, organization_id, coach_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
        [fullName, email, hashedPassword, role, organizationId, coachId]
      );

      userId = result.rows[0].id;

      // Mark invite code as used if it was provided
      if (invite_code && (organizationId || coachId)) {
        await dbConnection.query(
          'UPDATE invite_codes SET used_at = CURRENT_TIMESTAMP, used_by_user_id = $1 WHERE code = $2',
          [userId, invite_code]
        );
      }

      await dbConnection.query('COMMIT');
    } catch (transactionError) {
      await dbConnection.query('ROLLBACK');
      throw transactionError;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId, 
        email, 
        role,
        fullName 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        fullName,
        email,
        role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to register user'
    });
  }
}
