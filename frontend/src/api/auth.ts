import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface AuthResponse {
  access_token: string;
}

export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  console.log("Login request", username, password);
  const res = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, {
    username,
    password,
  });
  return res.data;
}

export async function register(
  username: string,
  password: string
): Promise<{ id: string; username: string }> {
  const res = await axios.post<{ id: string; username: string }>(
    `${BASE_URL}/auth/register`,
    { username, password }
  );
  return res.data;
}
