export async function registerUser(email: string, password: string) {
  const res = await fetch('http://localhost:8000/auth/register', {
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
  const res = await fetch('http://localhost:8000/auth/token', {
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
  const res = await fetch('http://127.0.0.1:8000/auth/profile', {
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
