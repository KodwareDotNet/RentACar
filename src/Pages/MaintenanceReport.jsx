import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  TextField
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import reportsService from "../api/services/Reports/reportsService";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import MaintenancePdf from "../components/MaintenancePdf";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const MaintenanceReport = () => {
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [openPdf, setOpenPdf] = useState(false);
  const [vehicleConditions, setVehicleConditions] = useState([]);
  const [revenueExpenses, setRevenueExpenses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    pageNumber: currentPage,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0
  });
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (date && endDate) {
      fetchReports();
    }
  }, [currentPage]);

  useEffect(() => {
    if (reports && reports.length > 0) {
      const totalBookings = reports.length;
      const completedBookings = reports.filter(b => b.status === "Completed").length;
      const activeBookings = reports.filter(b => b.status == "Active").length;
      const cancelledBookings = reports.filter(b => b.status == "Cancelled").length;
      const totalRevenue = reports.reduce((sum, b) => sum + b.amount, 0);
      const totalExpense = reports.reduce((sum, b) => sum + b.damageCharges, 0);
      const netProfit = totalRevenue - totalExpense;
      setSummary({
        totalBookings,
        completedBookings,
        activeBookings,
        cancelledBookings,
        totalRevenue,
        totalExpense,
        netProfit
      });
    }
  }, [reports]);

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      let params = {
        startDate: date,
        endDate: endDate,
        pageNumber: currentPage,
        pageSize: rowsPerPage
      };

      const res = await reportsService.getMaintenaceReports(params);
      const responseData = res.data?.data || res.data || [];
      const totalRecords = res.data.totalRecords || 0;

      // Calculate total pages based on your items per page
      const itemsPerPage = params.limit || 10; // Use whatever limit you're sending to backend
      const totalPages = Math.ceil(totalRecords / itemsPerPage);

      setReports(responseData);
      setPagination({
        totalRecords,
        totalPages,
        currentPage: params.page || 1,
        itemsPerPage
      });

    } catch (err) {
      console.error("Failed to fetch reports", err);
      alert(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Active":
        return "info";
      case "Cancelled":
        return "warning";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3, pt: 1, bgcolor: '#ffffff', minHeight: '100vh', ml: 8 }}>
      {/* Page Title with Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            bgcolor: '#3b82f6',
            p: 1.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        </Box>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
          Maintenance Reports
        </Typography>
      </Box>

      {/* Filters Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: { xs: "wrap", md: "nowrap" },
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: 'white',
          mb: 2,
          gap: 2,
          width: "100%",
        }}
      >
        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "#64748b",
              fontSize: "0.95rem",
              whiteSpace: "nowrap",
            }}
          >
            Date Range:
          </Typography>

          <DatePicker
            selected={date}
            onChange={setDate}
            customInput={
              <TextField
                size="small"
                sx={{ width: 150 }}
                placeholder="Start date"
                InputProps={{
                  startAdornment: (
                    <CalendarMonthIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            }
          />

          <Typography sx={{ color: "#94a3b8" }}>–</Typography>

          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            minDate={date}
            customInput={
              <TextField
                size="small"
                sx={{ width: 150 }}
                placeholder="End date"
                InputProps={{
                  startAdornment: (
                    <CalendarMonthIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            }
          />
        </Box>

        {/* Action */}
        <Button
          variant="contained"
          onClick={fetchReports}
          disabled={loading}
          sx={{
            bgcolor: "#3b82f6",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.1,
            borderRadius: 2,
            minWidth: 160,
            whiteSpace: "nowrap",
            "&:hover": {
              bgcolor: "#2563eb",
            },
          }}
        >
          {loading ? "Fetching..." : "Fetch Reports"}
        </Button>
      </Box>


      {/* PDF Dialog */}
      <Dialog open={openPdfDialog} onClose={() => setOpenPdfDialog(false)} fullWidth maxWidth="lg">
        <DialogTitle>Maintenance Report Preview</DialogTitle>
        <DialogContent dividers>
          <Box style={{ height: '600px' }}>
            <PDFViewer width="100%" height="100%">
              <MaintenancePdf
                reports={reports}
                summary={summary}
                startDate={date.toISOString().split('T')[0]}
                endDate={endDate.toISOString().split('T')[0]}
                revenueExpenses={revenueExpenses}
              />
            </PDFViewer>
          </Box>
        </DialogContent>
        <DialogActions>
          <PDFDownloadLink
            document={
              <MaintenancePdf
                reports={reports}
                summary={summary}
                startDate={date.toISOString().split('T')[0]}
                endDate={endDate.toISOString().split('T')[0]}
                vehicleConditions={vehicleConditions}
                revenueExpenses={revenueExpenses}
              />
            }
            fileName={`Maintenance_Report_${date.toISOString().split("T")[0]}_to_${endDate.toISOString().split("T")[0]}.pdf`}
          >
            {({ loading }) => (
              <Button variant="contained" color="primary">
                {loading ? 'Preparing PDF...' : 'Download Report'}
              </Button>
            )}
          </PDFDownloadLink>
          <Button onClick={() => setOpenPdfDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Summary Cards */}
      <Grid container spacing={5} mb={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* Total Vehicles */}
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
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                  </svg>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                    Vehicles
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {summary?.totalBookings || 0}
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
                    bgcolor: '#dcfce7',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#10b981">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                    Completed
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {summary?.completedBookings || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active */}
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#d97706">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                    Active
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {summary?.activeBookings || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Expenses */}
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
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Rs {summary?.totalRevenue || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reports Table */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Maintenance Records
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* Three-dot icon button */}
            <Button
              onClick={handleMenuOpen}
              sx={{
                minWidth: 'auto',
                p: 1,
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                color: '#64748b',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </Button>

            {/* Dropdown menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  minWidth: 180,
                },
              }}
            >
              <MenuItem
                disabled={!reports.length}
                onClick={() => {
                  handleMenuClose();
                  setOpenPdfDialog(true);
                }}
                sx={{ gap: 1.5 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444">
                  <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                Export PDF
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Vehicle</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:hover': { bgcolor: '#f8fafc' },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>#{row.id}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{row.carName}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{row.carBrand}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{formatDate(row.createdAt)}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          bgcolor:
                            row.status === 'Completed'
                              ? '#dcfce7'
                              : row.status === 'Active'
                                ? '#dbeafe'
                                : '#fee2e2',
                          color:
                            row.status === 'Completed'
                              ? '#10b981'
                              : row.status === 'Active'
                                ? '#3b82f6'
                                : '#ef4444',
                        }}
                      >
                        {row.status}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>
                      Rs {row.amount}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: '#94a3b8' }}>
                      {loading ? 'Loading...' : 'No data available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

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
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              sx={{
                minWidth: { xs: 36, sm: 40 },
                fontSize: { xs: '0.813rem', sm: '0.875rem' }
              }}
            >
              First
            </Button>
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
              ««
            </Button>

            {(() => {
              const maxVisible = 5;
              const totalPages = pagination.totalPages;

              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let endPage = Math.min(totalPages, startPage + maxVisible - 1);

              // Adjust startPage if we're near the end
              if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
              }

              return [...Array(endPage - startPage + 1)].map((_, index) => {
                const pageNum = startPage + index;
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
              });
            })()}

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
              »»
            </Button>
            <Button
              variant="outlined"
              onClick={() => setCurrentPage(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages}
              sx={{
                minWidth: { xs: 36, sm: 40 },
                fontSize: { xs: '0.813rem', sm: '0.875rem' }
              }}
            >
              Last
            </Button>
          </Box>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            textAlign: 'center',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Showing {reports.length} of {pagination.totalRecords} reports
        </Typography>
      </Box>


    </Box>
  );
};

export default MaintenanceReport;