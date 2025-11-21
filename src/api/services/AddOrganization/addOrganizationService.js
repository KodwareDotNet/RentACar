import api from "../../axiosConfig";

const addOrganizationService ={

    addOrganization: async (organizationData)=>{
    try{
        const res = await api.post("User/CreateOrganization", organizationData)
        return res;

    }
    catch(err){
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
      }
};
export default addOrganizationService;