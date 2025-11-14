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
import addUserService from "../api/services/AddUser/addUserService";

function AddUserModal({ modal, openModal, confirmAdding }) {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        organizationId: "",
        role: "",

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
        if (!userData.username.trim()) newErrors.username = "User name is required";
        if (!userData.email.trim()) newErrors.email = "Email is required";
        if (!userData.password.trim()) newErrors.password = "Password is required";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const res = await addUserService.addUser(userData);
                console.log("user added Successfully", res)
                confirmAdding(userData);
                
                alert("userAdded");
                setUserData({
                    username: "",
                    email: "",
                    password: "",
                    organizationId: "",
                    role: "",
                });
                openModal(false);
            } catch (err) {
                alert("error Adding User", err.message);
                
                setUserData({
                    username: "",
                    email: "",
                    password: "",
                    organizationId: "",
                    role: "",
                });
                openModal(false);
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
                    Add New User
                </Typography>
                <IconButton
                    onClick={() => openModal(false)}
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
                        {/* User Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="User Name"
                                required
                                value={userData.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                error={!!errors.username}
                                helperText={errors.username}
                                placeholder="Enter User name"
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

                        {/* PassWord */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={userData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="****"
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

                        {/* organizationId */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="organizationId"
                                type="number"
                                value={userData.organizationId}
                                onChange={(e) => handleChange("organizationId", e.target.value)}
                                placeholder="organizationId"
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

                        {/* Role */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Role"
                                
                                value={userData.role}
                                onChange={(e) => handleChange("role", e.target.value)}
                                placeholder="Role"
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