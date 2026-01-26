import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box, Typography, IconButton } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import bookCarsService from "../api/services/BookCars/bookCarsService";
import maintenanceService from "../api/services/MaintainCars/maintenanceService";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
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
        totalPrice: 0,
        receiveDate: "",
        mileage: "",
        receivedMileage: "",
        driverName: "",
        driverIDCard: "",
        driverPricePerHour: 100,
        driverTotalPrice: "",
    });
    const [receiveData, setReceiveData] = useState({
        Images: [],
        damageNotes: "",
        extraCharges: 0,
        lateReturnCharges: 0,
        remarks: "",
    });

    const [uploadedImages, setUploadedImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [hasDriver, setHasDriver] = useState(false);
    const [hasDamage, setHasDamage] = useState(false);

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
        setHasDriver(false);
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
            receivedMileage: "",
            driverName: "",
            driverIDCard: "",
        });
        setUploadedImages([]);
        setReceiveData({
            Images: [],
            damageNotes: "",
            extraCharges: 0,
            remarks: "",
            dropoffDate: "",
            receiveDate: ""
        });
    }
    const price = bookingData && bookingData.carDetail ? bookingData.carDetail.pricePerUnit : 0;

    React.useEffect(() => {
        if (isReceiveMode && bookingData) {
            const newMileage = bookingData.carDetail.pickupMileage;
            console.log("Setting mileage to:", newMileage);
            setUserData(prev => ({
                ...prev, // Keep existing state
                dropoffDate: bookingData.dropoffDate
                    ? new Date(bookingData.dropoffDate).toISOString().slice(0, 16)
                    : "",
                pricePerUnit: bookingData.pricePerUnit || bookingData.carDetail?.pricePerUnit || 0,
                pricingType: bookingData.pricingType || "hourly",
                bookingPrice: bookingData.totalPrice,
                mileage: bookingData.carDetail.pickupMileage
            }));
        }
    }, [bookingData, isReceiveMode, modal]);

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
                    ? new Date(bookingData.pickupDate).toISOString().slice(0, 16)
                    : "",
                dropoffDate: bookingData.dropoffDate
                    ? new Date(bookingData.dropoffDate).toISOString().slice(0, 16)
                    : "",
                carId: bookingData.carDetail?.id || bookingData.id || "",
                pricePerUnit: bookingData.carDetail.pricePerUnit,
                mileage: bookingData.carDetail.mileage,
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
                pricingType: "hourly",
                mileage: cardetail.mileage || cardetail.pickupMileage,
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
        const driverTotal = hasDriver
            ? duration * parseFloat(userData.driverPricePerHour || 0)
            : 0;
        const grandTotal = total + driverTotal;
        setUserData(prev => ({
            ...prev,
            totalPrice: grandTotal,
            driverTotalPrice:driverTotal,
        }));
    }, [
        userData.pickupDate,
        userData.dropoffDate,
        userData.pricingType,
        userData.pricePerUnit,
        hasDriver,
        userData.driverPricePerHour,
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
                const driverTotal = hasDriver
                    ? diffInHours * parseFloat(userData.driverPricePerHour || 0)
                    : 0;
                return {
                    hours: diffInHours.toFixed(2),
                    total: total.toFixed(2),
                    driverTotal: driverTotal.toFixed(2)
                };
            }
        }
        return { hours: 0, total: 0, driverTotal: 0 };
    };


    const { hours, total } = calculateTotalPrice();
    const finalTotal =
        Number(total) + Number(userData.driverTotalPrice || 0);

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
    const validateReceiveForm = () => {

        const newErrors = {};

        if (hasDamage && !receiveData.damageNotes.trim()) newErrors.damageNotes = "damageNotes are required";

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


    const calculateHours = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = endDate - startDate; // Can be negative, handle below
        return Math.max(Math.ceil(diffTime / (1000 * 60 * 60)), 0);
    };

    const calculateExtraCharges = (dropoff, receive, pricePerUnit) => {
        const extraHours = calculateHours(dropoff, receive);
        return extraHours > 0 ? extraHours * (pricePerUnit || 0) : 0;
    };

    const calculateTotalAmount = () => {
        const bookingPrice = parseFloat(userData.bookingPrice) || 0;
        const damageCharges = parseFloat(receiveData.extraCharges) || 0;
        const lateCharges = new Date(userData.receiveDate) > new Date(userData.dropoffDate)
            ? calculateExtraCharges(userData.dropoffDate, userData.receiveDate, price)
            : 0;

        return bookingPrice + damageCharges + lateCharges;
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
            formData.append('Mileage', userData.mileage);
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
        if (!validateReceiveForm())
            return;
        try {

            const lateCharges =
                new Date(userData.receiveDate) > new Date(userData.dropoffDate)
                    ? calculateExtraCharges(userData.dropoffDate, userData.receiveDate, price)
                    : 0;

            const totalAmount = calculateTotalAmount();
            const receivedMileage = Number(userData.receivedMileage);
            const maintenanceDueMileage = cardetail.maintenanceDueMileage;

            const formData = new FormData();

            formData.append('BookingId', bookingData.id);
            formData.append('DamageRemarks', receiveData.damageNotes);
            formData.append('bookingPrice', userData.bookingPrice);
            formData.append('DamageCharges', receiveData.extraCharges || 0);
            formData.append('Remarks', receiveData.remarks);
            formData.append('ReceiveDate', userData.receiveDate);
            formData.append('DropOffDate', userData.dropoffDate);
            formData.append('status', 'Completed');
            formData.append('bookingStatus', 2);
            formData.append('lateExtraCharges', lateCharges);
            formData.append('totalPrice', totalAmount);
            formData.append('returnMileage', receivedMileage);
            formData.append('pickupMileage', userData.mileage);
            formData.append('isDamaged', hasDamage);

            receiveData.Images.forEach((image) => {
                formData.append('ReceiveImages', image.file);
            });

            // 1️⃣ Receive car API
            const res = await bookCarsService.receiveBookCar(formData);

            if (res && res.status === 200) {
                showSnackbar("Car return recorded successfully!", "success");
            }
            openModal();
            resetForm();
            onUpdateSuccess?.();

        } catch (error) {
            console.error("Receive failed:", error);
            showSnackbar("Failed to receive car!", "error");
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
            formData.append('bookingTotal', total);
            formData.append('DriverCharges', userData.driverTotalPrice);
            formData.append('totalAmount', userData.totalPrice);
            formData.append('Status', 'Active');
            formData.append('PickUpMileage', userData.mileage);
            formData.append('DriverName', userData.driverName);
            formData.append('DriverCNIC', userData.driverIDCard);
            formData.append('isDriverRequired', hasDriver);

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
        catch (error) {
            console.log("Error while booking:", error);

            // Extract error message with fallback chain
            const rawMessage =
                error?.response?.data ||
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "Failed to book!";

            // Clean SQL/technical exception messages
            let cleanMessage = rawMessage;

            if (typeof rawMessage === "string") {
                // For SQL exceptions, extract the actual error message (first line)
                if (rawMessage.includes("SqlException")) {
                    // Get text between "SqlException (code):" and the stack trace
                    const match = rawMessage.match(/SqlException[^:]*:\s*([^\r\n]+)/);
                    cleanMessage = match ? match[1].trim() : rawMessage.split("\r\n")[0];
                }
                // For other colon-separated errors, get the part after the last colon
                else if (rawMessage.includes(":")) {
                    cleanMessage = rawMessage.split(":").pop().trim();
                }
            }

            // Show error in snackbar
            showSnackbar(cleanMessage, "error");

            // Optional: Additional error handling
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
                    <h2>{isEditMode ? 'Edit Reservation' : isReceiveMode ? "Receive " : "Complete Reservation"}</h2>
                    {/* <h2>Complete Reservation</h2> */}
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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={hasDamage}
                                        onChange={(e) => {
                                            setHasDamage(e.target.checked);
                                            if (!e.target.checked) {
                                                // clear remarks if unchecked
                                                handleReceiveInputChange("damageNotes", "");
                                            }
                                        }}
                                    />
                                }
                                label="Car has damage"
                            />

                            {hasDamage && (
                                <>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: 8,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Damage Remarks <span style={{ color: "red" }}>*</span>
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
                                    {errors.damageNotes && (
                                        <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                                            {errors.damageNotes}
                                        </Typography>
                                    )}
                                </>
                            )}
                        </Box>


                        <Box sx={{ mb: 3, display: "flex", gap: 3 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: 8 }}>Mileage while booking</label>
                                <input
                                    value={userData.mileage}
                                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                                    type="number"
                                    placeholder="Enter mileage"
                                    style={{
                                        width: "100%",
                                        padding: 12,
                                        borderRadius: 3,
                                        border: "1px solid #ccc",
                                        fontSize: 14,
                                    }}
                                    readOnly
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: 8 }}>Mileage while Receiving</label>
                                <input
                                    value={userData.receivedMileage}
                                    onChange={(e) => handleInputChange("receivedMileage", e.target.value)}
                                    type="number"
                                    placeholder="Enter receivedMileage"
                                    style={{
                                        width: "100%",
                                        padding: 12,
                                        borderRadius: 3,
                                        border: "1px solid #ccc",
                                        fontSize: 14,
                                    }}
                                />
                            </div>
                        </Box>

                        <Box sx={{ mb: 3, display: "flex", gap: 3 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                                    Booking Charges
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={userData.bookingPrice}
                                    onChange={(e) =>
                                        handleReceiveInputChange("totalPrice", e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        padding: 12,
                                        borderRadius: 3,
                                        border: "1px solid #ccc",
                                        fontSize: 14,
                                    }}
                                    readOnly
                                />
                            </div>
                            <div style={{ flex: 1 }}>
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
                            </div>
                        </Box>

                        <div className="info-form__2col">
                            <span>
                                <label>Actual Dropoff Date <b>*</b></label>
                                <input
                                    value={userData.dropoffDate}
                                    onChange={(e) => handleInputChange("dropoffDate", e.target.value)}
                                    readOnly
                                    type="datetime-local"
                                    min={userData.pickupDate}
                                />
                                {errors.dropoffDate && (
                                    <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                                        {errors.dropoffDate}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label> Date Of Receiving <b>*</b></label>
                                <input
                                    value={userData.receiveDate}
                                    onChange={(e) => handleInputChange("receiveDate", e.target.value)}
                                    type="datetime-local"
                                    min={userData.dropoffDate}
                                />
                            </span>

                            {new Date(userData.receiveDate) > new Date(userData.dropoffDate) && (
                                <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 1, border: '1px solid #ffb74d' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#e65100' }}>
                                        Late Return Charges
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Extra Hours: {calculateHours(userData.dropoffDate, userData.receiveDate)} hours
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#e65100' }}>
                                        Rs {calculateExtraCharges(userData.dropoffDate, userData.receiveDate, price)}
                                    </Typography>
                                </Box>
                            )}

                        </div>

                        <Box sx={{ mb: 3 }}>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                                Total Amount
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={calculateTotalAmount().toFixed(2)}
                                readOnly
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 3,
                                    border: "1px solid #ccc",
                                    fontSize: 14,
                                    backgroundColor: "#f5f5f5",
                                    cursor: "not-allowed"
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
                                            min={new Date().toISOString().slice(0, 16)}
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
                                    <span>
                                        <label>Mileage </label>
                                        <input
                                            value={userData.mileage}
                                            onChange={(e) => handleInputChange("mileage", e.target.value)}
                                            type="number"
                                            placeholder="Enter mileage"
                                            readOnly
                                        />

                                    </span>
                                </div>

                                <Box sx={{ mb: 3 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={hasDriver}
                                                onChange={(e) => {
                                                    setHasDriver(e.target.checked);
                                                    if (!e.target.checked) {
                                                        
                                                        handleInputChange("driverName", "");
                                                    }
                                                }}
                                            />
                                        }
                                        label="Want Driver?"
                                    />

                                    {hasDriver && (
                                        <div className="info-form__2col">
                                             <span >
                                                <label>
                                                    Driver,s Fare per Hour<b>*</b>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={userData.driverPricePerHour}
                                                    onChange={(e) =>
                                                        handleInputChange("driverPricePerHour", e.target.value)
                                                    }
                                                />
                                            </span>
                                            <span style={{display:'flex', justifyContent:'center'}}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Driver: {hours} hours × ${userData.driverPricePerHour}/hour = ${userData.driverTotalPrice}
                                                </Typography>
                                            </span>

                                            {errors.damageNotes && (
                                                <Typography color="error" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                                                    {errors.damageNotes}
                                                </Typography>
                                            )}
                                        </div>

                                    )}
                                </Box>

                                {hours > 0 && (
                                    <div className="info-form__1col" style={{ marginTop: '10px' }}>
                                        <div
                                            style={{
                                                padding: '15px',
                                                backgroundColor: '#f0f8ff',
                                                borderRadius: '8px',
                                                border: '1px solid #0066cc'
                                            }}
                                        >
                                            

                                            <Typography variant="body2" color="text.secondary">
                                                Vehicle: {hours} hours × ${userData.pricePerUnit}/hour = ${total}
                                            </Typography>

                                            { hasDriver &&(
                                                <Typography variant="body2" color="text.secondary">
                                                    Driver: ${userData.driverTotalPrice}
                                                </Typography>
                                            )}
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0066cc' }}>
                                               Total Price: ${(userData.totalPrice ?? 0).toFixed(2)}
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