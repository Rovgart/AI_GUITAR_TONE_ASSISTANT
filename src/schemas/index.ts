import z from "zod";

export const generateFormSchema = z.object({
  band: z
    .string()
    .min(0, { message: "Please enter band tone, you want to achieve" })
    .max(60, { message: "This field cannot be that big" }),
});

export const registerFormSchema = z
  .object({
    username: z.string(),
    email: z.string().email({ message: "This doesn't look like an email" }),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password doesn't match with password",
    path: ["confirmPassword"],
  });
