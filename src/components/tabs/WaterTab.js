import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

const WaterTab = ({ tab, onEntryAdd, onEntryDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    received: true
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  // Generate month options (last 12 months + next 6 months)
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = -12; i <= 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  // Generate date entries for selected month
  const generateMonthEntries = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const entries = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day).toISOString().split('T')[0];
      const existingEntry = tab.entries.find(entry => entry.date === date);
      
      if (existingEntry) {
        entries.push(existingEntry);
      } else {
        entries.push({
          id: `temp-${date}`,
          date,
          received: false,
          isNew: true
        });
      }
    }
    return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    const entry = {
      date: formData.date,
      received: formData.received
    };

    onEntryAdd(tab.id, entry);

    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      received: true
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        received: true
      });
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleCellChange = (entry, received) => {
    if (entry.isNew && received) {
      // Add new entry
      const newEntry = {
        date: entry.date,
        received: true
      };
      onEntryAdd(tab.id, newEntry);
    } else if (!entry.isNew) {
      // Update existing entry
      const updatedEntry = { ...entry, received };
      // This would require an onEntryUpdate prop - for now we'll just add/delete
      if (!received) {
        onEntryDelete(tab.id, entry.id);
      }
    }
  };

  const monthEntries = generateMonthEntries();
  const monthOptions = generateMonthOptions();

  const receivedDays = monthEntries.filter(entry => entry.received).length;
  const totalDays = monthEntries.length;
  const missedDays = totalDays - receivedDays;

  return (
    <Box>
      {/* Header with Month Selector */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" component="h2">
          {tab.name}
        </Typography>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Select Month"
            >
              {monthOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={toggleForm}
          >
            Add Entry
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="rgba(255,255,255,0.8)" gutterBottom variant="subtitle2">
                    Total Days
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {totalDays}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h6">📅</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="rgba(255,255,255,0.8)" gutterBottom variant="subtitle2">
                    Water Received
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {receivedDays}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h6">💧</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="rgba(255,255,255,0.8)" gutterBottom variant="subtitle2">
                    Days Missed
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {missedDays}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h6">❌</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Entry Form */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add Water Entry</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  name="date"
                  label="Date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="received"
                      checked={formData.received}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Water Received"
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button onClick={toggleForm}>Cancel</Button>
                  <Button type="submit" variant="contained">Add Entry</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Monthly Calendar Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Water Received</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthEntries.map((entry) => (
              <TableRow 
                key={entry.id} 
                sx={{ 
                  backgroundColor: entry.received ? '#e8f5e8' : 'inherit',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(entry.date)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={entry.received || false}
                    onChange={(e) => handleCellChange(entry, e.target.checked)}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="center">
                  {!entry.isNew && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onEntryDelete(tab.id, entry.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <TableCell><strong>TOTAL</strong></TableCell>
              <TableCell align="center">
                <Chip label={receivedDays} color="primary" size="small" />
              </TableCell>
              <TableCell align="center">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WaterTab;