import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

const PetrolTab = ({ tab, onEntryAdd, onEntryDelete, onTabUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    rate: tab.settings.defaultRate || 100,
    total: '',
    meterReading: '',
    quantity: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.rate || !formData.total) {
      alert('Please fill all required fields');
      return;
    }

    const quantity = parseFloat(formData.total) / parseFloat(formData.rate);
    const entry = {
      date: formData.date,
      rate: parseFloat(formData.rate),
      total: parseFloat(formData.total),
      quantity: quantity,
      meterReading: formData.meterReading
    };

    onEntryAdd(tab.id, entry);
    
    // Update default rate
    onTabUpdate(tab.id, {
      settings: { ...tab.settings, defaultRate: parseFloat(formData.rate) }
    });

    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      rate: parseFloat(formData.rate),
      total: '',
      meterReading: '',
      quantity: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const totalAmount = tab.entries.reduce((sum, entry) => sum + entry.total, 0);
  const totalQuantity = tab.entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const averageRate = tab.entries.length > 0 ? totalAmount / totalQuantity : 0;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          {tab.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowForm(!showForm)}
        >
          Add Entry
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h5" component="div">
                ₹{totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Quantity
              </Typography>
              <Typography variant="h5" component="div">
                {totalQuantity.toFixed(1)}L
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Rate
              </Typography>
              <Typography variant="h5" component="div">
                ₹{averageRate.toFixed(2)}/L
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Entry Form */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add Petrol Entry</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="number"
                  name="rate"
                  label="Rate (₹/L)"
                  value={formData.rate}
                  onChange={handleChange}
                  required
                  fullWidth
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="number"
                  name="total"
                  label="Total Paid (₹)"
                  value={formData.total}
                  onChange={handleChange}
                  required
                  fullWidth
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="number"
                  name="meterReading"
                  label="Odometer Reading"
                  value={formData.meterReading}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Current km reading"
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" variant="contained">Add Entry</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Entries Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Quantity (L)</strong></TableCell>
              <TableCell align="center"><strong>Rate (₹/L)</strong></TableCell>
              <TableCell align="center"><strong>Total (₹)</strong></TableCell>
              <TableCell align="center"><strong>Odometer</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tab.entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    No entries yet. Add your first petrol tracking entry!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tab.entries.map(entry => (
                <TableRow key={entry.id} hover>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell align="center">{entry.quantity.toFixed(2)}</TableCell>
                  <TableCell align="center">₹{entry.rate}</TableCell>
                  <TableCell align="center">₹{entry.total.toFixed(2)}</TableCell>
                  <TableCell align="center">{entry.meterReading || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onEntryDelete(tab.id, entry.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PetrolTab;