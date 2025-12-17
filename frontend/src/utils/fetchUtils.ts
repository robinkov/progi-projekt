const backend_url = import.meta.env.VITE_BACKEND_URL

export async function fetchGet<T>(url: string): Promise<T> {
  const response = await fetch(backend_url + url, { method: "GET" });

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
      ...headers, // merge your custom headers here
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
