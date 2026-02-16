// src/services/User/addUserService.js
import api from "../../axiosConfig.js";

const userService = {
  // ✅ Create
  addUser: async (userData) => {
    try {
      const res = await api.post("User/CreateUser", userData);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Failed to create user" };
    }
  },

  // ✅ Get All Users
  getUsers: async () => {
    try {
      const res = await api.get("User/GetAllUsers");
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Failed to fetch users" };
    }
  },

  // ✅ Delete User
  deleteUser: async (id) => {
    try {
      const res = await api.delete(`User/DeleteUser/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Failed to delete user" };
    }
  },

  // ✅ Edit / Update User
  updateUser: async (id, userData) => {
    try {
      const res = await api.put(
      "User/UpdateUser",
      userData,
      {
        params: { id }   // 👈 sends ?id=5
      }
    );
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: "Failed to update user" };
    }
  },
};

export default userService;
