import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    IconButton,
    Box,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import userService from "../api/services/AddUser/userService";

function AddUserModal({ modal, openModal, confirmAdding, editingUser }) {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        organizationId: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (editingUser) {
            setUserData({
                username: editingUser.name || "",
                email: editingUser.email || "",
                password: "", // leave empty or handle separately
                organizationId: editingUser.organizationId || "",
                role: editingUser.role || "",
            });
        }
    }, [editingUser]);

    const handleChange = (field, value) => {
        setUserData({ ...userData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!userData.username.trim()) newErrors.username = "User name is required";
        if (!userData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!userData.password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                if (editingUser) {
                    // Update user
                    await userService.updateUser(editingUser.id, userData);
                    alert("User updated successfully");
                } else {
                    // Add new user
                    await userService.addUser(userData);
                    alert("User added successfully");
                }

                confirmAdding(userData);
                setUserData({
                    username: "",
                    email: "",
                    password: "",
                    organizationId: "",
                    role: "",
                });
                openModal(false);
            } catch (err) {
                alert("Error: " + err.message);
            }
        }
    };

    // Shared TextField styles
    const textFieldStyles = {
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
                    {editingUser ? "Edit User" : "Add New User"}
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
                            marginBottom: "24px",
                            fontFamily: '"Rubik", sans-serif',
                        }}
                    >
                        User Information
                    </Typography>

                    {/* Row 1: User Name & Email */}
                    <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <TextField
                            fullWidth
                            label="User Name"
                            required
                            value={userData.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            error={!!errors.username}
                            helperText={errors.username}
                            placeholder="Enter User name"
                            sx={textFieldStyles}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            required
                            value={userData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            placeholder="example@email.com"
                            sx={textFieldStyles}
                        />
                    </Box>

                    {/* Row 2: Password & Organization ID */}
                    <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            required
                            value={userData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            placeholder="****"
                            sx={textFieldStyles}
                        />
                        <TextField
                            fullWidth
                            label="Organization ID"
                            type="number"
                            value={userData.organizationId}
                            onChange={(e) => handleChange("organizationId", e.target.value)}
                            placeholder="Organization ID"
                            sx={textFieldStyles}
                        />
                    </Box>

                    {/* Row 3: Role (half width for consistency) */}
                    <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <TextField
                            fullWidth
                            label="Role"
                            value={userData.role}
                            onChange={(e) => handleChange("role", e.target.value)}
                            placeholder="Role"
                            sx={{ ...textFieldStyles, maxWidth: "calc(50% - 8px)" }}
                        />
                    </Box>

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            marginTop: "32px",
                            paddingTop: "24px",
                            borderTop: "1px solid #e0e0e0",
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => openModal(false)}
                            sx={{
                                padding: "10px 24px",
                                fontSize: "15px",
                                fontWeight: 500,
                                fontFamily: '"Rubik", sans-serif',
                                textTransform: "none",
                                color: "#666",
                                borderColor: "#e0e0e0",
                                "&:hover": {
                                    borderColor: "#ff4d30",
                                    backgroundColor: "rgba(255, 77, 48, 0.05)",
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: "#ff4d30",
                                color: "white",
                                padding: "10px 32px",
                                fontSize: "15px",
                                fontWeight: 600,
                                fontFamily: '"Rubik", sans-serif',
                                textTransform: "none",
                                boxShadow: "0 4px 12px 0 rgba(255, 83, 48, 0.35)",
                                "&:hover": {
                                    backgroundColor: "#e63c20",
                                    boxShadow: "0 6px 16px 0 rgba(255, 83, 48, 0.5)",
                                },
                            }}
                        >
                            {editingUser ? "Update User" : "Add User"}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default AddUserModal;