import { ZodObject, ZodRawShape, ZodSchema, ZodTypeAny } from "zod";

export function validateObjectWithSchema<T>(
  schema: ZodSchema<T>,
  object: any
): T {
  const validatedObject = schema.safeParse(object);
  
  if (!validatedObject.success) {
    throw new Error(validatedObject.error.errors[0].message);
  }

  return validatedObject.data;
}
