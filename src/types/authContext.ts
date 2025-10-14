import type { UserData } from "../types/user";

export interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  user: UserData | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  guestLogin: () => Promise<void>;
}
