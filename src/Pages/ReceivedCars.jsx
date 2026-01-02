import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, Snackbar, Divider, ImageList, ImageListItem
} from '@mui/material';
import {
    Cancel, Delete, EventAvailable, PhotoLibrary
} from '@mui/icons-material';
import bookCarsService from '../api/services/BookCars/bookCarsService';
import { BASE_URL } from "../api/axiosConfig";
import audiBox from "../images/cars-big/audi-box.png";


const ReceivedCarsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const fetchBookings = async (pageNumber = 1, pageSize = 10) => {
        try {
            const res = await bookCarsService.getReceivedCars(pageNumber, pageSize);
            if (res && res.status === 200) {
                const responseData = res.data.data || res.data;
                const paginationData = res.data.pagination;

                const receivedBookings = responseData.map((b) => ({
                    id: b.bookingId,
                    receiveId: b.receiveId,
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

                // Update pagination state from backend response
                if (paginationData) {
                    setCurrentPage(paginationData.currentPage);
                    setTotalPages(paginationData.totalPages);
                    setTotalRecords(paginationData.totalRecords);
                    setPageSize(paginationData.pageSize);
                }
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        }
    };
    useEffect(() => {
        fetchBookings(currentPage, pageSize);
    }, [currentPage, pageSize]);

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
        setOpenImageDialog(false);
        setSelectedBooking(null);
        setSelectedImages([]);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                                        image={
                                               audiBox
                                        }
                                        alt={booking.carName}
                                    />
                                </Box>

                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            {booking.carName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {booking.description}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />


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
                                                onClick={() => deleteReceiveCar(booking.receiveId)}
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
                {totalRecords > pageSize && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 4,
                        gap: 1
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            sx={{ minWidth: 'auto', px: 2 }}
                        >
                            Previous
                        </Button>

                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "contained" : "outlined"}
                                    onClick={() => handlePageChange(pageNum)}
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
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            sx={{ minWidth: 'auto', px: 2 }}
                        >
                            Next
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ReceivedCarsPage;