import { ApiResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, headers, ...restOptions } = options;

  const authHeader: Record<string, string> = {};
  const storedToken =
    token !== undefined
      ? token
      : typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (storedToken) {
    authHeader["Authorization"] = `Bearer ${storedToken}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...headers,
      },
      ...restOptions,
    });

    const data: ApiResponse<T> = await res.json();

    if (!res.ok) {
      const errorMsg =
        data.message ||
        (data.errorSources && data.errorSources[0]?.message) ||
        `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error occurred";
    throw new Error(message);
  }
}
