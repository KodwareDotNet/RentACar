import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import customerHistory from '../api/services/CustomerHistory/customerHistory';

const CustomerHistory = () => {
  const [cnic, setCnic] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!cnic.trim()) {
      setError('Please enter a valid CNIC');
      return;
    }

    setLoading(true);
    setError('');
    setCustomerData(null);

    try {
      // Call the API
      const data = await customerHistory.checkCustomerHistoryByQuery(cnic);

      if (data && data.summary) {
        setCustomerData(data);
      } else {
        setError('No customer found with this CNIC');
      }
    } catch (err) {
      console.error('Error fetching customer history:', err);

      // Handle different error scenarios
      if (err.response) {
        // Server responded with error
        if (err.response.status === 404) {
          setError('No customer found with this CNIC');
        } else if (err.response.status === 400) {
          setError('Invalid CNIC format');
        } else {
          setError('Failed to fetch customer history. Please try again.');
        }
      } else if (err.request) {
        // Request made but no response
        setError('Network error. Please check your connection.');
      } else {
        // Other errors
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statuses = {
      0: { label: 'Pending', color: 'warning', icon: <WarningIcon fontSize="small" /> },
      1: { label: 'Active', color: 'info', icon: <CarIcon fontSize="small" /> },
      2: { label: 'Completed', color: 'success', icon: <CheckIcon fontSize="small" /> },
      3: { label: 'Cancelled', color: 'error', icon: <CancelIcon fontSize="small" /> },
    };
    return statuses[status] || statuses[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: ' #ffffff ',
        py: 1,
      }}
    >
      <Container maxWidth="lg" sx={{ml:8}}>
        {/* Header */}
        <Fade in timeout={800}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#1a1a1a',
                mb: 1,
                fontFamily: '"Outfit", sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              Customer History
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                fontWeight: 400,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Search and view complete booking records
            </Typography>
          </Box>
        </Fade>

        {/* Search Section */}
        <Zoom in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 3,
              background: '#fff',
              border: '2px solid #f0f0f0',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Enter CNIC Number"
                variant="outlined"
                value={cnic}
                onChange={(e) => {
                  setCnic(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                error={!!error}
                helperText={error}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF5733',
                      borderWidth: 2,
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#FF5733',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(255, 87, 51, 0.3)',
                  '&:hover': {
                    bgcolor: '#E64A2E',
                    boxShadow: '0 6px 20px rgba(255, 87, 51, 0.4)',
                  },
                  '&:disabled': {
                    bgcolor: '#FF5733',
                    opacity: 0.6,
                  },
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Box>
          </Paper>
        </Zoom>

        {/* Results Section */}
        {customerData && (
          <Fade in timeout={800}>
            <Box>
              {/* Summary Cards */}
              <Grid container spacing={5} mb={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                {/* Total Bookings */}
                <Grid item sx={{ height: '100px' }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '200px',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            bgcolor: '#ede9fe',
                            p: 1.5,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#7c3aed">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                          </svg>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                            Total Bookings
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {customerData.summary.totalBookings}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Completed */}
                <Grid item sx={{ height: '100px' }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '200px',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            bgcolor: '#fce7f3',
                            p: 1.5,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ec4899">
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                          </svg>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                            Completed
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {customerData.summary.completedBookings}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Active Bookings */}
                <Grid item sx={{ height: '100px' }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '200px',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            bgcolor: '#dbeafe',
                            p: 1.5,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                          </svg>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                            Active Bookings
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {customerData.summary.activeBookings}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Total Paid */}
                <Grid item sx={{ height: '100px' }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '200px',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            bgcolor: '#fef3c7',
                            p: 1.5,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
                            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                          </svg>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                            Total Paid
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            ${customerData.summary.totalAmountPaid}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Additional Summary Info */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  background: '#fff',
                  border: '2px solid #f0f0f0',
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WarningIcon sx={{ color: '#ff9800', mr: 2, fontSize: 32 }} />
                      <Box>
                        <Typography variant="body1" color="text.secondary">
                          Damage Reports
                        </Typography>
                        <Typography variant="body2" sx={{  color: '#000000' }}>
                          {customerData.summary.damageCount}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MoneyIcon sx={{ color: '#ff776e', mr: 2, fontSize: 32 }} />
                      <Box>
                        <Typography variant="body1" color="text.secondary">
                          Late Charges
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#000000' }}>
                          {customerData.summary.totalLateCharges}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ color: '#2196f3', mr: 2, fontSize: 32 }} />
                      <Box>
                        <Typography variant="body1" color="text.secondary">
                          Last Booking
                        </Typography>
                        <Typography variant="body2" sx={{  color: '#000000' }}>
                          {formatDate(customerData.summary.lastBookingDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Booking History Table */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '2px solid #f0f0f0',
                }}
              >
                <Box sx={{ p: 3, bgcolor: '#fafafa', borderBottom: '2px solid #f0f0f0' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Booking History
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Booking ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Car ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Pickup Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Dropoff Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Damage</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Total Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerData.history.map((booking, index) => {
                        const status = getStatusLabel(booking.bookingStatus);
                        return (
                          <TableRow
                            key={index}
                            sx={{
                              '&:hover': { bgcolor: '#fafafa' },
                              transition: 'background-color 0.2s',
                            }}
                          >
                            <TableCell sx={{ fontWeight: 600 }}>#{booking.bookingId}</TableCell>
                            <TableCell>{booking.carId}</TableCell>
                            <TableCell>{formatDate(booking.pickupDate)}</TableCell>
                            <TableCell>{formatDate(booking.dropoffDate)}</TableCell>
                            <TableCell>
                              <Chip
                                icon={status.icon}
                                label={status.label}
                                color={status.color}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              {booking.isDamaged ? (
                                <Chip
                                  label={`$${booking.damageCharges}`}
                                  color="error"
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              ) : (
                                <Chip label="None" color="success" size="small" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontWeight: 700, color: '#FF5733' }}>
                                ${booking.totalPrice}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {customerData.history.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No booking history found</Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Fade>
        )}

        {/* Error Alert */}
        {error && !customerData && !loading && (
          <Fade in timeout={600}>
            <Alert
              severity="error"
              sx={{
                borderRadius: 3,
                border: '2px solid #ffebee',
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default CustomerHistory;