import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import addOrganizationService from '../api/services/AddOrganization/addOrganizationService'; 



function OrganizationList() {

  const [organizationsList, setOrganizationsList]= useState([]);

  const Organizations = async () => {
    try {
      const res = await addOrganizationService.getOrganization();
      setOrganizationsList (res.data || []);
}
catch(err){
  console.error("failed ",err)
}
  }

 useEffect(() => {
    Organizations();  
  }, []);

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
        Organizations List
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
                Organization Name
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
            {organizationsList.map((organizations) => (
              <TableRow
                key={organizations.id}
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

                    <Typography
                      sx={{
                        fontSize: { xs: '1.4rem', md: '1.6rem' },
                        fontWeight: 500,
                        color: '#010103',
                        fontFamily: '"Rubik", sans-serif',
                      }}
                    >
                      {organizations.name}
                    </Typography>
                  </Box>
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
                      onClick={() => handleEdit(organizations.id)}
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
                      onClick={() => handleDelete(organizations.id)}
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

export default OrganizationList;