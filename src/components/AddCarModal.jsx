import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Box, Typography } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

function AddCarModal({ modal, openModal, onAddCar }) {
    const [carData, setCarData] = useState({
        name: "",
        brand: "",
        model: "",
        year: "",
        price: "",
        transmission: "",
        fuel: "",
        seats: "",
        doors: "",
        color: "",
        licensePlate: "",
        mileage: "",
        vin: "",
        bodyType: "",
        engineSize: "",
        description: ""
    });
    const [uploadedImages, setUploadedImages] = useState([]);

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

    const handleSubmit = () => {
        if (uploadedImages.length === 0) {
            alert("Please upload at least one car image");
            return;
        }
        onAddCar({ ...carData, images: uploadedImages });
    };

    React.useEffect(() => {
        return () => {
            uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [uploadedImages]);

    return (
        <>
            {/* Modal Overlay */}
            <div
                className={`modal-overlay ${modal ? "active-modal" : ""}`}
                
            ></div>

            {/* Modal Content */}
            <div className={`booking-modal ${modal ? "active-modal" : ""}`}>
                <div className="booking-modal__title">
                    <h2>Add New Car</h2>
                    <CloseIcon
                        onClick={openModal}
                        style={{ cursor: "pointer", fontSize: "2.5rem" }}
                    />
                </div>

                {/* Car Details Section */}
                <div className="booking-modal__person-info">
                    <h4>Car Information</h4>
                    <form className="info-form">
                        {/* Row 1: Car Name & Brand */}
                        <div className="info-form__2col">
                            <span>
                                <label>Car Name <b>*</b></label>
                                <input
                                    value={carData.name}
                                    onChange={(e) =>
                                        setCarData({ ...carData, name: e.target.value })
                                    }
                                    type="text"
                                    placeholder="e.g., A1, Golf 6, Camry"
                                />
                            </span>

                            <span>
                                <label>Brand <b>*</b></label>
                                <input
                                    value={carData.brand}
                                    onChange={(e) =>
                                        setCarData({ ...carData, brand: e.target.value })
                                    }
                                    type="text"
                                    placeholder="e.g., Audi, VW, Toyota"
                                />
                            </span>
                        </div>

                        {/* Row 2: Model & Year */}
                        <div className="info-form__2col">
                            <span>
                                <label>Model <b>*</b></label>
                                <input
                                    value={carData.model}
                                    onChange={(e) =>
                                        setCarData({ ...carData, model: e.target.value })
                                    }
                                    type="text"
                                    placeholder="e.g., Sport, Premium, Base"
                                />
                            </span>

                            <span>
                                <label>Year <b>*</b></label>
                                <input
                                    value={carData.year}
                                    onChange={(e) =>
                                        setCarData({ ...carData, year: e.target.value })
                                    }
                                    type="number"
                                    placeholder="e.g., 2024"
                                    min="1990"
                                    max="2025"
                                />
                            </span>
                        </div>

                        {/* Row 3: Price & Transmission */}
                        <div className="info-form__2col">
                            <span>
                                <label>Price (per day) <b>*</b></label>
                                <input
                                    value={carData.price}
                                    onChange={(e) =>
                                        setCarData({ ...carData, price: e.target.value })
                                    }
                                    type="number"
                                    placeholder="e.g., 45"
                                    min="0"
                                />
                            </span>

                            <span>
                                <label>Transmission <b>*</b></label>
                                <select
                                    value={carData.transmission}
                                    onChange={(e) =>
                                        setCarData({ ...carData, transmission: e.target.value })
                                    }
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
                            </span>
                        </div>

                        {/* Row 4: Fuel & Body Type */}
                        <div className="info-form__2col">
                            <span>
                                <label>Fuel Type <b>*</b></label>
                                <select
                                    value={carData.fuel}
                                    onChange={(e) =>
                                        setCarData({ ...carData, fuel: e.target.value })
                                    }
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
                            </span>

                            <span>
                                <label>Body Type <b>*</b></label>
                                <select
                                    value={carData.bodyType}
                                    onChange={(e) =>
                                        setCarData({ ...carData, bodyType: e.target.value })
                                    }
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
                            </span>
                        </div>

                        {/* Row 5: Seats & Doors */}
                        <div className="info-form__2col">
                            <span>
                                <label>Seats <b>*</b></label>
                                <input
                                    value={carData.seats}
                                    onChange={(e) =>
                                        setCarData({ ...carData, seats: e.target.value })
                                    }
                                    type="number"
                                    placeholder="e.g., 5"
                                    min="2"
                                    max="8"
                                />
                            </span>

                            <span>
                                <label>Doors <b>*</b></label>
                                <input
                                    value={carData.doors}
                                    onChange={(e) =>
                                        setCarData({ ...carData, doors: e.target.value })
                                    }
                                    type="number"
                                    placeholder="e.g., 4"
                                    min="2"
                                    max="5"
                                />
                            </span>
                        </div>

                        {/* Row 6: Color & License Plate */}
                        <div className="info-form__2col">
                            <span>
                                <label>Color <b>*</b></label>
                                <input
                                    value={carData.color}
                                    onChange={(e) =>
                                        setCarData({ ...carData, color: e.target.value })
                                    }
                                    type="text"
                                    placeholder="e.g., White, Black, Silver"
                                />
                            </span>

                            <span>
                                <label>License Plate <b>*</b></label>
                                <input
                                    value={carData.licensePlate}
                                    onChange={(e) =>
                                        setCarData({ ...carData, licensePlate: e.target.value })
                                    }
                                    type="text"
                                    placeholder="e.g., ABC-1234"
                                />
                            </span>
                        </div>

                        {/* Row 7: Mileage & Engine Size */}
                        <div className="info-form__2col">
                            <span>
                                <label>Mileage (km)</label>
                                <input
                                    value={carData.mileage}
                                    onChange={(e) =>
                                        setCarData({ ...carData, mileage: e.target.value })
                                    }
                                    type="number"
                                    placeholder="e.g., 50000"
                                    min="0"
                                />
                            </span>

                            <span>
                                <label>Engine Size (L)</label>
                                <input
                                    value={carData.engineSize}
                                    onChange={(e) =>
                                        setCarData({ ...carData, engineSize: e.target.value })
                                    }
                                    type="text"
                                    placeholder="e.g., 2.0L, 3.5L"
                                />
                            </span>
                        </div>

                        {/* Row 8: VIN */}
                        <div className="info-form__1col">
                            <span>
                                <label>VIN (Vehicle Identification Number)</label>
                                <input
                                    value={carData.vin}
                                    onChange={(e) =>
                                        setCarData({ ...carData, vin: e.target.value })
                                    }
                                    type="text"
                                    placeholder="17-character VIN"
                                    maxLength="17"
                                />
                            </span>
                        </div>

                        {/* Row 9: Description */}
                        <div className="info-form__1col">
                            <span>
                                <label>Description</label>
                                <textarea
                                    value={carData.description}
                                    onChange={(e) =>
                                        setCarData({ ...carData, description: e.target.value })
                                    }
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
                            </span>
                        </div>

                        {/* Image Upload Section */}
                        <div className="info-form__1col" style={{ marginTop: '2rem' }}>
                            <label>Upload Car Images <b>*</b></label>
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
                                    Upload multiple images of the car (required)
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
                                Add Car
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddCarModal;