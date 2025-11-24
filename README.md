# FF&E Hospitality BudgetBuilder™

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

**A professional, interactive budget management tool designed specifically for the hospitality design industry.**

The **FF&E Hospitality BudgetBuilder™** streamlines the complex process of managing Furniture, Fixtures, and Equipment budgets. Built with modern web technologies, it offers the ease of a spreadsheet with the power of a dedicated application—running directly in your browser with no installation required for end-users.

---

## 🌟 Key Features

### 💰 **Smart Budget Management**
*   **Real-Time Calculations**: Instantly updates subtotals, taxes, and grand totals as you type.
*   **Variance Tracking**: Visual indicators (🟢 Green / 🔴 Red) show immediately if you are under or over your allowance.
*   **Tax Configuration**: Adjustable sales tax rates to ensure accurate project estimations.

### 📂 **Project Organization**
*   **Categorized Sections**: Pre-built sections for *Front of House*, *Custom Fixtures*, *Wayfinding*, *Exterior*, and *Fees*.
*   **Detailed Line Items**: Track Manufacturer, Description, Dimensions, Quantity, Unit Price, Lead Time, and Notes.
*   **Customizable**: Add new sections or rename existing ones to fit your specific project needs.

### 💾 **Save & Load Capability**
*   **Local File Saving**: Save your work directly to your computer as a `.ffe` file.
*   **Resume Anytime**: Open previously saved files to continue working exactly where you left off.
*   **Auto-Save Protection**: The system warns you if you try to close the window with unsaved changes.

### 🖨️ **Professional Reporting**
*   **Print-Ready**: Automatically formats your budget into a clean, professional document.
*   **PDF Export**: Easily save as a PDF to share with clients or stakeholders.
*   **Branded Headers**: Includes your company logo and project details on every page.

---

## 📖 User Guide

### **1. Getting Started**
*   **Project Details**: At the top of the page, click on "Project Name", "Client", or "Address" to edit them inline.
*   **Company Branding**: You can update the company name and contact info in the top-left corner to match your organization.

### **2. Managing the Budget**
*   **Add Items**: Scroll to a category (e.g., "Front of House") and click the **+ Add Item** button.
*   **Edit Items**: Click on any text field (Description, Qty, Price, etc.) to type directly into the table.
*   **Delete Items**: Hover over a row and click the 🗑️ **Trash Icon** on the right to remove it.
*   **Add Sections**: Need a new category? Click **+ Add New Section** at the bottom of the page.

### **3. Saving Your Work**
*   **Save**: Click the **Save** button in the top navigation bar.
*   **File Format**: Your file will be saved with a `.ffe` extension. This is a special file type for this application.
*   **Browser Note**: For the best experience, use **Google Chrome** or **Microsoft Edge**. These browsers support the advanced saving features used by this tool.

### **4. Printing & PDF**
*   Click **Print / Save PDF** in the top navigation.
*   In the print dialog box, select **"Save as PDF"** as your printer.
*   *Tip: Ensure "Background Graphics" is checked in your print settings to see all colors and styling.*

---

## 💻 Developer Guide

If you are a developer looking to customize or deploy this application, here is the technical overview.

### **Tech Stack**
*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite 7](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN for lightweight portability)
*   **Icons**: [Lucide React](https://lucide.dev/)

### **Installation**

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd FFE-Hospitality-Budget-Manager
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    npm.cmd install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    # or
    npm.cmd run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

### **Project Structure**
```
src/
├── App.jsx          # Main application logic and state
├── App.css          # Custom print styles and overrides
├── main.jsx         # Entry point
└── assets/          # Images and static resources
```

### **Browser Compatibility**
This application uses the **File System Access API** for native file saving and loading.
*   ✅ **Supported**: Chrome, Edge, Opera
*   ⚠️ **Limited**: Firefox, Safari (Save/Load may behave differently or require fallback)

---

## 🤝 Credits & Contact

**FF&E Hospitality BudgetBuilder™** is developed and maintained by **Pat Ryan Things LLC**.

We specialize in creating digital tools for the hospitality and design industries.

📧 **Email**: [pat@patryan.com](mailto:pat@patryan.com)

---
*© 2025 Pat Ryan Things LLC. All Rights Reserved.*
