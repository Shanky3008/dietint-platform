// Role constants for the application
export const ROLES = {
  CLIENT: 'CLIENT',
  COACH: 'COACH',
  ADMIN: 'ADMIN',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Default role for new user registrations
export const DEFAULT_ROLE = ROLES.CLIENT;

// Role hierarchy for permission checks
export const ROLE_HIERARCHY: Record<Role, number> = {
  CLIENT: 1,
  COACH: 2,
  ADMIN: 3,
};

// Helper function to check if a role has permission
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
