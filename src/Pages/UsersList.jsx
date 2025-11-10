import React from 'react';
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

function UsersList() {
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 234 567 8900',
      role: 'Admin',
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 234 567 8901',
      role: 'Manager',
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '+1 234 567 8902',
      role: 'User',
      avatar: 'MB'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 234 567 8903',
      role: 'User',
      avatar: 'ED'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.w@example.com',
      phone: '+1 234 567 8904',
      role: 'Manager',
      avatar: 'DW'
    }
  ];

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
    // Add your edit logic here
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
    // Add your delete logic here
  };

  return (
    <Box
      sx={{
        padding: { xs: '2rem 1rem', md: '3rem 2rem' },
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '2.5rem', md: '3rem' },
          fontWeight: 600,
          color: '#010103',
          fontFamily: '"Rubik", sans-serif',
          marginBottom: '3rem',
          marginTop: '5rem',
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
                  padding: '2rem 1.5rem',
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
                  padding: '2rem 1.5rem',
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
                  padding: '2rem 1.5rem',
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
                  padding: '2rem 1.5rem',
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
                  padding: '2rem 1.5rem',
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
                    padding: '1.5rem',
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
                  {user.role}
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
                      onClick={() => handleEdit(user.id)}
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
    </Box>
  );
}

export default UsersList;