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

const ReportsPage = () => {
  const [reportType, setReportType] = useState("daily"); // daily | weekly | monthly
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date()); // only for weekly reports
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (reports && reports.length > 0) {
      const totalBookings = reports.length;
      const completedBookings = reports.filter(b => b.status === "Completed").length;
      const activeBookings = reports.filter(b => b.status !== "Completed").length;
      const cancelledBookings = reports.filter(b => b.status == "Cancelled").length;
      const totalRevenue = reports.reduce((sum, b) => sum + b.amount, 0);

      setSummary({
        totalBookings,
        completedBookings,
        activeBookings,
        cancelledBookings,
        totalRevenue,
      });
    }
  }, [reports]);

  useEffect(() => {
    fetchReports();
  }, []
  )

  // Watch reportType changes
  useEffect(() => {
    // Reset fields when report type changes
    setDate(new Date());
    setEndDate(new Date());
    setReports([]);
    setSummary(null);
  }, [reportType]);


  // Fetch reports only on button click
  const fetchReports = async () => {
    setLoading(true);
    try {
      let params;

      if (reportType === "daily") {
        params = { type: "daily", date };
      } else if (reportType === "weekly") {
        // Ensure both start and end date are set for weekly reports
        if (!date || !endDate) {
          alert("Please select both start and end dates for weekly reports.");
          setLoading(false);
          return;
        }

        // Ensure minimum 7 days
        const diffDays = Math.ceil(
          (endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays < 7) {
          alert("Weekly reports must cover at least 7 days.");
          setLoading(false);
          return;
        }

        // Optional: ensure not more than a month
        if (diffDays > 31) {
          alert("Weekly reports cannot exceed 1 month.");
          setLoading(false);
          return;
        }

        params = { type: "weekly", startDate: date, endDate: endDate };
      } else if (reportType === "monthly") {
        // Ensure both start and end dates are selected
        if (!date || !endDate) {
          alert("Please select both start and end dates for monthly reports.");
          setLoading(false);
          return;
        }

        const start = new Date(date);
        const end = new Date(endDate);

        // Calculate month difference
        const diffMonths =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());

        // Minimum 1 month
        if (diffMonths < 1) {
          alert("Monthly reports must cover at least 1 month.");
          setLoading(false);
          return;
        }

        // Maximum 12 months (1 year)
        if (diffMonths > 12) {
          alert("Monthly reports cannot exceed 1 year.");
          setLoading(false);
          return;
        }

        params = {
          type: "monthly",
          startDate: start,
          endDate: end,
        };
      }

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
        <Button
          variant={reportType === "daily" ? "contained" : "outlined"}
          onClick={() => setReportType("daily")}
        >
          Daily
        </Button>
        <Button
          variant={reportType === "weekly" ? "contained" : "outlined"}
          onClick={() => setReportType("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={reportType === "monthly" ? "contained" : "outlined"}
          onClick={() => setReportType("monthly")}
        >
          Monthly
        </Button>

        {/* Date Picker(s) */}
        {reportType === "daily" && (
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
        )}

        {reportType === "weekly" ||  "monthly" && (
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
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={fetchReports}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Reports"}
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
