import api from "../../axiosConfig";

const addRoleService = {

  addRole: async (roleData) => {
    try {
      const res = await api.post("User/CreateRole", roleData);
      return res;
    }
    catch (err) {
      throw err.response?.data || { message: "Failed " };
    }
  },

  getOrganization: async () => {
    try {

      const res = await api.get("User/GetAllOrganizations");
      return res;
    }
    catch (err) {
      throw err.response?.data || { message: "Failed " };
    }
  },

  getRoles: async () =>{
   try{
    const res = await api.get("user/GetRolesByOrganization");
    return res;
   }
   catch (err) {
    throw err.response?.data || { message: "Failed "}
   }
  }

};
export default addRoleService;