import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    Alert, Snackbar, Divider, Paper, ImageList, ImageListItem
} from '@mui/material';
import {
    DirectionsCar, CalendarToday, Settings,
    Cancel, CheckCircle, Restore, Delete, EventAvailable, PhotoLibrary
} from '@mui/icons-material';
import bookCarsService from '../api/services/BookCars/bookCarsService';
import { BASE_URL } from "../api/axiosConfig";

const ReceivedCarsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            
            const res = await bookCarsService.getReceivedCars();
            if (res && res.status === 200) {
                const receivedBookings = res.data
                    .map((b) => ({
                        id: b.bookingId,
                        Id: b.receiveId,
                        carName: b.carName || "Unknown Car",
                        image: b.images?.imageUrl ? `${BASE_URL}${b.images.imageUrl}` : '/placeholder.png',
                        price: b.car?.pricePerDay || 0,
                        description: b.car?.description || '',
                        transmission: b.car?.transmission || '',
                        fuelType: b.car?.fuel || '',
                        rating: '4/5',
                        pickupDate: b.pickupDate,
                        dropoffDate: b.dropoffDate,
                        totalDays: calculateDays(b.pickupDate, b.dropoffDate),
                        totalPrice: (b.car?.pricePerDay || 0) * calculateDays(b.pickupDate, b.dropoffDate),
                        status: 'received',
                        receivedDate: b.receivedDate || b.updatedDate || new Date().toISOString(),
                        fullName: b.fullName || '',
                        fatherName: b.fatherName || '',
                        cnic: b.cnic || '',
                        licenseNumber: b.licenseNumber || '',
                        phone: b.phone || '',
                        age: b.age || '',
                        address: b.address || '',
                        city: b.city || '',
                        damageRemarks: b.damageRemarks || '',
                        damageCharges: b.damageCharges || 0,
                        remarks: b.remarks || '',
                        // Map received images
                        receiveImages: b.images?.map(img => ({
                            imageId: img.imageId,
                            imageUrl: img.imageUrl.startsWith('http') 
                                ? img.imageUrl 
                                : `${BASE_URL}${img.imageUrl}`,
                            uploadedAt: img.uploadedAt
                        })) || [],
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
                
                setBookings(receivedBookings);
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

    const handleViewImages = (booking) => {
        setSelectedBooking(booking);
        setSelectedImages(booking.receiveImages || []);
        setOpenImageDialog(true);
    };

    const deleteReceiveCar = async (id) => {
        try {
            const res = await bookCarsService.deleteReceiveCars(id);

            if (res?.success === true || res?.status === 200) {
                setSnackbar({
                    open: true,
                    message: "Received Booking deleted successfully!",
                    severity: "success"
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Deletion failed!",
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
            setSelectedBooking(null);
            fetchBookings();
        }
    };

    const handleCloseDialog = () => {
        setOpenDeleteDialog(false);
        setOpenImageDialog(false);
        setSelectedBooking(null);
        setSelectedImages([]);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4, mt: 7 }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
                        Received Cars
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        View your received car rental bookings
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {bookings.length > 0 ? bookings.map((booking) => (
                        <Grid item xs={12} sm={6} lg={4} key={booking.id}>
                            <Card 
                                elevation={2} 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden', 
                                    '&:hover': { boxShadow: 6 }, 
                                    transition: 'box-shadow 0.3s',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ 
                                            height: 240,
                                            objectFit: 'cover'
                                        }}
                                        image={booking.image}
                                        alt={booking.carName}
                                    />
                                    
                                    {/* Image Count Badge */}
                                    {/* {booking.receiveImages.length > 0 && (
                                        <Chip
                                            icon={<PhotoLibrary />}
                                            label={`${booking.receiveImages.length} Photos`}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                bgcolor: 'rgba(255, 255, 255, 0.95)',
                                                fontWeight: 600,
                                                boxShadow: 2
                                            }}
                                        />
                                    )} */}
                                </Box>

                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            {booking.carName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {booking.description}
                                        </Typography>
                                        {/* <Typography variant="caption" sx={{ 
                                            display: 'inline-block',
                                            bgcolor: '#f5f5f5',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            color: '#666'
                                        }}>
                                            {booking.rating}
                                        </Typography> */}
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* <Box sx={{ mb: 2 }}>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Transmission
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {booking.transmission}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Fuel Type
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {booking.fuelType}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box> */}

                                    {/* Damage Info */}
                                    {booking.damageRemarks && (
                                        <Alert severity="warning" sx={{ mb: 2, py: 0.5 }}>
                                            <Typography variant="caption">
                                                <strong>Damage:</strong> {booking.damageRemarks}
                                            </Typography>
                                        </Alert>
                                    )}

                                    {booking.damageCharges > 0 && (
                                        <Alert severity="error" sx={{ mb: 2, py: 0.5 }}>
                                            <Typography variant="caption">
                                                <strong>Extra Charges:</strong> ${booking.damageCharges}
                                            </Typography>
                                        </Alert>
                                    )}

                                    <Alert severity="info" sx={{ mb: 2, py: 0.5 }} icon={<EventAvailable fontSize="small" />}>
                                        <Typography variant="caption">
                                            <strong>Received:</strong> {formatDateTime(booking.receivedDate)}
                                        </Typography>
                                    </Alert>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            {/* View Images Button */}
                                            {booking.receiveImages.length > 0 && (
                                                <Button 
                                                    variant="outlined" 
                                                    color="primary" 
                                                    size="small"
                                                    startIcon={<PhotoLibrary />} 
                                                    onClick={() => handleViewImages(booking)} 
                                                    fullWidth 
                                                    sx={{ 
                                                        py: 1,
                                                        fontWeight: 600,
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    View Images
                                                </Button>
                                            )}
                                            
                                            <Button 
                                                variant="outlined" 
                                                color="error" 
                                                size="small"
                                                startIcon={<Delete />} 
                                                onClick={() => deleteReceiveCar(booking.id)} 
                                                fullWidth 
                                                sx={{ 
                                                    py: 1,
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    '&:hover': { 
                                                        bgcolor: 'error.light', 
                                                        color: 'white' 
                                                    } 
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
                                <Cancel sx={{ fontSize: 100, color: '#e0e0e0', mb: 2 }} />
                                <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                                    No received bookings
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    You don't have any received car bookings
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Image Gallery Dialog */}
                <Dialog 
                    open={openImageDialog} 
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Car Return Images - {selectedBooking?.carName}
                            </Typography>
                            <Chip 
                                label={`${selectedImages.length} Photos`} 
                                color="primary" 
                                size="small"
                            />
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedImages.length > 0 ? (
                            <ImageList cols={2} gap={16}>
                                {selectedImages.map((img, index) => (
                                    <ImageListItem key={img.imageId || index}>
                                        <img
                                            src={img.imageUrl}
                                            alt={`Return photo ${index + 1}`}
                                            loading="lazy"
                                            style={{
                                                borderRadius: 8,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => window.open(img.imageUrl, '_blank')}
                                        />
                                        <Box sx={{ 
                                            position: 'absolute', 
                                            bottom: 8, 
                                            left: 8, 
                                            bgcolor: 'rgba(0,0,0,0.6)', 
                                            color: 'white',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1
                                        }}>
                                            <Typography variant="caption">
                                                {formatDateTime(img.uploadedAt)}
                                            </Typography>
                                        </Box>
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <PhotoLibrary sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                                <Typography color="text.secondary">
                                    No images available
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default ReceivedCarsPage;