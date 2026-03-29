/**
 * SMART FORM INPUT COMPONENT
 * 
 * This component is like a universal LEGO piece that works with:
 * - react-hook-form (the form manager)
 * - Yup (the validation system)
 * 
 * You can drop this into any form, and it automatically:
 * ✓ Tracks the input
 * ✓ Validates the input
 * ✓ Shows errors
 * ✓ Looks good (with Tailwind)
 */

import type{ InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "./input";
import { Label } from "./label";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * The label text shown above the input
   * Example: "Email Address"
   */
  label: string;

  /**
   * The error object from react-hook-form
   * Shows error messages if validation fails
   */
  error?: FieldError;

  /**
   * Helpful text displayed below the input
   * Example: "At least 8 characters"
   */
  helperText?: string;

  /**
   * The register function returned by useForm()
   * This connects the input to the form
   */
  registration: UseFormRegisterReturn;
}

export function FormField({
  label,
  error,
  helperText,
  registration,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {/* Label */}
      <Label htmlFor={registration.name}>{label}</Label>

      {/* Input - smart enough to show red if invalid */}
      <Input
        id={registration.name}
        {...registration}
        {...inputProps}
        className={`${error ? "border-red-500 focus:ring-red-500" : ""}`}
      />

      {/* Error message in red - only shows if there's an error */}
      {error && (
        <p className="text-red-500 text-sm font-medium">{error.message}</p>
      )}

      {/* Helper text - only shows if NO error */}
      {helperText && !error && (
        <p className="text-gray-500 text-sm">{helperText}</p>
      )}
    </div>
  );
}
