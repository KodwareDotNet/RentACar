// src/pages/LoginPage.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
  keyframes,
  styled,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from '../api/services/Login/authService';

// Keyframe animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
`;

// Styled components with car rental theme
const LoginContainer = styled(Box)(({ theme }) => ({
  width: "100vw",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #ff5722 0%, #ff7043 50%, #ff8a65 100%)",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: theme.spacing(2),
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "480px",
  margin: theme.spacing(0, 2),
  position: "relative",
  zIndex: 10,
  animation: `${slideUp} 0.8s ease-out`,
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(0, 1),
    borderRadius: "16px",
  },
}));

const LogoContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "1.5rem",
});

const LogoIcon = styled(Box)(({ theme }) => ({
  width: "70px",
  height: "70px",
  background: "linear-gradient(135deg, #ff5722, #ff7043)",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1rem",
  color: "white",
  boxShadow: "0 8px 24px rgba(255, 87, 34, 0.4)",
  [theme.breakpoints.down("sm")]: {
    width: "60px",
    height: "60px",
  },
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  color: "#1a1a1a",
  fontSize: "1.75rem",
  fontWeight: 700,
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: "#666",
  fontSize: "0.95rem",
  textAlign: "center",
  marginTop: "0.5rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.875rem",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "&:hover fieldset": {
      borderColor: "#ff5722",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff5722",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#ff5722",
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(1.5),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #ff5722, #ff7043)",
  color: "white",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "10px",
  textTransform: "none",
  boxShadow: "0 4px 15px rgba(255, 87, 34, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #f4511e, #ff5722)",
    boxShadow: "0 6px 20px rgba(255, 87, 34, 0.4)",
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    background: "#ccc",
    color: "#666",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.25),
    fontSize: "0.95rem",
  },
}));

const FooterText = styled(Typography)(({ theme }) => ({
  color: "#666",
  fontSize: "0.8rem",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
  },
}));

const StyledLink = styled(Link)({
  color: "#ff5722",
  fontWeight: 500,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

const BackgroundDecoration = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "hidden",
});

const FloatingCar = styled(Box)(({ delay = 0, size = 100, top, left, right, bottom }) => ({
  position: "absolute",
  width: `${size}px`,
  height: `${size}px`,
  top,
  left,
  right,
  bottom,
  opacity: 0.15,
  animation: `${float} 6s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

