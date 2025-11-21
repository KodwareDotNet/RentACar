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
    MenuItem,
    CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import addRoleService from '../api/services/AddRole/addRoleService';

function AddRoleModal({ modal, openModal, confirmAdding }) {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        roleName: "",
        organizationId: "",
    });
    const [errors, setErrors] = useState({});
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [organizationName, setOrganizationName] = useState("");

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
            const orgId = localStorage.getItem('organizationId');

            console.log('User Role from localStorage:', userRole);
            console.log('Organization ID from localStorage:', orgId);

            // Check if user is Super Admin
            const isSuperAdminUser = userRole === 'SuperAdmin' || userRole === 'Super Admin' || userRole === 'Admin';
            setIsSuperAdmin(isSuperAdminUser);

            // Fetch organizations
            await fetchOrganizations();

            if (!isSuperAdminUser && orgId) {
                // For non-Super Admin users, find and set the organization name
                const response = await addRoleService.getOrganization();
                const userOrg = response.data.find(org => org.id === parseInt(orgId));

                if (userOrg) {
                    setOrganizationName(userOrg.name);
                    setUserData(prev => ({
                        ...prev,
                        organizationId: orgId
                    }));
                } else {
                    console.warn('Organization not found for ID:', orgId);
                    setOrganizationName("Organization not found");
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

    const fetchOrganizations = async () => {
        try {
            const response = await addRoleService.getOrganization();
            setOrganizations(response.data || []);
        } catch (err) {
            console.error("Failed to fetch organizations:", err);
            setErrors(prev => ({
                ...prev,
                fetch: "Failed to load organizations"
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
        if (!userData.roleName.trim()) {
            newErrors.roleName = "Role Name is required";
        }
        if (!userData.organizationId) {
            newErrors.organizationId = "Organization is required";
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
                organizationId: parseInt(userData.organizationId),
            });
            openModal();
            console.log("Role added successfully:", response);

            if (confirmAdding) {
                confirmAdding(response.data);
            }

            navigate("/rolesList");

        } catch (err) {
            console.error("Unable to add role:", err);
            setErrors({
                submit: err.message || "Failed to add role. Please try again."
            });
        } finally {
            setSubmitting(false);
            navigate("/home");
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
                    Add Role
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
                            marginBottom: "24px",
                            fontFamily: '"Rubik", sans-serif',
                        }}
                    >
                        Role Information
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

                    {/* Fields Row */}
                    <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        {/* Role Name */}
                        <TextField
                            fullWidth
                            label="Role Name"
                            required
                            value={userData.roleName}
                            onChange={(e) => handleChange("roleName", e.target.value)}
                            error={!!errors.roleName}
                            helperText={errors.roleName}
                            placeholder="Enter Role name"
                            disabled={submitting}
                            sx={textFieldStyles}
                        />

                        {/* Organization - Conditional Rendering */}
                        {isSuperAdmin && (
                            <TextField
                                fullWidth
                                select
                                label="Organization"
                                required
                                value={userData.organizationId}
                                onChange={(e) => handleChange("organizationId", e.target.value)}
                                error={!!errors.organizationId}
                                helperText={errors.organizationId}
                                disabled={loading || submitting}
                                sx={textFieldStyles}
                            >
                                {loading ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={20} />
                                        <Typography sx={{ ml: 1 }}>Loading...</Typography>
                                    </MenuItem>
                                ) : organizations.length === 0 ? (
                                    <MenuItem disabled>No organizations available</MenuItem>
                                ) : (
                                    organizations.map((org) => (
                                        <MenuItem key={org.id} value={org.id}>
                                            {org.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                        )}
                    </Box>

                    {/* Non-Super Admin Organization Display */}
                    {!isSuperAdmin && organizationName && (
                        <Box sx={{ marginBottom: "16px" }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Organization
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {organizationName}
                            </Typography>
                        </Box>
                    )}

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
                            onClick={openModal}
                            disabled={submitting}
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
                            disabled={submitting || loading}
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
                                "Add Role"
                            )}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default AddRoleModal;