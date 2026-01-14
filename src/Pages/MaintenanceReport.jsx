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
  Paper,
  Chip,
  Container,
  Stack,
  Divider,
  TableContainer,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import reportsService from "../api/services/Reports/reportsService";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import MaintenancePdf from "../components/MaintenancePdf";

const MaintenanceReport = () => {
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [openPdf, setOpenPdf] = useState(false);
  const [vehicleConditions, setVehicleConditions] = useState([]);
  const [revenueExpenses, setRevenueExpenses] = useState({});
  const [openPdfDialog, setOpenPdfDialog] = useState(false);

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

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let params = { startDate: date, endDate: endDate };
      const res = await reportsService.getMaintenaceReports(params);
      setReports(res.data || []);
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
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 3, px: 3,pt:10 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: '#0f172a',
              mb: 0.5 
            }}
          >
            Maintenance Reports
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            Comprehensive overview of vehicle maintenance activities and expenses
          </Typography>
        </Box>

        {/* Filters Card */}
        <Card 
          sx={{ 
            mb: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            borderRadius: 1.5,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems={{ xs: 'stretch', sm: 'center' }}
              flexWrap="wrap"
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  flex: 1
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500, 
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}
                  >
                    Start:
                  </Typography>
                  <DatePicker
                    selected={date}
                    onChange={(d) => setDate(d)}
                    selectsStart
                    startDate={date}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    className="date-picker"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500, 
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}
                  >
                    End:
                  </Typography>
                  <DatePicker
                    selected={endDate}
                    onChange={(d) => setEndDate(d)}
                    selectsEnd
                    startDate={date}
                    endDate={endDate}
                    minDate={date}
                    dateFormat="yyyy-MM-dd"
                    className="date-picker"
                  />
                </Box>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={fetchReports}
                  disabled={loading}
                  sx={{
                    bgcolor: '#3b82f6',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    py: 0.75,
                    px: 2.5,
                    boxShadow: 'none',
                    '&:hover': { 
                      bgcolor: '#2563eb',
                      boxShadow: 'none'
                    },
                  }}
                >
                  {loading ? "Fetching..." : "Fetch Reports"}
                </Button>

                <Button
                  variant="outlined"
                  disabled={!reports.length}
                  onClick={() => setOpenPdfDialog(true)}
                  sx={{
                    borderColor: '#cbd5e1',
                    color: '#475569',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    py: 0.75,
                    px: 2.5,
                    '&:hover': { 
                      borderColor: '#94a3b8', 
                      bgcolor: '#f8fafc' 
                    },
                    '&:disabled': {
                      borderColor: '#e2e8f0',
                      color: '#cbd5e1'
                    }
                  }}
                >
                  View PDF
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {summary && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderColor: '#cbd5e1',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      mb: 1
                    }}
                  >
                    Total Vehicles
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#0f172a',
                      fontSize: '1.75rem'
                    }}
                  >
                    {summary.totalBookings}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderColor: '#cbd5e1',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Completed
                    </Typography>
                    <Chip 
                      label={`${summary.totalBookings > 0 ? ((summary.completedBookings / summary.totalBookings) * 100).toFixed(0) : 0}%`}
                      size="small"
                      sx={{ 
                        bgcolor: '#dcfce7',
                        color: '#16a34a',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#16a34a',
                      fontSize: '1.75rem'
                    }}
                  >
                    {summary.completedBookings}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderColor: '#cbd5e1',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Active
                    </Typography>
                    <Chip 
                      label={`${summary.totalBookings > 0 ? ((summary.activeBookings / summary.totalBookings) * 100).toFixed(0) : 0}%`}
                      size="small"
                      sx={{ 
                        bgcolor: '#fef3c7',
                        color: '#d97706',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#d97706',
                      fontSize: '1.75rem'
                    }}
                  >
                    {summary.activeBookings}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderColor: '#cbd5e1',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      mb: 1
                    }}
                  >
                    Total Expenses
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#7c3aed',
                      fontSize: '1.75rem'
                    }}
                  >
                    {formatCurrency(summary.totalRevenue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Reports Table */}
        <Card
          sx={{
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            borderRadius: 1.5,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2.5, pb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem', mb: 0.5 }}
              >
                Maintenance Records
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: '0.813rem' }}
              >
                Detailed list of all maintenance activities
              </Typography>
            </Box>
            <Divider />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#64748b',
                        fontSize: '0.813rem',
                        py: 1.5,
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#64748b',
                        fontSize: '0.813rem',
                        py: 1.5,
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      Vehicle
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#64748b',
                        fontSize: '0.813rem',
                        py: 1.5,
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      Brand
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#64748b',
                        fontSize: '0.813rem',
                        py: 1.5,
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#64748b',
                        fontSize: '0.813rem',
                        py: 1.5,
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#64748b',
                        fontSize: '0.813rem',
                        py: 1.5,
                        borderBottom: '1px solid #e2e8f0'
                      }}
                      align="right"
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.length > 0 ? (
                    reports.map((row, index) => (
                      <TableRow 
                        key={row.id}
                        sx={{
                          '&:hover': { bgcolor: '#f8fafc' },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.813rem', color: '#475569', py: 1.5 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#3b82f6',
                              fontSize: '0.813rem'
                            }}
                          >
                            #{row.id}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.813rem', py: 1.5 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              color: '#0f172a',
                              fontSize: '0.813rem'
                            }}
                          >
                            {row.carName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.813rem', color: '#64748b', py: 1.5 }}>
                          {row.carBrand}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.813rem', color: '#64748b', py: 1.5 }}>
                          {formatDate(row.createdAt)}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip
                            label={row.status}
                            color={getStatusColor(row.status)}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              height: 22
                            }}
                          />
                        </TableCell>
                        <TableCell 
                          align="right"
                          sx={{ 
                            fontSize: '0.813rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            py: 1.5
                          }}
                        >
                          {formatCurrency(row.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell 
                        colSpan={6} 
                        align="center"
                        sx={{ 
                          py: 6,
                          color: '#94a3b8'
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              color: '#64748b',
                              mb: 0.5
                            }}
                          >
                            {loading ? "Loading maintenance records..." : "No maintenance records found"}
                          </Typography>
                          {!loading && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              Try adjusting your date range or fetch new reports
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* PDF Dialog */}
        <Dialog
          open={openPdfDialog}
          onClose={() => setOpenPdfDialog(false)}
          fullWidth
          maxWidth="lg"
          PaperProps={{
            sx: {
              borderRadius: 2,
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 600,
              fontSize: '1.125rem'
            }}
          >
            Maintenance Report Preview
          </DialogTitle>

          <DialogContent dividers sx={{ p: 0 }}>
            <Box style={{ height: "600px" }}>
              <PDFViewer width="100%" height="100%">
                <MaintenancePdf
                  reports={reports}
                  summary={summary}
                  startDate={date.toISOString().split("T")[0]}
                  endDate={endDate.toISOString().split("T")[0]}
                  revenueExpenses={revenueExpenses}
                />
              </PDFViewer>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
            <PDFDownloadLink
              document={
                <MaintenancePdf
                  reports={reports}
                  summary={summary}
                  startDate={date.toISOString().split("T")[0]}
                  endDate={endDate.toISOString().split("T")[0]}
                  vehicleConditions={vehicleConditions}
                  revenueExpenses={revenueExpenses}
                />
              }
              fileName={`Maintenance_Report_${date.toISOString().split("T")[0]}_to_${endDate.toISOString().split("T")[0]}.pdf`}
            >
              {({ loading }) => (
                <Button 
                  variant="contained" 
                  sx={{
                    bgcolor: '#3b82f6',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  {loading ? "Preparing PDF..." : "Download Report"}
                </Button>
              )}
            </PDFDownloadLink>

            <Button 
              onClick={() => setOpenPdfDialog(false)}
              sx={{
                color: '#64748b',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Custom DatePicker Styles */}
      <style>{`
        .date-picker {
          padding: 6px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.813rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        .date-picker:hover {
          border-color: #94a3b8;
        }
        .date-picker:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </Box>
  );
};

export default MaintenanceReport;