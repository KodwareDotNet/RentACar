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
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import reportsService from "../api/services/Reports/reportsService";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import InstitutionalReport from "../components/InstitutionalReport";


const ReportsPage = () => {
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date()); // only for weekly reports
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
  }, []
  )

  // Fetch reports only on button click
  const fetchReports = async () => {
    setLoading(true);
    try {
      let params;

      params = { startDate: date, endDate: endDate };
      const res = await reportsService.getReports(params);
      setReports(res.data || []);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      alert(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      {/* Page Title */}
      <Typography variant="h4" fontWeight={600} mb={3}>
        Reports
      </Typography>

      {/* Filters */}
      <Box display="flex" alignItems="center" gap={2} mb={4} flexWrap="wrap">

        <Dialog
          open={openPdfDialog}
          onClose={() => setOpenPdfDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>Institutional Report Preview</DialogTitle>

          <DialogContent dividers>
            <Box style={{ height: "600px" }}>
              <PDFViewer width="100%" height="100%">
                <InstitutionalReport
                  reports={reports}
                  summary={summary}
                  startDate={date.toISOString().split("T")[0]}
                  endDate={endDate.toISOString().split("T")[0]}
                  revenueExpenses={revenueExpenses}
                />
              </PDFViewer>
            </Box>
          </DialogContent>

          <DialogActions>
            <PDFDownloadLink
              document={
                <InstitutionalReport
                  reports={reports}
                  summary={summary}
                  startDate={date.toISOString().split("T")[0]}
                  endDate={endDate.toISOString().split("T")[0]}
                  vehicleConditions={vehicleConditions}
                  revenueExpenses={revenueExpenses}
                />
              }
              fileName="Rent_A_Car_Report.pdf"
            >
              {({ loading }) => (
                <Button variant="contained" color="primary">
                  {loading ? "Preparing PDF..." : "Download Report"}
                </Button>
              )}
            </PDFDownloadLink>

            <Button onClick={() => setOpenPdfDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>



        <Box display="flex" gap={1} alignItems="center">
          <Typography>Start:</Typography>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            selectsStart
            startDate={date}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
          <Typography>End:</Typography>
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


        <Button
          variant="contained"
          color="primary"
          onClick={fetchReports}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Reports"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          disabled={!reports.length}
          onClick={() => setOpenPdfDialog(true)}
        >
          Generate & View Report (PDF)
        </Button>

      </Box>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Bookings
                </Typography>
                <Typography variant="h6">{summary.totalBookings}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Active Bookings
                </Typography>
                <Typography variant="h6">{summary.activeBookings}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Completed Bookings
                </Typography>
                <Typography variant="h6">{summary.completedBookings}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Cancelled Bookings
                </Typography>
                <Typography variant="h6">{summary.cancelledBookings || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Revenue
                </Typography>
                <Typography variant="h6">Rs {summary.totalRevenue}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reports Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Booking ID</TableCell>
            <TableCell>Car</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.length > 0 ? (
            reports.map((row) => (
              <TableRow key={row.bookingId}>
                <TableCell>{row.bookingId}</TableCell>
                <TableCell>{row.carName}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell
                  style={{
                    color: row.status === "Completed"
                      ? "green"
                      : row.status === "Active"
                        ? "blue"
                        : "orange",
                    fontWeight: 600,
                  }}
                >
                  {row.status}
                </TableCell>
                <TableCell>Rs {row.amount}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {loading ? "Loading..." : "No data available"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ReportsPage;
