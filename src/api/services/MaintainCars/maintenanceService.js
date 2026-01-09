import api from "../../axiosConfig";

const maintenanceService = {

    maintainCar: async (formData) => {
    try {
        const res = await api.post("Car/AddOrUpdateMaintanence", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        return res;
    }
    catch (error) {
        if (error.response) {
            console.error("Maintenance failed:", error.response.data);
            throw new Error(
                error.response.data.message || "Failed to submit maintenance request."
            );
        } else if (error.request) {
            console.error("No response from server:", error.request);
            throw new Error("No response from the server. Please try again.");
        } else {
            console.error("Error setting up request:", error.message);
            throw new Error("Error submitting maintenance: " + error.message);
        }
    }
},
    getMaintenanceRecords: async (page = 1, pageSize = 10) => {
        try {
            const res = await api.get("Car/GetAllMileage", {
                params: {
                    pageNumber: page,
                    pageSize: pageSize
                }
            });
            return res;
        }
        catch (error) {
            if (error.response) {
                console.error("Failed to fetch GetAllReceivedCars:", error.response.data);
                throw new Error(
                    error.response.data.message || "Failed to fetch GetAllReceivedCars."
                );
            } else if (error.request) {
                console.error("No response from server:", error.request);
                throw new Error("No response from the server. Please try again.");
            } else {
                console.error("Error setting up request:", error.message);
                throw new Error("Error fetching GetAllReceivedCars: " + error.message);
            }
        }
    },
    receiveMaintenance: async (data) => {
        try {
            const res = await api.post("Car/CompleteMaintenance", data);
            return res;
        }
        catch (error) {
            if (error.response) {
                console.error("Receive failed:", error.response.data);
                throw new Error(
                    error.response.data.message || "Failed to complete maintenance."
                );
            } else if (error.request) {
                console.error("No response from server:", error.request);
                throw new Error("No response from the server. Please try again.");
            } else {
                console.error("Error setting up request:", error.message);
                throw new Error("Error completing maintenance: " + error.message);
            }
        }
    },
    deleteMaintainedCars: async (id) => {
        try {
            const res = await api.put(`car/CancelMaintance/${id}`
            );
            return res.data;
        }
        catch (ex) {
            console.error("Cancel Error:", ex);
            throw ex;
        }
    },
    completeMaintenance: async (formData) => {
    
            try {
                const res = await api.post(`Car/receiveCar`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return res;
            }
            catch (error) {
                if (error.response) {
                    // Server responded with a status other than 2xx
                    console.error("receive Booking failed:", error.response.data);
                    throw new Error(
                        error.response.data.message || "Failed to receive the car."
                    );
                } else if (error.request) {
                    // Request was made but no response received
                    console.error("No response from server:", error.request);
                    throw new Error("No response from the server. Please try again.");
                } else {
                    // Something else happened while setting up the request
                    console.error("Error setting up request:", error.message);
                    throw new Error("Error booking the car: " + error.message);
                }
            }
        },
};

export default maintenanceService;