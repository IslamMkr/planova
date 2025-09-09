import { z } from 'zod';

/** Email:
 *  - trims, validates, lowercases
 *  - 254 char cap (common practical limit)
 */
const emailSchema = z
  .string()
  .trim()
  .max(254, 'Email is too long')
  .email('Please enter a valid email address')
  .transform((v) => v.toLowerCase());

/** Passwords:
 *  - 12–72 chars (72 is bcrypt-safe; raise if not using bcrypt)
 *  - at least 1 lowercase, 1 uppercase, 1 number, 1 special, no spaces
 *  - split rules for clearer error messages
 */
const passwordSchema = z
  .string()
  .min(12, 'Use at least 12 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[a-z]/, 'Must include a lowercase letter')
  .regex(/[A-Z]/, 'Must include an uppercase letter')
  .regex(/\d/, 'Must include a number')
  .regex(/[^\da-zA-Z]/, 'Must include a special character')
  .regex(/^\S+$/, 'No spaces allowed');

export const signinSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    rememberMe: z.boolean().optional(),
  })
  .strict(); // reject unknown fields

export type SigninFormData = z.infer<typeof signinSchema>;
