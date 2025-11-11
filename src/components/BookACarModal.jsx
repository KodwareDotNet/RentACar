import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Box, Typography } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

function BookACarModal({ modal, openModal, confirmBooking, cardetail }) {
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
                {cardetail && (
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
                )}

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
                                    onChange={(e) =>
                                        setUserData({ ...userData, name: e.target.value })
                                    }
                                    type="text"
                                    placeholder="Enter your full name"
                                />
                            </span>

                            <span>
                                <label>Father Name <b>*</b></label>
                                <input
                                    value={userData.fatherName}
                                    onChange={(e) =>
                                        setUserData({ ...userData, fatherName: e.target.value })
                                    }
                                    type="text"
                                    placeholder="Enter your father's name"
                                />
                            </span>
                        </div>

                        {/* Row 2: CNIC & License Number */}
                        <div className="info-form__2col">
                            <span>
                                <label>CNIC <b>*</b></label>
                                <input
                                    value={userData.cnic}
                                    onChange={(e) =>
                                        setUserData({ ...userData, cnic: e.target.value })
                                    }
                                    type="text"
                                    placeholder="XXXXX-XXXXXXX-X"
                                    maxLength="15"
                                />
                            </span>

                            <span>
                                <label>License Number <b>*</b></label>
                                <input
                                    value={userData.licenseNumber}
                                    onChange={(e) =>
                                        setUserData({ ...userData, licenseNumber: e.target.value })
                                    }
                                    type="text"
                                    placeholder="Enter your license number"
                                />
                            </span>
                        </div>

                        {/* Row 3: Phone & Age */}
                        <div className="info-form__2col">
                            <span>
                                <label>Phone <b>*</b></label>
                                <input
                                    value={userData.phone}
                                    onChange={(e) =>
                                        setUserData({ ...userData, phone: e.target.value })
                                    }
                                    type="tel"
                                    placeholder="Enter your phone number"
                                />
                            </span>

                            <span>
                                <label>Age <b>*</b></label>
                                <input
                                    value={userData.age}
                                    onChange={(e) =>
                                        setUserData({ ...userData, age: e.target.value })
                                    }
                                    type="number"
                                    placeholder="18"
                                    min="18"
                                    max="100"
                                />
                            </span>
                        </div>

                        {/* Row 4: Address & City */}
                        <div className="info-form__2col">
                            <span>
                                <label>Address <b>*</b></label>
                                <input
                                    value={userData.address}
                                    onChange={(e) =>
                                        setUserData({ ...userData, address: e.target.value })
                                    }
                                    type="text"
                                    placeholder="Enter your street address"
                                />
                            </span>

                            <span>
                                <label>City <b>*</b></label>
                                <input
                                    value={userData.city}
                                    onChange={(e) =>
                                        setUserData({ ...userData, city: e.target.value })
                                    }
                                    type="text"
                                    placeholder="Enter your city"
                                />
                            </span>
                        </div>

                        {/* Row 5: Pickup & Dropoff Dates */}
                        <div className="info-form__2col">
                            <span>
                                <label>Pickup Date <b>*</b></label>
                                <input
                                    value={userData.pickupDate}
                                    onChange={(e) =>
                                        setUserData({ ...userData, pickupDate: e.target.value })
                                    }
                                    type="date"
                                />
                            </span>

                            <span>
                                <label>Dropoff Date <b>*</b></label>
                                <input
                                    value={userData.dropoffDate}
                                    onChange={(e) =>
                                        setUserData({ ...userData, dropoffDate: e.target.value })
                                    }
                                    type="date"
                                />
                            </span>
                        </div>
                        {/* Image Upload Section */}
                        <div className="info-form__1col" style={{ marginTop: '2rem' }}>
                            <label>Upload Images (Optional)</label>
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
                                    You can upload multiple images 
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
                                                alt={`Upload ${index + 1}`}
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
                                onClick={() => confirmBooking({ ...userData, images: uploadedImages })}
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