import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    Alert, Snackbar, Divider, Paper
} from '@mui/material';
import {
    DirectionsCar, CalendarToday, Settings, Cancel, CheckCircle, Star
} from '@mui/icons-material';
import bookCarsService from '../api/services/BookCars/bookCarsService';
import BookACarModal from "../components/BookACarModal";
import { BASE_URL } from "../api/axiosConfig";
import { useNavigate } from 'react-router-dom';

const BookedCarsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchBookings();
    }, []);

    const pricingLabels = {
        hourly: "hour",
        daily: "days",
        weekly: "weeks",
        monthly: "months",
    };

    const navigate = useNavigate();
    const fetchBookings = async () => {
        setLoading(true);
        try {

            const res = await bookCarsService.getBookedCars();
            if (res && res.status === 200) {
                // Map API response to match UI fields
                const mappedBookings = res.data.map((b) => ({
                    id: b.bookingId,
                    carName: b.car?.carName || "Unknown Car",
                    image: b.car?.imageUrl ? `${BASE_URL}${b.car.imageUrl}` : '/placeholder.png',
                    price: b.car?.pricePerDay || 0,
                    description: b.car?.description || '',
                    transmission: b.car?.transmission || '',
                    fuelType: b.car?.fuel || '',
                    rating: '4/5',
                    pickupDate: b.pickupDate,
                    dropoffDate: b.dropoffDate,
                    totalDays: calculateDays(b.pickupDate, b.dropoffDate),
                    totalPrice: (b.pricePerUnit || 0) * calculateHours(b.pickupDate, b.dropoffDate),
                    status: b.status,
                    fullName: b.fullName || '',
                    fatherName: b.fatherName || '',
                    cnic: b.cnic || '',
                    licenseNumber: b.licenseNumber || '',
                    phone: b.phone || '',
                    age: b.age || '',
                    address: b.address || '',
                    city: b.city || '',
                    attachments: b.attachments?.map(att => ({
                        id: att.attachmentId,
                        attachmentId: att.attachmentId,
                        fileName: att.fileName,
                        filePath: `${BASE_URL}${att.filePath}`,
                        fileSize: att.fileSize,
                        uploadDate: att.uploadDate
                    })) || [],
                    carDetail: b
                }));

                setBookings(mappedBookings);

            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
    };

    const calculateHours = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        // Convert milliseconds to hours
        return Math.max(Math.ceil(diffTime / (1000 * 60 * 60)), 0);
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
                <Box sx={{ mb: 4, mt: 7 }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
                        My Bookings
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        View and manage your car rental bookings
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {bookings.length > 0 ? bookings.map((booking) => (
                        <Grid item xs={12} lg={6} key={booking.id}>
                            <Card elevation={2} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.3s' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: { xs: '100%', md: 300 }, height: { xs: 200, md: 'auto' }, objectFit: 'fill' }}
                                    image={booking.image}
                                    alt={booking.carName}
                                />

                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                            <Box>
                                                <Typography component="h2" variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {booking.carName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">{booking.description}</Typography>
                                            </Box>
                                            <Chip icon={getStatusIcon(booking.status)} label={booking.status.toUpperCase()} color={getStatusColor(booking.status)} size="small" sx={{ fontWeight: 600 }} />
                                        </Box>
                                        {booking.status === 'Active' && (
                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid item xs={12}>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="medium"
                                                        startIcon={<Settings />}
                                                        onClick={() => handleEditClick(booking)}
                                                        sx={{
                                                            fontWeight: 600,
                                                            textTransform: 'none',
                                                            borderRadius: 2,
                                                            px: 3,
                                                            '&:hover': {
                                                                bgcolor: 'primary.light',
                                                                color: 'white',
                                                                borderColor: 'primary.main'
                                                            }
                                                        }}
                                                    >
                                                        View Booking Details & Images
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                        <Divider sx={{ my: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <CalendarToday fontSize="small" color="primary" />
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Booking Details</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary"><strong>From:</strong> {booking.pickupDate}</Typography>
                                                    <Typography variant="body2" color="text.secondary"><strong>To:</strong> {booking.dropoffDate}</Typography>
                                                    {/* <Typography variant="body2" color="text.secondary"><strong>Duration:</strong> {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}</Typography> */}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Paper elevation={0} sx={{ bgcolor: '#f0f7ff', p: 2.5, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #e3f2fd' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>Total Amount</Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', display: 'flex', alignItems: 'center' }}>
                                                        ${booking.totalPrice}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                        {booking.status === 'Active' && (
                                            <Box sx={{ mt: 3 }}>
                                                <Button variant="outlined" color="error" size="large" startIcon={<Cancel />} onClick={() => handleCancelClick(booking)} fullWidth sx={{ py: 1.5, fontWeight: 600, '&:hover': { bgcolor: 'error.light', color: 'white', borderColor: 'error.main' } }}>
                                                    Cancel Booking
                                                </Button>
                                            </Box>
                                        )}
                                        <Box sx={{ mt: 3 }}>
                                            {booking.status === 'Active' && (
                                                <Button
                                                    variant="outlined"
                                                    color="success"
                                                    size="large"
                                                    startIcon={<CheckCircle />}
                                                    onClick={() => handleReceiveClick(booking)}
                                                    fullWidth
                                                    sx={{
                                                        py: 1.5,
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            bgcolor: 'success.light',
                                                            color: 'white',
                                                            borderColor: 'success.main'
                                                        }
                                                    }}
                                                >
                                                    Receive Booking
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Box>
                            </Card>
                        </Grid>
                    )) : (
                        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
                            <DirectionsCar sx={{ fontSize: 100, color: '#e0e0e0', mb: 2 }} />
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>No bookings found</Typography>
                            <Typography variant="body2" color="text.secondary">You haven't booked any cars yet</Typography>
                            {/* <Button onClick={navigate("models")} variant="contained" sx={{ mt: 3 }} startIcon={<DirectionsCar />}>Browse Cars</Button> */}
                        </Box>
                    )}
                </Grid>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Cancel Booking?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to cancel your booking for <strong>{selectedBooking?.carName}</strong>?
                        </DialogContentText>
                        {selectedBooking && (
                            <>
                                {bookings
                                    ?.filter(booking => booking.id === selectedBooking?.id)
                                    .map((booking, index) => (
                                        <Box sx={{ mb: 1 }} key={index}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CalendarToday fontSize="small" color="primary" />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    Booking Details
                                                </Typography>
                                            </Box>

                                            <Typography variant="body2" color="text.secondary">
                                                <strong>From:</strong> {booking?.carDetail?.pickupDate}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                <strong>To:</strong> {booking?.carDetail?.dropoffDate}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Duration:</strong>{" "}
                                                {booking.totalDays}{" "}
                                                {booking.totalDays === 1 ? "day" : "days"}
                                            </Typography>
                                        </Box>
                                    ))}

                                <Box sx={{ mt: 2 }}>
                                    <Typography>
                                        Used {selectedBooking.usedUnits}{" "}
                                        {pricingLabels[selectedBooking?.carDetail?.pricingType?.toLowerCase()] || ""}
                                    </Typography>
                                    <Typography color="error">
                                        Deduction: Rs {selectedBooking.usedAmount}
                                    </Typography>
                                    <Typography color="success.main" sx={{ fontWeight: 600 }}>
                                        Refund: Rs {selectedBooking.refundableAmount}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 0 }}>
                        <Button onClick={handleCloseDialog} variant="outlined" sx={{ px: 3 }}>Keep Booking</Button>
                        <Button onClick={() => deleteBookCar(selectedBooking.id)} color="error" variant="contained" sx={{ px: 3 }}>Cancel Booking</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
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
