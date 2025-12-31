import api from "../../axiosConfig";

const bookCarsService = {

    bookCar: async (formData) => {
        try {
            const res = await api.post("Car/BookCar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res;
        }
        catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error("Booking failed:", error.response.data);
                throw new Error(
                    error.response.data.message || "Failed to book the car."
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

    // Service
    getBookedCars: async (params = {}) => {
        try {
            const { pageNumber = 1, pageSize = 10, bookingStatus = 'all', priceRange = 'all' } = params;

            const queryParams = new URLSearchParams({
                pageNumber: pageNumber.toString(),
                pageSize: pageSize.toString(),
                ...(bookingStatus !== 'all' && { bookingStatus }),
                ...(priceRange !== 'all' && { priceRange }),
            });

            const res = await api.get(`Car/GetAllBookings?${queryParams}`);
            return res;
        } catch (error) {
            if (error.response) {
                console.error("Failed to fetch bookings:", error.response.data);
                throw new Error(error.response.data.message || "Failed to fetch bookings.");
            } else if (error.request) {
                console.error("No response from server:", error.request);
                throw new Error("No response from the server. Please try again.");
            } else {
                console.error("Error setting up request:", error.message);
                throw new Error("Error fetching bookings: " + error.message);
            }
        }
    },
    updateBookCar: async (formData) => {

        try {
            const res = await api.post(`Car/BookCar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res;
        }
        catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error("Update Booking failed:", error.response.data);
                throw new Error(
                    error.response.data.message || "Failed to book the car."
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
    receiveBookCar: async (formData) => {

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
    cancelBooking: async (id, cancellationData) => {
        try {
            const res = await api.put("car/CancelBooking", {
                id,
                usedUnits: cancellationData.usedUnits,
                UsedAmount: cancellationData.usedAmount,
                refundableAmount: cancellationData.refundableAmount,
                cancelledAt: new Date().toISOString(),
                status: 'Cancelled'
            });
            return res.data;
        } catch (ex) {
            console.error("Cancel Error:", ex);
            throw ex;
        }
    },
    getReceivedCars: async (page = 1, pageSize = 10) => {
        try {
            const res = await api.get("Car/GetAllReceivedCars", {
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
    deleteReceiveCars: async (id) => {
        try {
            const res = await api.delete(`car/DeleteReceivedCar/${id}`
            );
            return res.data;
        }
        catch (ex) {
            console.error("Cancel Error:", ex);
            throw ex;
        }
    },

};
export default bookCarsService;