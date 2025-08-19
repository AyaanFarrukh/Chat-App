import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        try {
          const response = await fetch("http://localhost:5000/api/user-details", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${savedToken}`
            },
            credentials: "include"
          });
          const data = await response.json();
          console.log("data", data);
          if (data.success) {
            console.log("user fetched", data.userData);
            setUser(data.userData);
          } else {
            toast.error("Some Error Happened");
            navigate("/email");
          }
        } catch (error) {
          console.error(error);
          toast.error("Something Went Wrong");
          navigate("/email");
        }
      }
    };
    fetchUser();
  }, [navigate]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, token, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
