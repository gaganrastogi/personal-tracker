# 🎯 Personal Tracker - Ultimate Daily Life Management App

A modern, beautiful React application for tracking daily activities, expenses, and personal tasks with a unified Material-UI interface.

![Personal Tracker](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.1-blue?style=for-the-badge&logo=mui)
![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)

## ✨ Features

### 📊 **Multi-Tab Tracking System**
- **Milk Tracking**: Daily milk delivery with quantity, rate, and payment tracking
- **Water Tracking**: Monthly water delivery schedule with visual calendar
- **Petrol/Fuel Tracking**: Fuel expenses with odometer readings
- **Service Tracking**: Vehicle maintenance and service cost records
- **Todo List**: Task management with priorities and completion tracking
- **Daily Expenses**: Categorized expense tracking with spending analysis

### 🎨 **Modern UI/UX**
- **Beautiful Gradients**: Eye-catching summary cards with gradient backgrounds
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Material Design**: Consistent Material-UI components throughout
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Color-Coded Categories**: Visual distinction for different data types

### 📈 **Smart Analytics**
- **Monthly Views**: Select any month to view historical data
- **Summary Cards**: Key metrics displayed with beautiful gradients
- **Category Analysis**: Top spending categories with rankings
- **Data Preservation**: Safe switching between months without data loss
- **PDF Export**: Generate comprehensive reports in PDF format

### 🔧 **Advanced Features**
- **Local Storage**: Data persists between browser sessions
- **Real-time Updates**: Instant calculations and statistics
- **Form Validation**: Input validation and error handling
- **Responsive Tables**: Scrollable tables with sticky headers
- **Search & Filter**: Easy data navigation and filtering

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gaganrastogi/personal-tracker.git
   cd personal-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 How to Use

### 1. **Create Your First Tab**
- Click "Add Tab" in the header
- Choose a tracking type (Milk, Water, Expenses, etc.)
- Give your tab a meaningful name

### 2. **Milk Tracking**
- Select month from dropdown
- Check/uncheck "Received" for each day
- Enter quantity and rate for received days
- View total amount and statistics

### 3. **Water Tracking**
- Select month to view calendar
- Check/uncheck water received for each day
- Track missed days and delivery schedule

### 4. **Daily Expenses**
- Add expenses with categories
- View spending analysis by category
- Track monthly spending patterns
- See top spending categories

### 5. **Export Data**
- Click "Export PDF" to generate reports
- Download comprehensive PDF with all your data

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **UI Framework**: Material-UI (MUI) 7.3.1
- **Icons**: Material-UI Icons + Lucide React
- **PDF Generation**: jsPDF + jspdf-autotable
- **Styling**: Material-UI Theme + Custom CSS
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: Local Storage

## 📁 Project Structure

```
src/
├── components/
│   ├── AddTabModal.js          # Tab creation modal
│   ├── TabManager.js           # Tab navigation and management
│   └── tabs/
│       ├── MilkTab.js          # Milk tracking interface
│       ├── WaterTab.js         # Water tracking interface
│       ├── PetrolTab.js        # Fuel tracking interface
│       ├── ServiceTab.js       # Service tracking interface
│       ├── TodoTab.js          # Todo list interface
│       └── ExpenseTab.js       # Expense tracking interface
├── utils/
│   ├── helpers.js              # Utility functions
│   └── pdfExport.js            # PDF generation logic
├── App.js                      # Main application component
└── index.js                    # Application entry point
```

## 🎨 UI Components

### Summary Cards
- **Gradient Backgrounds**: Beautiful color gradients for visual appeal
- **Icons**: Relevant emojis and Material-UI icons
- **Statistics**: Key metrics prominently displayed
- **Hover Effects**: Smooth animations on interaction

### Tables
- **Sticky Headers**: Headers remain visible while scrolling
- **Color Coding**: Different colors for different states
- **Responsive Design**: Adapts to different screen sizes
- **Interactive Elements**: Checkboxes, buttons, and form controls

### Forms
- **Material Design**: Consistent with Material-UI guidelines
- **Validation**: Real-time input validation
- **Responsive Layout**: Grid-based responsive design
- **Accessibility**: Proper labels and ARIA attributes

## 📊 Data Management

### Local Storage
- **Automatic Saving**: Data saved automatically on changes
- **Data Persistence**: Survives browser restarts
- **No Server Required**: Works completely offline
- **Privacy**: All data stored locally on your device

### Export Features
- **PDF Reports**: Comprehensive data export
- **Formatted Tables**: Clean, readable table layouts
- **Multiple Tabs**: All tabs included in single PDF
- **Date Stamping**: Files named with current date

## 🔮 Future Enhancements

- [ ] **Cloud Sync**: Google Drive/Dropbox integration
- [ ] **Charts & Graphs**: Visual data representation
- [ ] **Reminders**: Push notifications for tasks
- [ ] **Multi-language**: Internationalization support
- [ ] **Dark Mode**: Theme switching capability
- [ ] **Data Import**: CSV/Excel import functionality
- [ ] **Backup/Restore**: Data backup and restore features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gagan Rastogi**
- GitHub: [@gaganrastogi](https://github.com/gaganrastogi)
- Portfolio: [gaganrastogi.github.io](https://gaganrastogi.github.io)

## 🙏 Acknowledgments

- **Material-UI Team**: For the amazing React component library
- **React Community**: For the excellent documentation and support
- **jsPDF Team**: For the PDF generation capabilities

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ by [Gagan Rastogi](https://github.com/gaganrastogi)
