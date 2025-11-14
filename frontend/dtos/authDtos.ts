import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

const createUserSchema = userSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  repeatPassword: z.string().min(6, "Please repeat your password"),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords do not match",
  path: ["repeatPassword"],
});

export { userSchema, createUserSchema };
