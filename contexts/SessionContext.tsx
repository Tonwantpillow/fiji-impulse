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
  email?: string;
  role?: string;
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

          if (response.data && response.data.authenticated) {
            // Session is still valid, update user data from backend
            const updatedUserData: User = {
              id: response.data.user?.id || userData.id,
              username: response.data.user?.username || userData.username,
              email: response.data.user?.email || userData.email,
              role: response.data.user?.role || userData.role,
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

      if (response.data && response.data === "Login success") {
        // After successful login, get user data from /me endpoint
        try {
          const userResponse = await axios.get('http://localhost:8081/auth/me', {
            withCredentials: true
          });

          if (userResponse.data && userResponse.data.authenticated) {
            const userData: User = {
              id: userResponse.data.user.id.toString(),
              username: userResponse.data.user.username,
              email: userResponse.data.user.email,
              role: userResponse.data.user.role,
            };

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            setShowLoginModal(false);
            return true;
          }
        } catch (userError) {
          console.error("Failed to get user data after login:", userError);
          // Even if we can't get user data, login was successful
          const userData: User = {
            id: Date.now().toString(),
            username: username,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setShowLoginModal(false);
          return true;
        }
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

    // Default return in case no other path is taken
    return false;
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

  // Show login modal if user is not authenticated and not on public pages
  // Allow browsing on home page and product-details without login
  useEffect(() => {
    if (!isLoading && !user && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      // Exclude public pages that don't require login
      const publicPages = ["/", "/login", "/register"];
      // Also exclude product-details pages (they start with /product-details)
      const isProductDetailsPage = pathname.startsWith("/product-details");

      if (!publicPages.includes(pathname) && !isProductDetailsPage) {
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
