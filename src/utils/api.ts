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
  const res = await fetch('http://localhost:8000/auth/login', {
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
