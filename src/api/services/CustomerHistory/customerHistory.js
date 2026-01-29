import api from "../../axiosConfig";

const customerHistory = {
    
    checkCustomerHistoryByQuery: async (cnic) => {
        try {
            const res = await api.get("/Car/CustomerHistory", {
                params: { cnic }
            });
            return res.data;
        } catch (err) {
            console.error("Error fetching customer history:", err);
            throw err;
        }
    },

    // Get all customer bookings
    getAllCustomerBookings: async () => {
        try {
            const res = await api.get("/Car/CustomerHistory");
            return res.data;
        } catch (err) {
            console.error("Error fetching all customer bookings:", err);
            throw err;
        }
    }
};

export default customerHistory;