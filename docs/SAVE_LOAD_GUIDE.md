#  Save & Load Guide

## Overview

The **FF&E Hospitality Budget Manager** features a robust native file system integration. This allows you to save your budget projects directly to your local computer as `.ffe` files, just like you would with a Word document or Excel spreadsheet.

---

##  Key Features

###  New Document
- **Action:** Resets the application to the default template.
- **Safety:** Checks for unsaved changes before resetting.
- **State:** Clears the current file association (next save will be "Save As").

###  Save
- **Action:** Saves the current state to the active file.
- **Behavior:** 
  - If a file is already open, it overwrites it silently.
  - If no file is open, it triggers the "Save As" dialog.
- **Feedback:** Removes the "Unsaved Changes" indicator.

###  Save As
- **Action:** Creates a copy of the current project.
- **Behavior:** Always opens the system file picker to choose a new name/location.
- **Use Case:** Creating versioned backups (e.g., `Project_v1.ffe`, `Project_v2.ffe`).

###  Open
- **Action:** Loads a previously saved `.ffe` file.
- **Safety:** Warns if the current project has unsaved changes.
- **Validation:** Checks file integrity before loading.

###  Unsaved Changes Protection
- **Visual Indicator:** An asterisk `(*)` appears in the window title.
- **Browser Guard:** Prevents accidental tab closing or refreshing if changes are unsaved.
- **Action Guard:** Prompts for confirmation before "New" or "Open" actions if changes exist.

---

##  How to Use

### Saving Your Work

1. **Initial Save:**
   - Click the **Save** button in the top toolbar.
   - A system dialog will appear.
   - Choose a folder and enter a filename (e.g., `Hotel_Lobby_Budget.ffe`).
   - Click **Save**.

2. **Quick Save:**
   - After the first save, clicking **Save** updates the file instantly.
   - No dialog will appear.

3. **Creating a Copy:**
   - Click **Save As**.
   - Enter a new filename.
   - The application will now be editing the *new* file.

### Opening a Project

1. Click **Open** in the toolbar.
2. Navigate to your saved `.ffe` file.
3. Select the file and confirm.
4. The project loads instantly with all categories, items, and settings restored.

---

##  File Format Specification

The application uses a custom JSON-based format with the `.ffe` extension.

### Structure Overview

```json
{
  "version": "1.0",
  "savedAt": "2025-11-24T14:30:00.000Z",
  "projectInfo": {
    "name": "Grand Hotel Lobby",
    "client": "Hospitality Corp",
    "allowance": 500000,
    "salesTaxRate": 8.5
    // ... branding details
  },
  "categories": [
    {
      "id": "foh",
      "title": "Front of House",
      "items": [ ... ]
    },
    {
      "id": "cat_1732401234567", // Dynamic Category ID
      "title": "Custom Millwork",
      "items": [ ... ]
    }
  ]
}
```

### Data Persistence
- **Project Info:** All fields including branding and tax rates.
- **Categories:** Both default and custom-added categories.
- **Line Items:** All item details, quantities, and costs.
- **Order:** Category order is preserved.

---

##  Troubleshooting

### Browser Support
The **File System Access API** is a modern web standard.
- **Supported:** Google Chrome, Microsoft Edge, Opera.
- **Limited/Unsupported:** Firefox, Safari (may fallback to simple download).

### "File not found" Error
- Ensure the file hasn't been moved or renamed outside the application while it was open.
- Try using **Open** again to re-establish the link.

### Permission Prompts
- The browser may ask for permission to "View files" or "Save changes".
- Always click **Allow** or **Grant Access** to enable functionality.

---

**Note:** `.ffe` files are plain text JSON. In an emergency, they can be opened and edited with any text editor (Notepad, VS Code), though this is not recommended for general use.
