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
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import addRoleService from '../api/services/AddRole/addRoleService';
import AddRoleModal from '../components/AddRoleModal';

function RolesList() {
  const [rolesList, setRolesList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const Roles = async () => {
    try {
      const res = await addRoleService.getRoles();
      setRolesList(res.data || []);
    } catch (err) {
      console.error("failed ", err);
    }
  };

  useEffect(() => {
    Roles();
  }, []);

  const handleEdit = (roleId) => {
    console.log('Edit role with ID:', roleId);
    const roleToEdit = rolesList.find(role => role.roleId === roleId);
    console.log('Complete role data to edit:', JSON.stringify(roleToEdit, null, 2));
    
    if (roleToEdit) {
      setSelectedRole(roleToEdit);
      setModalOpen(true);
    } else {
      console.error('Role not found in list');
    }
  };

  const handleDelete = async (id) => {
    try{
      await addRoleService.deleteRole(id);
      await Roles();
      alert ("Role deleted SuccessFully");
    }
    catch(err){
      alert(err.message || "Failed to delete");
    }
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRole(null);
  };

  const handleConfirmAdding = (newRole) => {
    console.log('Role operation completed, refreshing list...');
    // Refresh the roles list after adding/editing
    Roles();
  };

  return (
    <Box
      sx={{
        padding: { xs: '2rem 1rem', md: '3rem 2rem' },
        maxWidth: '1400px',
        ml:8
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '2.5rem', md: '3rem' },
            fontWeight: 600,
            color: '#010103',
            fontFamily: '"Rubik", sans-serif',
          }}
        >
          Roles List
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRole}
          sx={{
            backgroundColor: '#ff4d30',
            color: 'white',
            padding: '10px 24px',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: '"Rubik", sans-serif',
            textTransform: 'none',
            boxShadow: '0 4px 12px 0 rgba(255, 83, 48, 0.35)',
            '&:hover': {
              backgroundColor: '#e63c20',
              boxShadow: '0 6px 16px 0 rgba(255, 83, 48, 0.5)',
            },
          }}
        >
          Add Role
        </Button>
      </Box>

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
                Roles Name
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
            {rolesList.map((roles) => (
              <TableRow
                key={roles.roleId}
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
                      {roles.roleName}
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
                      onClick={() => handleEdit(roles.roleId)}
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
                      onClick={() => handleDelete(roles.id)}
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

      {/* Add/Edit Role Modal */}
      <AddRoleModal
        modal={modalOpen}
        openModal={handleCloseModal}
        confirmAdding={handleConfirmAdding}
        roleData={selectedRole}
      />
    </Box>
  );
}

export default RolesList;