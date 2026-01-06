import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    Alert, Snackbar, Divider, Paper,
    FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import {
    DirectionsCar, Build, Cancel, CheckCircle, FilterList, AccessTime
} from '@mui/icons-material';
import { BASE_URL } from '../api/axiosConfig';
import maintenanceService from "../api/services/MaintainCars/maintenanceService";

const MaintenancePage = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    useEffect(() => {
        fetchMaintenanceRecords();
    }, [currentPage, filterStatus]);

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
            const res = await maintenanceService.getMaintenanceRecords({
                pageNumber: currentPage,
                pageSize: rowsPerPage,
                status: filterStatus
            });

            if (res && res.status === 200) {
                const responseData = res.data.data || res.data;
                const paginationData = res.data.pagination;

                const mappedRecords = responseData.map((m) => ({
                    id: m.maintenanceId,
                    carId: m.car?.carId,
                    carName: m.car?.carName || "Unknown Car",
                    plateNumber: m.car?.plateNumber || 'N/A',
                    image: m.car?.imageUrl ? `${BASE_URL}${m.car.imageUrl}` : '/placeholder.png',
                    thingToMaintain: m.thingToMaintain,
                    isRepair: m.isRepair,
                    isReplace: m.isReplace,
                    cost: m.cost,
                    lastMaintenanceDate: m.lastMaintenanceDate,
                    status: m.status || 1,
                    statusText: m.statusText || 'Active',
                }));

                setMaintenanceRecords(mappedRecords);

                if (paginationData) {
                    setPagination(paginationData);
                }
            }
        } catch (err) {
            console.error("Failed to fetch maintenance records:", err);
        }
    };

    const handleCancelClick = (maintenance) => {
        setSelectedMaintenance(maintenance);
        setOpenCancelDialog(true);
    };

    const handleCompleteClick = (maintenance) => {
        setSelectedMaintenance(maintenance);
        setShowMaintenanceModal(true);
    };

    const handleConfirmCancel = async () => {
        try {
            const res = await maintenanceService.deleteMaintainedCars(selectedMaintenance.id);

            if (res?.success === true || res?.status === 200) {
                setSnackbar({
                    open: true,
                    message: `Maintenance for ${selectedMaintenance.carName} has been cancelled`,
                    severity: 'success'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed: ' + error.message,
                severity: 'error'
            });
        } finally {
            setOpenCancelDialog(false);
            setSelectedMaintenance(null);
            fetchMaintenanceRecords();
        }
    };

    const handleConfirmComplete = async () => {
        try {
            // const res = await maintenanceService.completeMaintenance(selectedMaintenance.id);

            // if (res?.success === true || res?.status === 200) {
                setSnackbar({
                    open: true,
                    message: `Maintenance for ${selectedMaintenance.carName} completed successfully`,
                    severity: 'success'
                });
            // }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed: ' + error.message,
                severity: 'error'
            });
        } finally {
            setOpenCompleteDialog(false);
            setSelectedMaintenance(null);
            fetchMaintenanceRecords();
        }
    };

    const handleCloseDialog = () => {
        setOpenCancelDialog(false);
        setOpenCompleteDialog(false);
        setSelectedMaintenance(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getStatusColor = (statusText) => {
        switch (statusText) {
            case 'Active': return 'warning';
            case 'Completed': return 'success';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (statusText) => {
        if (statusText === 'Active') return <AccessTime fontSize="small" />;
        if (statusText === 'Completed') return <CheckCircle fontSize="small" />;
        return <Cancel fontSize="small" />;
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, mt: { xs: 2, sm: 4, md: 7 } }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: '#1a1a1a',
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }
                        }}
                    >
                        Vehicle Maintenance
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#666',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        Manage and track vehicle maintenance records
                    </Typography>
                </Box>

                {/* Filter Section */}
                <Box sx={{
                    mb: 3,
                    bgcolor: 'white',
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: 2,
                    boxShadow: 1,
                    width: { xs: '100%', sm: '80%', md: '50%', lg: '35%' }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <FilterList color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            Filter Maintenance
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filterStatus}
                                    label="Status"
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="1">Active</MenuItem>
                                    <MenuItem value="2">Completed</MenuItem>
                                    <MenuItem value="3">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {filterStatus !== 'all' && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setFilterStatus('all')}
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                                Clear All Filters
                            </Button>
                        </Box>
                    )}

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        Showing {maintenanceRecords.length} of {maintenanceRecords.length} records
                    </Typography>
                </Box>

                {/* Maintenance Grid */}
                <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    {maintenanceRecords.length > 0 ? maintenanceRecords.map((maintenance) => (
                        <Grid item xs={12} sm={6} lg={4} key={maintenance.id}>
                            <Card
                                elevation={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    overflow: 'hidden',
                                    '&:hover': { boxShadow: 6 },
                                    transition: 'box-shadow 0.3s',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    maxWidth: { xs: '100%', sm: 420 },
                                    mx: 'auto'
                                }}
                            >
                                {/* Image with Action Icons */}
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        image={maintenance.image}
                                        alt={maintenance.carName}
                                        sx={{
                                            width: '100%',
                                            height: { xs: 180, sm: 200 },
                                            objectFit: 'cover'
                                        }}
                                    />

                                    {/* Action Icons - Only for Active */}
                                    {maintenance.statusText === 'Active' && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            display: 'flex',
                                            gap: 0.75,
                                            zIndex: 2
                                        }}>
                                            <IconButton
                                                onClick={() => handleCancelClick(maintenance)}
                                                sx={{
                                                    bgcolor: 'error.main',
                                                    color: 'white',
                                                    width: { xs: 32, sm: 36 },
                                                    height: { xs: 32, sm: 36 },
                                                    '&:hover': {
                                                        bgcolor: 'error.dark',
                                                        transform: 'scale(1.1)'
                                                    },
                                                    transition: 'all 0.2s',
                                                    boxShadow: 3
                                                }}
                                                size="small"
                                            >
                                                <Cancel sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                            </IconButton>

                                            <IconButton
                                                onClick={() => handleCompleteClick(maintenance)}
                                                sx={{
                                                    bgcolor: 'success.main',
                                                    color: 'white',
                                                    width: { xs: 32, sm: 36 },
                                                    height: { xs: 32, sm: 36 },
                                                    '&:hover': {
                                                        bgcolor: 'success.dark',
                                                        transform: 'scale(1.1)'
                                                    },
                                                    transition: 'all 0.2s',
                                                    boxShadow: 3
                                                }}
                                                size="small"
                                            >
                                                <CheckCircle sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                            </IconButton>
                                        </Box>
                                    )}

                                    {/* Status Badge */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Chip
                                            icon={getStatusIcon(maintenance.statusText)}
                                            label={maintenance.statusText.toUpperCase()}
                                            color={getStatusColor(maintenance.statusText)}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                height: { xs: 28, sm: 30 },
                                                boxShadow: 2,
                                                '& .MuiChip-icon': {
                                                    fontSize: { xs: 16, sm: 18 }
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <CardContent sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: { xs: 2, sm: 2.5 }
                                }}>
                                    {/* Car Name */}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 0.5,
                                            fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                        }}
                                    >
                                        {maintenance.carName}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.813rem' },
                                            mb: 2
                                        }}
                                    >
                                        {maintenance.thingToMaintain}
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Maintenance Details */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' }, mb: 0.5 }}
                                        >
                                            <strong>Type:</strong> {maintenance.isRepair && 'Repair'}{maintenance.isRepair && maintenance.isReplace && ' & '}{maintenance.isReplace && 'Replace'}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' } }}
                                        >
                                            <strong>Last Maintenance:</strong> {formatDate(maintenance.lastMaintenanceDate)}
                                        </Typography>
                                    </Box>

                                    {/* Cost */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            bgcolor: '#f0f7ff',
                                            p: 1.5,
                                            borderRadius: 1.5,
                                            border: '1px solid #e3f2fd',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                mb: 0.5,
                                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                display: 'block'
                                            }}
                                        >
                                            Maintenance Cost
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#2e7d32',
                                                fontSize: { xs: '1.5rem', sm: '1.75rem' }
                                            }}
                                        >
                                            ${maintenance.cost}
                                        </Typography>
                                    </Paper>
                                </CardContent>
                            </Card>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Box sx={{
                                textAlign: 'center',
                                py: { xs: 6, sm: 8, md: 10 },
                                bgcolor: 'white',
                                borderRadius: 2,
                                boxShadow: 1,
                                mx: { xs: 1, sm: 0 }
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
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                    }}
                                >
                                    No maintenance records found
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    No vehicles are currently under maintenance
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Cancel Dialog */}
                <Dialog
                    open={openCancelDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            m: { xs: 2, sm: 3 },
                            maxHeight: { xs: '90vh', sm: 'calc(100% - 64px)' }
                        }
                    }}
                >
                    <DialogTitle sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1.125rem', sm: '1.25rem' },
                        pb: { xs: 1, sm: 2 }
                    }}>
                        Cancel Maintenance?
                    </DialogTitle>
                    <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                        <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Are you sure you want to cancel the maintenance for <strong>{selectedMaintenance?.carName}</strong>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{
                        p: { xs: 2, sm: 2 },
                        pt: 0,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 }
                    }}>
                        <Button
                            onClick={handleCloseDialog}
                            variant="outlined"
                            sx={{
                                px: 3,
                                width: { xs: '100%', sm: 'auto' },
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Keep Active
                        </Button>
                        <Button
                            onClick={handleConfirmCancel}
                            color="error"
                            variant="contained"
                            sx={{
                                px: 3,
                                width: { xs: '100%', sm: 'auto' },
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Cancel Maintenance
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Complete Dialog */}
                <Dialog
                    open={openCompleteDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            m: { xs: 2, sm: 3 },
                            maxHeight: { xs: '90vh', sm: 'calc(100% - 64px)' }
                        }
                    }}
                >
                    <DialogTitle sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1.125rem', sm: '1.25rem' },
                        pb: { xs: 1, sm: 2 }
                    }}>
                        Complete Maintenance?
                    </DialogTitle>
                    <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                        <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Mark the maintenance for <strong>{selectedMaintenance?.carName}</strong> as completed?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{
                        p: { xs: 2, sm: 2 },
                        pt: 0,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 }
                    }}>
                        <Button
                            onClick={handleCloseDialog}
                            variant="outlined"
                            sx={{
                                px: 3,
                                width: { xs: '100%', sm: 'auto' },
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Not Yet
                        </Button>
                        <Button
                            onClick={handleConfirmComplete}
                            color="success"
                            variant="contained"
                            sx={{
                                px: 3,
                                width: { xs: '100%', sm: 'auto' },
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Mark as Completed
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{
                        bottom: { xs: 16, sm: 24 },
                    }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{
                            width: '100%',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* Pagination */}
                {pagination.totalRecords > rowsPerPage && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 4,
                        gap: { xs: 0.5, sm: 1 },
                        flexWrap: 'wrap'
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            sx={{
                                minWidth: 'auto',
                                px: { xs: 1.5, sm: 2 },
                                fontSize: { xs: '0.813rem', sm: '0.875rem' }
                            }}
                        >
                            Previous
                        </Button>

                        {[...Array(pagination.totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "contained" : "outlined"}
                                    onClick={() => setCurrentPage(pageNum)}
                                    sx={{
                                        minWidth: { xs: 36, sm: 40 },
                                        fontWeight: currentPage === pageNum ? 600 : 400,
                                        fontSize: { xs: '0.813rem', sm: '0.875rem' }
                                    }}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}

                        <Button
                            variant="outlined"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                            disabled={currentPage === pagination.totalPages}
                            sx={{
                                minWidth: 'auto',
                                px: { xs: 1.5, sm: 2 },
                                fontSize: { xs: '0.813rem', sm: '0.875rem' }
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                )}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 2,
                        textAlign: 'center',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                >
                    Showing {maintenanceRecords.length} of {pagination.totalRecords} records
                </Typography>
            </Container>
        </Box>
    );
};

export default MaintenancePage;