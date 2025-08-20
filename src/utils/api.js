export const apiFetch = async (url, options = {}, token) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = `API Error: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (err) {
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  return res.json();
};
