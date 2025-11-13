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
import addOrganizationService from "../api/services/AddOrganization/addOrganizationService";

function AddOrganizationModal({ modal, openModal, confirmAdding }) {
    const [organizationData, setOrganizationData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",

    });
    const [errors, setErrors] = useState({});



    const handleChange = (field, value) => {
        setOrganizationData({ ...organizationData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!organizationData.name.trim()) newErrors.name = "Full name is required";
        if (!organizationData.email.trim()) newErrors.email = "Email is required";
        if (!organizationData.password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const res = await addOrganizationService.addOrganization(organizationData);
                console.log("Oranization added ", res);
                if (res) {
                    alert("Added");
                }
                confirmAdding(organizationData);
                openModal();
                setOrganizationData({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    address: "",
                });
            }
            catch (err) {
                console.error("error", err);
                alert("Error Adding");
                openModal();
                setOrganizationData({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    address: "",
                });
            }
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
                    Add Organization
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
                        Organization Information
                    </Typography>

                    <Grid container spacing={2.5}>
                        {/* Organization Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Organization Name"
                                required
                                value={organizationData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                                placeholder="Enter  name"
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
                                value={organizationData.email}
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

                        {/* password */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                required
                                type="password"
                                value={organizationData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                                placeholder="Enter password"
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

                        {/* phone */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="phone"
                                required
                                type="tel"
                                value={organizationData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                placeholder="Enter phone"
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
                                type="text"
                                value={organizationData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                placeholder="Enter address"
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
                                    Add Organization
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default AddOrganizationModal;