// Main Component
function LoginPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // JWT Decode function
  const decodeJWT = (token) => {
    try {

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Handle sign in
  const handleSignIn = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email,
        password,
      });

      console.log("Login success:", response);

      // Extract data from response
      const { token, role, refreshToken, expiresAt } = response;
        localStorage.setItem('token', token);

      // Decode JWT to get additional claims
      const decodedToken = decodeJWT(token);
      if (decodedToken) {
        console.log("Decoded Token:", decodedToken);
        console.log("Organization ID:", decodedToken.OrganizationId);
        console.log("User Role:", role);

        // Store all necessary data in localStorage
        localStorage.setItem('role', role);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('expiresAt', expiresAt);
        localStorage.setItem('organizationId', decodedToken.OrganizationId);
        localStorage.setItem('userId', decodedToken.sub);
        localStorage.setItem('email', decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]);
        localStorage.setItem('userName', decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
        localStorage.setItem('permission', decodedToken.Permission);
        localStorage.setItem('UserType', decodedToken.UserType);
        // Navigate based on role
          navigate("/home");
        
      } else {
        setError("Failed to process login data");
      }

    } catch (error) {
      console.error("Login error:", error);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || "Invalid email or password";
        setError(errorMessage);
      } else if (error.request) {
        // Request made but no response
        setError("Unable to connect to server. Please try again.");
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSignIn();
  };

  return (
    <LoginContainer>
      <Box
        sx={{
          width: "100%",
          maxWidth: "520px",
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <LoginCard elevation={0}>
          {/* Logo and Title */}
          <LogoContainer>
            <LogoIcon>
              <svg
                width={isSmallScreen ? "35" : "40"}
                height={isSmallScreen ? "35" : "40"}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 17H4C2.89543 17 2 16.1046 2 15V12C2 10.8954 2.89543 10 4 10H5M19 17H20C21.1046 17 22 16.1046 22 15V12C22 10.8954 21.1046 10 20 10H19M5 17C5 18.6569 6.34315 20 8 20C9.65685 20 11 18.6569 11 17M5 17C5 15.3431 6.34315 14 8 14C9.65685 14 11 15.3431 11 17M19 17C19 18.6569 17.6569 20 16 20C14.3431 20 13 18.6569 13 17M19 17C19 15.3431 17.6569 14 16 14C14.3431 14 13 15.3431 13 17M11 17H13M5 10V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </LogoIcon>
            <MainTitle component="h1">CAR Rental</MainTitle>
            <Subtitle>Plan your trip with us</Subtitle>
          </LogoContainer>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
              {error}
            </Alert>
          )}

          {/* Sign In Form */}
          <Box>
            <StyledTextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              type="email"
            />
            <StyledTextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />

            <Box textAlign="right" mb={2}>
              <StyledLink href="#" underline="none" sx={{ fontSize: "0.875rem" }}>
                Forgot Password?
              </StyledLink>
            </Box>

            <StyledButton fullWidth onClick={handleSignIn} disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </StyledButton>
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <FooterText>
              By continuing, you agree to our{" "}
              <StyledLink href="#" underline="none">
                Terms
              </StyledLink>{" "}
              and{" "}
              <StyledLink href="#" underline="none">
                Privacy Policy
              </StyledLink>
            </FooterText>
          </Box>
        </LoginCard>
      </Box>

      {/* Floating car decorations in background */}
      <BackgroundDecoration>
        <FloatingCar delay={0} size={120} top="10%" left="5%">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M5 17H4C2.89543 17 2 16.1046 2 15V12C2 10.8954 2.89543 10 4 10H5M19 17H20C21.1046 17 22 16.1046 22 15V12C22 10.8954 21.1046 10 20 10H19M5 17C5 18.6569 6.34315 20 8 20C9.65685 20 11 18.6569 11 17M5 17C5 15.3431 6.34315 14 8 14C9.65685 14 11 15.3431 11 17M19 17C19 18.6569 17.6569 20 16 20C14.3431 20 13 18.6569 13 17M19 17C19 15.3431 17.6569 14 16 14C14.3431 14 13 15.3431 13 17M11 17H13M5 10V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6V10" />
          </svg>
        </FloatingCar>
        <FloatingCar delay={2} size={150} top="60%" right="8%">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M5 17H4C2.89543 17 2 16.1046 2 15V12C2 10.8954 2.89543 10 4 10H5M19 17H20C21.1046 17 22 16.1046 22 15V12C22 10.8954 21.1046 10 20 10H19M5 17C5 18.6569 6.34315 20 8 20C9.65685 20 11 18.6569 11 17M5 17C5 15.3431 6.34315 14 8 14C9.65685 14 11 15.3431 11 17M19 17C19 18.6569 17.6569 20 16 20C14.3431 20 13 18.6569 13 17M19 17C19 15.3431 17.6569 14 16 14C14.3431 14 13 15.3431 13 17M11 17H13M5 10V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6V10" />
          </svg>
        </FloatingCar>
        <FloatingCar delay={4} size={100} bottom="15%" left="15%">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M5 17H4C2.89543 17 2 16.1046 2 15V12C2 10.8954 2.89543 10 4 10H5M19 17H20C21.1046 17 22 16.1046 22 15V12C22 10.8954 21.1046 10 20 10H19M5 17C5 18.6569 6.34315 20 8 20C9.65685 20 11 18.6569 11 17M5 17C5 15.3431 6.34315 14 8 14C9.65685 14 11 15.3431 11 17M19 17C19 18.6569 17.6569 20 16 20C14.3431 20 13 18.6569 13 17M19 17C19 15.3431 17.6569 14 16 14C14.3431 14 13 15.3431 13 17M11 17H13M5 10V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6V10" />
          </svg>
        </FloatingCar>
      </BackgroundDecoration>
    </LoginContainer>
  );
}

export default LoginPage;