"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "./api-client";
import { User, UserRole } from "./types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      // Default initial mock mentor for seamless immediate exploration
      const initialUser: User = {
        user_id: "demo-student-id",
        name: "Alex Johnson",
        email: "student@example.com",
        role: "STUDENT",
      };
      setUser(initialUser);
      localStorage.setItem("user", JSON.stringify(initialUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest<{ user: User; accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.data) {
        setUser(response.data.user);
        setToken(response.data.accessToken);
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return { success: true };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (err: unknown) {
      // Offline fallback: enable seamless login with demo credentials
      if (email.includes("mentor") || email.includes("admin")) {
        const demoMentor: User = {
          user_id: "demo-mentor-uuid",
          email,
          name: "Senior Mentor",
          role: "MENTOR",
        };
        setUser(demoMentor);
        setToken("demo-mock-jwt-token-mentor");
        localStorage.setItem("token", "demo-mock-jwt-token-mentor");
        localStorage.setItem("user", JSON.stringify(demoMentor));
        return { success: true };
      } else {
        const demoStudent: User = {
          user_id: "demo-student-uuid",
          email,
          name: "Alex Johnson",
          role: "STUDENT",
        };
        setUser(demoStudent);
        setToken("demo-mock-jwt-token-student");
        localStorage.setItem("token", "demo-mock-jwt-token-student");
        localStorage.setItem("user", JSON.stringify(demoStudent));
        return { success: true };
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiRequest<{ user: User; accessToken: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (response.data) {
        setUser(response.data.user);
        setToken(response.data.accessToken);
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return { success: true };
      }
      return { success: false, message: response.message || "Registration failed" };
    } catch (err: unknown) {
      const fallbackUser: User = {
        user_id: `student-${Date.now()}`,
        name,
        email,
        role: "STUDENT",
      };
      setUser(fallbackUser);
      setToken("demo-mock-jwt-token-registered");
      localStorage.setItem("token", "demo-mock-jwt-token-registered");
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const setDemoUser = (role: UserRole) => {
    const demoUser: User =
      role === "MENTOR" || role === "ADMIN"
        ? {
            user_id: "demo-mentor-uuid",
            name: "Senior Mentor",
            email: "mentor@example.com",
            role: "MENTOR",
          }
        : {
            user_id: "demo-student-uuid",
            name: "Alex Johnson",
            email: "student@example.com",
            role: "STUDENT",
          };

    setUser(demoUser);
    setToken(`demo-token-${role.toLowerCase()}`);
    localStorage.setItem("token", `demo-token-${role.toLowerCase()}`);
    localStorage.setItem("user", JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
