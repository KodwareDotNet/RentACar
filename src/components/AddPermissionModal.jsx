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
    Grid,
    MenuItem,
    CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import addRoleService from '../api/services/AddRole/addRoleService';

function AddPermissionModal({ modal, openModal, confirmAdding }) {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        permissionName: "",
        roleName: "",
    });
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [roleName, setRoleName] = useState("");

    // Fetch user role and organization when modal opens
    useEffect(() => {
        if (modal) {
            checkUserRole();
        }
    }, [modal]);

    const checkUserRole = async () => {
        setLoading(true);



        try {
            // Get user info from localStorage
            const userRole = localStorage.getItem('role');
            const roleId = localStorage.getItem('roleId');

            console.log('User Role from localStorage:', userRole);
            console.log('Organization ID from localStorage:', roleId);

            // Check if user is Super Admin
            // Adjust this condition based on what your backend returns for Super Admin
            const isSuperAdminUser = userRole === 'SuperAdmin' || userRole === 'Super Admin' || userRole === 'Admin';
            setIsSuperAdmin(isSuperAdminUser);

            // Fetch organizations
            await fetchRoles();

            if (!isSuperAdminUser && roleId) {
                // For non-Super Admin users, find and set the organization name
                const response = await addRoleService.getRoles();
                const roleName = response.data.find(role => role.id === parseInt(roleId));

                if (roleName) {
                    setRoleName(response.data.roleName);
                    setUserData(prev => ({
                        ...prev,
                        roleId: roleId
                    }));
                } else {
                    console.warn('Role not found for ID:', roleId);
                    setRoleName("Role not found");
                }
            }
        } catch (err) {
            console.error("Failed to check user role:", err);
            setErrors(prev => ({
                ...prev,
                fetch: "Failed to load user information"
            }));
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await addRoleService.getRoles();
            setRoles(response.data || []);
        } catch (err) {
            console.error("Failed to fetch Roles:", err);
            setErrors(prev => ({
                ...prev,
                fetch: "Failed to load roles"
            }));
        }
    };

    const handleChange = (field, value) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!userData.permissionName.trim()) {
            newErrors.permissionName = "Permission Name is required";
        }
        if (!userData.roleName) {
            newErrors.roleName = "role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const response = await addRoleService.addRole({
                roleName: userData.roleName,
                roleId: parseInt(userData.roleId),
            });

            console.log("Role added successfully:", response);

            if (confirmAdding) {
                confirmAdding(response.data);
            }

            openModal();
            navigate("/rolesList");

        } catch (err) {
            console.error("Unable to add role:", err);
            setErrors({
                submit: err.message || "Failed to add permission. Please try again."
            });
        } finally {
            setSubmitting(false);
            navigate("/home");
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
                    Add Permissions
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
                        Permission Information
                    </Typography>

                    {errors.fetch && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {errors.fetch}
                        </Typography>
                    )}

                    {errors.submit && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {errors.submit}
                        </Typography>
                    )}

                    <Grid container spacing={2.5}>
                        {/* Permission Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Permission Name"
                                required
                                value={userData.permissionName}
                                onChange={(e) => handleChange("permissionName", e.target.value)}
                                error={!!errors.permissionName}
                                helperText={errors.permissionName}
                                placeholder="Enter Permission name"
                                disabled={submitting}
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

                        {/* Organization - Conditional Rendering */}
                        {isSuperAdmin && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Role Name"
                                    required
                                    value={userData.roleName}
                                    onChange={(e) => handleChange("roleName", e.target.value)}
                                    error={!!errors.roleName}
                                    helperText={errors.roleName}
                                    disabled={loading || submitting}
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
                                >
                                    {loading ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} />
                                            <Typography sx={{ ml: 1 }}>Loading...</Typography>
                                        </MenuItem>
                                    ) : roles.length === 0 ? (
                                        <MenuItem disabled>No roles available</MenuItem>
                                    ) : (
                                        roles.map((role) => (
                                            <MenuItem key={role.roleId} value={role.roleId}>
                                                {role.roleName}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>
                            </Grid>
                        )}


                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={submitting || loading}
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
                                        "&:disabled": {
                                            backgroundColor: "#ccc",
                                        },
                                    }}
                                >
                                    {submitting ? (
                                        <>
                                            <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Permission"
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    ); 

}

export default AddPermissionModal;