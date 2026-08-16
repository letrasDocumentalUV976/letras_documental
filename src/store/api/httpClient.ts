export const requestJson = async <T>(
  input: string,
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.message ?? "Request failed");
  }
  return body.data as T;
};
