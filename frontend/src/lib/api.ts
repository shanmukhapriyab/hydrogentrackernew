const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export type ApiOptions = RequestInit & { auth?: boolean };

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = true, headers, ...request } = options;
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${path}`, {
    ...request,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || 'Request failed');
  }
  return body as T;
}

export { API_URL };
