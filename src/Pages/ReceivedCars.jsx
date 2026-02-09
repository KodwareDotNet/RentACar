import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, Snackbar, Divider, ImageList, ImageListItem, IconButton
} from '@mui/material';
import {
    Cancel, Delete, EventAvailable, PhotoLibrary, Speed
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
    const [open, setOpen] = useState(false);


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
                    mileage: b.returnMileage || '',
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
            setSnackbar({
                open: true,
                message: "Failed to get Received cars: ",
                severity: "error"
            });
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
    const handleOpen = (booking) => {
        setSelectedBooking(booking);
        setOpen(true);
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
        <Box sx={{ bgcolor: '#ffffff' }}>

            <Container maxWidth={false} disableGutters sx={{ pl: 10.5 }}>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0px 10px 40px rgba(0,0,0,0.12)',
                        },
                    }}
                >
                    {/* Header */}
                    <DialogTitle sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600 }}
                            >
                                Car Details
                            </Typography>

                            <IconButton onClick={() => setOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    {/* Content */}
                    <DialogContent dividers sx={{ p: 2.5 }}>
                        {selectedBooking && (
                            <>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Car Name:</strong> {selectedBooking.carName}
                                </Typography>

                                <Typography variant="body2" gutterBottom>
                                    <strong>Damage Remarks:</strong> {selectedBooking.damageRemarks || 'N/A'}
                                </Typography>

                                <Typography variant="body2">
                                    <strong>Damage Charges:</strong> {selectedBooking.damageCharges || 0}
                                </Typography>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: '#1a1a1a',
                            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                        }}
                    >
                        Received Cars
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        View your received car rental bookings
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 0.5, sm: 1, md: 1.5 }}
                    sx={{
                        mb: { xs: 0.5, sm: 1, md: 1.5 }
                    }}>
                    {bookings.length > 0 ? bookings.map((booking) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={booking.id}>
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
                                    borderRadius: 2,
                                    maxWidth: { xs: '100%', sm: 420 },
                                    mx: 'auto'
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            width: { xs: 250, sm: 280, md: 240, lg: 290 },
                                            height: { xs: 160, sm: 180, md: 200 },
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                        image={audiBox}
                                        alt={booking.carName}
                                    />
                                    <IconButton
                                        onClick={() => handleOpen(booking)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                            '&:hover': {
                                                bgcolor: 'white',
                                            },
                                        }}
                                        size="small"
                                    >
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                <CardContent sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: { xs: 2, sm: 2.5 }
                                }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="h3"
                                            component={"h3"}
                                        >
                                            {booking.carName}
                                        </Typography>

                                    </Box>

                                    <Divider />

                                    {/* Compact Info Display */}
                                    <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>


                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EventAvailable sx={{ fontSize: 18, color: 'info.main' }} />
                                            <Typography variant="body2" sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}>
                                                <strong>Received:</strong> {formatDateTime(booking.receivedDate)}
                                            </Typography>
                                        </Box>

                                        {/* {booking.damageRemarks && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" color="warning.main" sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}>
                                                    ⚠️ <strong>Damage:</strong> {booking.damageRemarks}
                                                </Typography>
                                            </Box>
                                        )}

                                        {booking.damageCharges > 0 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" color="error.main" sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}>
                                                    💰 <strong>Extra Charges:</strong> ${booking.damageCharges}
                                                </Typography>
                                            </Box>
                                        )} */}
                                    </Box>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1,
                                            flexDirection: { xs: 'column', sm: 'row' }
                                        }}>
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
                                                        textTransform: 'none',
                                                        fontSize: { xs: '0.813rem', sm: '0.875rem' }
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
                                                    fontSize: { xs: '0.813rem', sm: '0.875rem' },
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
                            <Box sx={{
                                textAlign: 'center',
                                py: { xs: 6, sm: 10 },
                                bgcolor: 'white',
                                borderRadius: 2,
                                boxShadow: 1
                            }}>
                                <Cancel sx={{ fontSize: { xs: 60, sm: 100 }, color: '#e0e0e0', mb: 2 }} />
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                    }}
                                >
                                    No received bookings
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
                                >
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
                    PaperProps={{
                        sx: {
                            m: { xs: 2, sm: 3 },
                            maxHeight: { xs: '90vh', sm: '85vh' }
                        }
                    }}
                >
                    <DialogTitle>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 0 }
                        }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                }}
                            >
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
                            <ImageList
                                cols={{ xs: 1, sm: 2 }}
                                gap={{ xs: 12, sm: 16 }}
                                sx={{ m: 0 }}
                            >
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
                                            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                                {formatDateTime(img.uploadedAt)}
                                            </Typography>
                                        </Box>
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <PhotoLibrary sx={{ fontSize: { xs: 50, sm: 60 }, color: '#ccc', mb: 2 }} />
                                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    No images available
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
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

                {/* Pagination */}
                {totalRecords > pageSize && (
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
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            sx={{
                                minWidth: 'auto',
                                px: { xs: 1.5, sm: 2 },
                                fontSize: { xs: '0.813rem', sm: '0.875rem' }
                            }}
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
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
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
            </Container>

        </Box>
    );
};

export default ReceivedCarsPage;