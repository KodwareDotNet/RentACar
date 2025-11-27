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
    CircularProgress,
    FormControlLabel,
    Checkbox,
    FormGroup,
    FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import addRoleService from '../api/services/AddRole/addRoleService';

function AddPermissionModal({ modal, openModal, confirmAdding }) {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        selectedPermissions: [],
        roleName: "",
    });
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
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
            console.log('Role ID from localStorage:', roleId);

            // Check if user is Super Admin
            const isSuperAdminUser = userRole === 'SuperAdmin' || userRole === 'Super Admin' || userRole === 'Admin';
            setIsSuperAdmin(isSuperAdminUser);

            // Fetch roles and permissions
            await fetchRoles();
            await fetchPermissions();

            if (!isSuperAdminUser && roleId) {
                // For non-Super Admin users, find and set the role name
                const response = await addRoleService.getRoles();
                const userRoleData = response.data.find(role => role.roleId === parseInt(roleId));

                if (userRoleData) {
                    setRoleName(userRoleData.roleName);
                    setUserData(prev => ({
                        ...prev,
                        roleName: userRoleData.roleName
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

    const fetchPermissions = async () => {
        try {
            // Fetch permissions directly from GetAllPermissions endpoint
            const response = await addRoleService.getPermissions();
            const permissionsData = response.data || [];

            // Map the backend response to component format
            // Backend returns: { id, displayName, value, group }
            const formattedPermissions = permissionsData.map(permission => ({
                permissionId: permission.id,
                permissionName: permission.displayName,
                value: permission.value,
                group: permission.group
            }));

            setPermissions(formattedPermissions);
            console.log('Fetched permissions:', formattedPermissions);
        } catch (err) {
            console.error("Failed to fetch Permissions:", err);

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

    const handlePermissionToggle = (permissionId) => {
        setUserData(prev => {
            const isSelected = prev.selectedPermissions.includes(permissionId);
            const newPermissions = isSelected
                ? prev.selectedPermissions.filter(id => id !== permissionId)
                : [...prev.selectedPermissions, permissionId];

            return {
                ...prev,
                selectedPermissions: newPermissions
            };
        });

        // Clear permission error if user selects at least one
        if (errors.selectedPermissions) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.selectedPermissions;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (userData.selectedPermissions.length === 0) {
            newErrors.selectedPermissions = "Please select at least one permission";
        }
        if (!userData.roleName) {
            newErrors.roleName = "Role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            // Format the payload according to your backend structure
            const payload = {
                roleName: userData.roleName,
                selectedPermissions: userData.selectedPermissions.map(permissionId => ({
                    permissionId: permissionId
                }))
            };

            console.log('Submitting payload:', payload);

            const response = await addRoleService.addPermission(payload);
            console.log("Permissions added successfully:", response);

            if (confirmAdding) {
                confirmAdding(response.data);
            }

            openModal();
            setUserData({
                selectedPermissions: [],
                roleName: "",
            });
            navigate("/rolesList");

        } catch (err) {
            console.error("Unable to add permissions:", err);
            setErrors(prev => ({
                ...prev,
                submit: err.response?.data?.message || "Unable to add permissions. Please try again."
            }));
        } finally {
            setSubmitting(false);
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
                            marginBottom: "24px",
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

                    {/* Role Selection */}
                    <Box sx={{ marginBottom: "24px" }}>
                        {isSuperAdmin ? (
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
                                sx={textFieldStyles}
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
                                        <MenuItem key={role.roleId} value={role.roleName}>
                                            {role.roleName}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                        ) : (
                            <TextField
                                fullWidth
                                label="Role Name"
                                value={roleName}
                                disabled
                                sx={textFieldStyles}
                            />
                        )}
                    </Box>

                    {/* Permissions Selection */}
                    <Box sx={{ marginBottom: "16px" }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                color: "#010103",
                                marginBottom: "12px",
                                fontFamily: '"Rubik", sans-serif',
                            }}
                        >
                            Select Permissions <span style={{ color: "#ff4d30" }}>*</span>
                        </Typography>

                        {loading ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CircularProgress size={20} />
                                <Typography>Loading permissions...</Typography>
                            </Box>
                        ) : permissions.length === 0 ? (
                            <Typography color="textSecondary">No permissions available</Typography>
                        ) : (
                            <FormGroup>
                                <Box
                                    sx={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        maxHeight: "300px",
                                        overflowY: "auto",
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    {permissions.map((permission) => (
                                        <FormControlLabel
                                            key={permission.permissionId}
                                            control={
                                                <Checkbox
                                                    checked={userData.selectedPermissions.includes(permission.permissionId)}
                                                    onChange={() => handlePermissionToggle(permission.permissionId)}
                                                    disabled={submitting}
                                                    sx={{
                                                        color: "#ff4d30",
                                                        "&.Mui-checked": {
                                                            color: "#ff4d30",
                                                        },
                                                    }}
                                                />
                                            }
                                            label={permission.permissionName}
                                            sx={{
                                                marginBottom: "8px",
                                                "& .MuiFormControlLabel-label": {
                                                    fontFamily: '"Rubik", sans-serif',
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            </FormGroup>
                        )}

                        {errors.selectedPermissions && (
                            <FormHelperText error sx={{ marginTop: "8px" }}>
                                {errors.selectedPermissions}
                            </FormHelperText>
                        )}

                        {userData.selectedPermissions.length > 0 && (
                            <Typography
                                variant="caption"
                                sx={{
                                    marginTop: "8px",
                                    color: "#666",
                                    display: "block",
                                }}
                            >
                                {userData.selectedPermissions.length} permission(s) selected
                            </Typography>
                        )}
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
                                "Add Permissions"
                            )}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default AddPermissionModal;