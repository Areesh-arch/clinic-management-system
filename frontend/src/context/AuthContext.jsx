import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../services/api";

import {
  loginUser as loginRequest,
  logoutUser,
} from "../services/authService";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // LOAD CURRENT USER
  // =====================================================

  const loadCurrentUser =
    async () => {

      const token =
        localStorage.getItem(
          "access_token"
        ) ||
        sessionStorage.getItem(
          "access_token"
        );


      if (!token) {

        setUser(null);
        setLoading(false);

        return null;
      }


      try {

        setLoading(true);

        const currentUser =
          await apiRequest(
            "/auth/me"
          );

        setUser(
          currentUser
        );

        return currentUser;

      } catch (error) {

        console.error(
          "Failed to load current user:",
          error
        );

        logoutUser();

        setUser(null);

        return null;

      } finally {

        setLoading(false);
      }
    };


  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (
    email,
    password,
    rememberMe = false
  ) => {

    // -----------------------------------------------
    // Step 1: Authenticate
    // -----------------------------------------------

    await loginRequest(
      email,
      password,
      rememberMe
    );


    // -----------------------------------------------
    // Step 2: Load Current User
    // -----------------------------------------------

    const currentUser =
      await loadCurrentUser();


    if (!currentUser) {

      throw new Error(
        "Login succeeded, but user information could not be loaded."
      );
    }


    return currentUser;
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    logoutUser();

    setUser(null);
  };


  // =====================================================
  // INITIAL AUTH CHECK
  // =====================================================

  useEffect(() => {

    loadCurrentUser();

  }, []);


  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser:
      loadCurrentUser,
  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// =========================================================
// USE AUTH
// =========================================================

export function useAuth() {
  return useContext(
    AuthContext
  );
}