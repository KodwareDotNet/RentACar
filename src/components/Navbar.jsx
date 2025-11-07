import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '../images/logo/logo.png';
import AddCustomerModal from './AddCustomerModal'
import AddCarModal from './AddCarModal';


function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      handleNavigation("/")
    } else {
      handleNavigation("/")
    }

  }

  const toggleCustomerModal = () => {
    setShowCustomerModal((prev) => !prev);
  };

  const toggleAddCarModal = () => {
    setShowAddCarModal((prev) => !prev);
  }


  const handleCustomerSubmit = (customerData) => {
    console.log("Customer data:", customerData);
    setShowCustomerModal(false);
    // Add your API call or data handling here
  };

  const handleAddCarSubmit = (carData) => {
    console.log("Added Car:", carData);
    setShowAddCarModal(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const navItems = [
    { label: 'Home', path: '/home', className: 'home-link' },
    { label: 'Vehicles', path: '/models', className: 'models-link' },
    { label: 'Add Car', onClick: toggleAddCarModal },
    { label: 'Add Customer', onClick: toggleCustomerModal}
  ];

  const drawer = (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: 'absolute',
          top: '3.5rem',
          right: '3.5rem',
          fontSize: '3rem',
          color: '#010103',
          transition: 'all 0.3s',
          '&:hover': {
            color: '#ff4d30',
          },
        }}
      >
        <CloseIcon sx={{ fontSize: '3rem' }} />
      </IconButton>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          textAlign: 'center',
        }}
      >
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              // onClick={() => handleNavigation(item.path)}
              onClick={() => {
                if (item.onClick) {
                  item.onClick(); // 🔥 calls toggleAddCarModal
                } else {
                  handleNavigation(item.path); // 🔥 navigates normally
                }
              }}
              sx={{
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '2.3rem',
                    fontWeight: 500,
                    color: '#010103',
                    fontFamily: '"Rubik", sans-serif',
                    transition: 'all 0.3s',
                  },
                  '&:hover .MuiTypography-root': {
                    color: '#ff4d30',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          maxWidth: '133rem',
          width: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            padding: '2.7rem 2rem',
            minHeight: 'auto !important',
          }}
        >
          {/* Logo */}
          <Box
            onClick={() => handleNavigation('/home')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="logo"
              sx={{
                width: '14.5rem',
                height: 'auto',
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  gap: '2.1rem',
                }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    // onClick={() => handleNavigation(item.path)}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick(); // 🔥 calls toggleAddCarModal
                      } else {
                        handleNavigation(item.path); // 🔥 navigates normally
                      }
                    }}
                    className={item.className}
                    sx={{
                      fontSize: '1.6rem',
                      fontFamily: '"Rubik", sans-serif',
                      fontWeight: 500,
                      color: '#010103',
                      textTransform: 'none',
                      padding: 0,
                      minWidth: 'auto',
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#ff4d30',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '2.5rem',
                  alignItems: 'center',
                }}
              >
              
                <Button
                  onClick={handleAuthClick}
                  sx={{
                    fontSize: '1.6rem',
                    fontFamily: '"Rubik", sans-serif',
                    fontWeight: 500,
                    color: '#010103',
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 'auto',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#ff4d30',
                    },
                  }}
                >
                  {isLoggedIn ? "Logout" : "Sign In"}
                </Button>

              </Box>
            </>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                fontSize: '2.8rem',
                color: '#010103',
                transition: 'all 0.3s',
                '&:hover': {
                  color: '#ff4d30',
                  backgroundColor: 'transparent',
                },
              }}
            >
              <MenuIcon sx={{ fontSize: '2.8rem' }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            boxSizing: 'border-box',
          },
        }}
        transitionDuration={500}
      >
        {drawer}
      </Drawer>
      <AddCustomerModal
        modal={showCustomerModal}
        openModal={toggleCustomerModal}
        confirmAdding={handleCustomerSubmit}
      />
      <AddCarModal
        modal={showAddCarModal}
        openModal={toggleAddCarModal}
        onAddCar={handleAddCarSubmit}
      />
    </>
  );
}

export default Navbar;