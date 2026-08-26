const API_URL = import.meta.env.API_URL;

export class ApiError extends Error {

  errors: string[];

  fieldErrors: Record<string, string>;

  constructor(
    message: string,
    errors: string[] = [],
    fieldErrors: Record<string, string> = {}
  ) {

    super(message);

    this.name = "ApiError";

    this.errors = errors;

    this.fieldErrors = fieldErrors;
  }
}

export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      ...options
    }
  );

  const data = await response.json();

  if (!response.ok) {

    throw new ApiError(
      data.message || "Ocurrió un error",
      Array.isArray(data.errors)
        ? data.errors
        : [],
      data.fieldErrors &&
        typeof data.fieldErrors === "object"
        ? data.fieldErrors
        : {}
    );
  }

  return data;
}