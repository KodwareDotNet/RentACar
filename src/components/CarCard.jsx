// src/components/CarCard.jsx
import React from "react";
import { BASE_URL } from "../api/axiosConfig";
import {
    Card, CardMedia, CardContent, Typography, Box, Chip, IconButton, Rating, Button, Grid
} from '@mui/material';
import {
    DirectionsCar, LocalGasStation, Speed,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const CarCard = ({ car, onBook, onUpdate, onDelete, onMaintenance }) => {
    return (
        <Box sx={{ mb: 1 }}>
            <Card
                sx={{
                    maxWidth: 320,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                    }
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={`${BASE_URL}${car.imageUrl}`}
                        alt={car.name}
                        sx={{
                            objectFit: 'cover',
                             width: { xs: 250, sm: 280, md: 240, lg: 290 },
                            height: { xs: 160, sm: 180, md: 200 },
                        }}
                    />

                    {/* Action Buttons on Image */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            display: 'flex',
                            gap: 0.5,
                            backgroundColor: 'transparent',
                            borderRadius: 16,
                            padding: '4px 6px',
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={onUpdate}
                            sx={{
                                bgcolor: 'transparent',        // change per icon (primary / error / success)
                                color: 'white',
                                width: { xs: 32, sm: 36 },
                                height: { xs: 32, sm: 36 },
                                '&:hover': {
                                    bgcolor: 'primary.dark',      // change per icon
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s',
                                boxShadow: 3,
                            }}
                            title="Update"
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={onDelete}
                            sx={{
                                bgcolor: 'error.main',        // change per icon (primary / error / success)
                                color: 'white',
                                width: { xs: 32, sm: 36 },
                                height: { xs: 32, sm: 36 },
                                '&:hover': {
                                    bgcolor: 'error.dark',      // change per icon
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s',
                                boxShadow: 3,
                            }}
                            title="Delete"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>


                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Header with Name and Rating */}
                    <Box >
                        <Typography variant="h4" component="h3" sx={{ fontWeight: 600, mb: 0.5, display: 'flex', justifyContent: 'flex-start' }}>
                            {car.carName}
                        </Typography>
                    </Box>

                    {/* Price */}
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                            {car.pricePerHour}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            per hour
                        </Typography>
                    </Box>

                    {/* Car Details */}
                    <Grid container spacing={1} >
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: '2px' }}>
                                <DirectionsCar sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {car.brand}
                                </Typography>
                            </Box>
                        </Grid>

                    </Grid>

                    {/* Book Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={onBook}
                        sx={{
                            mb: 0.5,

                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Book Car
                    </Button>

                    {/* Action Buttons */}

                </CardContent>
            </Card>
        </Box>
    );
};

export default CarCard;
