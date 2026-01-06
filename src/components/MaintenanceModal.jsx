import { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import maintenanceService from "../api/services/MaintainCars/maintenanceService";

function MaintenanceModal({ 
  modal, 
  openModal, 
  carDetail, 
  onSubmitSuccess 
}) {
  const [userData, setUserData] = useState({
    thingToMaintain: '',
    isRepair: false,
    isReplace: false,
    cost: '',
    maintenanceDate: '',
    status: 'Active'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.thingToMaintain.trim()) {
      newErrors.thingToMaintain = 'Please specify what needs maintenance';
    }
    
    if (!userData.isRepair && !userData.isReplace) {
      newErrors.maintenanceType = 'Please select either Repair or Replace';
    }
    
    if (!userData.cost || parseFloat(userData.cost) <= 0) {
      newErrors.cost = 'Please enter a valid cost';
    }
    
    if (!userData.maintenanceDate) {
      newErrors.maintenanceDate = 'Please select the last maintenance date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData instead of JSON object
      const formData = new FormData();
      formData.append('carId', carDetail?.id);
      formData.append('thingToMaintain', userData.thingToMaintain);
      formData.append('isRepair', userData.isRepair);
      formData.append('isReplace', userData.isReplace);
      formData.append('cost', parseFloat(userData.cost));
      
      if (userData.maintenanceDate) {
        formData.append('lastMaintenanceDate', new Date(userData.maintenanceDate).toISOString());
      }
      
      formData.append('status', userData.status || 1);
      
      console.log('Sending to maintenance as FormData');
      
      const res = await maintenanceService.maintainCar(formData);
      
      showSnackbar('Maintenance request submitted successfully', 'success');
      
      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }
      
      setTimeout(() => {
        setUserData({
          thingToMaintain: '',
          isRepair: false,
          isReplace: false,
          cost: '',
          maintenanceDate: ''
        });
        setErrors({});
        openModal(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending to maintenance:', error);
      showSnackbar('Failed to send maintenance request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setUserData({
        thingToMaintain: '',
        isRepair: false,
        isReplace: false,
        cost: '',
        maintenanceDate: ''
      });
      setErrors({});
      openModal(false);
    }
  };

  return (
    <>
      <Dialog
        open={modal}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            maxHeight: '90vh'
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: '#ff4d30',
            color: 'white',
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Send to Maintenance
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          {/* Section Title */}
          <Typography
            variant="h6"
            sx={{
              color: '#ff4d30',
              fontWeight: 600,
              mb: 3,
              textTransform: 'uppercase',
              fontSize: '1.1rem'
            }}
          >
            Maintenance Details
          </Typography>

          {/* Car Details */}
          {carDetail && (
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                bgcolor: '#f8f9fa',
                borderRadius: 1,
                border: '1px solid #e9ecef'
              }}
            >
              <Typography variant="body1" sx={{ mb: 0.5, color: '#495057' }}>
                <Box component="span" sx={{ fontWeight: 600 }}>Vehicle:</Box>{' '}
                {carDetail.make} {carDetail.model}
              </Typography>
              {carDetail.plate && (
                <Typography variant="body1" sx={{ color: '#495057' }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>Plate:</Box>{' '}
                  {carDetail.plate}
                </Typography>
              )}
            </Box>
          )}

          {/* Thing To Maintain - Full Width */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: '#495057',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
            >
              Thing To Maintain <span style={{ color: '#ff4d30' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., Engine, Tires, Brakes"
              value={userData.thingToMaintain}
              onChange={(e) => handleInputChange('thingToMaintain', e.target.value)}
              disabled={isSubmitting}
              error={!!errors.thingToMaintain}
              helperText={errors.thingToMaintain}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f1f3f5',
                  '& fieldset': {
                    borderColor: errors.thingToMaintain ? '#ff4d30' : '#dee2e6'
                  },
                  '&:hover fieldset': {
                    borderColor: '#adb5bd'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff4d30'
                  }
                }
              }}
            />
          </Box>

          {/* Maintenance Type Checkboxes */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: '#495057',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
            >
              Maintenance Type <span style={{ color: '#ff4d30' }}>*</span>
            </Typography>
            <FormGroup sx={{ flexDirection: 'row', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userData.isRepair}
                    onChange={(e) => handleInputChange('isRepair', e.target.checked)}
                    disabled={isSubmitting}
                    sx={{
                      color: '#ff4d30',
                      '&.Mui-checked': {
                        color: '#ff4d30'
                      }
                    }}
                  />
                }
                label="Repair"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userData.isReplace}
                    onChange={(e) => handleInputChange('isReplace', e.target.checked)}
                    disabled={isSubmitting}
                    sx={{
                      color: '#ff4d30',
                      '&.Mui-checked': {
                        color: '#ff4d30'
                      }
                    }}
                  />
                }
                label="Replace"
              />
            </FormGroup>
            {errors.maintenanceType && (
              <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                {errors.maintenanceType}
              </Typography>
            )}
          </Box>

          {/* Two Column Layout */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            {/* Cost */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: '#495057',
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}
              >
                Cost <span style={{ color: '#ff4d30' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="Enter cost"
                value={userData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                disabled={isSubmitting}
                error={!!errors.cost}
                helperText={errors.cost}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f1f3f5',
                    '& fieldset': {
                      borderColor: errors.cost ? '#ff4d30' : '#dee2e6'
                    },
                    '&:hover fieldset': {
                      borderColor: '#adb5bd'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff4d30'
                    }
                  }
                }}
              />
            </Box>

            {/* Last Maintenance Date */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: '#495057',
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}
              >
                Maintenance Date <span style={{ color: '#ff4d30' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                value={userData.maintenanceDate}
                onChange={(e) => handleInputChange('maintenanceDate', e.target.value)}
                disabled={isSubmitting}
                error={!!errors.maintenanceDate}
                helperText={errors.maintenanceDate}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f1f3f5',
                    '& fieldset': {
                      borderColor: errors.maintenanceDate ? '#ff4d30' : '#dee2e6'
                    },
                    '&:hover fieldset': {
                      borderColor: '#adb5bd'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff4d30'
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Submit Button */}
          <Box>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                bgcolor: '#ff4d30',
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                boxShadow: '0 10px 15px rgba(255, 77, 48, 0.35)',
                '&:hover': {
                  bgcolor: '#e63c1f',
                  boxShadow: '0 10px 20px rgba(255, 77, 48, 0.45)'
                },
                '&:disabled': {
                  bgcolor: '#fca5a5',
                  color: 'white'
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MaintenanceModal;