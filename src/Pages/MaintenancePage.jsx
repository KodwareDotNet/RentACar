import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Alert, Snackbar, Divider, Paper, Tabs, Tab, Badge
} from '@mui/material';
import {
    DirectionsCar, Build, CheckCircle, AccessTime, Construction
} from '@mui/icons-material';
import { BASE_URL } from '../api/axiosConfig';
import maintenanceService from "../api/services/MaintainCars/maintenanceService";

const MaintenancePage = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [activeTab, setActiveTab] = useState(0); // 0 = To Repair, 1 = Repaired
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0
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
            // Fetch based on active tab: 0 = Active (status 1), 1 = Completed (status 2)
            const status = activeTab === 0 ? '1' : '2';

            const res = await maintenanceService.getMaintenanceRecords({
                pageNumber: currentPage,
                pageSize: rowsPerPage,
                status: status
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
                    lastMaintenanceDate: m.lastMaintenanceDate,
                    status: m.status || 1,
                    statusText: m.statusText || 'Active',
                    remarks: m.remarks,
                    // Determine repair type text based on source from backend
                    // Assuming backend provides 'maintenanceSource' or 'repairType' field
                    // If it comes from mileage -> "Routine Repair"
                    // If it comes from damage -> "Damage Repair"
                    repairType: m.maintenanceSource === 'mileage' || m.repairType === 'routine'
                        ? 'Routine Repair'
                        : 'Damage Repair',
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getRepairTypeIcon = () => {
        // Always show wrench icon for all maintenance
        return <Build sx={{ fontSize: 24, color: '#1976d2' }} />;
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{ mb: { xs: 0.5, sm: 1, md: 1 }, mt: { xs: 2, sm: 4, md: 7 } }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: '#1a1a1a',
                            fontSize: { xs: '1rem', sm: '1.5rem', md: '1.7rem' }
                        }}
                    >
                        Vehicle Maintenance
                    </Typography>
                    {/* <Typography
                        variant="body1"
                        sx={{
                            color: '#666',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        Manage and track vehicle maintenance records
                    </Typography> */}
                </Box>

                {/* Tabs Section */}
                <Box sx={{
                    mb: 1,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 1,
                    overflow: 'hidden',
                    width: '20vw'
                }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                fontWeight: 600,
                                py: { xs: 2, sm: 2.5 }
                            }
                        }}
                    >
                        <Tab
                            label="Cars to Repair"
                            icon={<Build />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Repaired Cars"
                            icon={<CheckCircle />}
                            iconPosition="start"
                        />
                    </Tabs>
                    {/* 
                    <Box sx={{ p: { xs: 2, sm: 2.5 }, height: '0.5vh' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Showing {maintenanceRecords.length} of {pagination.totalRecords} records
                        </Typography>
                    </Box> */}
                </Box>

                {/* Maintenance Grid */}
                <Grid container spacing={{ xs: 0.5, sm: 1, md: 1 }} >
                    {maintenanceRecords.length > 0 ? maintenanceRecords.map((maintenance) => (
                        <Grid item xs={12} sm={6} lg={4} key={maintenance.id} sx={{ height: '50vh' }} >
                            <Card
                                elevation={2}
                                sx={{
                                    display: "flex",
                                    position: 'relative',
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
                                {/* Image with Type Icon */}
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

                                    {/* Repair Type Icon Badge */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        bgcolor: 'white',
                                        borderRadius: '50%',
                                        width: 50,
                                        height: 50,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 3,
                                        zIndex: 2
                                    }}>
                                        {getRepairTypeIcon()}
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
                                    {/* 
                                    <Typography
                                        variant="body2"
                                        color="primary"
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.813rem' },
                                            fontWeight: 600,
                                            mb: 1
                                        }}
                                    >
                                        {maintenance.plateNumber}
                                    </Typography> */}

                                    {/* <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.813rem' },
                                            mb: 2
                                        }}
                                    >
                                        {maintenance.thingToMaintain}
                                    </Typography> */}

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Maintenance Details */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' }, mb: 0.5 }}
                                        >
                                            <strong>Type:</strong> {maintenance.repairType}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' } }}
                                        >
                                            <strong>Maintenance date:</strong> {formatDate(maintenance.lastMaintenanceDate)}
                                        </Typography>
                                    </Box>

                                    {/* Cost */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            px: 2,
                                            py: 1,
                                            // borderRadius: 2,
                                            bgcolor: 'white',
                                            textAlign: 'center',
                                            minWidth: 90
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
                                    No records found
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
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
            </Container>
        </Box>
    );
};

export default MaintenancePage;