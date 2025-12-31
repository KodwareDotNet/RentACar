import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    Alert, Snackbar, Divider, Paper,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
    DirectionsCar, CalendarToday, Settings, Cancel, CheckCircle, FilterList
} from '@mui/icons-material';
import bookCarsService from '../api/services/BookCars/bookCarsService';
import BookACarModal from "../components/BookACarModal";
import { BASE_URL } from "../api/axiosConfig";
import { useNavigate } from 'react-router-dom';

const BookedCarsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriceRange, setFilterPriceRange] = useState('all');
    const [filterCarType, setFilterCarType] = useState('all');
    const [pagination, setPagination] = useState({
        currentPage,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0
    });
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentBookings = bookings;

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, filterPriceRange, filterCarType]);

    useEffect(() => {
        fetchBookings();
    }, [currentPage, filterStatus, filterPriceRange, filterCarType]);

    const pricingLabels = {
        hourly: "hour",
        daily: "days",
        weekly: "weeks",
        monthly: "months",
    };

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
    const fetchBookings = async () => {
        try {
            const res = await bookCarsService.getBookedCars({
                pageNumber: currentPage,
                pageSize: rowsPerPage,
                bookingStatus: filterStatus,
                priceRange: filterPriceRange,
            });

            if (res && res.status === 200) {
                console.log('API Response:', res.data);

                // Check the response structure
                const responseData = res.data.data || res.data;
                const paginationData = res.data.pagination;

                const mappedBookings = responseData.map((b) => {
                    // Calculate dates properly
                    const pickup = b.pickupDate !== "0001-01-01T00:00:00" ? new Date(b.pickupDate) : null;
                    const dropoff = b.dropoffDate !== "0001-01-01T00:00:00" ? new Date(b.dropoffDate) : null;

                    return {
                        id: b.bookingId,
                        carName: b.car?.carName || "Unknown Car",
                        image: b.car?.imageUrl ? `${BASE_URL}${b.car.imageUrl}` : '/placeholder.png',
                        price: b.car?.pricePerHour || b.pricePerUnit || 0,
                        description: b.car?.description || '',
                        transmission: b.car?.transmission || 'N/A',
                        fuelType: b.car?.fuel || 'N/A',
                        rating: '4/5',
                        pickupDate: pickup,
                        dropoffDate: dropoff,
                        totalDays: pickup && dropoff ? calculateDays(pickup, dropoff) : 0,
                        totalPrice: b.totalAmount || 0,
                        status: b.status || 'Pending',
                        fullName: b.fullName || '',
                        fatherName: b.fatherName || '',
                        cnic: b.cnic || '',
                        licenseNumber: b.licenseNumber || '',
                        phone: b.phone || '',
                        age: b.age || 0,
                        address: b.address || '',
                        city: b.city || '',
                        attachments: b.attachments?.map(att => ({
                            id: att.attachmentId,
                            attachmentId: att.attachmentId,
                            fileName: att.fileName,
                            filePath: att.filePath ? `${BASE_URL}${att.filePath}` : null,
                            fileSize: att.fileSize,
                            uploadDate: att.uploadDate
                        })) || [],
                        carDetail: b
                    };
                });

                console.log('Mapped Bookings:', mappedBookings); // Debug log

                setBookings(mappedBookings);

                if (paginationData) {
                    setPagination(paginationData);
                }
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);

        } 
    };

    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
    };

    const calculateDuration = (start, end, type) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate - startDate;

        if (diffMs <= 0) return 0;

        if (type === "hourly") {
            return Math.ceil(diffMs / (1000 * 60 * 60));
        }
        if (type === "monthly") {
            return Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));
        }
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // daily
    };

    const handleCancelClick = (booking) => {
        const cancelDate = new Date();
        const dropoffDate = new Date(booking.carDetail.dropoffDate);

        // Use the earlier date between cancel date and dropoff date
        const effectiveCancelDate = cancelDate > dropoffDate ? dropoffDate : cancelDate;

        const usedUnits = calculateDuration(
            booking.carDetail.pickupDate,
            effectiveCancelDate,
            booking.carDetail.pricingType
        );

        const usedAmount = usedUnits * booking.carDetail.pricePerUnit;

        const refundableAmount = Math.max(
            booking.totalPrice - usedAmount,
            0
        );

        setSelectedBooking({
            ...booking,
            usedUnits,
            usedAmount,
            refundableAmount
        });

        setOpenDialog(true);
    };




    const deleteBookCar = async (id) => {
        try {
            const cancellationData = {
                usedUnits: selectedBooking.usedUnits,
                usedAmount: selectedBooking.usedAmount,
                refundableAmount: selectedBooking.refundableAmount
            };

            const res = await bookCarsService.cancelBooking(id, cancellationData);

            if (res?.success === true || res?.status === 200) {
                setSnackbar({
                    open: true,
                    message: "Booking cancelled successfully!",
                    severity: "success"
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Cancellation failed!",
                    severity: "error"
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed: " + error.message,
                severity: "error"
            });
        } finally {
            setOpenDialog(false);
            setSelectedBooking(null);
            fetchBookings();
        }
    };


    const handleConfirmCancel = () => {
        if (selectedBooking) {
            setBookings(bookings.map(b =>
                b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
            ));
            setSnackbar({
                open: true,
                message: `Booking for ${selectedBooking.carName} has been cancelled successfully!`,
                severity: 'success'
            });
        }
        setOpenDialog(false);
        setSelectedBooking(null);
    };

    const handleCloseDialog = () => {

        setOpenDialog(false);
        setSelectedBooking(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Completed': return 'info';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const toggleBookModal = (booking) => {
        setSelectedBookingDetails(booking);
        setShowBookModal((prev) => !prev);
    };

    const handleEditClick = (booking) => {
        setSelectedBookingDetails(booking);
        setShowEditModal(true);
    };

    // Handler for Receive Booking button
    const handleReceiveClick = (booking) => {
        setSelectedBookingDetails(booking);
        setShowReceiveModal(true);
    };

    const getStatusIcon = (status) => (status === 'Active' || status === 'Completed') ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />;

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="lg">
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
                        My Bookings
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#666',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        View and manage your car rental bookings
                    </Typography>
                </Box>

                <Box sx={{
                    mb: 3,
                    bgcolor: 'white',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 1,
                    display: 'block',
                    width: '35%'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <FilterList color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Filter Bookings
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {/* Status Filter */}
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

                    {/* Clear Filters Button */}
                    {(filterStatus !== 'all' || filterPriceRange !== 'all' || filterCarType !== 'all') && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setFilterStatus('all');
                                    setFilterPriceRange('all');
                                    setFilterCarType('all');
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </Box>
                    )}

                    {/* Results Count */}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Showing {bookings.length} of {bookings.length} bookings
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {bookings.length > 0 ? currentBookings.map((booking) => (
                        <Grid item xs={12} sm={12} md={6} lg={4} key={booking.id}>
                            <Card
                                elevation={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    overflow: 'hidden',
                                    '&:hover': { boxShadow: 4 },
                                    transition: 'box-shadow 0.3s'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={booking.image}
                                    alt={booking.carName}
                                    sx={{
                                        width: '100%',
                                        height: 180,
                                        objectFit: 'cover'
                                    }}
                                />
                                <CardContent
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: { xs: 2, sm: 2.5, md: 3 }
                                    }}
                                >
                                    {/* Header with Car Name and Status */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        mb: 2,
                                        gap: 1
                                    }}>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                component="h2"
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                                                }}
                                            >
                                                {booking.carName}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {booking.description}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            icon={getStatusIcon(booking.status)}
                                            label={booking.status.toUpperCase()}
                                            color={getStatusColor(booking.status)}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                height: { xs: 24, sm: 28 }
                                            }}
                                        />
                                    </Box>

                                    {/* View Details Button - Only for Active */}
                                    {booking.status === 'Active' && (
                                        <Box sx={{ mb: 2 }}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                startIcon={<Settings sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                                onClick={() => handleEditClick(booking)}
                                                fullWidth
                                                sx={{
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    borderRadius: 2,
                                                    px: { xs: 1.5, sm: 2 },
                                                    py: { xs: 0.75, sm: 1 },
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    '&:hover': {
                                                        bgcolor: 'primary.light',
                                                        color: 'white',
                                                        borderColor: 'primary.main'
                                                    }
                                                }}
                                            >
                                                View Details & Images
                                            </Button>
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 2 }} />

                                    {/* Booking Details Grid */}
                                    <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2 }}>
                                        <Grid item xs={12}>
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <CalendarToday sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} color="primary" />
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                                        }}
                                                    >
                                                        Booking Details
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, mb: 0.5 }}
                                                >
                                                    <strong>From:</strong> {formatDate(booking.pickupDate)}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                                                >
                                                    <strong>To:</strong> {formatDate(booking.dropoffDate)}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    bgcolor: '#f0f7ff',
                                                    p: { xs: 1.5, sm: 2 },
                                                    borderRadius: 2,
                                                    border: '1px solid #e3f2fd',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 0.5,
                                                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                        display: 'block'
                                                    }}
                                                >
                                                    Total Amount
                                                </Typography>
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#2e7d32',
                                                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                                                    }}
                                                >
                                                    ${booking.totalPrice}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* Action Buttons - Spacer to push buttons to bottom */}
                                    <Box sx={{ flexGrow: 1 }} />

                                    {/* Action Buttons */}
                                    {booking.status === 'Active' && (
                                        <Box sx={{ mt: 'auto' }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="medium"
                                                startIcon={<Cancel sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                                onClick={() => handleCancelClick(booking)}
                                                fullWidth
                                                sx={{
                                                    py: { xs: 1, sm: 1.25 },
                                                    mb: 1.5,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                    '&:hover': {
                                                        bgcolor: 'error.light',
                                                        color: 'white',
                                                        borderColor: 'error.main'
                                                    }
                                                }}
                                            >
                                                Cancel Booking
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                size="medium"
                                                startIcon={<CheckCircle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                                onClick={() => handleReceiveClick(booking)}
                                                fullWidth
                                                sx={{
                                                    py: { xs: 1, sm: 1.25 },
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                    '&:hover': {
                                                        bgcolor: 'success.light',
                                                        color: 'white',
                                                        borderColor: 'success.main'
                                                    }
                                                }}
                                            >
                                                Receive Booking
                                            </Button>
                                        </Box>
                                    )}

                                    {/* Empty space for cancelled/completed bookings to maintain height */}
                                    {booking.status !== 'Active' && (
                                        <Box sx={{ mt: 'auto', minHeight: { xs: 90, sm: 100 } }} />
                                    )}
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
                                    No bookings found
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    You haven't booked any cars yet
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Cancel Dialog */}
                <Dialog
                    open={openDialog}
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
                        Cancel Booking?
                    </DialogTitle>
                    <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                        <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Are you sure you want to cancel your booking for <strong>{selectedBooking?.carName}</strong>?
                        </DialogContentText>
                        {selectedBooking && (
                            <>
                                {bookings
                                    ?.filter(booking => booking.id === selectedBooking?.id)
                                    .map((booking, index) => (
                                        <Box sx={{ mb: 1, mt: 2 }} key={index}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CalendarToday fontSize="small" color="primary" />
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                                    }}
                                                >
                                                    Booking Details
                                                </Typography>
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                            >
                                                <strong>From:</strong> {booking?.carDetail?.pickupDate}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                            >
                                                <strong>To:</strong> {booking?.carDetail?.dropoffDate}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                            >
                                                <strong>Duration:</strong>{" "}
                                                {booking.totalDays}{" "}
                                                {booking.totalDays === 1 ? "day" : "days"}
                                            </Typography>
                                        </Box>
                                    ))}

                                <Box sx={{ mt: 2 }}>
                                    <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                        Used {selectedBooking.usedUnits}{" "}
                                        {pricingLabels[selectedBooking?.carDetail?.pricingType?.toLowerCase()] || ""}
                                    </Typography>
                                    <Typography
                                        color="error"
                                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                    >
                                        Deduction: Rs {selectedBooking.usedAmount}
                                    </Typography>
                                    <Typography
                                        color="success.main"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }}
                                    >
                                        Refund: Rs {selectedBooking.refundableAmount}
                                    </Typography>
                                </Box>
                            </>
                        )}
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
                                width: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            Keep Booking
                        </Button>
                        <Button
                            onClick={() => deleteBookCar(selectedBooking.id)}
                            color="error"
                            variant="contained"
                            sx={{
                                px: 3,
                                width: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            Cancel Booking
                        </Button>
                    </DialogActions>
                </Dialog>

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

                {pagination.totalRecords > rowsPerPage && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 4,
                        gap: 1
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            sx={{ minWidth: 'auto', px: 2 }}
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
                                        minWidth: 40,
                                        fontWeight: currentPage === pageNum ? 600 : 400
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
                            sx={{ minWidth: 'auto', px: 2 }}
                        >
                            Next
                        </Button>
                    </Box>
                )}

                {/* Update Results Count */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Showing {bookings.length} of {pagination.totalRecords} bookings
                </Typography>
            </Container>

            {/* EDIT MODE MODAL */}
            <BookACarModal
                modal={showEditModal}
                openModal={() => setShowEditModal(false)}
                cardetail={selectedBookingDetails?.carDetail}
                bookingData={selectedBookingDetails}
                isEditMode={true}
                isReceiveMode={false}
                onUpdateSuccess={fetchBookings}
            />

            {/* RECEIVE MODE MODAL */}
            <BookACarModal
                modal={showReceiveModal}
                openModal={() => setShowReceiveModal(false)}
                cardetail={selectedBookingDetails?.carDetail}
                bookingData={selectedBookingDetails}
                isEditMode={false}
                isReceiveMode={true}
                onUpdateSuccess={fetchBookings}
            />
        </Box>
    );
};

export default BookedCarsPage;
