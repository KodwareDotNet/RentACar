import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
  TextField,
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
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import maintenanceService from "../api/services/MaintainCars/maintenanceService";
import { BASE_URL } from "../api/axiosConfig";

function MaintenanceModal({ 
  modal, 
  openModal, 
  carDetail,
  maintenanceData,
  isEditMode = false,
  isReceiveMode = false,
  onSubmitSuccess 
}) {
  const [formData, setFormData] = useState({
    thingToMaintain: '',
    isRepair: false,
    isReplace: false,
    cost: '',
    maintenanceDate: '',
    status: 1
  });

  const [receiveData, setReceiveData] = useState({
    receiveImages: [],
    damageNotes: '',
    extraCharges: 0,
    remarks: '',
    receiveDate: '',
    completionNotes: ''
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isEditMode && maintenanceData) {
      setFormData({
        thingToMaintain: maintenanceData.thingToMaintain || '',
        isRepair: maintenanceData.isRepair || false,
        isReplace: maintenanceData.isReplace || false,
        cost: maintenanceData.cost || '',
        maintenanceDate: maintenanceData.lastMaintenanceDate 
          ? new Date(maintenanceData.lastMaintenanceDate).toISOString().slice(0, 16)
          : '',
        status: maintenanceData.status || 1
      });

      if (maintenanceData.imageUrl) {
        const fullImageUrl = maintenanceData.imageUrl.startsWith('http')
          ? maintenanceData.imageUrl
          : `${BASE_URL}${maintenanceData.imageUrl}`;

        setUploadedImages([{
          preview: fullImageUrl,
          isExisting: true,
          imageId: maintenanceData.imageUrl
        }]);
      }
    } else if (isReceiveMode && maintenanceData) {
      setFormData({
        thingToMaintain: maintenanceData.thingToMaintain || '',
        isRepair: maintenanceData.isRepair || false,
        isReplace: maintenanceData.isReplace || false,
        cost: maintenanceData.cost || '',
        maintenanceDate: maintenanceData.lastMaintenanceDate 
          ? new Date(maintenanceData.lastMaintenanceDate).toISOString().slice(0, 16)
          : '',
        status: maintenanceData.status || 1
      });
    } else if (carDetail) {
      setFormData(prev => ({
        ...prev,
        status: 1
      }));

      if (carDetail.imageUrl) {
        const fullImageUrl = carDetail.imageUrl.startsWith('http')
          ? carDetail.imageUrl
          : `${BASE_URL}${carDetail.imageUrl}`;

        setUploadedImages([{
          preview: fullImageUrl,
          isExisting: true,
          imageId: carDetail.imageUrl
        }]);
      }
    }
  }, [carDetail, maintenanceData, isEditMode, isReceiveMode, modal]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReceiveInputChange = (field, value) => {
    setReceiveData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file: file,
      isExisting: false
    }));
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  const handleReceiveImagesSelect = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setReceiveData(prev => ({
      ...prev,
      receiveImages: [...prev.receiveImages, ...images],
    }));
  };

  const handleRemoveReceiveImage = (index) => {
    const newImages = receiveData.receiveImages.filter((_, i) => i !== index);
    setReceiveData(prev => ({ ...prev, receiveImages: newImages }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.thingToMaintain.trim()) {
      newErrors.thingToMaintain = 'Please specify what needs maintenance';
    }
    
    if (!formData.isRepair && !formData.isReplace) {
      newErrors.maintenanceType = 'Please select either Repair or Replace';
    }
    
    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Please enter a valid cost';
    }
    
    if (!formData.maintenanceDate) {
      newErrors.maintenanceDate = 'Please select the maintenance date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReceiveForm = () => {
    const newErrors = {};
    
    if (!receiveData.receiveDate) {
      newErrors.receiveDate = 'Please select receive date';
    }
    
    if (!receiveData.remarks.trim()) {
      newErrors.remarks = 'Remarks are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalCost = () => {
    const maintenanceCost = parseFloat(formData.cost) || 0;
    const extraCost = parseFloat(receiveData.extraCharges) || 0;
    return maintenanceCost + extraCost;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const apiFormData = new FormData();
      
      apiFormData.append('maintenanceId', maintenanceData.id);
      apiFormData.append('carId', maintenanceData.carId || carDetail?.id);
      apiFormData.append('thingToMaintain', formData.thingToMaintain);
      apiFormData.append('isRepair', formData.isRepair);
      apiFormData.append('isReplace', formData.isReplace);
      apiFormData.append('cost', parseFloat(formData.cost));
      
      if (formData.maintenanceDate) {
        apiFormData.append('lastMaintenanceDate', new Date(formData.maintenanceDate).toISOString());
      }
      
      apiFormData.append('status', formData.status);

      const newImages = uploadedImages.filter(img => !img.isExisting && img.file);
      newImages.forEach((image) => {
        apiFormData.append('Images', image.file);
      });

      const existingImageUrls = uploadedImages
        .filter(img => img.isExisting && img.preview)
        .map(img => {
          const url = img.preview;
          if (url.startsWith('http://') || url.startsWith('https://')) {
            const urlObj = new URL(url);
            return urlObj.pathname;
          }
          return url;
        });

      if (existingImageUrls.length > 0) {
        apiFormData.append('existingImageUrls', JSON.stringify(existingImageUrls));
      }
      
      const res = await maintenanceService.updateMaintenance(apiFormData);
      
      if (res && res.status === 200) {
        showSnackbar('Maintenance updated successfully', 'success');
        
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        
        setTimeout(() => {
          resetForm();
          openModal(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating maintenance:', error);
      showSnackbar('Failed to update maintenance', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiveSubmit = async () => {
    if (!validateReceiveForm()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const apiFormData = new FormData();
      
      apiFormData.append('maintenanceId', maintenanceData.id);
      apiFormData.append('carId', maintenanceData.carId || carDetail?.id);
      apiFormData.append('damageRemarks', receiveData.damageNotes);
      apiFormData.append('extraCharges', parseFloat(receiveData.extraCharges) || 0);
      apiFormData.append('remarks', receiveData.remarks);
      apiFormData.append('completionNotes', receiveData.completionNotes);
      apiFormData.append('totalCost', calculateTotalCost());
      apiFormData.append('status', 2);
      
      if (receiveData.receiveDate) {
        apiFormData.append('receiveDate', new Date(receiveData.receiveDate).toISOString());
      }

      receiveData.receiveImages.forEach((image) => {
        apiFormData.append('ReceiveImages', image.file);
      });
      
      const res = await maintenanceService.receiveMaintenance(apiFormData);
      
      if (res && res.status === 200) {
        showSnackbar('Maintenance completed successfully', 'success');
        
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        
        setTimeout(() => {
          resetForm();
          openModal(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error receiving maintenance:', error);
      showSnackbar('Failed to complete maintenance', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (isEditMode) {
      handleUpdate();
      return;
    }
    
    if (isReceiveMode) {
      handleReceiveSubmit();
      return;
    }

    if (!validateForm()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const apiFormData = new FormData();
      
      apiFormData.append('carId', carDetail?.id);
      apiFormData.append('thingToMaintain', formData.thingToMaintain);
      apiFormData.append('isRepair', formData.isRepair);
      apiFormData.append('isReplace', formData.isReplace);
      apiFormData.append('cost', parseFloat(formData.cost));
      
      if (formData.maintenanceDate) {
        apiFormData.append('lastMaintenanceDate', new Date(formData.maintenanceDate).toISOString());
      }
      
      apiFormData.append('status', 1);

      uploadedImages.forEach((image) => {
        if (!image.isExisting && image.file) {
          apiFormData.append('Image', image.file);
        }
      });

      const existingImageIds = uploadedImages
        .filter(img => img.isExisting)
        .map(img => img.imageId);

      if (existingImageIds.length > 0) {
        apiFormData.append('carImageUrl', JSON.stringify(existingImageIds));
      }
      
      const res = await maintenanceService.maintainCar(apiFormData);
      
      if (res && res.status === 200) {
        showSnackbar('Maintenance request submitted successfully', 'success');
        
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        
        setTimeout(() => {
          resetForm();
          openModal(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending to maintenance:', error);
      showSnackbar('Failed to send maintenance request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      thingToMaintain: '',
      isRepair: false,
      isReplace: false,
      cost: '',
      maintenanceDate: '',
      status: 1
    });
    setReceiveData({
      receiveImages: [],
      damageNotes: '',
      extraCharges: 0,
      remarks: '',
      receiveDate: '',
      completionNotes: ''
    });
    setUploadedImages([]);
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      openModal(false);
    }
  };

  const getCarInfo = () => {
    if (isEditMode || isReceiveMode) {
      return maintenanceData?.carName || 'Unknown Car';
    }
    return carDetail ? `${carDetail.carName || carDetail.make} ${carDetail.model || ''}`.trim() : 'Unknown Car';
  };

  const getCarImage = () => {
    if (isEditMode || isReceiveMode) {
      return maintenanceData?.image || uploadedImages[0]?.preview;
    }
    return uploadedImages[0]?.preview;
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
          <Typography variant="h5" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isEditMode ? 'Edit Maintenance' : isReceiveMode ? 'Complete Maintenance' : 'Send to Maintenance'}
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          {getCarImage() && (
            <Box sx={{ mb: 3, position: 'relative', width: '100%', height: 200, borderRadius: 2, overflow: 'hidden', border: '2px solid #e9ecef' }}>
              <img src={getCarImage()} alt={getCarInfo()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', p: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>{getCarInfo()}</Typography>
              </Box>
            </Box>
          )}

          {isReceiveMode ? (
            <>
              <Typography variant="h6" sx={{ color: '#ff4d30', fontWeight: 600, mb: 3, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                Completion Details
              </Typography>

              <Box sx={{ mb: 3, p: 2.5, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Typography variant="body1" sx={{ mb: 1, color: '#495057' }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>Item:</Box> {formData.thingToMaintain}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, color: '#495057' }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>Type:</Box>{' '}
                  {formData.isRepair && 'Repair'}{formData.isRepair && formData.isReplace && ' & '}{formData.isReplace && 'Replace'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#495057' }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>Original Cost:</Box> ${formData.cost}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Completion Images <span style={{ color: '#ff4d30' }}>*</span>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Take photos of completed work, all sides, and any issues
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {receiveData.receiveImages.map((image, index) => (
                    <Box key={index} sx={{ position: 'relative', width: 120, height: 120, borderRadius: 1, overflow: 'hidden', border: '2px solid #4caf50', '&:hover .delete-btn': { opacity: 1 } }}>
                      <img src={image.preview} alt={`Receive ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton
                        className="delete-btn"
                        onClick={() => handleRemoveReceiveImage(index)}
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', width: 28, height: 28, opacity: 0, transition: 'opacity 0.3s', '&:hover': { bgcolor: 'error.dark' } }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  ))}

                  <Box
                    component="label"
                    sx={{ width: 120, height: 120, border: '2px dashed #4caf50', borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', bgcolor: '#f1f8f4', '&:hover': { bgcolor: '#e8f5e9' } }}
                  >
                    <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">Add Photo</Typography>
                    <input type="file" multiple accept="image/*" onChange={handleReceiveImagesSelect} style={{ display: 'none' }} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                  Damage/Issue Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Describe any issues found during maintenance..."
                  value={receiveData.damageNotes}
                  onChange={(e) => handleReceiveInputChange('damageNotes', e.target.value)}
                  disabled={isSubmitting}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f1f3f5', '& fieldset': { borderColor: '#dee2e6' }, '&:hover fieldset': { borderColor: '#adb5bd' }, '&.Mui-focused fieldset': { borderColor: '#ff4d30' } } }}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                    Extra Charges
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="0.00"
                    value={receiveData.extraCharges}
                    onChange={(e) => handleReceiveInputChange('extraCharges', e.target.value)}
                    disabled={isSubmitting}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f1f3f5', '& fieldset': { borderColor: '#dee2e6' }, '&:hover fieldset': { borderColor: '#adb5bd' }, '&.Mui-focused fieldset': { borderColor: '#ff4d30' } } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                    Completion Date <span style={{ color: '#ff4d30' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    value={receiveData.receiveDate}
                    onChange={(e) => handleReceiveInputChange('receiveDate', e.target.value)}
                    disabled={isSubmitting}
                    error={!!errors.receiveDate}
                    helperText={errors.receiveDate}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f1f3f5', '& fieldset': { borderColor: errors.receiveDate ? '#ff4d30' : '#dee2e6' }, '&:hover fieldset': { borderColor: '#adb5bd' }, '&.Mui-focused fieldset': { borderColor: '#ff4d30' } } }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3, p: 2.5, bgcolor: '#fff3e0', borderRadius: 1, border: '1px solid #ffb74d' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#e65100' }}>Total Cost</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#e65100' }}>${calculateTotalCost().toFixed(2)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Original: ${formData.cost} + Extra: ${receiveData.extraCharges || 0}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                  Completion Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Any additional notes about the maintenance..."
                  value={receiveData.completionNotes}
                  onChange={(e) => handleReceiveInputChange('completionNotes', e.target.value)}
                  disabled={isSubmitting}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f1f3f5', '& fieldset': { borderColor: '#dee2e6' }, '&:hover fieldset': { borderColor: '#adb5bd' }, '&.Mui-focused fieldset': { borderColor: '#ff4d30' } } }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                  Remarks <span style={{ color: '#ff4d30' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter final remarks"
                  value={receiveData.remarks}
                  onChange={(e) => handleReceiveInputChange('remarks', e.target.value)}
                  disabled={isSubmitting}
                  error={!!errors.remarks}
                  helperText={errors.remarks}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f1f3f5', '& fieldset': { borderColor: errors.remarks ? '#ff4d30' : '#dee2e6' }, '&:hover fieldset': { borderColor: '#adb5bd' }, '&.Mui-focused fieldset': { borderColor: '#ff4d30' } } }}
                />
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ color: '#ff4d30', fontWeight: 600, mb: 3, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                Maintenance Details
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                  Thing To Maintain <span style={{ color: '#ff4d30' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Engine, Tires, Brakes"
                  value={formData.thingToMaintain}
                  onChange={(e) => handleInputChange('thingToMaintain', e.target.value)}
                  disabled={isSubmitting}
                  error={!!errors.thingToMaintain}
                  helperText={errors.thingToMaintain}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f1f3f5', '& fieldset': { borderColor: errors.thingToMaintain ? '#ff4d30' : '#dee2e6' }, '&:hover fieldset': { borderColor: '#adb5bd' }, '&.Mui-focused fieldset': { borderColor: '#ff4d30' } } }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                  Maintenance Type <span style={{ color: '#ff4d30' }}>*</span>
                </Typography>
                <FormGroup sx={{ flexDirection: 'row', gap: 2 }}>
                  <FormControlLabel
                    control={<Checkbox checked={formData.isRepair} onChange={(e) => handleInputChange('isRepair', e.target.checked)} disabled={isSubmitting} sx={{ color: '#ff4d30', '&.Mui-checked': { color: '#ff4d30' } }} />}
                    label="Repair"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={formData.isReplace} onChange={(e) => handleInputChange('isReplace', e.target.checked)} disabled={isSubmitting} sx={{ color: '#ff4d30', '&.Mui-checked': { color: '#ff4d30' } }} />}
                    label="Replace"
                  />
                </FormGroup>
                {errors.maintenanceType && (
                  <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5 }}>{errors.maintenanceType}</Typography>
                )}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                    Cost <span style={{ color: '#ff4d30' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter cost"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    disabled={isSubmitting}
                    error={!!errors.cost}
                    helperText={errors.cost}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f1f3f5', '& fieldset': { borderColor: errors.cost ? '#ff4d30' : '#dee2e6' }, '&:hover fieldset': { borderColor: '#adb5bd' }, '&.Mui-focused fieldset': { borderColor: '#ff4d30' } } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#495057', fontWeight: 500, fontSize: '0.95rem' }}>
                    Maintenance Date <span style={{ color: '#ff4d30' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    value={formData.maintenanceDate}
                    onChange={(e) => handleInputChange('maintenanceDate', e.target.value)}
                    disabled={isSubmitting}
                    error={!!errors.maintenanceDate}
                    helperText={errors.maintenanceDate}
                    // Continue from previous...
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f1f3f5', '& fieldset': { borderColor: errors.maintenanceDate ? '#ff4d30' : '#dee2e6' }, '&:hover fieldset': { borderColor: '#adb5bd' }, '&.Mui-focused fieldset': { borderColor: '#ff4d30' } } }}
                  />
                </Box>
              </Box>

              {/* Image Upload Section - Only for Create/Edit */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Maintenance Images / Documents
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {uploadedImages.map((image, index) => (
                    <Box
                      key={image.id || index}
                      sx={{ position: 'relative', width: 120, height: 120, borderRadius: 1, overflow: 'hidden', border: image.isExisting ? '2px solid #1976d2' : '2px solid #e0e0e0', '&:hover .delete-btn': { opacity: 1 } }}
                    >
                      <img src={image.preview} alt={image.fileName || `Image ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                      {image.isExisting && (
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(25, 118, 210, 0.9)', color: 'white', py: 0.5, px: 1, fontSize: '0.65rem', fontWeight: 600, textAlign: 'center' }}>
                          CAR IMAGE
                        </Box>
                      )}

                      {!image.isExisting && (
                        <IconButton
                          className="delete-btn"
                          onClick={() => handleRemoveImage(index)}
                          sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', width: 28, height: 28, opacity: 0, transition: 'opacity 0.3s', '&:hover': { bgcolor: 'error.dark' } }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      )}
                    </Box>
                  ))}

                  <Box
                    component="label"
                    sx={{ width: 120, height: 120, border: '2px dashed #ccc', borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', bgcolor: '#fafafa', '&:hover': { borderColor: '#1976d2', bgcolor: '#e3f2fd' } }}
                  >
                    <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#999', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">Upload</Typography>
                    <input type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                  </Box>
                </Box>

                {uploadedImages.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} selected
                    </Typography>
                    {uploadedImages.filter(img => img.isExisting).length > 0 && (
                      <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                        ({uploadedImages.filter(img => img.isExisting).length} existing)
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </>
          )}

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
                '&:hover': { bgcolor: '#e63c1f', boxShadow: '0 10px 20px rgba(255, 77, 48, 0.45)' },
                '&:disabled': { bgcolor: '#fca5a5', color: 'white' }
              }}
            >
              {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Maintenance' : isReceiveMode ? 'Complete Maintenance' : 'Submit Request'}
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MaintenanceModal;