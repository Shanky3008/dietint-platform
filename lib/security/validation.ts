// Comprehensive input validation and sanitization
import { NextApiRequest } from 'next';

// Validation error class
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Validation schema types
export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'date' | 'phone' | 'password';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  sanitize?: boolean;
  allowedValues?: any[];
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// Sanitization functions
export class Sanitizer {
  static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  static removeScripts(text: string): string {
    return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\(\)\s]/g, '');
  }

  static sanitizeString(text: string): string {
    return this.escapeHtml(this.removeScripts(text.trim()));
  }

  static sanitizeNumber(value: string | number): number {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
  }

  static sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new ValidationError('Invalid URL protocol');
      }
      return parsed.toString();
    } catch {
      throw new ValidationError('Invalid URL format');
    }
  }

  static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9\-_\.]/g, '_');
  }
}

// Validator class
export class Validator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
  private static readonly URL_REGEX = /^https?:\/\/.+/;
  private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/[^\d+]/g, '');
    return this.PHONE_REGEX.test(cleaned);
  }

  static validateUrl(url: string): boolean {
    return this.URL_REGEX.test(url);
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    return { valid: errors.length === 0, errors };
  }

  static validateCreditCard(cardNumber: string): boolean {
    // Luhn algorithm
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 && digits.length >= 13 && digits.length <= 19;
  }

  static validateDate(date: string): boolean {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed.toISOString().split('T')[0] === date;
  }

  static validateField(value: any, rule: ValidationRule, fieldName: string): any {
    // Check required
    if (rule.required && (value === null || value === undefined || value === '')) {
      throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
    }

    // Return early if value is empty and not required
    if (!rule.required && (value === null || value === undefined || value === '')) {
      return value;
    }

    // Type conversion and validation
    let processedValue = value;

    switch (rule.type) {
      case 'string':
        processedValue = String(value);
        if (rule.sanitize) {
          processedValue = Sanitizer.sanitizeString(processedValue);
        }
        break;

      case 'number':
        processedValue = Sanitizer.sanitizeNumber(value);
        if (isNaN(processedValue)) {
          throw new ValidationError(`${fieldName} must be a valid number`, fieldName, 'INVALID_TYPE');
        }
        break;

      case 'boolean':
        processedValue = Boolean(value);
        break;

      case 'email':
        processedValue = Sanitizer.sanitizeEmail(String(value));
        if (!this.validateEmail(processedValue)) {
          throw new ValidationError(`${fieldName} must be a valid email address`, fieldName, 'INVALID_EMAIL');
        }
        break;

      case 'url':
        processedValue = String(value);
        if (!this.validateUrl(processedValue)) {
          throw new ValidationError(`${fieldName} must be a valid URL`, fieldName, 'INVALID_URL');
        }
        if (rule.sanitize) {
          processedValue = Sanitizer.sanitizeUrl(processedValue);
        }
        break;

      case 'phone':
        processedValue = Sanitizer.sanitizePhone(String(value));
        if (!this.validatePhone(processedValue)) {
          throw new ValidationError(`${fieldName} must be a valid phone number`, fieldName, 'INVALID_PHONE');
        }
        break;

      case 'password':
        const passwordValidation = this.validatePassword(String(value));
        if (!passwordValidation.valid) {
          throw new ValidationError(
            `${fieldName}: ${passwordValidation.errors.join(', ')}`,
            fieldName,
            'INVALID_PASSWORD'
          );
        }
        processedValue = String(value);
        break;

      case 'date':
        if (!this.validateDate(String(value))) {
          throw new ValidationError(`${fieldName} must be a valid date (YYYY-MM-DD)`, fieldName, 'INVALID_DATE');
        }
        processedValue = String(value);
        break;

      default:
        processedValue = value;
    }

    // Length validation for strings
    if (typeof processedValue === 'string') {
      if (rule.minLength && processedValue.length < rule.minLength) {
        throw new ValidationError(
          `${fieldName} must be at least ${rule.minLength} characters long`,
          fieldName,
          'MIN_LENGTH'
        );
      }

      if (rule.maxLength && processedValue.length > rule.maxLength) {
        throw new ValidationError(
          `${fieldName} must be no more than ${rule.maxLength} characters long`,
          fieldName,
          'MAX_LENGTH'
        );
      }
    }

    // Numeric range validation
    if (typeof processedValue === 'number') {
      if (rule.min !== undefined && processedValue < rule.min) {
        throw new ValidationError(
          `${fieldName} must be at least ${rule.min}`,
          fieldName,
          'MIN_VALUE'
        );
      }

      if (rule.max !== undefined && processedValue > rule.max) {
        throw new ValidationError(
          `${fieldName} must be no more than ${rule.max}`,
          fieldName,
          'MAX_VALUE'
        );
      }
    }

    // Pattern validation
    if (rule.pattern && typeof processedValue === 'string') {
      if (!rule.pattern.test(processedValue)) {
        throw new ValidationError(
          `${fieldName} format is invalid`,
          fieldName,
          'INVALID_PATTERN'
        );
      }
    }

    // Allowed values validation
    if (rule.allowedValues && !rule.allowedValues.includes(processedValue)) {
      throw new ValidationError(
        `${fieldName} must be one of: ${rule.allowedValues.join(', ')}`,
        fieldName,
        'INVALID_VALUE'
      );
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(processedValue);
      if (customResult !== true) {
        const message = typeof customResult === 'string' ? customResult : `${fieldName} is invalid`;
        throw new ValidationError(message, fieldName, 'CUSTOM_VALIDATION');
      }
    }

    return processedValue;
  }

  static validateObject(data: any, schema: ValidationSchema): Record<string, any> {
    const result: Record<string, any> = {};
    const errors: ValidationError[] = [];

    // Validate each field
    Object.entries(schema).forEach(([fieldName, rule]) => {
      try {
        result[fieldName] = this.validateField(data[fieldName], rule, fieldName);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error);
        } else {
          errors.push(new ValidationError(`Validation failed for ${fieldName}`, fieldName));
        }
      }
    });

    // Check for unexpected fields
    Object.keys(data).forEach(key => {
      if (!schema[key]) {
        errors.push(new ValidationError(`Unexpected field: ${key}`, key, 'UNEXPECTED_FIELD'));
      }
    });

    if (errors.length > 0) {
      const combinedMessage = errors.map(e => e.message).join('; ');
      const error = new ValidationError(combinedMessage);
      (error as any).validationErrors = errors;
      throw error;
    }

    return result;
  }
}

// Validation schemas for common forms
export const AuthSchemas = {
  register: {
    fullName: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 100,
      sanitize: true,
    },
    email: {
      required: true,
      type: 'email' as const,
    },
    password: {
      required: true,
      type: 'password' as const,
    },
    phone: {
      required: false,
      type: 'phone' as const,
    },
  },

  login: {
    email: {
      required: true,
      type: 'email' as const,
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 1,
    },
  },
};

export const PaymentSchemas = {
  payment: {
    amount: {
      required: true,
      type: 'number' as const,
      min: 0.01,
      max: 10000,
    },
    currency: {
      required: false,
      type: 'string' as const,
      allowedValues: ['USD', 'EUR', 'GBP'],
    },
    paymentMethod: {
      required: true,
      type: 'string' as const,
      allowedValues: ['credit_card', 'paypal', 'bank_transfer'],
    },
  },
};

// Middleware for API validation
export function withValidation(schema: ValidationSchema) {
  return (handler: (req: NextApiRequest & { validatedData: any }, res: any) => Promise<void>) => {
    return async (req: NextApiRequest, res: any) => {
      try {
        const validatedData = Validator.validateObject(req.body, schema);
        (req as any).validatedData = validatedData;
        return await handler(req as any, res);
      } catch (error) {
        if (error instanceof ValidationError) {
          return res.status(400).json({
            error: 'Validation failed',
            message: error.message,
            validationErrors: (error as any).validationErrors || [error],
          });
        }
        throw error;
      }
    };
  };
}

export { Validator, Sanitizer };