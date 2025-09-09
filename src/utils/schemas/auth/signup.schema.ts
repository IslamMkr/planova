import { z } from 'zod';

/** Names: allow international letters, spaces, apostrophes, hyphens.
 *  - trims + collapses multiple spaces
 *  - 2–50 chars, must start/end with a letter
 */
const nameSchema = z
  .string()
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be at most 50 characters')
  .regex(
    /^\p{L}(?:[\p{L}\p{M}' -]*\p{L})$/u,
    'Only letters, spaces, apostrophes, and hyphens',
  )
  .transform((v) => v.trim().replace(/\s+/g, ' '));

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

// Accept boolean, but validate it must be true
const termsSchema = z.boolean().refine((v) => v === true, {
  message: 'You must agree to the Terms & Conditions',
});

export const signupSchema = z
  .object({
    email: emailSchema,
    firstname: nameSchema,
    lastname: nameSchema,
    password: passwordSchema,
    agreeToTerms: termsSchema,
  })
  .strict(); // reject unknown fields

export type SignupFormData = z.infer<typeof signupSchema>;
