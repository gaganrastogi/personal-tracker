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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

const TodoTab = ({ tab, onEntryAdd, onEntryDelete, onEntryUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    task: '',
    dueDate: '',
    priority: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.task.trim()) {
      alert('Please enter a task');
      return;
    }

    const entry = {
      task: formData.task.trim(),
      dueDate: formData.dueDate,
      priority: formData.priority,
      completed: false
    };

    onEntryAdd(tab.id, entry);

    setShowForm(false);
    setFormData({
      task: '',
      dueDate: '',
      priority: 'medium'
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
        task: '',
        dueDate: '',
        priority: 'medium'
      });
    }
  };

  const toggleCompletion = (entryId, currentStatus) => {
    onEntryUpdate(tab.id, entryId, { completed: !currentStatus });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const completedTodos = tab.entries.filter(entry => entry.completed).length;
  const totalTodos = tab.entries.length;
  const pendingTodos = totalTodos - completedTodos;

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
          Add Todo
        </Button>
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
                    Total Todos
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {totalTodos}
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
                  <Typography variant="h6">📋</Typography>
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
                    Completed
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {completedTodos}
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
                  <Typography variant="h6">✅</Typography>
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
                    Pending
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {pendingTodos}
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
                  <Typography variant="h6">⏳</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Todo Form */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add Todo Item</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="task"
                  label="Task"
                  value={formData.task}
                  onChange={handleChange}
                  placeholder="Enter your task..."
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  name="dueDate"
                  label="Due Date (Optional)"
                  value={formData.dueDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button onClick={toggleForm}>Cancel</Button>
                  <Button type="submit" variant="contained">Add Todo</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Todos List */}
      <Box>
        {tab.entries.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="h6">
              No todos yet. Add your first task!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {tab.entries.map(entry => (
              <Grid item xs={12} key={entry.id}>
                <Card 
                  elevation={1} 
                  sx={{ 
                    opacity: entry.completed ? 0.7 : 1,
                    backgroundColor: entry.completed ? '#f8f9fa' : 'white'
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" alignItems="flex-start" flex={1} gap={2}>
                        <Checkbox
                          checked={entry.completed}
                          onChange={() => toggleCompletion(entry.id, entry.completed)}
                          color="primary"
                        />
                        <Box flex={1}>
                          <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{ 
                              textDecoration: entry.completed ? 'line-through' : 'none',
                              color: entry.completed ? 'text.secondary' : 'text.primary'
                            }}
                          >
                            {entry.task}
                          </Typography>
                          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                            {entry.dueDate && (
                              <Chip 
                                label={`Due: ${formatDate(entry.dueDate)}`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                            <Chip 
                              label={`${entry.priority.toUpperCase()} Priority`}
                              color={getPriorityColor(entry.priority)}
                              size="small"
                            />
                          </Box>
                        </Box>
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

export default TodoTab;