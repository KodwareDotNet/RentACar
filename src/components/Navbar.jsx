import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  ListItemIcon,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddUserModal from './AddUserModal';
import AddCarModal from './AddCarModal';
import AddRoleModal from './AddRoleModal';
import AddOrganizationModal from './AddOrganizationModal';
import AddPermissionModal from './AddPermissionModal';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddUserModal, setshowAddUserModal] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddOrganizationModal, setShowAddOrganizationModal] = useState(false);
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    if (drawerOpen) {
      setDrawerOpen(false);
    }
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.clear();
      handleNavigation("/")
    } else {
      handleNavigation("/")
    }
  }

  const toggleAddUserModal = (value) => {
    if (value === undefined) {
      setshowAddUserModal(prev => !prev);
    } else {
      setshowAddUserModal(value);
    }
  };

  const toggleAddCarModal = () => {
    setShowAddCarModal((prev) => !prev);
  };

  const toggleAddRoleModal = () => {
    setShowAddRoleModal((prev) => !prev);
  };

  const toggleAddOrganizationModal = () => {
    setShowAddOrganizationModal((prev) => !prev);
  };

  const toggleAddPermissionModal = () => {
    setShowAddPermissionModal((prev) => !prev);
  };

  const handleCustomerSubmit = () => {
    setshowAddUserModal(false);
  };

  const handleAddCarSubmit = (carData) => {
    console.log("Added Car:", carData);
    setShowAddCarModal(false);
  };

  const handleAddRoleSubmit = (roleData) => {
    console.log("Role Added:", roleData);
    setShowAddRoleModal(false);
  };

  const handleAddOrganizationSubmit = (organizationData) => {
    console.log("Organization Added:", organizationData);
    setShowAddOrganizationModal(false);
  }

  const handleAddPermissionSubmit = (permissionData) => {
    console.log("Permission Added:", permissionData);
    setShowAddPermissionModal(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const userType = localStorage.getItem("UserType");

  const navItems = [
    { label: 'Home', path: '/home', icon: 'bi-house-door', className: 'home-link' },
    { label: 'Vehicles', path: '/models', icon: 'bi-car-front', className: 'models-link' },
    { label: 'Add Car', path: '/models?modal=true', icon: 'bi-plus-circle', className: 'models-link' },
    { label: 'Add Organization', onClick: toggleAddOrganizationModal, icon: 'bi-building-add' },
    { label: 'Add User', onClick: toggleAddUserModal, icon: 'bi-person-plus' },
    { label: 'Add Role', onClick: toggleAddRoleModal, icon: 'bi-shield-plus' },
    { label: 'Organizations', path: '/organizationList', icon: 'bi-buildings' },
    { label: 'Users', path: '/usersList', icon: 'bi-people' },
    { label: 'Roles', path: '/rolesList', icon: 'bi-shield-check' },
    { label: 'Permissions', onClick: toggleAddPermissionModal, icon: 'bi-key' },
    { label: 'Booked Cars', path: '/bookedCarsPage', icon: 'bi-calendar-check' },
    { label: 'Received Cars', path: '/receivedCarspage', icon: 'bi-clipboard-check' },
    { label: 'Maintenance', path: '/maintenancePage', icon: 'bi-tools' },
    { label: 'Booking Reports', path: '/reportsPage', icon: 'bi-file-earmark-bar-graph' },
    { label: 'Maintenance Report', path: '/maintenanceReport', icon: 'bi-graph-up' },
    { label: 'Customer History', path: '/customerHistory', icon: 'bi-clock-history' }
  ];

  const filterdNavItems = navItems.filter(item => {
    if (item.label === "Add User" && userType === "1") {
      return false;
    }
    else if (item.label === "Add Organization" && userType === "2") {
      return false;
    }
    else if (userType === "3" && (item.label === "Add Organization" || item.label === "Add User" ||
      item.label === "Add Role" || item.label === "Add Car" || item.label === "Users" || item.label === "Roles")) {
      return false;
    }
    else {
      return true;
    }
  });

  const drawer = (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        pt: '4rem',
        px: { xs: 2, sm: 3 },
        overflowY: 'auto', // allows scrolling if items overflow
      }}
    >
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: 'absolute',
          top: '1rem',
          right: '.5rem',
          fontSize: '2.5rem',
          color: '#010103',
          transition: 'all 0.3s',
          '&:hover': {
            color: '#ff4d30',
          },
        }}
      >
        <CloseIcon sx={{ fontSize: '2.5rem' }} />
      </IconButton>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '0.3rem', sm: '0.5rem' },
          textAlign: 'left',
          width: '100%',
          maxWidth: '100%',

        }}
      >
        {filterdNavItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                  setDrawerOpen(false);
                } else {
                  handleNavigation(item.path);
                }
              }}
              sx={{
                borderRadius: '8px',
                py: 1,
                px: 0,
                color: location.pathname === item.path ? 'rgba(231, 40, 11, 0.63)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 77, 48, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <i
                  className={item.icon}
                  style={{
                    fontSize: '1.4rem',
                    color: '#010103',
                    transition: 'color 0.3s'
                  }}
                ></i>
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  color: location.pathname === item.path ? 'rgba(231, 40, 11, 0.63)' : 'transparent',
                  '& .MuiTypography-root': {
                    fontSize: '1.4rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color:
                      location.pathname === item.path
                        ? '#ff4d30'
                        : '#010103',
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

        {/* Login/Logout Button */}
        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton
            onClick={() => {
              handleAuthClick();
              setDrawerOpen(false);
            }}
            sx={{
              borderRadius: '8px',
              py: 1,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 77, 48, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              {isLoggedIn ? (
                <LogoutIcon sx={{ fontSize: '1.8rem', color: '#010103' }} />
              ) : (
                <i className="bi-box-arrow-in-right" style={{ fontSize: '1.4rem', color: '#010103' }}></i>
              )}
            </ListItemIcon>
            <ListItemText
              primary={isLoggedIn ? "Logout" : "Login"}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '1.4rem',
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
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          maxWidth: '133rem',
          width: '100%',
          top: 0,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            padding: '16px 8px 8px 8px',
            minHeight: 'auto !important',
          }}
        >
          {/* Left Section: Menu Icon + Home & Vehicles Links */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: '1.5rem', md: '2.5rem' },
            }}
          >
            {/* Three Lines Menu Icon */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                fontSize: '2.8rem',
                color: '#010103',
                transition: 'all 0.3s',
                padding: '0.5rem',
                '&:hover': {
                  color: '#ff4d30',
                  backgroundColor: 'transparent',
                },
              }}
            >
              <MenuIcon sx={{ fontSize: '2.8rem' }} />
            </IconButton>

            {/* Home Link */}
            <Button
              onClick={() => handleNavigation('/home')}
              sx={{
                fontSize: { xs: '1.4rem', md: '1.6rem' },
                fontFamily: '"Rubik", sans-serif',
                fontWeight: 500,
                color: location.pathname === '/home' ? '#ff4d30' : '#010103',
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
              Home
            </Button>

            {/* Vehicles Link */}
            <Button
              onClick={() => handleNavigation('/models')}
              sx={{
                fontSize: { xs: '1.4rem', md: '1.6rem' },
                fontFamily: '"Rubik", sans-serif',
                fontWeight: 500,
                color: location.pathname === '/models' ? '#ff4d30' : '#010103',
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
              Vehicles
            </Button>
          </Box>

          {/* Right Section: Logout Icon (only on larger screens) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={handleAuthClick}
              sx={{
                fontSize: '1.6rem',
                color: '#010103',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#ff4d30',
                },
              }}
            >
              {isLoggedIn ? <LogoutIcon sx={{ fontSize: '2.4rem' }} /> : "Login"}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: {
              xs: '54%',
              sm: '25%',
              md: '20%',
              lg: '15%',
            },
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'flex-start',
            transition: 'width 0.3s ease'
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        }}
        transitionDuration={500}
      >
        {drawer}
      </Drawer>

      <AddUserModal
        modal={showAddUserModal}
        openModal={toggleAddUserModal}
        confirmAdding={handleCustomerSubmit}
      />
      <AddCarModal
        modal={showAddCarModal}
        openModal={toggleAddCarModal}
        onAddCar={handleAddCarSubmit}
      />
      <AddRoleModal
        modal={showAddRoleModal}
        openModal={toggleAddRoleModal}
        confirmAdding={handleAddRoleSubmit}
      />
      <AddOrganizationModal
        modal={showAddOrganizationModal}
        openModal={toggleAddOrganizationModal}
        confirmAdding={handleAddOrganizationSubmit}
      />
      <AddPermissionModal
        modal={showAddPermissionModal}
        openModal={toggleAddPermissionModal}
        confirmAdding={handleAddPermissionSubmit}
      />
    </>
  );
}

export default Navbar;