const base = ''; // same origin; Vite proxy sends /api to backend

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include', // important: send/receive session cookies
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === 'string' ? data : data.error || 'Request failed';
    throw new Error(message);
  }

  return data;
}
