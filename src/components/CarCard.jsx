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
            <CardMedia
                component="img"
                height="180"
                image={`${BASE_URL}${car.imageUrl}`}
                alt={car.name}
                sx={{ objectFit: 'cover' }}
            />

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                {/* Header with Name and Rating */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {car.carName}
                    </Typography>
                    <Rating value={5} size="small" readOnly />
                </Box>

                {/* Price */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                        ${car.pricePerHour}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        per hour
                    </Typography>
                </Box>

                {/* Car Details */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DirectionsCar sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {car.brand}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Typography variant="body2" color="text.secondary">
                                4/5
                            </Typography>
                            <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DirectionsCar sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {car.transmission}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Typography variant="body2" color="text.secondary">
                                {car.fuel}
                            </Typography>
                            <LocalGasStation sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </Box>
                    </Grid>
                </Grid>

                {/* Book Button */}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={onBook}
                    sx={{
                        mb: 1.5,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Book Car
                </Button>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={onMaintenance}
                    sx={{
                        mb: 1.5,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Send to Maintance
                </Button>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={onUpdate}
                        sx={{
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.lighter' }
                        }}
                        title="Update"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={onDelete}
                        sx={{
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.lighter' }
                        }}
                        title="Delete"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CarCard;
