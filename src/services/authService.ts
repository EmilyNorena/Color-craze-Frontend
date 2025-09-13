import apiClient from "../services/axiosService";

import type { LoginResponse } from "../types/loginResponse";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const API_AUTH_URL = "http://localhost:8080/api/auth";
  const url = `${API_AUTH_URL}/login`;

  const response = await apiClient.post<LoginResponse>(url, {
    email,
    password,
  });
    
  return response.data;
}

export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  const API_AUTH_URL = "http://localhost:8080/api/auth";
  const url = `${API_AUTH_URL}/refresh`;

  const response = await apiClient.post<LoginResponse>(url, {
    refreshToken,
  });

  return response.data;
}