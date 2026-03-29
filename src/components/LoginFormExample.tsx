/**
 * SIMPLE LOGIN FORM EXAMPLE
 * 
 * This shows that once you set up the system,
 * creating a new form takes just a few lines!
 * 
 * Notice how it's almost identical to YupFormDemo,
 * but uses loginSchema instead of signupSchema
 */

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField } from "./ui/form-field";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { loginSchema } from "../lib/validationSchemas";
import type { LoginFormData } from "../lib/validationSchemas";
export function LoginFormExample() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema), // ← Different schema!
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("✅ Login successful:", data);
    toast.success("Logged in!");
    reset();
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg space-y-6 bg-white shadow-lg">
      <div>
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-gray-600 text-sm mt-1">
          Sign in to your account
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Email"
          placeholder="your@email.com"
          registration={register("email")}
          error={errors.email}
          type="email"
        />

        <FormField
          label="Password"
          placeholder="Your password"
          registration={register("password")}
          error={errors.password}
          type="password"
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <p className="text-sm text-gray-600 text-center">
        Same validation system, different form! ✨
      </p>
    </div>
  );
}
