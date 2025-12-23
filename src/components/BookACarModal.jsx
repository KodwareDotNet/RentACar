import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box, Typography, IconButton } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import bookCarsService from "../api/services/BookCars/bookCarsService";
import addCarsService from "../api/services/AddCars/addCarsService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BASE_URL } from "../api/axiosConfig";

function BookACarModal({ modal, openModal, cardetail, bookingData, isEditMode = false, isReceiveMode = false, onUpdateSuccess, carsApi }) {
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
        pricingType: "daily",
        pricePerUnit: 0,
        totalPrice: 0
    });

    const [receiveData, setReceiveData] = useState({
        Images: [],
        damageNotes: "",
        extraCharges: 0,
        remarks: "",
    });

    const [uploadedImages, setUploadedImages] = useState([]);
    const [errors, setErrors] = useState({});

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

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
        setReceiveData({
            Images: [],
            damageNotes: "",
            extraCharges: 0,
            remarks: "",
        });
    }

    // Update carId and image when cardetail changes
    React.useEffect(() => {
        if (isEditMode && bookingData) {
            // Edit mode logic (existing code)
            setUserData({
                name: bookingData.fullName || "",
                fatherName: bookingData.fatherName || "",
                cnic: bookingData.cnic || "",
                licenseNumber: bookingData.licenseNumber || "",
                phone: bookingData.phone || "",
                age: bookingData.age || "",
                address: bookingData.address || "",
                city: bookingData.city || "",
                pickupDate: bookingData.pickupDate
                    ? bookingData.pickupDate.slice(0, 16)  : "",
                dropoffDate: bookingData.dropoffDate
                    ? bookingData.dropoffDate.slice(0, 16)
                    : "",
                carId: bookingData.carDetail?.id || bookingData.id || "",
                pricePerUnit: bookingData.carDetail.pricePerUnit,
            });

            if (bookingData.attachments && bookingData.attachments.length > 0) {
                const existingImages = bookingData.attachments.map(att => ({
                    id: att.id,
                    attachmentId: att.attachmentId,
                    imageId: att.attachmentId,
                    preview: att.filePath,
                    file: null,
                    isExisting: true,
                    fileName: att.fileName,
                    fileSize: att.fileSize
                }));
                setUploadedImages(existingImages);
            }
        } else if (cardetail) {
            // For new booking mode
            setUserData(prev => ({
                ...prev, carId: cardetail.id, pricePerUnit: cardetail.pricePerHour || 0,
                pricingType: "hourly"
            }));

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

    React.useEffect(() => {
        const duration = calculateDuration(
            userData.pickupDate,
            userData.dropoffDate,
            userData.pricingType
        );

        const total = duration * Number(userData.pricePerUnit || 0);

        setUserData(prev => ({
            ...prev,
            totalPrice: total
        }));
    }, [
        userData.pickupDate,
        userData.dropoffDate,
        userData.pricingType,
        userData.pricePerUnit
    ]);

    const calculateTotalPrice = () => {
        if (userData.pickupDate && userData.dropoffDate && userData.pricePerUnit) {
            const pickup = new Date(userData.pickupDate);
            const dropoff = new Date(userData.dropoffDate);

            // Calculate difference in hours
            const diffInMs = dropoff - pickup;
            const diffInHours = diffInMs / (1000 * 60 * 60);

            if (diffInHours > 0) {
                const total = diffInHours * parseFloat(userData.pricePerUnit);
                return {
                    hours: diffInHours.toFixed(2),
                    total: total.toFixed(2)
                };
            }
        }
        return { hours: 0, total: 0 };
    };


    const { hours, total } = calculateTotalPrice();

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

    const handleRemoveReturnImage = (index) => {
        const newImages = receiveData.Images.filter((_, i) => i !== index);
        setReceiveData(prev => ({ ...prev, Images: newImages }));
    };

    const handleReturnImagesSelect = (e) => {
        const files = Array.from(e.target.files);

        const images = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setReceiveData(prev => ({
            ...prev,
            Images: [...prev.Images, ...images],
        }));
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

    const handleReceiveInputChange = (field, value) => {
        setReceiveData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => {
            const newErrors = { ...prev };
            if (value.trim() !== "" && newErrors[field]) {
                delete newErrors[field];
            }
            return newErrors;
        });
    };

    const handleCloseModal = () => {
        resetForm();     // reset all form states
        openModal();     // close modal
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



    const validateUpdateForm = () => {

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

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const calculateDuration = (start, end, type) => {
        if (!start || !end) return 0;

        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate - startDate;

        if (diffMs <= 0) return 0;

        if (type === "hourly") {
            return Math.ceil(diffMs / (1000 * 60 * 60));
        }
        if (type === "monthly") {
            return Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));
        }
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // daily
    };

    const handleUpdate = async () => {
        if (!validateUpdateForm())

            return;

        try {

            const formData = new FormData();

            // Append booking ID for update
            formData.append('Id', bookingData.id);

            // Append all text fields
            formData.append('FullName', userData.name);
            formData.append('FatherName', userData.fatherName);
            formData.append('CNIC', userData.cnic);
            formData.append('LicenseNumber', userData.licenseNumber);
            formData.append('Phone', userData.phone);
            formData.append('Age', userData.age);
            formData.append('Address', userData.address);
            formData.append('City', userData.city);
            formData.append('PickupDate', userData.pickupDate);
            formData.append('DropoffDate', userData.dropoffDate);
            formData.append('PricingType', userData.pricingType);
            formData.append('PricePerUnit', userData.pricePerUnit);
            formData.append('TotalAmount', userData.totalPrice);
            const carId = bookingData.carDetail?.car?.carId ||
                cardetail?.carId ||
                bookingData.id;
            formData.append('CarId', carId);
            formData.append('CarName', bookingData.carName);
            formData.append('CarName', bookingData.carDetail?.carName || bookingData.carName);
            formData.append('status', 'active');


            // Append new uploaded images (not existing ones)
            const newImages = uploadedImages.filter(img => !img.isExisting && img.file);
            newImages.forEach((image) => {
                formData.append('Attachments', image.file);
            });


            const existingImageUrls = uploadedImages
                .filter(img => img.isExisting && img.preview)
                .map(img => {
                    const url = img.preview;
                    // Remove base URL if it exists
                    if (url.startsWith('http://') || url.startsWith('https://')) {
                        // Extract path after the domain
                        const urlObj = new URL(url);
                        return urlObj.pathname; // This returns "/Images/..."
                    }
                    return url; // Already relative path
                });

            if (existingImageUrls.length > 0) {
                formData.append('CarImageUrl', JSON.stringify(existingImageUrls));
            }


            const res = await bookCarsService.updateBookCar(formData);


            if (res && res.status === 200) {
                showSnackbar("Booking updated successfully!", "success");
                if (onUpdateSuccess) {
                    onUpdateSuccess(); // Refresh the bookings list
                }

            }
        } catch (err) {
            console.error("Update failed:", err);
            showSnackbar("Booking Not updated !", "error");

        }
        finally {
            openModal();
            resetForm();

        }

    };

    const handleReceiveSubmit = async () => {

        try {
            const formData = new FormData();

            formData.append('BookingId', bookingData.id);
            formData.append('DamageRemarks', receiveData.damageNotes);
            formData.append('ExtraCharges', receiveData.extraCharges || 0);
            formData.append('Remarks', receiveData.remarks);
            formData.append('status', 'Completed');
            formData.append("bookingStatus", 2);

            // Append return images
            receiveData.Images.forEach((image) => {
                formData.append('ReceiveImages', image.file);
            });

            // Call your API endpoint
            const res = await bookCarsService.receiveBookCar(formData);


            if (res && res.status === 200) {
                showSnackbar("Car return recorded successfully!", "success");
            }
            if (onUpdateSuccess) {
                onUpdateSuccess();
            }

        } catch (err) {
            console.error("Receive failed:", err);
            showSnackbar("Failed to receive car !", "error");
        }
        finally {

            openModal();
            resetForm();
        }
    };

    const handleSubmit = async () => {
        if (isEditMode) {
            handleUpdate();
            return;
        }
        else if (isReceiveMode) {
            handleReceiveSubmit();
            return;
        }
        if (!validateForm())

            return;

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
            formData.append('pricingType', userData.pricingType);
            formData.append('pricePerUnit', userData.pricePerUnit);
            formData.append('totalAmount', userData.totalPrice);
            formData.append('Status', 'Active');

            // Append new uploaded images (not existing ones)
            uploadedImages.forEach((image, index) => {
                if (!image.isExisting && image.file) {
                    formData.append('Attachments', image.file);
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
                showSnackbar("Booked successfully!", "success");
            }
            await carsApi();
            openModal();
            resetForm();
        }
        catch (err) {
            showSnackbar("Failed to book!", "error");
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
            />

            {/* Modal Content */}
            <div className={`booking-modal ${modal ? "active-modal" : ""}`}>
                <div className="booking-modal__title">
                    {/* <h2>{isEditMode?'Edit Reservation' :isReceiveMode? "Receive ": "Complete Reservation"}</h2> */}
                    <h2>Complete Reservation</h2>
                    <CloseIcon
                        onClick={handleCloseModal}

                        style={{ cursor: "pointer", fontSize: "2.5rem" }}
                    />
                </div>

                {isReceiveMode ? (
                    <>
                        <h4 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                            Car Return Details
                        </h4>

                        {/* Car Condition Images */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                Car Condition Images <span style={{ color: "red" }}>*</span>
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mb: 2, display: "block" }}
                            >
                                Take photos of all sides, interior, and any damage
                            </Typography>

                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                {receiveData.Images.map((image, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: "relative",
                                            width: 120,
                                            height: 120,
                                            borderRadius: 1,
                                            overflow: "hidden",
                                            border: "2px solid #4caf50",
                                            "&:hover .delete-btn": { opacity: 1 },
                                        }}
                                    >
                                        <img
                                            src={image.preview}
                                            alt={`Return ${index + 1}`}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />

                                        <IconButton
                                            className="delete-btn"
                                            onClick={() => handleRemoveReturnImage(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                bgcolor: "error.main",
                                                color: "white",
                                                width: 28,
                                                height: 28,
                                                opacity: 0,
                                                transition: "opacity 0.3s",
                                                "&:hover": { bgcolor: "error.dark" },
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Box>
                                ))}

                                <Box
                                    component="label"
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: "2px dashed #4caf50",
                                        borderRadius: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        bgcolor: "#f1f8f4",
                                        "&:hover": { bgcolor: "#e8f5e9" },
                                    }}
                                >
                                    <AddPhotoAlternateIcon
                                        sx={{ fontSize: 40, color: "#4caf50", mb: 1 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Add Photo
                                    </Typography>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleReturnImagesSelect}
                                        style={{ display: "none" }}
                                    />
                                </Box>
                            </Box>

                            {errors.Images && (
                                <Typography color="error" sx={{ fontSize: "0.875rem", mt: 1 }}>
                                    {errors.Images}
                                </Typography>
                            )}
                        </Box>


                        <Box sx={{ mb: 3 }}>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                                Damage  Remarks
                            </label>
                            <textarea
                                rows="4"
                                value={receiveData.damageNotes}
                                onChange={(e) =>
                                    handleReceiveInputChange("damageNotes", e.target.value)
                                }
                                placeholder="Describe any scratches, dents, or damage found..."
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 3,
                                    border: "1px solid #ccc",
                                    fontSize: 14,
                                }}
                            />
                        </Box>

                        {/* Extra Charges */}
                        <Box sx={{ mb: 3 }}>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                                Extra Charges for Damages (Optional)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={receiveData.extraCharges}
                                onChange={(e) =>
                                    handleReceiveInputChange("extraCharges", e.target.value)
                                }
                                placeholder="Enter amount"
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 3,
                                    border: "1px solid #ccc",
                                    fontSize: 14,
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                                Remarks <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="text"
                                rows="4"
                                value={receiveData.remarks}
                                onChange={(e) =>
                                    handleReceiveInputChange("remarks", e.target.value)
                                }
                                placeholder="Enter  remarks"
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 3,
                                    border: errors.remarks
                                        ? "1px solid red"
                                        : "1px solid #ccc",
                                    fontSize: 14,
                                }}
                            />
                        </Box>

                        <div className="reserve-button">
                            <button type="button" onClick={handleSubmit}>
                                Complete Return Process
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="booking-modal__person-info">
                        <h4>Personal Information</h4>

                        <form className="info-form">
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
                                            inputMode="numeric"
                                            placeholder="age"
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
                                            type="datetime-local"
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
                                            type="datetime-local"
                                            min={userData.pickupDate}
                                        />
                                        {errors.dropoffDate && (
                                            <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                                                {errors.dropoffDate}
                                            </Typography>
                                        )}
                                    </span>
                                </div>


                                {/* Pricing Type */}
                                <div className="info-form__2col">

                                    <span>
                                        <label>Price per Hour <b>*</b></label>
                                        <input
                                            type="number"
                                            value={userData.pricePerUnit}
                                            onChange={(e) =>
                                                handleInputChange("pricePerUnit", e.target.value)
                                            }
                                        />
                                    </span>
                                </div>
                                {hours > 0 && (
                                    <div className="info-form__1col" style={{ marginTop: '10px' }}>
                                        <div style={{
                                            padding: '15px',
                                            backgroundColor: '#f0f8ff',
                                            borderRadius: '8px',
                                            border: '1px solid #0066cc'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0066cc' }}>
                                                Total Price: ${total}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ({hours} hours × ${userData.pricePerUnit}/hour)
                                            </Typography>
                                        </div>
                                    </div>
                                )}


                                {/* Image Upload Section */}
                                <Box sx={{ mt: 3, mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Car Images / Documents
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2
                                    }}>
                                        {/* Display all uploaded/existing images */}
                                        {uploadedImages.map((image, index) => (
                                            <Box
                                                key={image.id || index}
                                                sx={{
                                                    position: 'relative',
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                    border: image.isExisting ? '2px solid #1976d2' : '2px solid #e0e0e0',
                                                    '&:hover .delete-btn': {
                                                        opacity: 1
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={image.preview}
                                                    alt={image.fileName || `Car ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />

                                                {/* Existing badge */}
                                                {image.isExisting && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bgcolor: 'rgba(25, 118, 210, 0.9)',
                                                            color: 'white',
                                                            py: 0.5,
                                                            px: 1,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 600,
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        EXISTING
                                                    </Box>
                                                )}

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
                                        <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} selected
                                            </Typography>
                                            {uploadedImages.filter(img => img.isExisting).length > 0 && (
                                                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                                    ({uploadedImages.filter(img => img.isExisting).length} existing)
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Box>

                                <div className="reserve-button">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                    >
                                        {isEditMode ? "Update Now" : "Book Now"}
                                    </button>
                                </div>
                            </form>
                        </form>
                    </div>
                )}
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );

}

export default BookACarModal;