import api from "../../axiosConfig";

const reportsService = {
    getReports: async (params) => {
        try {
            const res = await api.get("Car/GetReports", { params });
            return res;
        }
        catch (ex) {
            console.log("failed to get reports", ex);
        }
    },
    getMaintenaceReports: async (params) => {
        try {
            const res = await api.get("Car/GetMaintenanceReports", { params });
            return res;
        }
        catch (ex) {
            console.log("failed to get reports", ex);
        }
    }
};
export default reportsService