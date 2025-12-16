import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    Alert, Snackbar, Divider, Paper
} from '@mui/material';
import {
    DirectionsCar, CalendarToday, AttachMoney, Settings,
    LocalGasStation, Cancel, CheckCircle, Star
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
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchBookings();
    }, []);

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
                    rating: '4/5', // If API has rating, replace
                    pickupDate: b.pickupDate,
                    dropoffDate: b.dropoffDate,
                    totalDays: calculateDays(b.pickupDate, b.dropoffDate),
                    totalPrice: (b.car?.pricePerDay || 0) * calculateDays(b.pickupDate, b.dropoffDate),
                    status: 'active', // or get from API if status exists
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

    const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setOpenDialog(true);
    };

    const deleteBookCar = async (id) => {
        try {
            const res = await bookCarsService.deleteBookCars(id);

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
            // 🔥 ALWAYS close dialog
            setOpenDialog(false);
            setSelectedBooking(null);

            // 🔄 Refresh list (optional)
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
            case 'active': return 'success';
            case 'completed': return 'info';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const toggleBookModal = (booking) => {
        setSelectedBookingDetails(booking);
        setShowBookModal((prev) => !prev);
    };

    const getStatusIcon = (status) => (status === 'active' || status === 'completed') ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />;

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4, mt: 7 }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
                        My Bookings
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        View and manage your car rental bookings
                    </Typography>
                </Box>

                <Grid container spacing={3}>
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

                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="medium"
                                                    startIcon={<Settings />}
                                                    onClick={() => toggleBookModal(booking)}
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
                                                    <Typography variant="body2" color="text.secondary"><strong>Duration:</strong> {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}</Typography>
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

                                        {booking.status === 'active' && (
                                            <Box sx={{ mt: 3 }}>
                                                <Button variant="outlined" color="error" size="large" startIcon={<Cancel />} onClick={() => handleCancelClick(booking)} fullWidth sx={{ py: 1.5, fontWeight: 600, '&:hover': { bgcolor: 'error.light', color: 'white', borderColor: 'error.main' } }}>
                                                    Cancel Booking
                                                </Button>
                                            </Box>
                                        )}
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
            <BookACarModal
                modal={showBookModal}
                openModal={toggleBookModal}
                cardetail={selectedBookingDetails?.carDetail}
                bookingData={selectedBookingDetails} // Pass the booking data
                isEditMode={true} // Flag to indicate edit mode
                onUpdateSuccess={fetchBookings} // Refresh bookings after update
            />
        </Box>
    );
};

export default BookedCarsPage;
