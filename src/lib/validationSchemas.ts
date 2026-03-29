/**
 * YUP VALIDATION SCHEMAS
 * 
 * Think of Yup like a LEGO system for building validation rules:
 * - Each piece = a validation rule
 * - You can mix and match pieces to build different forms
 * - Each form gets its own blueprint (schema)
 * 
 * This means you can reuse the same validation rules across your entire project!
 */

import * as yup from "yup";

/**
 * INDIVIDUAL VALIDATION RULES (like LEGO pieces)
 * These can be mixed and matched for different forms
 */

// Email validation
export const emailField = yup
  .string()
  .email("Must be a valid email address")
  .required("Email is required");

// Password validation
export const passwordField = yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .required("Password is required");

// Confirm password validation (must match password)
export const confirmPasswordField = yup
  .string()
  .oneOf([yup.ref("password")], "Passwords must match")
  .required("Please confirm your password");

// Name validation
export const nameField = yup
  .string()
  .min(2, "Name must be at least 2 characters")
  .required("Name is required");

// Age validation
export const ageField = yup
  .number()
  .min(18, "You must be at least 18 years old")
  .max(120, "Please enter a valid age")
  .required("Age is required")
  .typeError("Age must be a number");

// Phone validation
export const phoneField = yup
  .string()
  .matches(/^\d{10}$/, "Phone number must be 10 digits")
  .required("Phone number is required");

// URL validation
export const urlField = yup
  .string()
  .url("Must be a valid URL")
  .required("URL is required");

/**
 * COMPLETE SCHEMAS (built from LEGO pieces)
 * Ready to use in forms!
 */

// Schema for signup form
export const signupSchema = yup.object().shape({
  name: nameField,
  email: emailField,
  password: passwordField,
  confirmPassword: confirmPasswordField,
  age: ageField,
});

// Schema for login form
export const loginSchema = yup.object().shape({
  email: emailField,
  password: passwordField,
});

// Schema for profile update
export const profileSchema = yup.object().shape({
  name: nameField,
  email: emailField,
  phone: phoneField,
  age: ageField,
});

// Schema for contact form
export const contactSchema = yup.object().shape({
  name: nameField,
  email: emailField,
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

export type SignupFormData = yup.InferType<typeof signupSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type ProfileFormData = yup.InferType<typeof profileSchema>;
export type ContactFormData = yup.InferType<typeof contactSchema>;
