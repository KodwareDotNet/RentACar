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
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import addRoleService from '../api/services/AddRole/addRoleService';

function AddRoleModal({ modal, openModal, confirmAdding, roleData }) {
    const navigate = useNavigate();
    const isEditMode = !!roleData;

    const [userData, setUserData] = useState({
        roleName: "",
        organizationId: "",
        roleId: "",
    });
    const [errors, setErrors] = useState({});
    const [organizations, setOrganizations] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [organizationName, setOrganizationName] = useState("");

    // Fetch user role and organization when modal opens
    useEffect(() => {
        if (modal) {
            checkUserRole();
            fetchPermissionsAndSetSelected();
        } else {
            // Reset form when modal closes
            resetForm();
        }
    }, [modal]);

    // Separate useEffect to populate form when roleData changes
    useEffect(() => {
        if (isEditMode && roleData && modal && permissions.length > 0) {
            console.log('Setting edit mode data:', roleData);

            setUserData({
                roleName: roleData.roleName || "",
                organizationId: roleData.organizationId?.toString() || "",
                roleId: roleData.roleId,
                rolePermissions: roleData.rolePermissions?.map(p => p.permissionId) || []
            });

            // Handle different possible permission structures
            let permissionIds = [];

            if (roleData.rolePermissions && Array.isArray(roleData.rolePermissions)) {
                permissionIds = roleData.rolePermissions.map(p => p.permissionId);
                console.log('Permissions from rolePermissions:', permissionIds);
            } else if (roleData.permissions && Array.isArray(roleData.permissions)) {
                permissionIds = roleData.permissions.map(p => p.permissionId || p.id);
                console.log('Permissions from permissions:', permissionIds);
            }

            setSelectedPermissions(permissionIds);
            console.log('Selected permissions set to:', permissionIds);
        }
    }, [roleData, modal, isEditMode, permissions]);

    const resetForm = () => {
        setUserData({
            roleName: "",
            organizationId: "",
        });
        setSelectedPermissions([]);
        setErrors({});
    };

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

    const fetchPermissionsAndSetSelected = async () => {
        setLoadingPermissions(true);
        try {
            const response = await addRoleService.getPermissions();
            setPermissions(response.data || []);
        } catch (err) {
            console.error("Failed to fetch permissions:", err);
            setErrors(prev => ({
                ...prev,
                fetch: "Failed to load permissions"
            }));
        } finally {
            setLoadingPermissions(false);
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

    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
        // Clear permission error when user selects a permission
        if (errors.permissions) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.permissions;
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
        if (selectedPermissions.length === 0) {
            newErrors.permissions = "At least one permission must be selected";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const payload = {
                roleId: isEditMode ? roleData.roleId : 0,
                roleName: userData.roleName,
                organizationId: parseInt(userData.organizationId),
                rolePermissions: selectedPermissions.map(id => ({ permissionId: id }))
            };

            if (isEditMode) {
                payload.id = roleData.roleId;   // <-- correct key and value
            }

            // Add the role ID to payload for edit mode
            if (isEditMode && roleData?.id) {
                payload.id = roleData.id;
                console.log("Updating role with payload:", payload);
            } else {
                console.log("Creating role with payload:", payload);
            }

            const response = await addRoleService.addRole(payload);
            console.log(`Role ${isEditMode ? 'updated' : 'added'} successfully:`, response);

            openModal();

            if (confirmAdding) {
                confirmAdding(response.data);
            }

        } catch (err) {
            console.error(`Unable to ${isEditMode ? 'update' : 'add'} role:`, err);
            setErrors({
                submit: err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'add'} role. Please try again.`
            });
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
                    {isEditMode ? 'Edit Role' : 'Add Role'}
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

                    {/* Permissions Section */}
                    <Box sx={{ marginTop: "24px", marginBottom: "16px" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "#010103",
                                marginBottom: "16px",
                                fontFamily: '"Rubik", sans-serif',
                            }}
                        >
                            Permissions
                        </Typography>

                        {loadingPermissions ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CircularProgress size={20} />
                                <Typography>Loading permissions...</Typography>
                            </Box>
                        ) : permissions.length === 0 ? (
                            <Typography color="text.secondary">No permissions available</Typography>
                        ) : (
                            <FormGroup>
                                {permissions.map((permission) => (
                                    <FormControlLabel
                                        key={permission.id}
                                        control={
                                            <Checkbox
                                                checked={selectedPermissions.includes(permission.id)}
                                                onChange={() => handlePermissionChange(permission.id)}
                                                disabled={submitting}
                                                sx={{
                                                    color: "#666",
                                                    "&.Mui-checked": {
                                                        color: "#ff4d30",
                                                    },
                                                    "&:hover": {
                                                        backgroundColor: "rgba(255, 77, 48, 0.05)",
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                sx={{
                                                    fontFamily: '"Rubik", sans-serif',
                                                    fontSize: "15px",
                                                    color: "#010103",
                                                }}
                                            >
                                                {permission.value}
                                            </Typography>
                                        }
                                        sx={{ marginBottom: "8px" }}
                                    />
                                ))}
                            </FormGroup>
                        )}

                        {errors.permissions && (
                            <FormHelperText error sx={{ marginTop: "8px" }}>
                                {errors.permissions}
                            </FormHelperText>
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
                                    {isEditMode ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                isEditMode ? 'Update Role' : 'Add Role'
                            )}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default AddRoleModal;