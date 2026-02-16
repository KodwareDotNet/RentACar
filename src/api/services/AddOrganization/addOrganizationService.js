import api from "../../axiosConfig";
// addOrganizationService.js

const addOrganizationService = {

  addOrganization: async (organizationData) => {
    const res = await api.post("User/CreateOrganization", organizationData);
    return res;
  },

  getOrganization: async () => {
    const res = await api.get("User/GetAllOrganizations");
    return res;
  },

  updateOrganization: async (id, organizationData) => {
    const payload = {
      id: id,
      ...organizationData,
    };

    const res = await api.put("User/UpdateOrganization", payload);
    return res;
  },


  deleteOrganization: async (id) => {
    const res = await api.delete(`User/DeleteOrganization/${id}`);
    return res;
  }
};

export default addOrganizationService;
