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
  Checkbox,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

const MilkTab = ({ tab, onEntryAdd, onEntryDelete, onTabUpdate, onEntryUpdate }) => {
  const [defaultRate, setDefaultRate] = useState(tab.settings.defaultRate || 55);
  const [defaultQuantity, setDefaultQuantity] = useState(tab.settings.defaultQuantity || 3);
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
          rate: defaultRate,
          received: false,
          quantity: 0,
          total: 0,
          isNew: true
        });
      }
    }
    return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const monthEntries = generateMonthEntries();
  const monthOptions = generateMonthOptions();

  const handleAddEntry = (date, received, quantity, rate) => {
    const entry = {
      date,
      rate: parseFloat(rate),
      received,
      quantity: received ? parseFloat(quantity) : 0,
      total: received ? (parseFloat(rate) * parseFloat(quantity)) : 0
    };

    onEntryAdd(tab.id, entry);
  };

  const handleUpdateEntry = (entryId, updates) => {
    const updatedEntry = {
      ...updates,
      total: updates.received ? (parseFloat(updates.rate) * parseFloat(updates.quantity)) : 0
    };
    onEntryUpdate(tab.id, entryId, updatedEntry);
  };

  const handleCellChange = (entry, field, value) => {
    if (entry.isNew && field === 'received' && value) {
      // Add new entry
      handleAddEntry(entry.date, true, defaultQuantity, defaultRate);
    } else if (!entry.isNew) {
      // Update existing entry
      const updates = { ...entry, [field]: value };
      if (field === 'rate' || field === 'quantity') {
        updates[field] = parseFloat(value) || 0;
      }
      handleUpdateEntry(entry.id, updates);
    }
  };

  const handleDefaultRateChange = (newRate) => {
    setDefaultRate(newRate);
    onTabUpdate(tab.id, {
      settings: { ...tab.settings, defaultRate: newRate, defaultQuantity }
    });
  };

  const handleDefaultQuantityChange = (newQuantity) => {
    setDefaultQuantity(newQuantity);
    onTabUpdate(tab.id, {
      settings: { ...tab.settings, defaultRate, defaultQuantity: newQuantity }
    });
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const totalAmount = monthEntries.reduce((sum, entry) => sum + (entry.total || 0), 0);
  const totalQuantity = monthEntries.reduce((sum, entry) => sum + (entry.received ? entry.quantity : 0), 0);
  const daysReceived = monthEntries.filter(entry => entry.received).length;

  return (
    <Box>
      {/* Header with Month Selector and Settings */}
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
          <TextField
            label="Default Rate (₹/L)"
            type="number"
            size="small"
            value={defaultRate}
            onChange={(e) => handleDefaultRateChange(parseFloat(e.target.value))}
            sx={{ width: 140 }}
          />
          <TextField
            label="Default Quantity (L)"
            type="number"
            size="small"
            value={defaultQuantity}
            onChange={(e) => handleDefaultQuantityChange(parseFloat(e.target.value))}
            sx={{ width: 140 }}
          />
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
                    Total Amount
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
                    Total Quantity
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {totalQuantity.toFixed(1)}L
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
                  <Typography variant="h6">L</Typography>
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
                    Days Received
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {daysReceived}
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
                  <Typography variant="h6">✓</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Spreadsheet Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Received</strong></TableCell>
              <TableCell align="center"><strong>Quantity (L)</strong></TableCell>
              <TableCell align="center"><strong>Rate (₹/L)</strong></TableCell>
              <TableCell align="center"><strong>Total (₹)</strong></TableCell>
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
                    onChange={(e) => handleCellChange(entry, 'received', e.target.checked)}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    size="small"
                    value={entry.received ? entry.quantity : ''}
                    onChange={(e) => handleCellChange(entry, 'quantity', e.target.value)}
                    disabled={!entry.received}
                    sx={{ width: 80 }}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    size="small"
                    value={entry.received ? entry.rate : ''}
                    onChange={(e) => handleCellChange(entry, 'rate', e.target.value)}
                    disabled={!entry.received}
                    sx={{ width: 80 }}
                    inputProps={{ step: 0.01, min: 0 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="bold">
                    {entry.received ? `₹${entry.total.toFixed(2)}` : '-'}
                  </Typography>
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
                <Chip label={daysReceived} color="primary" size="small" />
              </TableCell>
              <TableCell align="center">
                <strong>{totalQuantity.toFixed(1)}L</strong>
              </TableCell>
              <TableCell align="center">-</TableCell>
              <TableCell align="center">
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </TableCell>
              <TableCell align="center">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MilkTab;