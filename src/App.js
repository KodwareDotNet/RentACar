import "../src/dist/styles.css";
import Home from "./Pages/Home";
import Navbar from "../src/components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Models from "./Pages/Models";
import LoginPage from "./Pages/LoginPage";
import UsersList from "./Pages/UsersList";
import RolesList from "./Pages/RolesList";
import OrganizationList from "./Pages/OrganizationList";
import BookedCarsPage from "./Pages/BookedCars";
import ReceivedCarsPage from "./Pages/ReceivedCars";
import ReportsPage from "./Pages/ReportsPage";
import MaintenancePage from "./Pages/MaintenancePage";
import MaintenanceReport from "./Pages/MaintenanceReport";
import CustomerHistory from "./Pages/CustomerHistory";
import { ThemeProvider, GlobalStyles, CssBaseline } from '@mui/material';
import { theme, globalStyles } from './Theme/theme';

function App() {
  const location = useLocation();

  // Hide navbar on login page (root path)
  const hideNavbarPaths = ["/", "/loginPage"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      {showNavbar && <Navbar />}
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route index path="/loginPage" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="about" element={<About />} /> */}
        <Route path="models" element={<Models />} />
        {/* <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="team" element={<Team />} />
        <Route path="contact" element={<Contact />} /> */}
        <Route path="usersList" element={<UsersList />} />
        <Route path="rolesList" element={<RolesList />} />
        <Route path="organizationList" element={<OrganizationList />} />
        <Route path="bookedCarsPage" element={<BookedCarsPage />} />
        <Route path="receivedCarsPage" element={<ReceivedCarsPage />} />
        <Route path="maintenancePage" element={<MaintenancePage />} />
        <Route path="reportsPage" element={<ReportsPage />} />
        <Route path="maintenanceReport" element={<MaintenanceReport />} />
        <Route path="customerHistory" element={<CustomerHistory />} />
      </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;