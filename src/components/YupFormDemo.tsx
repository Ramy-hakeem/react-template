/**
 * YUP + REACT-HOOK-FORM INTEGRATION DEMO
 * 
 * This shows how to:
 * 1. Pick a schema (like picking a LEGO blueprint)
 * 2. Set up the form (build with LEGO)
 * 3. Use FormField components (attach the pieces)
 * 4. Handle submission (finish the build!)
 * 
 * Once you learn this pattern, you can create ANY form in your project!
 */

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField } from "./ui/form-field";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { signupSchema } from "../lib/validationSchemas";
import type { SignupFormData } from "../lib/validationSchemas";

export function YupFormDemo() {
  /**
   * Step 1: Initialize the form with Yup schema
   * 
   * Translation:
   * "Dear react-hook-form, use this Yup schema to validate my form"
   * mode: "onChange" = Check validation as user types (instant feedback)
   */
  const {
    register, // Connects inputs to form
    handleSubmit, // Checks validation before submitting
    formState: { errors }, // Contains error messages
    reset, // Clears the form
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema), // Use the signupSchema from validationSchemas.ts
    mode: "onChange", // Validate while typing
  });

  /**
   * Step 2: Handle form submission
   * This only runs if ALL validations pass!
   */
  const onSubmit = (data: SignupFormData) => {
    console.log("✅ Form is valid! Submitted data:", data);
    toast.success("Account created successfully!");
    reset(); // Clear form after success
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg space-y-6 bg-white shadow-lg">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-gray-600 text-sm mt-1">
          Try typing and see validation in action!
        </p>
      </div>

      <Separator />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 
          FIELD 1: NAME
          
          How it works:
          1. label = What the user sees
          2. registration = register("name") - connects to form
          3. error = errors.name - shows error if invalid
          4. helperText = Helpful hint
          5. type = "text" - HTML input type
        */}
        <FormField
          label="Full Name"
          placeholder="John Doe"
          helperText="At least 2 characters"
          registration={register("name")}
          error={errors.name}
          type="text"
        />

        {/* FIELD 2: EMAIL */}
        <FormField
          label="Email Address"
          placeholder="john@example.com"
          helperText="Must be a valid email"
          registration={register("email")}
          error={errors.email}
          type="email"
        />

        {/* FIELD 3: PASSWORD */}
        <FormField
          label="Password"
          placeholder="Enter password"
          helperText="At least 8 characters"
          registration={register("password")}
          error={errors.password}
          type="password"
        />

        {/* FIELD 4: CONFIRM PASSWORD */}
        {/* 
          This one is special - Yup checks if it matches the password field!
          This is done in validationSchemas.ts with: 
          oneOf([yup.ref("password")], "Passwords must match")
        */}
        <FormField
          label="Confirm Password"
          placeholder="Password again"
          helperText="Must match your password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword}
          type="password"
        />

        {/* FIELD 5: AGE */}
        <FormField
          label="Age"
          placeholder="18"
          helperText="Must be 18 or older"
          registration={register("age")}
          error={errors.age}
          type="number"
        />

        {/* SUBMIT BUTTON */}
        {/* Only works if all validations pass! */}
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>

      <Separator />

      {/* Educational Info Box */}
      <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-3">
        <p className="font-semibold text-blue-900">How to use this anywhere:</p>
        <div className="space-y-2 text-blue-800">
          <p>
            <strong>1. Import schema:</strong>
            <br />
            <code className="text-xs bg-white px-2 py-1 rounded">
              import {"{"} loginSchema {"}"} from "../lib/validationSchemas"
            </code>
          </p>
          <p>
            <strong>2. Use in form:</strong>
            <br />
            <code className="text-xs bg-white px-2 py-1 rounded">
              resolver: yupResolver(loginSchema)
            </code>
          </p>
          <p>
            <strong>3. Add FormField components</strong> for each input
          </p>
          <p>
            <strong>✨ That's it!</strong> Works in any component!
          </p>
        </div>
      </div>

      {/* Example Schemas Available */}
      <div className="bg-green-50 p-4 rounded-lg text-sm space-y-2">
        <p className="font-semibold text-green-900">Available Pre-built Schemas:</p>
        <ul className="text-green-800 space-y-1 text-xs">
          <li>✓ <code>signupSchema</code> - For user registration</li>
          <li>✓ <code>loginSchema</code> - For login forms</li>
          <li>✓ <code>profileSchema</code> - For profile updates</li>
          <li>✓ <code>contactSchema</code> - For contact forms</li>
          <li>✓ Create your own by mixing validation fields!</li>
        </ul>
      </div>
    </div>
  );
}
