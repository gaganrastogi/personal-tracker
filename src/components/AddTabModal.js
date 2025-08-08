import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { Add, LocalDrink, LocalGasStation, Build, WaterDrop, CheckCircle, Settings, AttachMoney } from '@mui/icons-material';

const AddTabModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: ''
  });

  const tabTypes = [
    { value: 'milk', label: 'Milk Tracking', icon: <LocalDrink />, description: 'Track daily milk delivery and payments' },
    { value: 'petrol', label: 'Petrol/Fuel Tracking', icon: <LocalGasStation />, description: 'Monitor fuel expenses and consumption' },
    { value: 'service', label: 'Bike/Car Service', icon: <Build />, description: 'Record vehicle maintenance and service costs' },
    { value: 'water', label: 'Water Tracking', icon: <WaterDrop />, description: 'Track water delivery schedule' },
    { value: 'todo', label: 'Todo List', icon: <CheckCircle />, description: 'Manage tasks and daily activities' },
    { value: 'expense', label: 'Daily Expenses', icon: <AttachMoney />, description: 'Track daily expenses with categories' },
    { value: 'custom', label: 'Custom Tracking', icon: <Settings />, description: 'Create your own tracking category' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.type) {
      alert('Please fill all required fields');
      return;
    }

    onAdd(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedType = tabTypes.find(type => type.value === formData.type);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Add color="primary" />
          <Typography variant="h6">Add New Tab</Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              name="name"
              label="Tab Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Daily Milk Track"
              required
              autoFocus
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Tab Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Tab Type"
              >
                {tabTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center" gap={2}>
                      {type.icon}
                      <Box>
                        <Typography variant="body1">{type.label}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedType && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {selectedType.icon}
                  <Typography variant="subtitle2" color="primary">
                    {selectedType.label}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {selectedType.description}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<Add />}>
            Create Tab
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTabModal;