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
      setshowAddUserModal(value);  // <-- explicit open/close
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
    // console.log("Customer data:", customerData);
    setshowAddUserModal(false);
    // Add your API call or data handling here
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

  const handleAddPermissionSubmit =(permissionData) => {
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
    { label: 'Home', path: '/home', className: 'home-link' },
    { label: 'Vehicles', path: '/models', className: 'models-link' },
    { label: 'Add Car', onClick: toggleAddCarModal },
    { label: 'Add organization', onClick: toggleAddOrganizationModal },
    { label: 'Add User', onClick: toggleAddUserModal },
    { label: 'Add Role', onClick: toggleAddRoleModal },
    { label: 'User List', path: '/usersList' },
    { label: 'Role List', path: 'rolesList' },
    { label: 'Assign Permission',onClick: toggleAddPermissionModal  },
  ];


  const filterdNavItems = navItems.filter(item => {

    if (item.label === "Add User" && userType === "1") {
      return false;
    }
    else if (item.label === "Add organization" && userType === "2") {
      return false;
    }
    else if (userType === "3" && (item.label === "Add organization" || item.label === "Add User" ||
      item.label === "Add Role" || item.label === "Add Car" || item.label === "User List" || item.label === "Role List")) {
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
        justifyContent: { xs: 'flex-start', sm: 'center' },
        alignItems: 'flex-start',
        position: 'relative',
        p: { xs: 3, sm: 4 },
      }}
    >
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: 'absolute',
          top: '1.5rem',
          right: '.5rem',
          fontSize: '3rem',
          color: '#010103',
          transition: 'all 0.3s',
          '&:hover': {
            color: '#ff4d30',
          },
        }}
      >
        <CloseIcon sx={{ fontSize: '3rem', marginRight: 0 }}
        />
      </IconButton>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '2rem', sm: '3rem' },
          textAlign: 'left',
          width: '100%',
          maxWidth: { xs: '100%', sm: '250px' },
          px: { xs: 2, sm: 4 },
          mt: { xs: 2, sm: 35, md: 36, lg: 40, xl: 50 },
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

        {/* Login/Logout Button */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleAuthClick();
              setDrawerOpen(false);
            }}
            sx={{
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <ListItemText
              primary={isLoggedIn ? <LogoutIcon sx={{ fontSize: '2.4rem' }} /> : "Login"}
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
              Home
            </Button>

            {/* Vehicles Link */}
            <Button
              onClick={() => handleNavigation('/models')}
              sx={{
                fontSize: { xs: '1.4rem', md: '1.6rem' },
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
              xs: '75%',
              sm: '50%',
              md: '30%',
              lg: '20%',
            },
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'flex-start',
            transition: 'width 0.3s ease'
          },
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
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