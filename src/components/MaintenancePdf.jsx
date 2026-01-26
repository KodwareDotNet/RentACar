// src/components/reports/InstitutionalReport.jsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    title: { fontSize: 14, fontWeight: "bold" },
    period: { fontSize: 10, color: "#555" },

    // Table
    tableContainer: { flexDirection: "column", borderWidth: 1, borderColor: "#000", marginBottom: 15 },
    tableHeader: { flexDirection: "row", backgroundColor: "#eee", borderBottomWidth: 1, borderBottomColor: "#000", padding: 5 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc", padding: 5 },
    cell: { flex: 1, fontSize: 10 },

    summary: { marginTop: 15, marginBottom: 20 },
    summaryItem: { marginBottom: 5, lineHeight: 1.5 },
    footer: { position: "absolute", bottom: 20, left: 30, right: 30, fontSize: 8, color: "#555", textAlign: "center" },
    sectionTitle: { fontWeight: "bold", marginBottom: 10, marginTop: 20 },
});


// Helper to color status
const getStatusColor = (status) => {
    if (status === "Completed") return "green";
    if (status === "Active") return "blue";
    if (status === "Cancelled") return "red";
    return "black";
};

const MaintenancePdf = ({ reports, summary, startDate, endDate, revenueExpenses }) => (
    <Document>
        {/* ---------- Page 1: Bookings + Summary ---------- */}
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Rent A Car - Institutional Report</Text>
                <Text style={styles.period}>Period: {startDate} to {endDate}</Text>
            </View>

            {/* Booking Table */}
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>1. Maintenance Details</Text>

            <View style={{ flexDirection: "column", marginBottom: 10 }}>
                {/* Table Header */}
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", borderWidth: 1, borderColor: "#000", padding: 3 }}>Maintenace ID</Text>
                    <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", borderWidth: 1, borderColor: "#000", padding: 3 }}>Car</Text>
                    <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", borderWidth: 1, borderColor: "#000", padding: 3 }}>Car Brand</Text>
                    {/* <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", borderWidth: 1, borderColor: "#000", padding: 3 }}>Damage</Text> */}
                    <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", borderWidth: 1, borderColor: "#000", padding: 3 }}>Status</Text>
                    {/* <Text style={{ flex: 1, fontSize: 10, fontWeight: "bold", borderWidth: 1, borderColor: "#000", padding: 3 }}>Amount</Text> */}
                </View>

                {/* Table Rows */}
                {reports.map((r) => (
                    <View style={{ flexDirection: "row" }} key={r.bookingId}>
                        <Text style={{ flex: 1, fontSize: 10, borderWidth: 1, borderColor: "#000", padding: 3 }}>{r.id}</Text>
                        <Text style={{ flex: 1, fontSize: 10, borderWidth: 1, borderColor: "#000", padding: 3 }}>{r.carName}</Text>
                        <Text style={{ flex: 1, fontSize: 10, borderWidth: 1, borderColor: "#000", padding: 3 }}>{r.carBrand}</Text>
                        {/* <Text style={{ flex: 1, fontSize: 10, borderWidth: 1, borderColor: "rgba(0, 0, 0, 1)", padding: 3 }}>{r.remarks || "-"}</Text> */}
                        <Text style={{ flex: 1, fontSize: 10, borderWidth: 1, borderColor: "#000", color: getStatusColor(r.status), fontWeight: "bold", padding: 3 }}>
                            {r.status}
                        </Text>
                        {/* <Text style={{ flex: 1, fontSize: 10, borderWidth: 1, borderColor: "#000", padding: 3 }}>Rs {r.amount}</Text> */}
                    </View>
                ))}
            </View>
        {/* </Page>

        <Page size="A4" style={styles.page}> */}
            {/* Executive Summary */}
            <View style={styles.header}>
                <Text style={{ fontWeight: "bold",  }}>2. Executive Summary</Text>
            </View>
            <View style={styles.summary}>
                <Text style={styles.summaryItem}>Total Bookings: {summary.totalBookings}</Text>
                <Text style={styles.summaryItem}>Active Bookings: {summary.activeBookings}</Text>
                <Text style={styles.summaryItem}>Completed Bookings: {summary.completedBookings}</Text>
                <Text style={styles.summaryItem}>Cancelled Bookings: {summary.cancelledBookings}</Text>
                {/* <Text style={styles.summaryItem}>Total Bookings: Rs {summary.totalRevenue}</Text> */}
            </View>

            <View style={styles.header}>
                <Text style={styles.title}>Vehicle Condition & Financial Summary</Text>
            </View>

            {/* Vehicle Condition Table */}
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>1. Vehicle Condition Report</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.cell}>Car</Text>
                <Text style={styles.cell}>Status</Text>
                <Text style={styles.cell}>Damage Description</Text>
                <Text style={styles.cell}>Repair Cost</Text>
            </View>
            {reports?.map((v, idx) => (
                <View style={styles.tableRow} key={idx}>
                    <Text style={styles.cell}>{v.carName}</Text>
                    <Text style={styles.cell}>{v.status}</Text>
                    <Text style={styles.cell}>{v.remarks || "-"}</Text>
                    <Text style={styles.cell}>Rs {v.damageCharges || 0}</Text>
                </View>
            ))}

            {/* Revenue & Expense Summary */}
            <View style={styles.summary}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>2. Revenue & Expense Summary</Text>
                <Text style={styles.summaryItem}>Total Revenue: Rs {summary.totalRevenue || 0}</Text>
                <Text style={styles.summaryItem}>Total Expenses: Rs {summary.totalExpense || 0}</Text>
                <Text style={styles.summaryItem}>Net Profit: Rs {summary.netProfit || 0}</Text>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>System Generated Report </Text>
        </Page>
    </Document>
);

export default MaintenancePdf;
