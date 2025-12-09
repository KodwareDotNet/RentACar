import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box, Typography, IconButton } from "@mui/material";
import bookCarsService from "../api/services/BookCars/bookCarsService";
import { BASE_URL } from "../api/axiosConfig";

function BookACarModal({ modal, openModal, cardetail, bookingData, isEditMode = false, onUpdateSuccess }) {
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

    const [uploadedImages, setUploadedImages] = useState([]);
    const [errors, setErrors] = useState({});

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
        setUploadedImages([]);
    }

    // Update carId and image when cardetail changes
    React.useEffect(() => {
        if (isEditMode && bookingData) {
            // Pre-fill data from existing booking for editing
            setUserData({
                name: bookingData.fullName || "",
                fatherName: bookingData.fatherName || "",
                cnic: bookingData.cnic || "",
                licenseNumber: bookingData.licenseNumber || "",
                phone: bookingData.phone || "",
                age: bookingData.age || "",
                address: bookingData.address || "",
                city: bookingData.city || "",
                pickupDate: bookingData.pickupDate || "",
                dropoffDate: bookingData.dropoffDate || "",
                carId: bookingData.carDetail?.id || bookingData.id || "",
            });

            // Set existing images from booking
            if (bookingData.images && bookingData.images.length > 0) {
                const existingImages = bookingData.images.map(imageUrl => ({
                    preview: imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`,
                    isExisting: true,
                    imageId: imageUrl
                }));
                setUploadedImages(existingImages);
            } else {
                setUploadedImages([]);
            }
        } else if (cardetail) {
            // For new booking mode
            setUserData(prev => ({ ...prev, carId: cardetail.id }));

            if (cardetail.imageUrl) {
                const fullImageUrl = cardetail.imageUrl.startsWith('http')
                    ? cardetail.imageUrl
                    : `${BASE_URL}${cardetail.imageUrl}`;

                setUploadedImages([{
                    preview: fullImageUrl,
                    isExisting: true,
                    imageId: cardetail.imageUrl
                }]);
            } else {
                setUploadedImages([]);
            }
        }
    }, [cardetail, bookingData, isEditMode, modal]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            preview: URL.createObjectURL(file),
            file: file,
            isExisting: false
        }));
        setUploadedImages([...uploadedImages, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
    };

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));

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

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();

            // Append booking ID for update
            formData.append('id', bookingData.id);

            // Append all text fields
            formData.append('FullName', userData.name);
            formData.append('fatherName', userData.fatherName);
            formData.append('cnic', userData.cnic);
            formData.append('licenseNumber', userData.licenseNumber);
            formData.append('phone', userData.phone);
            formData.append('age', userData.age);
            formData.append('address', userData.address);
            formData.append('city', userData.city);
            formData.append('pickupDate', userData.pickupDate);
            formData.append('dropoffDate', userData.dropoffDate);
            formData.append('carId', bookingData.carDetail?.id || bookingData.id);
            formData.append('carName', bookingData.carDetail?.carName || bookingData.carName);
            formData.append('price', bookingData.carDetail?.pricePerDay || bookingData.price);

            // Append new uploaded images (not existing ones)
            const newImages = uploadedImages.filter(img => !img.isExisting && img.file);
            newImages.forEach((image) => {
                formData.append('CarImage', image.file);
            });

            // Keep track of existing images that weren't deleted
            const existingImageIds = uploadedImages
                .filter(img => img.isExisting)
                .map(img => img.imageId);

            if (existingImageIds.length > 0) {
                formData.append('ExistingImages', JSON.stringify(existingImageIds));
            }

            // Call update API (you'll need to create this endpoint)
            const res = await bookCarsService.updateBookCar(bookingData.id, formData);

            if (res && res.status === 200) {
                alert("Booking updated successfully");
                if (onUpdateSuccess) {
                    onUpdateSuccess(); // Refresh the bookings list
                }
                openModal();
                resetForm();
            }
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update booking");
        }
    };

    const handleSubmit = async () => {
        if (isEditMode) {
            // If in edit mode, call update function
            handleUpdate();
            return;
        }
        if (!validateForm()) return;

        try {
            // Create FormData object
            const formData = new FormData();


            // Append all text fields
            formData.append('FullName', userData.name);
            formData.append('fatherName', userData.fatherName);
            formData.append('cnic', userData.cnic);
            formData.append('licenseNumber', userData.licenseNumber);
            formData.append('phone', userData.phone);
            formData.append('age', userData.age);
            formData.append('address', userData.address);
            formData.append('city', userData.city);
            formData.append('pickupDate', userData.pickupDate);
            formData.append('dropoffDate', userData.dropoffDate);
            formData.append('carId', cardetail?.id);
            formData.append('carName', cardetail?.carName);
            formData.append('price', cardetail?.pricePerDay);

            // Append new uploaded images (not existing ones)
            uploadedImages.forEach((image, index) => {
                if (!image.isExisting && image.file) {
                    formData.append('CarImage', image.file);
                }
            });

            // If you need to send existing image IDs separately
            const existingImageIds = uploadedImages
                .filter(img => img.isExisting)
                .map(img => img.imageId);

            if (existingImageIds.length > 0) {
                formData.append('CarImageUrl', JSON.stringify(existingImageIds));
            }

            const res = await bookCarsService.bookCar(formData);
            if (res && res.status === 200) {
                alert("car booked successfully");
            }
            openModal();
            resetForm();
        }
        catch (err) {
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
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
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                                        {errors.dropoffDate}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Image Upload Section */}
                        <Box sx={{ mt: 3, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Car Images
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2
                            }}>
                                {/* Display all uploaded images */}
                                {uploadedImages.map((image, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: 'relative',
                                            width: 120,
                                            height: 120,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            border: '2px solid #e0e0e0',
                                            '&:hover .delete-btn': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <img
                                            src={image.preview}
                                            alt={`Car ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <IconButton
                                            className="delete-btn"
                                            onClick={() => handleRemoveImage(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                bgcolor: 'error.main',
                                                color: 'white',
                                                width: 28,
                                                height: 28,
                                                opacity: 0,
                                                transition: 'opacity 0.3s',
                                                '&:hover': {
                                                    bgcolor: 'error.dark'
                                                }
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Box>
                                ))}

                                {/* Upload Button */}
                                <Box
                                    component="label"
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: '2px dashed #ccc',
                                        borderRadius: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        bgcolor: '#fafafa',
                                        '&:hover': {
                                            borderColor: '#1976d2',
                                            bgcolor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#999', mb: 1 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Upload
                                    </Typography>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                </Box>
                            </Box>

                            {uploadedImages.length > 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} selected
                                </Typography>
                            )}
                        </Box>

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