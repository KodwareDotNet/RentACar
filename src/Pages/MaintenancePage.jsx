import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Alert, Snackbar, Divider, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import {
    DirectionsCar, Build, CheckCircle, AccessTime, Construction
} from '@mui/icons-material';
import { BASE_URL } from '../api/axiosConfig';
import maintenanceService from "../api/services/MaintainCars/maintenanceService";

const MaintenancePage = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [formData, setFormData] = useState({});
    const [statusFilter, setStatusFilter] = useState('All');

    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0
    });

    const filteredData = maintenanceRecords.filter(item => {
        if (statusFilter === 'All') return true;
        if (statusFilter === 'Active') return item.status === 1;
        if (statusFilter === 'Completed') return item.status === 2;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    useEffect(() => {
        fetchMaintenanceRecords();
    }, [currentPage, activeTab]);

    const formatDate = (dateString) => {
        if (!dateString || dateString === "0001-01-01T00:00:00") {
            return 'Not set';
        }
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    const fetchMaintenanceRecords = async () => {
        try {
            const status = activeTab === 0 ? '1' : '2';

            const res = await maintenanceService.getMaintenanceRecords({
                pageNumber: currentPage,
                pageSize: rowsPerPage,
            });

            if (res && res.status === 200) {
                const responseData = res.data.data || res.data;
                const paginationData = res.data.pagination;
                const mappedRecords = responseData.map((m) => ({
                    id: m.maintenanceId,
                    carId: m.carId,
                    carName: m.carName || "Unknown Car",
                    plateNumber: m.plateNumber || 'N/A',
                    image: m.imageUrl
                        ? `${BASE_URL}${m.imageUrl}`
                        : (m.car?.imageUrl ? `${BASE_URL}${m.car.imageUrl}` : '/placeholder.png'),
                    thingToMaintain: m.thingToMaintain,
                    isRepair: m.isRepair,
                    isReplace: m.isReplace,
                    cost: m.cost,
                    lastMaintenanceDate: m.pickupDate,
                    status: m.status ?? 1,
                    statusText: m.statusText || 'Active',
                    remarks: m.remarks,
                    repairType: m.repairTypeText,
                    imageUrl: m.imageUrl,
                }));

                setMaintenanceRecords(mappedRecords);

                if (paginationData) {
                    setPagination(paginationData);
                }
            }
        } catch (err) {
            console.error("Failed to fetch maintenance records:", err);
            setSnackbar({
                open: true,
                message: 'Failed to fetch maintenance records',
                severity: 'error'
            });
        }
    };

    const handleCompleteMaintenance = (maintenance) => {
        setSelectedMaintenance(maintenance);
        setOpenDialog(true);
    };

    const handleUpdateMaintenance = async () => {
        const formDataPayload = new FormData();
        formDataPayload.append('id', selectedMaintenance.id);
        formDataPayload.append('cost', Number(formData.cost));
        formDataPayload.append('remarks', formData.remarks);
        formDataPayload.append('status', "completed");
        try {
            await maintenanceService.completeMaintenance(formDataPayload);

            setSnackbar({
                open: true,
                message: 'Maintenance updated successfully',
                severity: 'success'
            });

            setOpenDialog(false);
            fetchMaintenanceRecords();
        } catch (err) {
            console.error(err);

            setSnackbar({
                open: true,
                message: err.message || 'Update failed',
                severity: 'error'
            });
            setOpenDialog(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const repairTypeStyles = {
        'Damaged Repair': {
            color: 'error.main',
            fontWeight: 700,
        },
        'Routine Repair': {
            color: 'warning.main',
            fontWeight: 600,
        },
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 1:
                return {
                    color: 'success',
                    label: 'Active',
                    showIcon: true
                };
            case 2:
                return {
                    color: 'info',
                    label: 'Completed',
                    showIcon: false
                };
            default:
                return {
                    color: 'default',
                    label: 'Unknown',
                    showIcon: false
                };
        }
    };

    return (
        <Box sx={{
            bgcolor: '#f5f5f5',
            minHeight: '100vh',
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2 }
        }}>
            <Container
                maxWidth="xl"
                sx={{
                    px: { xs: 1, sm: 2, md: 3 }
                }}
            >
                {/* Header Section */}
                <Box sx={{
                    mb: { xs: 2, sm: 3, md: 4 },
                    mt: { xs: 2, sm: 3, md: 4 }
                }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: '#1a1a1a',
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                            lineHeight: 1.2
                        }}
                    >
                        Vehicle Maintenance
                    </Typography>
                </Box>

                {/* Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    fullWidth
                    maxWidth="sm"
                    fullScreen={false}
                    sx={{
                        '& .MuiDialog-paper': {
                            m: { xs: 2, sm: 3 },
                            maxWidth: { xs: '100%', sm: 600 }
                        }
                    }}
                >
                    <DialogTitle sx={{
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        pb: 1
                    }}>
                        Complete Maintenance
                    </DialogTitle>

                    <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Cost"
                            type="number"
                            value={formData.cost || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, cost: e.target.value })
                            }
                            sx={{
                                mb: 2,
                                '& .MuiInputBase-input': {
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            label="Remarks"
                            multiline
                            rows={3}
                            value={formData.remarks || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, remarks: e.target.value })
                            }
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }
                            }}
                        />
                    </DialogContent>

                    <DialogActions sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleUpdateMaintenance}
                            sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Filter:
                    </Typography>
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                </Box> */}

                {/* Maintenance Grid */}
                <Grid
                    container
                    spacing={{ xs: 2, sm: 2.5, md: 3 }}
                    sx={{
                        mb: { xs: 3, sm: 4 }
                    }}
                >
                    {filteredData.length > 0 ? filteredData.map((maintenance) => {
                        const statusConfig = getStatusConfig(maintenance.status);

                        return (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={maintenance.id}
                            >
                                <Card
                                    elevation={2}
                                    sx={{
                                        display: "flex",
                                        position: 'relative',
                                        flexDirection: 'column',
                                        height: '100%',
                                        minHeight: { xs: 320, sm: 360, md: 380 },
                                        maxHeight: { xs: 400, sm: 450, md: 480 },
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: 6,
                                            transform: 'translateY(-4px)'
                                        },
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: { xs: 1.5, sm: 2 },
                                        width: '100%'
                                    }}
                                >
                                    {/* Image Section */}
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        flexShrink: 0
                                    }}>
                                        <CardMedia
                                            component="img"
                                            image={maintenance.image}
                                            alt={maintenance.carName}
                                            sx={{
                                                width: '100%',
                                                height: { xs: 160, sm: 180, md: 200 },
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                        />

                                        {/* Status Chip - Top Left */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: { xs: 8, sm: 12 },
                                            left: { xs: 8, sm: 12 },
                                            zIndex: 2
                                        }}>
                                            <Chip
                                                label={statusConfig.label}
                                                color={statusConfig.color}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.688rem', sm: '0.75rem' },
                                                    height: { xs: 24, sm: 28 },
                                                    boxShadow: 2,
                                                }}
                                            />
                                        </Box>

                                        {/* Repair Icon Badge - Bottom Right */}
                                        {statusConfig.showIcon && (
                                            <Box
                                                onClick={() => handleCompleteMaintenance(maintenance)}
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: { xs: 8, sm: 12 },
                                                    right: { xs: 8, sm: 12 },
                                                    bgcolor: 'white',
                                                    borderRadius: '50%',
                                                    width: { xs: 36, sm: 40 },
                                                    height: { xs: 36, sm: 40 },
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: 3,
                                                    zIndex: 2,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        boxShadow: 6,
                                                        bgcolor: '#f5f5f5',
                                                        transform: 'scale(1.1)'
                                                    }
                                                }}
                                            >
                                                <Build sx={{
                                                    fontSize: { xs: 20, sm: 24 },
                                                    color: '#1bdb52'
                                                }} />
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Content Section */}
                                    <CardContent sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: { xs: 1.5, sm: 2, md: 2.5 },
                                        overflow: 'hidden'
                                    }}>
                                        {/* Car Name */}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                mb: { xs: 0.5, sm: 1 },
                                                fontSize: { xs: '0.938rem', sm: '1.125rem', md: '1.25rem' },
                                                lineHeight: 1.3,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {maintenance.carName}
                                        </Typography>

                                        <Divider sx={{ mb: { xs: 1, sm: 1.5 } }} />

                                        {/* Maintenance Details */}
                                        <Box sx={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: { xs: 0.5, sm: 0.75 }
                                        }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' },
                                                    lineHeight: 1.5,
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                <Box component="span" sx={{ fontWeight: 600 }}>
                                                    Type:
                                                </Box>{' '}
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        display: 'inline',
                                                        fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' },
                                                        ...(repairTypeStyles[maintenance.repairType] || {
                                                            color: 'text.secondary',
                                                            fontWeight: 400,
                                                        }),
                                                    }}
                                                >
                                                    {maintenance.repairType}
                                                </Box>
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' },
                                                    lineHeight: 1.5,
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                <Box component="span" sx={{ fontWeight: 600 }}>
                                                    Maintenance date:
                                                </Box>{' '}
                                                {formatDate(maintenance.lastMaintenanceDate)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    }) : (
                        <Grid item xs={12}>
                            <Box sx={{
                                textAlign: 'center',
                                py: { xs: 6, sm: 8, md: 10 },
                                bgcolor: 'white',
                                borderRadius: { xs: 1.5, sm: 2 },
                                boxShadow: 1,
                                mx: { xs: 0, sm: 2 }
                            }}>
                                <DirectionsCar sx={{
                                    fontSize: { xs: 60, sm: 80, md: 100 },
                                    color: '#e0e0e0',
                                    mb: 2
                                }} />
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                                        fontWeight: 600
                                    }}
                                >
                                    No records found
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: { xs: '0.813rem', sm: '0.875rem', md: '1rem' },
                                        px: { xs: 2, sm: 0 }
                                    }}
                                >
                                    {activeTab === 0
                                        ? 'No vehicles currently need repairs'
                                        : 'No vehicles have been repaired yet'}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Pagination */}
                {pagination.totalRecords > rowsPerPage && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: { xs: 3, sm: 4 },
                        mb: { xs: 2, sm: 3 },
                        gap: { xs: 0.5, sm: 1 },
                        flexWrap: 'wrap',
                        px: { xs: 1, sm: 0 }
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            sx={{
                                minWidth: { xs: 'auto', sm: 80 },
                                px: { xs: 1.5, sm: 2 },
                                py: { xs: 0.75, sm: 1 },
                                fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' }
                            }}
                        >
                            Previous
                        </Button>

                        <Box sx={{
                            display: 'flex',
                            gap: { xs: 0.5, sm: 1 },
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            {[...Array(pagination.totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "contained" : "outlined"}
                                        onClick={() => setCurrentPage(pageNum)}
                                        sx={{
                                            minWidth: { xs: 32, sm: 36, md: 40 },
                                            height: { xs: 32, sm: 36, md: 40 },
                                            p: 0,
                                            fontWeight: currentPage === pageNum ? 600 : 400,
                                            fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' }
                                        }}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </Box>

                        <Button
                            variant="outlined"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                            disabled={currentPage === pagination.totalPages}
                            sx={{
                                minWidth: { xs: 'auto', sm: 80 },
                                px: { xs: 1.5, sm: 2 },
                                py: { xs: 0.75, sm: 1 },
                                fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' }
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                )}

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{
                        bottom: { xs: 16, sm: 24 },
                        '& .MuiSnackbar-root': {
                            left: { xs: 8, sm: 16 },
                            right: { xs: 8, sm: 16 }
                        }
                    }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: 400 },
                            fontSize: { xs: '0.813rem', sm: '0.875rem', md: '1rem' }
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default MaintenancePage;