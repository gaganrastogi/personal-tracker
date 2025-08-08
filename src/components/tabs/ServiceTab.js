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
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

const ServiceTab = ({ tab, onEntryAdd, onEntryDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    expense: '',
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.expense) {
      alert('Please fill all required fields');
      return;
    }

    const entry = {
      date: formData.date,
      expense: parseFloat(formData.expense),
      note: formData.note.trim()
    };

    onEntryAdd(tab.id, entry);

    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      expense: '',
      note: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        expense: '',
        note: ''
      });
    }
  };

  const totalExpense = tab.entries.reduce((sum, entry) => sum + entry.expense, 0);
  const totalEntries = tab.entries.length;

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
          onClick={toggleForm}
        >
          Add Entry
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expense
              </Typography>
              <Typography variant="h5" component="div">
                ₹{totalExpense.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Entries
              </Typography>
              <Typography variant="h5" component="div">
                {totalEntries}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Entry Form */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add Service Entry</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  name="date"
                  label="Service Date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  name="expense"
                  label="Total Expense (₹)"
                  value={formData.expense}
                  onChange={handleChange}
                  required
                  fullWidth
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="note"
                  label="Notes (Repaired Parts)"
                  value={formData.note}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="e.g., Oil change, brake pads, chain cleaning..."
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

      {/* Entries List */}
      <Box>
        {tab.entries.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="h6">
              No entries yet. Add your first service record!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {tab.entries.map(entry => (
              <Grid item xs={12} key={entry.id}>
                <Card elevation={1}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {formatDate(entry.date)}
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                          ₹{entry.expense.toFixed(2)}
                        </Typography>
                        {entry.note && (
                          <Typography variant="body2" color="textSecondary">
                            {entry.note}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => onEntryDelete(tab.id, entry.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ServiceTab;