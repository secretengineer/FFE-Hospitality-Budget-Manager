# 🏨 FF&E Hospitality BudgetBuilder™

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/license-Proprietary-red.svg?style=for-the-badge)

> **The ultimate professional budgeting and specification tool for the hospitality design industry.**

The **FF&E Hospitality BudgetBuilder™** transforms the complex workflow of managing Furniture, Fixtures, and Equipment into a seamless, visual experience. It combines the flexibility of a spreadsheet with the power of a dedicated specification platform—running entirely in your browser with zero installation required.

---

## ✨ New in Version 1.1

### 📘 **Integrated Spec Book Generator**
Turn your budget into a client-ready specification book with one click.
*   **Auto-Generated Layouts**: Creates professional spec sheets from your budget data.
*   **Visual Richness**: Supports high-quality product images and multiple attachments per item.
*   **Smart Formatting**: Optimized for landscape printing with a clean, compact design that saves paper.

### 🎨 **Visual Status Tracking**
Say goodbye to text-heavy spreadsheets.
*   **Color-Coded Indicators**: Instantly see item status (Draft, Approved, In Progress, Received, Installed).
*   **Interactive Legend**: A clear visual guide helps stakeholders understand project progress at a glance.

---

## 🚀 Key Features

### 💰 **Intelligent Budgeting**
*   **Real-Time Financials**: Subtotals, taxes, and grand totals update instantly as you work.
*   **Variance Analysis**: Live "Over/Under" indicators keep your budget on track.
*   **Flexible Tax Rates**: Configure sales tax percentages globally or per project.

### 🛠️ **Advanced Item Management**
*   **Detailed Specifications**: Track everything from dimensions and lead times to detailed finish notes.
*   **File Attachments**: Attach PDFs, cut sheets, and images directly to line items.
*   **Column Control**: Toggle visibility for columns like "Dimensions" or "Lead Time" to tailor your view.
*   **Drag-and-Drop**: Reorder items and categories effortlessly (Coming Soon).

### 🖨️ **Professional Output**
*   **Print-Perfect**: Custom CSS ensures clean margins (1" top/bottom) and proper page breaks.
*   **Cross-Referencing**: Automatically adds "(See Spec Book)" notes to printed budgets when detailed specs exist.
*   **Branding**: Upload your own company logo and customize headers for a white-label experience.

### 💾 **Data Security & Persistence**
*   **Local First**: Save your work as `.ffe` files directly to your device—your data never leaves your control.
*   **Auto-Save**: Continuous background saving prevents data loss during browser crashes.
*   **Dark Mode**: A fully supported dark theme for late-night design sessions.

---

## 📖 User Guide

### **1. Getting Started**
*   **Project Setup**: Click on any header text (Project Name, Client, Address) to edit inline.
*   **Logo Upload**: Click the placeholder logo to upload your own company branding.
*   **View Options**: Use the "View Options" menu to show/hide specific columns like *Dimensions* or *Status*.

### **2. Managing Items**
*   **Adding Items**: Hover over any row to see the "Insert Row" button, or add a new section at the bottom.
*   **Status Updates**: Click the colored circle in the Status column to update an item's lifecycle state.
*   **Specifications**: Click the "Add Specs" button to open the detailed editor, where you can add descriptions and upload images.

### **3. The Spec Book**
*   Navigate to the **Spec Book** view via the top menu.
*   Review the auto-generated layout which combines your budget data with uploaded images.
*   Click **Print Spec Book** to generate a PDF. The layout is optimized for **Landscape** orientation.

### **4. Saving & Exporting**
*   **Save**: Creates a `.ffe` file containing all your data, including images and attachments.
*   **Print/PDF**: Use the Print button to generate a clean budget report.
    *   *Note: Select "Background Graphics" in your print settings to ensure status colors appear correctly.*

---

## 💻 Technical Overview

Built for performance and maintainability using the latest web standards.

### **Tech Stack**
| Component | Technology | Description |
|-----------|------------|-------------|
| **Core** | [React 19](https://react.dev/) | Latest React features including Hooks and Functional Components |
| **Build** | [Vite 7](https://vitejs.dev/) | Lightning-fast HMR and optimized production builds |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS for rapid UI development |
| **Icons** | [Lucide React](https://lucide.dev/) | Beautiful, consistent SVG icons |

### **Project Structure**
```bash
src/
├── App.jsx          # Main Budget View & Logic
├── SpecBookView.jsx # Specification Book Generation Logic
├── App.css          # Global styles & Print media queries
├── main.jsx         # Application Entry Point
└── assets/          # Static resources
```

### **Browser Support**
This application leverages the **File System Access API** for a native-app-like "Save" experience.
*   ✅ **Recommended**: Google Chrome, Microsoft Edge, Opera
*   ⚠️ **Limited**: Firefox, Safari (May require manual file naming on save)

---

## 🤝 Credits & Contact

**FF&E Hospitality BudgetBuilder™** is proudly developed by **Pat Ryan Things LLC**.

We build specialized digital tools that empower the hospitality and design industries to work smarter.

📧 **Support**: [pat@patryan.com](mailto:pat@patryan.com)
🌐 **Website**: [patryan.com](https://patryan.com)

---
*© 2025 Pat Ryan Things LLC. All Rights Reserved.*
