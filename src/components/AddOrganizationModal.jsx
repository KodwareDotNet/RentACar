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
import addOrganizationService from "../api/services/AddOrganization/addOrganizationService";
import addRoleService from '../api/services/AddRole/addRoleService';
import addPermissionService from "../api/services/AddPermission/addPermissionService";

function AddOrganizationModal({ modal, openModal, confirmAdding, selectedOrg, isEdit }) {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [organizationData, setOrganizationData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        roles: [],
        permissionIds: [],
    });
    const [errors, setErrors] = useState({});
    const resetForm = () => {
        setOrganizationData({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
        });
        setRoles([]);
    };

    const handleChange = (field, value) => {
        setOrganizationData({ ...organizationData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    useEffect(() => {
        if (modal) {
            const fetchRoles = async () => {
                try {
                    const res = await addRoleService.getRoles();
                    setRoles(res.data);
                } catch (err) {
                    console.log("Error fetching roles", err);
                }
            };

            fetchRoles();
        }
    }, [modal]);

    const handleRoleToggle = (role) => {
        const exists = organizationData.roles.some(r => r.roleId === role.roleId);

        if (exists) {
            // Remove role
            setOrganizationData({
                ...organizationData,
                roles: organizationData.roles.filter(r => r.roleId !== role.roleId),
            });
        } else {
            // Add role in KeyValue format
            setOrganizationData({
                ...organizationData,
                roles: [
                    ...organizationData.roles,
                    {
                        roleId: role.roleId,
                        displayName: role.roleName,
                    },
                ],
            });
        }
    };



    const validateForm = () => {
        const newErrors = {};
        if (!organizationData.name.trim()) newErrors.name = "Organization name is required";
        if (!organizationData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(organizationData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!organizationData.password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (isEdit && selectedOrg) {
            setOrganizationData({
                name: selectedOrg.name || "",
                email: selectedOrg.email || "",
                password: "", // usually not sent back
                phone: selectedOrg.phone || "",
                address: selectedOrg.address || "",
            });
        }
    }, [selectedOrg, isEdit]);


    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                if (isEdit) {
                    await addOrganizationService.updateOrganization(
                        selectedOrg.id,
                        organizationData
                    );
                    alert("Organization Updated");
                } else {
                    await addOrganizationService.addOrganization(organizationData);
                    alert("Organization Added");
                }

                confirmAdding(); // refresh list
                openModal();
                resetForm();

            } catch (err) {
                alert("Error");
                resetForm();
                openModal();
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
                    {isEdit ? "Edit Organization" : "Add Organization"}
                </Typography>
                <IconButton
                    onClick={() => { resetForm(); openModal(); }}
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
                        Organization Information
                    </Typography>

                    {/* Row 1: Organization Name & Email */}
                    <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <TextField
                            fullWidth
                            label="Organization Name"
                            required
                            value={organizationData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            placeholder="Enter name"
                            sx={textFieldStyles}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            required
                            value={organizationData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            placeholder="example@email.com"
                            sx={textFieldStyles}
                        />
                    </Box>

                    {/* Row 2: Password & Phone */}
                    <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
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
                            sx={textFieldStyles}
                        />
                        <TextField
                            fullWidth
                            label="Phone"
                            type="tel"
                            value={organizationData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="Enter phone"
                            sx={textFieldStyles}
                        />
                    </Box>

                    {/* Row 3: Address (takes half width to maintain consistency) */}
                    <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <TextField
                            fullWidth
                            label="Address"
                            type="text"
                            value={organizationData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            placeholder="Enter address"
                            sx={{ ...textFieldStyles, maxWidth: "calc(50% - 8px)" }}
                        />
                    </Box>

                    <Box sx={{ marginBottom: "16px" }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, marginBottom: "8px" }}
                        >
                            Select Roles
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {roles.map((role) => (
                                <Box
                                    key={role.roleId}
                                    sx={{ display: "flex", alignItems: "center" }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={organizationData.roles.some(r => r.roleId === role.roleId)}
                                        onChange={() => handleRoleToggle(role)}
                                    />
                                    <Typography sx={{ marginLeft: "8px" }}>
                                        {role.roleName}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
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
                            onClick={() => { resetForm(); openModal(); }}
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
                            {isEdit ? "Update Organization" : "Add Organization"}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default AddOrganizationModal;