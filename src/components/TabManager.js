import React, { useState } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  IconButton, 
  TextField,
  Paper,
  Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';
import MilkTab from './tabs/MilkTab';
import PetrolTab from './tabs/PetrolTab';
import ServiceTab from './tabs/ServiceTab';
import WaterTab from './tabs/WaterTab';
import TodoTab from './tabs/TodoTab';
import ExpenseTab from './tabs/ExpenseTab';

const TabManager = ({
  tabs,
  activeTabId,
  onTabSwitch,
  onTabUpdate,
  onTabDelete,
  onEntryAdd,
  onEntryUpdate,
  onEntryDelete
}) => {
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const handleTabNameEdit = (tabId, currentName) => {
    setEditingTabId(tabId);
    setEditingName(currentName);
  };

  const handleTabNameSave = (tabId) => {
    if (editingName.trim()) {
      onTabUpdate(tabId, { name: editingName.trim() });
    }
    setEditingTabId(null);
    setEditingName('');
  };

  const handleTabNameCancel = () => {
    setEditingTabId(null);
    setEditingName('');
  };

  const renderTabContent = (tab) => {
    const commonProps = {
      tab,
      onEntryAdd,
      onEntryUpdate,
      onEntryDelete,
      onTabUpdate
    };

    switch(tab.type) {
      case 'milk':
        return <MilkTab {...commonProps} />;
      case 'petrol':
        return <PetrolTab {...commonProps} />;
      case 'service':
        return <ServiceTab {...commonProps} />;
      case 'water':
        return <WaterTab {...commonProps} />;
      case 'todo':
        return <TodoTab {...commonProps} />;
      case 'expense':
        return <ExpenseTab {...commonProps} />;
      default:
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" component="h2">
                {tab.name}
              </Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Custom tracking tab
              </Typography>
              <Typography color="textSecondary">
                Add your own implementation here
              </Typography>
            </Paper>
          </Box>
        );
    }
  };

  return (
    <Paper elevation={2}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabs.findIndex(tab => tab.id === activeTabId)} 
          onChange={(event, newValue) => onTabSwitch(tabs[newValue].id)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {editingTabId === tab.id ? (
                    <TextField
                      size="small"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleTabNameSave(tab.id)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleTabNameSave(tab.id);
                        } else if (e.key === 'Escape') {
                          handleTabNameCancel();
                        }
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      sx={{ minWidth: '120px' }}
                    />
                  ) : (
                    <span onDoubleClick={() => handleTabNameEdit(tab.id, tab.name)}>
                      {tab.name}
                    </span>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabDelete(tab.id);
                    }}
                    sx={{ ml: 1, p: 0.5 }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {activeTab && renderTabContent(activeTab)}
      </Box>
    </Paper>
  );
};

export default TabManager;