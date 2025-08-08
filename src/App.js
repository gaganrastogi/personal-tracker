import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import { Add, Download } from '@mui/icons-material';
import TabManager from './components/TabManager';
import AddTabModal from './components/AddTabModal';
import { exportToPDF } from './utils/pdfExport';
import { generateId } from './utils/helpers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#388e3c',
      light: '#66bb6a',
      dark: '#2e7d32',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#1e293b',
            borderBottom: '2px solid #e2e8f0',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f1f5f9',
          padding: '12px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTabs = localStorage.getItem('trackerTabs');
    const savedActiveTab = localStorage.getItem('activeTabId');
    
    if (savedTabs) {
      const parsedTabs = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      
      if (savedActiveTab && parsedTabs.find(tab => tab.id === savedActiveTab)) {
        setActiveTabId(savedActiveTab);
      } else if (parsedTabs.length > 0) {
        setActiveTabId(parsedTabs[0].id);
      }
    }
  }, []);

  // Save data to localStorage whenever tabs or activeTabId changes
  useEffect(() => {
    localStorage.setItem('trackerTabs', JSON.stringify(tabs));
    if (activeTabId) {
      localStorage.setItem('activeTabId', activeTabId);
    }
  }, [tabs, activeTabId]);

  const addTab = (tabData) => {
    const newTab = {
      id: generateId(),
      name: tabData.name,
      type: tabData.type,
      entries: [],
      settings: getDefaultSettings(tabData.type)
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setShowAddModal(false);
  };

  const getDefaultSettings = (type) => {
    switch(type) {
      case 'milk':
        return { defaultRate: 60 };
      case 'petrol':
        return { defaultRate: 100 };
      default:
        return {};
    }
  };

  const updateTab = (tabId, updates) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  };

  const deleteTab = (tabId) => {
    if (window.confirm('Are you sure you want to delete this tab? All data will be lost.')) {
      setTabs(prev => {
        const newTabs = prev.filter(tab => tab.id !== tabId);
        
        if (activeTabId === tabId) {
          setActiveTabId(newTabs.length > 0 ? newTabs[0].id : null);
        }
        
        return newTabs;
      });
    }
  };

  const addEntry = (tabId, entryData) => {
    const entry = {
      id: generateId(),
      ...entryData,
      timestamp: new Date().toISOString()
    };
    
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, entries: [entry, ...tab.entries] }
        : tab
    ));
  };

  const updateEntry = (tabId, entryId, updates) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? {
            ...tab,
            entries: tab.entries.map(entry => 
              entry.id === entryId ? { ...entry, ...updates } : entry
            )
          }
        : tab
    ));
  };

  const deleteEntry = (tabId, entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setTabs(prev => prev.map(tab => 
        tab.id === tabId 
          ? { ...tab, entries: tab.entries.filter(entry => entry.id !== entryId) }
          : tab
      ));
    }
  };

  const handleExportPDF = () => {
    if (tabs.length === 0) {
      alert('No data to export');
      return;
    }
    exportToPDF(tabs);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Tracker
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Add />}
            onClick={() => setShowAddModal(true)}
            sx={{ mr: 1 }}
          >
            Add Tab
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Download />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {tabs.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight="60vh"
            textAlign="center"
          >
            <Typography variant="h4" gutterBottom color="text.secondary">
              Welcome to Personal Tracker!
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              Start by adding your first tracking tab
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<Add />}
              onClick={() => setShowAddModal(true)}
            >
              Add Your First Tab
            </Button>
          </Box>
        ) : (
          <TabManager
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSwitch={setActiveTabId}
            onTabUpdate={updateTab}
            onTabDelete={deleteTab}
            onEntryAdd={addEntry}
            onEntryUpdate={updateEntry}
            onEntryDelete={deleteEntry}
          />
        )}
      </Container>

      {showAddModal && (
        <AddTabModal
          onClose={() => setShowAddModal(false)}
          onAdd={addTab}
        />
      )}
    </ThemeProvider>
  );
}

export default App;