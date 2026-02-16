import api from "../../axiosConfig";

const addPermissionService = {
getPermissionsByRole: async (roleId) => {
   return await api.get(`Permission/GetByRole/${roleId}`);
},

    };
export default addPermissionService;