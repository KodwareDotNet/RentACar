import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Box, Typography } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import addCarsService from "../api/services/AddCars/addCarsService";
import { BASE_URL } from "../api/axiosConfig";

function BookACarModal({ modal, openModal, cardetail }) {
    const [userData, setUserData] = useState({
        name: "",
        fatherName: "",
        cnic: "",
        licenseNumber: "",
        phone: "",
        age: "",
        address: "",
        city: "",
        pickupDate: "",
        dropoffDate: "",
        carId: "",
    });

    const resetForm = () => {
     setUserData({
        name: "",
        fatherName: "",
        cnic: "",
        licenseNumber: "",
        phone: "",
        age: "",
        address: "",
        city: "",
        pickupDate: "",
        dropoffDate: "",
        carId: "",
     });
    }
    const [uploadedImages, setUploadedImages] = useState([]);
    const [errors, setErrors] = useState({});

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setUploadedImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setUploadedImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    // Update carId when it changes
    React.useEffect(() => {
        if (cardetail) {
            setUserData(prev => ({ ...prev, carId: cardetail.id }));
        }
    }, [cardetail]);

    React.useEffect(() => {
        return () => {
            uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [uploadedImages]);

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));

        // Remove error for this field if it exists
        setErrors(prev => {
            const newErrors = { ...prev };
            if (value.trim() !== "" && newErrors[field]) {
                delete newErrors[field];
            }
            return newErrors;
        });
    };



    const validateForm = () => {
        const newErrors = {};

        if (!userData.name.trim()) newErrors.name = "Name is required";
        if (!userData.fatherName.trim()) newErrors.fatherName = "Father Name is required";
        if (!userData.cnic.trim()) newErrors.cnic = "CNIC is required";
        if (!userData.licenseNumber.trim()) newErrors.licenseNumber = "License Number is required";
        if (!userData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!String(userData.age).trim()) newErrors.age = "Age is required";
        if (!userData.address.trim()) newErrors.address = "Address is required";
        if (!userData.city.trim()) newErrors.city = "City is required";
        if (!String(userData.pickupDate).trim()) newErrors.pickupDate = "Pickup Date is required";
        if (!String(userData.dropoffDate).trim()) newErrors.dropoffDate = "Dropoff Date is required";
        if (!String(userData.carId).trim()) newErrors.carId = "Car selection is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;
debugger
        try {
            const formData = new FormData();

        

            const res = await addCarsService.bookCar(formData);
            if (res && res.status === 200) {
                alert("car booked successfully");

            }
            openModal();
            resetForm();
        }
        catch (err) {
            debugger
            alert("booking failed", err);
            openModal();
             resetForm();
        }
    }

    return (
        <>
            {/* Modal Overlay */}
            <div
                className={`modal-overlay ${modal ? "active-modal" : ""}`}
                onClick={openModal}
            ></div>

            {/* Modal Content */}
            <div className={`booking-modal ${modal ? "active-modal" : ""}`}>
                <div className="booking-modal__title">
                    <h2>Complete Reservation</h2>
                    <CloseIcon
                        onClick={openModal}
                        
                        style={{ cursor: "pointer", fontSize: "2.5rem" }}
                    />
                </div>

                {/* Car Info Section */}
                {/* {cardetail && (
                    <div className="booking-modal__car-info">
                        <div className="booking-modal__car-info__model">
                            <h5>
                                Vehicle: <span>{cardetail.name} - {cardetail.brand}</span>
                            </h5>
                            <img
                                src={cardetail.img}
                                alt={cardetail.name}
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <h5>
                                Price: <span>${cardetail.price}/day</span>
                            </h5>
                            {cardetail.transmission && cardetail.fuel && (
                                <p style={{ fontSize: '1.4rem', color: '#777', marginTop: '1rem' }}>
                                    {cardetail.transmission} • {cardetail.fuel}
                                </p>
                            )}
                        </div>

                        <div className="booking-modal__car-info__dates">
                            <h5>Rental Details</h5>
                            <span>
                                <i className="fa-solid fa-calendar-days"></i>
                                <div>
                                    <h6>Pickup Date</h6>
                                    <p>{userData.pickupDate || "Not selected"}</p>
                                </div>
                            </span>
                            <span>
                                <i className="fa-solid fa-calendar-days"></i>
                                <div>
                                    <h6>Dropoff Date</h6>
                                    <p>{userData.dropoffDate || "Not selected"}</p>
                                </div>
                            </span>
                        </div>
                    </div>
                )} */}

                {/* Personal Info Section */}
                <div className="booking-modal__person-info">
                    <h4>Personal Information</h4>
                    <form className="info-form">
                        {/* Row 1: Name & Father Name */}
                        <div className="info-form__2col">
                            <span>
                                <label>Full Name <b>*</b></label>
                                <input
                                    value={userData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    type="text"
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.name}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Father Name <b>*</b></label>
                                <input
                                    value={userData.fatherName}
                                    onChange={(e) => handleInputChange("fatherName", e.target.value)}
                                    type="text"
                                    placeholder="Enter your father's name"
                                />
                                {errors.fatherName && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.fatherName}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 2: CNIC & License Number */}
                        <div className="info-form__2col">
                            <span>
                                <label>CNIC <b>*</b></label>
                                <input
                                    value={userData.cnic}
                                    onChange={(e) => handleInputChange("cnic", e.target.value)}
                                    type="text"
                                    placeholder="XXXXX-XXXXXXX-X"
                                    maxLength="15"
                                />
                                {errors.cnic && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.cnic}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>License Number <b>*</b></label>
                                <input
                                    value={userData.licenseNumber}
                                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                    type="text"
                                    placeholder="Enter your license number"
                                />
                                {errors.licenseNumber && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.licenseNumber}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 3: Phone & Age */}
                        <div className="info-form__2col">
                            <span>
                                <label>Phone <b>*</b></label>
                                <input
                                    value={userData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    type="tel"
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.phone}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Age <b>*</b></label>
                                <input
                                    value={userData.age}
                                    onChange={(e) => handleInputChange("age", e.target.value)}
                                    type="number"
                                    placeholder="18"
                                    min="18"
                                    max="100"
                                />
                                {errors.age && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.age}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 4: Address & City */}
                        <div className="info-form__2col">
                            <span>
                                <label>Address <b>*</b></label>
                                <input
                                    value={userData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    type="text"
                                    placeholder="Enter your street address"
                                />
                                {errors.address && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.address}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>City <b>*</b></label>
                                <input
                                    value={userData.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    type="text"
                                    placeholder="Enter your city"
                                />
                                {errors.city && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.city}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 5: Pickup & Dropoff Dates */}
                        <div className="info-form__2col">
                            <span>
                                <label>Pickup Date <b>*</b></label>
                                <input
                                    value={userData.pickupDate}
                                    onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                                    type="date"
                                />
                                {errors.pickupDate && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.pickupDate}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Dropoff Date <b>*</b></label>
                                <input
                                    value={userData.dropoffDate}
                                    onChange={(e) => handleInputChange("dropoffDate", e.target.value)}
                                    type="date"
                                />
                                {errors.dropoffDate && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.dropoffDate}
                                    </Typography>
                                )}
                            </span>
                        </div>
                        {/* Image Upload Section */}
                        {/* Image Section */}
                        {cardetail?.imageUrl && (
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                mt: 2
                            }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: 120,
                                        height: 120,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        border: '2px solid #e0e0e0'
                                    }}
                                >
                                    <img
                                        src={cardetail.imageUrl.startsWith('http') ? cardetail.imageUrl : `${BASE_URL}${cardetail.imageUrl}`}
                                        alt={cardetail.carName}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}

                        <div className="reserve-button">
                            <button
                                type="button"
                                onClick={handleSubmit}
                            >
                                Book Now
                            </button>
                            
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default BookACarModal;