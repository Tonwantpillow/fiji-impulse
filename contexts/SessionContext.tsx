"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  // Add other user fields as needed
}

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check session validity on mount and when user changes
  useEffect(() => {
    validateSession();
  }, []);

  const validateSession = async () => {
    setIsLoading(true);
    try {
      // First check if we have a stored session
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);

        // Validate session with backend
        try {
          const response = await axios.get('http://localhost:8081/auth/me', {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true // Important for session cookies
          });

          if (response.data && response.data.valid) {
            // Session is still valid, update user data if needed
            const updatedUserData: User = {
              id: response.data.user?.id || userData.id,
              username: response.data.user?.username || userData.username,
            };
            setUser(updatedUserData);
            localStorage.setItem("user", JSON.stringify(updatedUserData));
          } else {
            // Session expired or invalid
            setUser(null);
            localStorage.removeItem("user");
          }
        } catch (validationError) {
          // If validation fails, clear session
          console.error("Session validation failed:", validationError);
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Session validation setup failed:", error);
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      // Make actual API call to login endpoint
      const response = await axios.post('http://localhost:8081/auth/login', {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // If you're using cookies
      });

      if (response.data && response.data.success) {
        // Store user data from response
        const userData: User = {
          id: response.data.user?.id || response.data.id,
          username: response.data.user?.username || response.data.username,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setShowLoginModal(false);
        return true;
      } else {
        // Login failed but no error thrown
        return false;
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);

        // You can return specific error messages based on status
        if (error.response.status === 401) {
          console.error("Invalid credentials");
        } else if (error.response.status === 500) {
          console.error("Server error");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
      }

      return false;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await axios.post('http://localhost:8081/auth/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Important for clearing session cookies
      });

      // Clear local state regardless of API response
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // Show login modal if user is not authenticated and not on login/register pages
  // Use setTimeout to ensure page renders before modal appears
  useEffect(() => {
    if (!isLoading && !user && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname !== "/login" && pathname !== "/register") {
        // Delay showing modal to allow page to render first
        const timer = setTimeout(() => {
          setShowLoginModal(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, isLoading]);

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
