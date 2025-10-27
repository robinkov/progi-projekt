import API_URL from "@/constants/API_URL";
import { User } from "@/types/User";

export async function getUserWithToken(token: string): Promise<User> {
  const response = await fetch(API_URL + "/users/get");
  const result = await response.json() as Promise<User>;

  return result;
}
