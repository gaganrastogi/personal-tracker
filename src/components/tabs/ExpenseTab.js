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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, Delete, Category } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

const ExpenseTab = ({ tab, onEntryAdd, onEntryDelete, onEntryUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    item: '',
    amount: '',
    category: ''
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  // Get categories from tab settings or use defaults
  const categories = tab.settings?.categories || [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Health & Fitness',
    'Education',
    'Other'
  ];

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

  // Get entries for selected month
  const getMonthEntries = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return tab.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month - 1;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.item || !formData.amount || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    const entry = {
      date: formData.date,
      item: formData.item.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category
    };

    onEntryAdd(tab.id, entry);

    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      item: '',
      amount: '',
      category: ''
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
        item: '',
        amount: '',
        category: ''
      });
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const monthEntries = getMonthEntries();
  const monthOptions = generateMonthOptions();

  // Calculate statistics
  const totalAmount = monthEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalEntries = monthEntries.length;
  
  // Category-wise summary
  const categorySummary = monthEntries.reduce((acc, entry) => {
    if (!acc[entry.category]) {
      acc[entry.category] = { count: 0, total: 0 };
    }
    acc[entry.category].count += 1;
    acc[entry.category].total += entry.amount;
    return acc;
  }, {});

  // Top spending categories
  const topCategories = Object.entries(categorySummary)
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 3);

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
            variant="outlined"
            startIcon={<Category />}
            onClick={() => setShowCategoryManager(true)}
          >
            Categories
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={toggleForm}
          >
            Add Expense
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
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    ₹{totalAmount.toFixed(2)}
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
                  <Typography variant="h6">₹</Typography>
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
                    Total Entries
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {totalEntries}
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
                  <Typography variant="h6">📝</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="rgba(255,255,255,0.8)" gutterBottom variant="subtitle2">
                    Average per Day
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    ₹{(totalAmount / Math.max(1, totalEntries)).toFixed(2)}
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
                  <Typography variant="h6">📊</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1e293b' }}>
              Top Spending Categories
            </Typography>
          </Grid>
          {topCategories.map(([category, data], index) => (
            <Grid item xs={12} sm={4} key={category}>
              <Card sx={{ 
                background: index === 0 ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                         index === 1 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                         'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white'
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="rgba(255,255,255,0.8)" gutterBottom variant="subtitle2">
                        #{index + 1} {category}
                      </Typography>
                      <Typography variant="h5" component="div" fontWeight="bold">
                        ₹{data.total.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.8)">
                        {data.count} purchases
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
                      <Typography variant="h6">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Expense Form */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add Expense Entry</Typography>
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
                <TextField
                  name="item"
                  label="Item/Description"
                  value={formData.item}
                  onChange={handleChange}
                  placeholder="e.g., Coffee, Groceries..."
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  name="amount"
                  label="Amount (₹)"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  fullWidth
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button onClick={toggleForm}>Cancel</Button>
                  <Button type="submit" variant="contained">Add Expense</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Expenses Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Item</strong></TableCell>
              <TableCell align="center"><strong>Category</strong></TableCell>
              <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    No expenses for this month. Add your first expense entry!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              monthEntries.map(entry => (
                <TableRow key={entry.id} hover>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.item}</TableCell>
                  <TableCell align="center">
                    <Chip label={entry.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      ₹{entry.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
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
            {/* Total Row */}
            {monthEntries.length > 0 && (
              <TableRow sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                <TableCell colSpan={3}><strong>TOTAL</strong></TableCell>
                <TableCell align="right">
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="center">-</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Category Manager Dialog */}
      <Dialog open={showCategoryManager} onClose={() => setShowCategoryManager(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Categories</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Categories help you organize and analyze your expenses better.
          </Typography>
          <Grid container spacing={1}>
            {categories.map(category => (
              <Grid item xs={12} sm={6} key={category}>
                <Chip label={category} variant="outlined" sx={{ m: 0.5 }} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCategoryManager(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseTab;
