import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    IconButton,
    Box,
    Typography,
    Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function AddUserModal({ modal, openModal, confirmAdding }) {
    const [userData, setUserData] = useState({
        name: "",
        fatherName: "",
        email: "",
        cnic: "",
        licenseNumber: "",
        phone: "",
        age: "",
        address: "",
        city: "",
        pickupDate: "",
        dropoffDate: "",
        carType: "",
        emergencyContact: "",
        occupation: "",
    });
    const [errors, setErrors] = useState({});



    const handleChange = (field, value) => {
        setUserData({ ...userData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!userData.name.trim()) newErrors.name = "Full name is required";
        if (!userData.fatherName.trim()) newErrors.fatherName = "Father name is required";
        if (!userData.cnic.trim()) newErrors.cnic = "CNIC is required";
        if (!userData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
        if (!userData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!userData.age || userData.age < 18) newErrors.age = "Age must be 18 or above";
        if (!userData.address.trim()) newErrors.address = "Address is required";
        if (!userData.city.trim()) newErrors.city = "City is required";
        if (!userData.pickupDate) newErrors.pickupDate = "Pickup date is required";
        if (!userData.dropoffDate) newErrors.dropoffDate = "Dropoff date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            confirmAdding({ ...userData});
        }
    };


    return (
        <Dialog
            open={modal}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "8px",
                    maxHeight: "90vh",
                },
            }}
        >
            {/* Dialog Title */}
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    padding: "20px 24px",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: "#010103",
                        fontFamily: '"Rubik", sans-serif',
                    }}
                >
                    Add New User
                </Typography>
                <IconButton
                    onClick={openModal}
                    sx={{
                        color: "#666",
                        "&:hover": {
                            color: "#ff4d30",
                            backgroundColor: "rgba(255, 77, 48, 0.1)",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent sx={{ padding: "24px" }}>
                <Box component="form" noValidate>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: "#010103",
                            marginBottom: "20px",
                            fontFamily: '"Rubik", sans-serif',
                        }}
                    >
                        User Information
                    </Typography>

                    <Grid container spacing={2.5}>
                        {/* Full Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                required
                                value={userData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                                placeholder="Enter your full name"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Father Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Father Name"
                                required
                                value={userData.fatherName}
                                onChange={(e) => handleChange("fatherName", e.target.value)}
                                error={!!errors.fatherName}
                                helperText={errors.fatherName}
                                placeholder="Enter your father's name"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={userData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="example@email.com"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Phone */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                required
                                type="tel"
                                value={userData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                placeholder="Enter your phone number"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* CNIC */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="CNIC"
                                required
                                value={userData.cnic}
                                onChange={(e) => handleChange("cnic", e.target.value)}
                                error={!!errors.cnic}
                                helperText={errors.cnic}
                                placeholder="XXXXX-XXXXXXX-X"
                                inputProps={{ maxLength: 15 }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* License Number */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="License Number"
                                required
                                value={userData.licenseNumber}
                                onChange={(e) => handleChange("licenseNumber", e.target.value)}
                                error={!!errors.licenseNumber}
                                helperText={errors.licenseNumber}
                                placeholder="Enter your license number"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Age */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Age"
                                required
                                type="number"
                                value={userData.age}
                                onChange={(e) => handleChange("age", e.target.value)}
                                error={!!errors.age}
                                helperText={errors.age}
                                placeholder="18"
                                inputProps={{ min: 18, max: 100 }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Occupation */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Occupation"
                                value={userData.occupation}
                                onChange={(e) => handleChange("occupation", e.target.value)}
                                placeholder="Enter your occupation"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Address */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                required
                                value={userData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                error={!!errors.address}
                                helperText={errors.address}
                                placeholder="Enter your street address"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* City */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                required
                                value={userData.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                                error={!!errors.city}
                                helperText={errors.city}
                                placeholder="Enter your city"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Emergency Contact */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Emergency Contact"
                                type="tel"
                                value={userData.emergencyContact}
                                onChange={(e) => handleChange("emergencyContact", e.target.value)}
                                placeholder="Emergency contact number"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4d30",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ff4d30",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Submit Button */}
                        
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    sx={{
                                        backgroundColor: "#ff4d30",
                                        color: "white",
                                        padding: "12px 32px",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        fontFamily: '"Rubik", sans-serif',
                                        textTransform: "none",
                                        boxShadow: "0 10px 15px 0 rgba(255, 83, 48, 0.35)",
                                        "&:hover": {
                                            backgroundColor: "#e63c20",
                                            boxShadow: "0 10px 15px 0 rgba(255, 83, 48, 0.5)",
                                        },
                                    }}
                                >
                                    Add User
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default AddUserModal;