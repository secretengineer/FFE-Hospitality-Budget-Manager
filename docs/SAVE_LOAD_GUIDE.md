# Save & Load Functionality Guide

## Overview

The FFE Hospitality Budget Manager now includes full document save/load functionality, allowing you to save your work to your local filesystem and reopen it later for continued editing. This works similarly to traditional document editing programs like Microsoft Word or Excel.

## Features

### 🆕 New Document
- Creates a fresh document with default template values
- Warns you if current document has unsaved changes
- Resets file handle (future saves will prompt for location)

### 💾 Save
- Saves document to previously chosen file location
- If no location chosen yet, prompts with "Save As" dialog
- Uses .ffe file extension (FFE Budget Files)
- Marks document as saved (removes unsaved indicator)

### 💾 Save As
- Always prompts for new file location
- Allows creating copies with different names
- Useful for creating project variants

### 📂 Open
- Opens previously saved .ffe files
- Warns if current document has unsaved changes
- Validates file format before loading
- Restores all project data including categories and items

### ⚠️ Unsaved Changes Detection
- Yellow asterisk (*) appears in app title when changes are unsaved
- Browser warns before closing tab/window with unsaved changes
- Confirmation prompts when opening/creating new document

## How to Use

### Saving Your Work

1. **First Save**:
   - Click the "Save" button in the top navigation bar
   - A file picker dialog will appear
   - Choose a location on your computer
   - Enter a filename (suggested format: `projectname_budget.ffe`)
   - Click "Save"

2. **Subsequent Saves**:
   - Click "Save" button
   - File automatically saves to previous location
   - No dialog appears (quick save)

3. **Save to Different Location**:
   - Click "Save As" button
   - Choose new location and/or filename
   - Future "Save" operations use this new location

### Opening Saved Documents

1. Click "Open" button in top navigation
2. If you have unsaved changes, confirm you want to proceed
3. Browse to your .ffe file location
4. Select the file and click "Open"
5. Document loads with all data preserved

### Creating New Documents

1. Click "New" button in top navigation
2. If you have unsaved changes, confirm you want to proceed
3. Document resets to default template
4. Previous file association is cleared

## File Format

### .ffe Files
- **Extension**: .ffe (FFE Budget Files)
- **Format**: JSON (JavaScript Object Notation)
- **Content**: Project information, categories, and all line items
- **Size**: Typically 5-50 KB depending on project complexity
- **Portability**: Can be easily shared via email, cloud storage, etc.

### File Structure
```json
{
  "version": "1.0",
  "savedAt": "2025-11-23T10:30:00.000Z",
  "projectInfo": {
    "name": "Project Name",
    "client": "Client Name",
    // ... other project fields
  },
  "categories": [
    {
      "id": "foh",
      "title": "Front of House | Furniture & Equipment",
      "color": "text-blue-600",
      "items": [
        // ... line items
      ]
    }
    // ... other categories
  ]
}
```

## Best Practices

### Naming Conventions
- Use descriptive filenames: `hotel_project_budget.ffe`
- Include project name or number: `proj_2024_001_ffe_budget.ffe`
- Consider date stamps for versions: `hilton_budget_2025_11_23.ffe`

### Saving Frequency
- Save after completing major sections
- Save before printing/exporting to PDF
- Save before closing browser or taking breaks
- Use "Save As" to create backup copies at milestones

### File Organization
- Create a dedicated folder for FFE budgets
- Organize by client or project
- Keep backups of important documents
- Consider version control for critical projects

### Sharing Files
- .ffe files can be emailed or uploaded to cloud storage
- Recipients need the FFE Budget Manager app to open files
- Files are plain JSON - can be read in text editors if needed
- No sensitive data is encrypted - be mindful of confidentiality

## Troubleshooting

### "Failed to save document" Error
- **Cause**: Permission issue or disk full
- **Solution**: Try saving to different location (Documents, Desktop)

### "Failed to open document" Error
- **Cause**: File is corrupted or wrong format
- **Solution**: Ensure file has .ffe extension and is valid JSON

### Save/Open buttons don't work
- **Cause**: Browser doesn't support File System Access API
- **Solution**: Use Chrome, Edge, or Opera browser (Firefox/Safari not supported)

### Unsaved changes warning doesn't appear
- **Cause**: Browser setting or extension blocking
- **Solution**: Check browser permissions for the site

### File picker doesn't appear
- **Cause**: Popup blocked or browser permission denied
- **Solution**: Allow popups for the site, check browser permissions

## Browser Compatibility

### Fully Supported
- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Opera 72+

### Not Supported
- ❌ Firefox (as of Nov 2025)
- ❌ Safari (as of Nov 2025)
- ❌ Internet Explorer

**Recommendation**: Use Google Chrome or Microsoft Edge for best experience.

## Technical Details

### File System Access API
The save/load functionality uses the modern **File System Access API** which provides:
- Native file picker dialogs (Windows/Mac/Linux)
- Direct file system access with user permission
- Ability to overwrite files (with permission)
- No server upload required - all local

### Security
- User must explicitly grant file access via dialog
- Each operation requires user interaction (can't auto-save without permission)
- Files are saved locally only - no cloud storage
- No data transmitted over network

### Privacy
- All data stays on your computer
- No tracking or analytics on saved files
- No server-side storage or processing
- Files are not encrypted - use OS-level encryption if needed

## Keyboard Shortcuts

Currently, keyboard shortcuts are not implemented, but you can use standard browser shortcuts:
- **Ctrl+P** (Windows) / **Cmd+P** (Mac): Print dialog
- **Ctrl+S** (Windows) / **Cmd+S** (Mac): Browser's save page dialog (not the app's save function)

*Future enhancement: Custom keyboard shortcuts for save/open*

## FAQ

### Q: Can I open .ffe files in Excel?
**A:** No, but you can open them in a text editor since they're JSON format. For Excel, use the print-to-PDF feature, then convert PDF to Excel.

### Q: Are my files saved to the cloud?
**A:** No, files are saved only to your local computer. You control where they're stored.

### Q: Can multiple people edit the same file?
**A:** Not simultaneously. Save, share the file, then only one person should edit at a time to avoid conflicts.

### Q: What happens if I close the browser without saving?
**A:** The browser will warn you about unsaved changes. If you proceed, changes will be lost.

### Q: Can I edit .ffe files manually?
**A:** Yes, they're JSON files. Use a text editor, but be careful to maintain valid JSON structure.

### Q: How do I backup my budgets?
**A:** Use "Save As" to create copies, or copy .ffe files to external drive/cloud storage.

### Q: Why .ffe extension?
**A:** FFE stands for "Furniture, Fixtures & Equipment" - it helps identify these budget files.

## Support

For issues or questions:
1. Check browser compatibility (Chrome/Edge recommended)
2. Ensure file permissions are not restricted
3. Try saving to different location (Desktop, Documents)
4. Check console for error messages (F12 in browser)

## Version History

- **v1.0** (Nov 2025): Initial save/load functionality release
  - New, Open, Save, Save As operations
  - Unsaved changes detection
  - File System Access API integration
  - .ffe file format specification
