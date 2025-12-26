const backend_url = import.meta.env.VITE_BACKEND_URL

export async function fetchGet<T>(
  url: string,
  headers?: Record<string, string>): Promise<T> {

  if (!headers) headers = {}
  const response = await fetch(backend_url + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  try {
    const data = await response.json();
    if (!response.ok) {
      return Promise.reject(new Error(data.message || "Unknown error."));
    }
    return Promise.resolve(data as T);
  } catch (error) {
    return Promise.reject(new Error("Invalid JSON response."));
  }
}

export async function fetchPost<T>(
  url: string,
  body: any,
  headers?: Record<string, string>
): Promise<T> {
  const response = await fetch(backend_url + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  try {
    const data = await response.json();
    if (!response.ok) {
      return Promise.reject(new Error(data.message || "Unknown error."));
    }
    return data as T;
  } catch (error) {
    return Promise.reject(new Error("Invalid JSON response."));
  }
}


export async function fetchDelete<T>(
  url: string,
  headers: Record<string, string> = {}
): Promise<T> {
  const response = await fetch(backend_url + url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
  }

  return response.json();
}
