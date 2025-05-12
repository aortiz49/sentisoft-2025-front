const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${backendApiUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(error.message || 'Failed to register user');
  }

  return await res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${backendApiUrl}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(error.message || 'Failed to login user');
  }

  return await res.json();
}

export async function getProfile(token: string) {
  const res = await fetch(`${backendApiUrl}/auth/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await res.json();
}
