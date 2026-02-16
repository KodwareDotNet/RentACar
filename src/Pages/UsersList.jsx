import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import userService from "../api/services/AddUser/userService";
import AddUserModal from "../components/AddUserModal"

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [editId, setEditId] = useState(null);

  // 🔹 Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data); // store all users here
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Delete user
  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      fetchUsers(); // refresh list after delete
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleEditClick = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleUserUpdated = (updatedUserData) => {
    setModalOpen(false);
    fetchUsers(); // refresh table
    setEditingUser(null);
  };

  const getRole = (userType) => {
    switch (userType) {
      case 1:
        return "Super Admin";
      case 2:
        return "Admin";
      case 3:
        return "User";
      default:
        return "Unknown";
    }
  };


  return (
    <Box
      sx={{
        padding: 1,
        maxWidth: '1400px',
        ml: 10,
      }}
    >
      <Typography
        varaiant={"h3"}
        component={"h1"}
        sx={{
          color: '#010103',
          fontFamily: '"Rubik", sans-serif',
          mb: 1
        }}
      >
        Users List
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '1.2rem',
          overflow: 'hidden',
        }}
      >
        <Table
          sx={{
            minWidth: { xs: 650, md: 750 },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#f5f5f5',
              }}
            >
              <TableCell
                sx={{
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: '#010103',
                  fontFamily: '"Rubik", sans-serif',
                  padding: 1,
                }}
              >
                User
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: '#010103',
                  fontFamily: '"Rubik", sans-serif',
                  padding: 1,
                  display: { xs: 'none', sm: 'table-cell' },
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: '#010103',
                  fontFamily: '"Rubik", sans-serif',
                  padding: 1,
                  display: { xs: 'none', md: 'table-cell' },
                }}
              >
                Phone
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: '#010103',
                  fontFamily: '"Rubik", sans-serif',
                  padding: 1,
                }}
              >
                Role
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: '#010103',
                  fontFamily: '"Rubik", sans-serif',
                  padding: 1,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#fafafa',
                  },
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  sx={{
                    padding: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: '4rem', md: '4.5rem' },
                        height: { xs: '4rem', md: '4.5rem' },
                        backgroundColor: '#ff4d30',
                        fontSize: { xs: '1.6rem', md: '1.8rem' },
                        fontWeight: 600,
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                    <Typography
                      sx={{
                        fontSize: { xs: '1.4rem', md: '1.6rem' },
                        fontWeight: 500,
                        color: '#010103',
                        fontFamily: '"Rubik", sans-serif',
                      }}
                    >
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                    color: '#555',
                    fontFamily: '"Rubik", sans-serif',
                    padding: '1.5rem',
                    display: { xs: 'none', sm: 'table-cell' },
                  }}
                >
                  {user.email}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                    color: '#555',
                    fontFamily: '"Rubik", sans-serif',
                    padding: '1.5rem',
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                >
                  {user.phone}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                    fontWeight: 600,
                    color: '#ff4d30',
                    fontFamily: '"Rubik", sans-serif',
                    padding: '1.5rem',
                  }}
                >
                  {getRole(user.userType)}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    padding: '1.5rem',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '1rem',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton
                      onClick={() => handleEditClick(user)}
                      sx={{
                        color: '#2196f3',
                        transition: 'all 0.3s',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.1)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <EditIcon sx={{ fontSize: { xs: '2rem', md: '2.2rem' } }} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      sx={{
                        color: '#f44336',
                        transition: 'all 0.3s',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: { xs: '2rem', md: '2.2rem' } }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddUserModal
        modal={modalOpen}
        openModal={setModalOpen}
        confirmAdding={handleUserUpdated}
        editingUser={editingUser}
      />
    </Box>
  );
}

export default UsersList;