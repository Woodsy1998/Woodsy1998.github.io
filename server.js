/***************************************************
 * server.js (or app.js)
 * Node.js + Express Server for Carbonem AV Installation
 ***************************************************/

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// =============================================
// MIDDLEWARE SETUP
// =============================================
// Parse URL-encoded data (from traditional form posts)
app.use(express.urlencoded({ extended: true }));
// Parse JSON data (from Fetch or XHR with JSON body)
app.use(express.json());

// =============================================
// SERVE STATIC FILES
// =============================================
// If your frontend files (HTML, CSS, JS) are in a folder named "public"
// this line will serve them at the root URL.
app.use(express.static(path.join(__dirname, 'public')));

// =============================================
// OPTIONAL: MAIN ROUTE
// If you prefer to serve index.html explicitly rather than relying on static middleware:
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// =============================================
// SERVICES DATA ROUTE (OPTIONAL)
// =============================================
// Example: If you have a services.json file in the same directory as this server file
// with a structure like: [ { "id": 1, "name": "Home Theater", ... }, ... ]
// You can load it and serve it here. Make sure the file path is correct.
let servicesData = [];
try {
  // Attempt to read the services.json file synchronously at startup
  const servicesRaw = fs.readFileSync(path.join(__dirname, 'services.json'), 'utf8');
  servicesData = JSON.parse(servicesRaw);
} catch (error) {
  console.warn('Warning: Could not load services.json. If this file does not exist, ignore this message.');
  // servicesData remains an empty array if the file isn't found
}

// Provide a route to return this data as JSON
app.get('/api/services', (req, res) => {
  return res.json(servicesData);
});

// =============================================
// CONTACT FORM SUBMISSION ROUTE
// =============================================
app.post('/contact', (req, res) => {
  // Destructure form data from req.body
  const { name, email, phone, message } = req.body;

  // Basic server-side validation (optional, but recommended)
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Required fields are missing. Please include at least name, email, and message.'
    });
  }

  // Prepare the new inquiry object
  const newInquiry = {
    id: Date.now(), // simple unique ID based on timestamp
    name,
    email,
    phone: phone || '',
    message,
    submittedAt: new Date().toISOString()
  };

  // Read existing inquiries from a JSON file (inquiries.json)
  // If it doesn't exist, we'll create it and start from an empty array
  const inquiriesFile = path.join(__dirname, 'inquiries.json');
  let inquiriesData = [];

  try {
    if (fs.existsSync(inquiriesFile)) {
      const existingData = fs.readFileSync(inquiriesFile, 'utf8');
      inquiriesData = JSON.parse(existingData);
    }
  } catch (error) {
    // If file read fails, we'll just keep inquiriesData as an empty array
    console.error('Error reading inquiries file:', error);
  }

  // Add the new inquiry
  inquiriesData.push(newInquiry);

  // Write the updated array back to inquiries.json
  try {
    fs.writeFileSync(inquiriesFile, JSON.stringify(inquiriesData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to inquiries file:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save your inquiry. Please try again later.'
    });
  }

  // Respond with success
  return res.json({
    success: true,
    message: 'Thank you for contacting us! We will get back to you soon.'
  });
});

// =============================================
// ERROR HANDLING (OPTIONAL)
// =============================================

// 404 handler for any unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found.'
  });
});

// Generic error handling middleware
// (Note: In a real production app, you'd do more robust error reporting)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server.'
  });
});

// =============================================
// START THE SERVER
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
