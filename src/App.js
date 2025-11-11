import "../src/dist/styles.css";
import About from "./Pages/About";
import Home from "./Pages/Home";
import Navbar from "../src/components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Models from "./Pages/Models";
import TestimonialsPage from "./Pages/TestimonialsPage";
import Team from "./Pages/Team";
import Contact from "./Pages/Contact";
import LoginPage from "./Pages/LoginPage";
import UsersList from "./Pages/UsersList";
import RolesList from "./Pages/RolesList";

function App() {
  const location = useLocation();
  
  // Hide navbar on login page (root path)
  const showNavbar = location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route index path="/loginPage" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="models" element={<Models />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="team" element={<Team />} />
        <Route path="contact" element={<Contact />} />
        <Route path="usersList" element={<UsersList/>} />
        <Route path="rolesList" element={<RolesList/>}/>
      </Routes>
    </>
  );
}

export default App;