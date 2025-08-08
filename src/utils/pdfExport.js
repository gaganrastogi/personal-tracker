import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './helpers';

export const exportToPDF = (tabs) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Personal Tracker Export', 20, 20);
  
  let yPosition = 40;
  
  tabs.forEach((tab, tabIndex) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Tab title
    doc.setFontSize(16);
    doc.text(`${tab.name} (${tab.type})`, 20, yPosition);
    yPosition += 10;
    
    if (tab.entries.length === 0) {
      doc.setFontSize(12);
      doc.text('No entries', 30, yPosition);
      yPosition += 15;
    } else {
      // Create table data based on tab type
      const tableData = getTableDataForTab(tab);
      
      autoTable(doc, {
        startY: yPosition,
        head: [tableData.headers],
        body: tableData.rows,
        margin: { left: 20 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [52, 152, 219] }
      });
      
      yPosition = doc.lastAutoTable.finalY + 15;
    }
  });
  
  // Save the PDF
  const fileName = `personal-tracker-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Get table data for different tab types
const getTableDataForTab = (tab) => {
  switch(tab.type) {
    case 'milk':
      return {
        headers: ['Date', 'Received', 'Quantity (L)', 'Rate (₹/L)', 'Total (₹)'],
        rows: tab.entries.map(entry => [
          formatDate(entry.date),
          entry.received ? 'Yes' : 'No',
          entry.received ? entry.quantity : '-',
          entry.rate,
          entry.received ? entry.total.toFixed(2) : '0.00'
        ])
      };
    case 'petrol':
      return {
        headers: ['Date', 'Quantity (L)', 'Rate (₹/L)', 'Total (₹)', 'Odometer'],
        rows: tab.entries.map(entry => [
          formatDate(entry.date),
          entry.quantity,
          entry.rate,
          entry.total.toFixed(2),
          entry.meterReading || '-'
        ])
      };
    case 'service':
      return {
        headers: ['Date', 'Expense (₹)', 'Notes'],
        rows: tab.entries.map(entry => [
          formatDate(entry.date),
          entry.expense.toFixed(2),
          entry.note || '-'
        ])
      };
    case 'water':
      return {
        headers: ['Date', 'Water Received'],
        rows: tab.entries.map(entry => [
          formatDate(entry.date),
          entry.received ? 'Yes' : 'No'
        ])
      };
    case 'todo':
      return {
        headers: ['Task', 'Priority', 'Due Date', 'Status'],
        rows: tab.entries.map(entry => [
          entry.task,
          entry.priority.toUpperCase(),
          entry.dueDate ? formatDate(entry.dueDate) : '-',
          entry.completed ? 'Completed' : 'Pending'
        ])
      };
    case 'expense':
      return {
        headers: ['Date', 'Item', 'Category', 'Amount (₹)'],
        rows: tab.entries.map(entry => [
          formatDate(entry.date),
          entry.item,
          entry.category,
          entry.amount.toFixed(2)
        ])
      };
    default:
      return {
        headers: ['Data'],
        rows: [['Custom tab - no export format defined']]
      };
  }
};