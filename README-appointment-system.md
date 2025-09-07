# Appointment Management System

A modern, responsive web-based appointment management system that handles facility appointments, creates time slots, and manages healthcare providers.

## Features

### 🏥 Facility Management
- Add, edit, and delete facilities
- Store facility details (name, address, phone, email, capacity)
- Visual facility cards with complete information

### 👨‍⚕️ Provider Management
- Add, edit, and delete healthcare providers
- Assign providers to specific facilities
- Track provider specialties and contact information
- Provider-facility relationship management

### ⏰ Time Slot Management
- Create time slots for specific facilities and providers
- Flexible slot duration (15-120 minutes)
- Automatic slot generation based on start/end times
- Visual slot status (available/booked)

### 📅 Appointment Booking
- Book appointments for available time slots
- Patient information management
- Real-time slot availability checking
- Appointment status tracking

## How to Use

### Getting Started
1. Open `appointment-system.html` in your web browser
2. The system uses localStorage to persist data (no database required)
3. Start by adding facilities, then providers, then create time slots

### Step-by-Step Workflow

#### 1. Add Facilities
- Click on the "Facilities" tab
- Click "Add Facility" button
- Fill in facility details:
  - Facility Name
  - Address
  - Phone Number
  - Email
  - Capacity (number of people)
- Click "Save Facility"

#### 2. Add Providers
- Click on the "Providers" tab
- Click "Add Provider" button
- Fill in provider details:
  - Provider Name
  - Specialty
  - Email
  - Phone
  - Assigned Facility (select from dropdown)
- Click "Save Provider"

#### 3. Create Time Slots
- Click on the "Time Slots" tab
- Click "Create Time Slots" button
- Select:
  - Facility
  - Provider
  - Date
  - Start Time
  - End Time
  - Slot Duration (in minutes)
- Click "Create Slots" to generate multiple slots automatically

#### 4. Book Appointments
- Click on the "Appointments" tab
- Click "Book Appointment" button
- Select:
  - Facility
  - Provider
  - Date
  - Available Time Slot (populated based on selections)
- Fill in patient information:
  - Patient Name
  - Patient Email
  - Patient Phone
  - Notes (optional)
- Click "Book Appointment"

## Technical Features

### Responsive Design
- Mobile-friendly interface
- Adaptive grid layouts
- Touch-friendly buttons and forms
- Optimized for all screen sizes

### Data Persistence
- Uses browser localStorage for data storage
- No server or database required
- Data persists between browser sessions
- Easy to backup and restore

### User Experience
- Modern, clean interface
- Intuitive navigation with tabs
- Real-time form validation
- Success/error messaging
- Modal dialogs for forms
- Empty state illustrations

### Data Management
- Automatic ID generation
- Data relationships (providers to facilities, appointments to slots)
- Cascade deletion (deleting facility removes related data)
- Form validation and error handling

## File Structure

```
appointment-system.html    # Main HTML file
appointment-styles.css     # CSS styling
appointment-script.js      # JavaScript functionality
README-appointment-system.md # This documentation
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Styling
- Modify `appointment-styles.css` to change colors, fonts, and layout
- Uses CSS custom properties for easy theme changes
- Responsive breakpoints can be adjusted

### Functionality
- Extend `appointment-script.js` to add new features
- Add new form fields by updating HTML and JavaScript
- Implement additional validation rules

### Data Export/Import
- Data is stored in localStorage as JSON
- Can be exported/imported using browser developer tools
- Consider adding export/import functionality for production use

## Future Enhancements

Potential improvements for production use:
- Server-side data storage
- User authentication and roles
- Email notifications
- Calendar integration
- Reporting and analytics
- Multi-language support
- API integration
- Mobile app development

## Support

This system is designed to be self-contained and easy to use. All data is stored locally in your browser, making it perfect for small to medium-sized practices or as a starting point for larger systems.

For technical support or customization requests, refer to the code comments and this documentation.