// import api from "../axiosConfig";

// export const authService = {
//   // ✅ Login
//   login: async (data) => {
//     try {
//       const res = await api.post("/Auth/login", data);

//       // Backend sends AuthViewModel
//       const { token, role, expiresAt, refreshToken } = res.data;
      
//       // Save all authentication data in localStorage
//       if (token) {
//         localStorage.setItem("token", token);
//         // Set role from backend response - it should come from your API
//         if (role) {
//           localStorage.setItem("role", role);
//         }
//         else{
//           localStorage.setItem("role", "user");
//         }
//         localStorage.setItem("refreshToken", refreshToken);
//         localStorage.setItem("expiresAt", expiresAt);
//       }

//       return res.data;
//     } catch (err) {
//       throw err.response?.data || { message: "Login failed" };
//     }
//   },

//   // ✅ Register
//   register: async (data) => {
//     try {
//       const res = await api.post("/Auth/register", data);

//       const { token, role, expiresAt, refreshToken } = res.data;

//       if (token) {
//         localStorage.setItem("token", token);
//         if (role) {
//           localStorage.setItem("role", role);
//         }
//         else{
//           localStorage.setItem("role", "user");
//         }
//         localStorage.setItem("refreshToken", refreshToken);
//         localStorage.setItem("expiresAt", expiresAt);
//       }

//       return res.data;
//     } catch (err) {
//       throw err.response?.data || { message: "Register failed" };
//     }
//   },

//   // ✅ Google Login
//   googleLogin: async (googleToken) => {
//     try {
//       // Send Google token to your backend
//       // Your backend should verify it and return user info with role
//       const res = await api.post("/Auth/google-login", { 
//         token: googleToken 
//       });

//       const { token, role, expiresAt, refreshToken } = res.data;

//       if (token) {
//         localStorage.setItem("token", token);
//         if (role) {
//           localStorage.setItem("role", role);
//         }
//         else{
//           localStorage.setItem("role", "user");
//         }
//         localStorage.setItem("refreshToken", refreshToken);
//         localStorage.setItem("expiresAt", expiresAt);
//       }

//       return res.data;
//     } catch (err) {
//       throw err.response?.data || { message: "Google login failed" };
//     }
//   },

//   // ✅ Logout
//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("expiresAt");
//     localStorage.removeItem("expiresIn");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userName");
//   },

//   // ✅ Check if logged in
//   isAuthenticated: () => {
//     const token = localStorage.getItem("token");
//     const expiresAt = localStorage.getItem("expiresAt");
    
//     // Check if token exists and hasn't expired
//     if (!token) return false;
    
//     if (expiresAt) {
//       const expiryTime = new Date(expiresAt).getTime();
//       const currentTime = new Date().getTime();
//       return currentTime < expiryTime;
//     }
    
//     return true;
//   },

//   // ✅ Get current user role
//   getRole: () => {
//     return localStorage.getItem("role");
//   },

//   // ✅ Get token
//   getToken: () => {
//     return localStorage.getItem("token");
//   },

//   // ✅ Check if user has specific role
//   hasRole: (requiredRole) => {
//     const userRole = localStorage.getItem("role");
//     return userRole === requiredRole;
//   },
// };