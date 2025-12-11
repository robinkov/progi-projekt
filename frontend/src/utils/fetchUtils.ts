export async function fetchGet<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: "GET" });

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

export async function fetchPost<T>(url: string, body: any): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
