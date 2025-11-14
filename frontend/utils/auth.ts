import endpoints from "@/constants/endpoints";
import { createUserSchema } from "@/dtos/authDtos";

type RegisterUserResponse = {
  message: string;
  data: {
    id: string;
    email: string;
  },
  valid: boolean;
};

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  repeatPassword: string
): Promise<RegisterUserResponse> {
  const isValid = createUserSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
    repeatPassword
  });

  if (!isValid.success) {
    throw new Error(isValid.error.errors[0].message);
  }

  const result =  await fetch(endpoints.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "first_name": firstName,
      "last_name": lastName,
      "email": email,
      "password": password,
    })
  });

  if (!result.ok) {
    const errorData = await result.json();
    throw new Error(errorData.error || "Unknown error");
  }

  return result.json();
}
