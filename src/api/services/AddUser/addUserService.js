import api from "../../axiosConfig.js"

const addUserService ={

    addUser: async (userData) => {
        try {
          const res = await api.post("User/CreateUser" , userData);
          return res;
        }
        catch(err){
          throw err.response?.data || { message: "Failed " };
        }
    }

};
export default addUserService;