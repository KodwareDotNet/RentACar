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

    getBookedCars: async () => {
        try {
            const res = await api.get("Car/GetAllBookings"); // or whatever your endpoint is
            return res;
        }
        catch (error) {
            if (error.response) {
                console.error("Failed to fetch bookings:", error.response.data);
                throw new Error(
                    error.response.data.message || "Failed to fetch bookings."
                );
            } else if (error.request) {
                console.error("No response from server:", error.request);
                throw new Error("No response from the server. Please try again.");
            } else {
                console.error("Error setting up request:", error.message);
                throw new Error("Error fetching bookings: " + error.message);
            }
        }
    },
    updateBookCar: async (id, formData) => {
        try {
            const res = await api.put(`Car/UpdateBookCar/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
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
    deleteBookCars: async (id) => {
        try {
            const res = await api.delete(`car/CancelBooking/${id}`
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