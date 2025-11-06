import api from "../axiosConfig";

const authService = {
  login: async (credentials) => {
    try {
      debugger
      const res = await api.post("/auth/login", credentials);
      const { token, role, expiresAt, refreshToken } = res.data;
      
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role || "user");
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (expiresAt) localStorage.setItem("expiresAt", expiresAt);
      }
      
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Login failed" };
    }
  },

  register: async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      // same logic as login
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Registration failed" };
    }
  },

  logout: () => {
    localStorage.clear();
  },
};

export default authService;