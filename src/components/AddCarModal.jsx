import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Box, Typography } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import addCarsService from "../api/services/AddCars/addCarsService";
import { Alert, Snackbar } from "@mui/material";
import { BASE_URL } from "../api/axiosConfig";

function AddCarModal({ modal, openModal, carToEdit, onAddCar, refreshCarsList }) {
    const [carData, setCarData] = useState({
        carName: "",
        brand: "",
        model: "",
        year: "",
        pricePerDay: "",
        transmission: "",
        fuel: "",
        seats: "",
        doors: "",
        color: "",
        numberPlate: "",
        mileage: "",
        vin: "",
        bodyType: "",
        engineSize: "",
        description: ""
    });
    const [uploadedImages, setUploadedImages] = useState([]);
    const [errors, setErrors] = useState({});
    const isEditMode = !!carToEdit;
    const navigate = useNavigate();

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

    // Prefill form when carToEdit changes
    useEffect(() => {
        if (carToEdit) {
            setCarData({
                carName: carToEdit.carName || "",
                brand: carToEdit.brand || "",
                model: carToEdit.model || "",
                year: String(carToEdit.year || ""),
                pricePerDay: String(carToEdit.pricePerDay || ""),
                transmission: carToEdit.transmission || "",
                fuel: carToEdit.fuel || "",
                seats: String(carToEdit.seats || ""),
                doors: String(carToEdit.doors || ""),
                color: carToEdit.color || "",
                numberPlate: carToEdit.numberPlate || "",
                mileage: String(carToEdit.mileage || ""),
                vin: carToEdit.vin || "",
                bodyType: carToEdit.bodyType || "",
                engineSize: String(carToEdit.engineSize || ""),
                description: carToEdit.description || ""
            });
            // Handle existing images
            if (carToEdit.imageUrl) {
                const fullImageUrl = carToEdit.imageUrl.startsWith('http')
                    ? carToEdit.imageUrl
                    : `${BASE_URL}${carToEdit.imageUrl}`;

                setUploadedImages([{
                    preview: fullImageUrl,
                    isExisting: true,
                    imageId: carToEdit.imageUrl
                }]);
            } else {
                setUploadedImages([]);
            }
        } else {
            resetForm();
        }
    }, [carToEdit]);

    const resetForm = () => {
        setCarData({
            carName: "",
            brand: "",
            model: "",
            year: "",
            pricePerDay: "",
            transmission: "",
            fuel: "",
            seats: "",
            doors: "",
            color: "",
            numberPlate: "",
            mileage: "",
            vin: "",
            bodyType: "",
            engineSize: "",
            description: ""
        });
        setUploadedImages([]);
        setErrors({});
    };

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
            if (newImages[index].preview) {
                URL.revokeObjectURL(newImages[index].preview);
            }
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleInputChange = (field, value) => {
        setCarData(prev => ({ ...prev, [field]: value }));

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

        if (!carData.carName.trim()) newErrors.carName = "Car name is required";
        if (!carData.brand.trim()) newErrors.brand = "Brand is required";
        if (!carData.model.trim()) newErrors.model = "Model is required";
        if (!carData.year.trim()) newErrors.year = "Year is required";
        if (!carData.pricePerDay.trim()) newErrors.pricePerDay = "Price per day is required";
        if (!carData.transmission.trim()) newErrors.transmission = "Transmission type is required";
        if (!carData.fuel.trim()) newErrors.fuel = "Fuel type is required";
        if (!carData.seats.trim()) newErrors.seats = "Seats field is required";
        if (!carData.doors.trim()) newErrors.doors = "Number of doors is required";
        if (!carData.color.trim()) newErrors.color = "Color is required";
        if (!carData.numberPlate.trim()) newErrors.numberPlate = "Number plate is required";
        if (!carData.mileage.trim()) newErrors.mileage = "Mileage is required";
        if (!carData.vin.trim()) newErrors.vin = "VIN is required";
        if (!carData.bodyType.trim()) newErrors.bodyType = "Body type is required";
        if (!carData.engineSize.trim()) newErrors.engineSize = "Engine size is required";
        if (!carData.description.trim()) newErrors.description = "Description is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            const formData = new FormData();

            if (isEditMode) {
                // Edit mode
                formData.append("id", carToEdit.id);

                // Append all car data fields
                for (let key in carData) {
                    formData.append(key, carData[key]);
                }

                // Handle images for edit mode
                if (uploadedImages.length > 0) {
                    const newImage = uploadedImages.find(img => img.file);
                    if (newImage && newImage.file) {
                        formData.append("Image", newImage.file);
                    } else if (carToEdit.imageUrl) {
                        formData.append("ImageUrl", carToEdit.imageUrl);
                    }
                }

                await addCarsService.addCars(formData);
                showSnackbar("Car updated successfully!", "success");

            } else {
                // Add mode
                for (let key in carData) {
                    formData.append(key, carData[key]);
                }

                // Append all new images only
                uploadedImages.forEach((image) => {
                    if (image.file) {
                        formData.append("Image", image.file);
                    }
                });

                const res = await addCarsService.addCars(formData);
                if (res.data === true || res.status === 200 || res.data.success) {
                    showSnackbar("Car Added successfully!", "success");

                    // Reset form and close modal

                } else {
                    showSnackbar("Failed to Add", "error");
                }
            }
            resetForm();
            openModal(); // Close modal
            refreshCarsList();
            // Optional: Navigate to models page after successful operation
            navigate("/models");

        } catch (err) {
            console.error(isEditMode ? "Update error:" : "Add error:", err);
            alert(`${isEditMode ? 'Update' : 'Add'} failed: ` +
                (err.response?.data?.message || err.message || "Unknown error"));
        }
    };


    return (
        <>
            {/* Modal Overlay */}
            <div
                className={`modal-overlay ${modal ? "active-modal" : ""}`}
            ></div>

            {/* Modal Content */}
            <div className={`booking-modal ${modal ? "active-modal" : ""}`}>
                <div className="booking-modal__title">
                    <h2>{isEditMode ? "Edit Car" : "Add New Car"}</h2>
                    <CloseIcon
                        onClick={openModal}
                        style={{ cursor: "pointer", fontSize: "2.5rem" }}
                    />
                </div>

                {/* Car Details Section */}
                <div className="booking-modal__person-info">
                    <h4>Car Information</h4>
                    <form className="info-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        {/* Row 1: Car Name & Brand */}
                        <div className="info-form__2col">
                            <span>
                                <label>Car Name <b>*</b></label>
                                <input
                                    value={carData.carName}
                                    onChange={(e) => handleInputChange("carName", e.target.value)}
                                    type="text"
                                    placeholder="e.g., A1, Golf 6, Camry"
                                />
                                {errors.carName && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.carName}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Brand <b>*</b></label>
                                <input
                                    value={carData.brand}
                                    onChange={(e) => handleInputChange("brand", e.target.value)}
                                    type="text"
                                    placeholder="e.g., Audi, VW, Toyota"
                                />
                                {errors.brand && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.brand}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 2: Model & Year */}
                        <div className="info-form__2col">
                            <span>
                                <label>Model <b>*</b></label>
                                <input
                                    value={carData.model}
                                    onChange={(e) => handleInputChange("model", e.target.value)}
                                    type="text"
                                    placeholder="e.g., 2023,2024"
                                />
                                {errors.model && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.model}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Year <b>*</b></label>
                                <input
                                    value={carData.year}
                                    onChange={(e) => handleInputChange("year", e.target.value)}
                                    type="number"
                                    placeholder="e.g., 2024"
                                    min="1990"
                                    max="2025"
                                />
                                {errors.year && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.year}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 3: Price & Transmission */}
                        <div className="info-form__2col">
                            <span>
                                <label>Price (per day) <b>*</b></label>
                                <input
                                    value={carData.pricePerDay}
                                    onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
                                    type="number"
                                    placeholder="e.g., 45"
                                    min="0"
                                />
                                {errors.pricePerDay && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.pricePerDay}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Transmission <b>*</b></label>
                                <select
                                    value={carData.transmission}
                                    onChange={(e) => handleInputChange("transmission", e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1.2rem 1.5rem',
                                        fontSize: '1.6rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px'
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                                {errors.transmission && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.transmission}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 4: Fuel & Body Type */}
                        <div className="info-form__2col">
                            <span>
                                <label>Fuel Type <b>*</b></label>
                                <select
                                    value={carData.fuel}
                                    onChange={(e) => handleInputChange("fuel", e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1.2rem 1.5rem',
                                        fontSize: '1.6rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px'
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                                {errors.fuel && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.fuel}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Body Type <b>*</b></label>
                                <select
                                    value={carData.bodyType}
                                    onChange={(e) => handleInputChange("bodyType", e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1.2rem 1.5rem',
                                        fontSize: '1.6rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px'
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Coupe">Coupe</option>
                                    <option value="Convertible">Convertible</option>
                                    <option value="Wagon">Wagon</option>
                                </select>
                                {errors.bodyType && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.bodyType}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 5: Seats & Doors */}
                        <div className="info-form__2col">
                            <span>
                                <label>Seats <b>*</b></label>
                                <input
                                    value={carData.seats}
                                    onChange={(e) => handleInputChange("seats", e.target.value)}
                                    type="number"
                                    placeholder="e.g., 5"
                                    min="2"
                                    max="8"
                                />
                                {errors.seats && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.seats}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Doors <b>*</b></label>
                                <input
                                    value={carData.doors}
                                    onChange={(e) => handleInputChange("doors", e.target.value)}
                                    type="number"
                                    placeholder="e.g., 4"
                                    min="2"
                                    max="5"
                                />
                                {errors.doors && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.doors}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 6: Color & License Plate */}
                        <div className="info-form__2col">
                            <span>
                                <label>Color <b>*</b></label>
                                <input
                                    value={carData.color}
                                    onChange={(e) => handleInputChange("color", e.target.value)}
                                    type="text"
                                    placeholder="e.g., White, Black, Silver"
                                />
                                {errors.color && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.color}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Number Plate <b>*</b></label>
                                <input
                                    value={carData.numberPlate}
                                    onChange={(e) => handleInputChange("numberPlate", e.target.value)}
                                    type="text"
                                    placeholder="e.g., ABC-1234"
                                />
                                {errors.numberPlate && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.numberPlate}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 7: Mileage & Engine Size */}
                        <div className="info-form__2col">
                            <span>
                                <label>Mileage (km)</label>
                                <input
                                    value={carData.mileage}
                                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                                    type="number"
                                    placeholder="e.g., 50000"
                                    min="0"
                                />
                                {errors.mileage && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.mileage}
                                    </Typography>
                                )}
                            </span>

                            <span>
                                <label>Engine Size (L)</label>
                                <input
                                    value={carData.engineSize}
                                    onChange={(e) => handleInputChange("engineSize", e.target.value)}
                                    type="number"
                                    placeholder="e.g., 2.0L, 3.5L"
                                />
                                {errors.engineSize && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.engineSize}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 8: VIN */}
                        <div className="info-form__1col">
                            <span>
                                <label>VIN (Vehicle Identification Number)</label>
                                <input
                                    value={carData.vin}
                                    onChange={(e) => handleInputChange("vin", e.target.value)}
                                    type="text"
                                    placeholder="17-character VIN"
                                    maxLength="17"
                                />
                                {errors.vin && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.vin}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Row 9: Description */}
                        <div className="info-form__1col">
                            <span>
                                <label>Description</label>
                                <textarea
                                    value={carData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Additional features and details about the car"
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '1.2rem 1.5rem',
                                        fontSize: '1.6rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                                {errors.description && (
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {errors.description}
                                    </Typography>
                                )}
                            </span>
                        </div>

                        {/* Image Upload Section */}
                        <div className="info-form__1col" style={{ marginTop: '2rem' }}>
                            <label>Upload Car Images {!isEditMode && <b>*</b>}</label>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<PhotoCamera />}
                                    sx={{
                                        textTransform: 'none',
                                        backgroundColor: '#ff4d30',
                                        '&:hover': { backgroundColor: '#e63c20' }
                                    }}
                                >
                                    Choose Images
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: '#777' }}>
                                    {isEditMode ? "Upload new images to replace existing ones (optional)" : "Upload multiple images of the car (required)"}
                                </Typography>
                            </Box>

                            {/* Image Previews */}
                            {uploadedImages.length > 0 && (
                                <Box sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                    mt: 2
                                }}>
                                    {uploadedImages.map((image, index) => (
                                        <Box
                                            key={index}
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
                                                src={image.preview}
                                                alt={`Car ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <IconButton
                                                onClick={() => handleRemoveImage(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    backgroundColor: 'rgba(255, 77, 48, 0.9)',
                                                    color: 'white',
                                                    padding: '4px',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(230, 60, 32, 1)'
                                                    }
                                                }}
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </div>

                        <div className="reserve-button">
                            <button
                                type="button"
                                onClick={handleSubmit}
                            >
                                {isEditMode ? "Update Car" : "Add Car"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default AddCarModal;