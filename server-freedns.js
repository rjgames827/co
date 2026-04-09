// Backend server for FreeDNS subdomain registration
// Deploy this to handle automatic subdomain registration

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Your FreeDNS credentials
const FREEDNS_USERNAME = 'your_username'; // Change this
const FREEDNS_PASSWORD = 'your_password'; // Change this

// Generate SHA-1 hash for FreeDNS API authentication
function generateAuthHash(username, password) {
  const authString = `${username}|${password}`;
  return crypto.createHash('sha1').update(authString).digest('hex');
}

// Register a subdomain on FreeDNS
app.post('/register-subdomain', async (req, res) => {
  try {
    const { subdomain, domain, destination } = req.body;

    // Generate authentication hash
    const authHash = generateAuthHash(FREEDNS_USERNAME, FREEDNS_PASSWORD);

    // FreeDNS dynamic update URL
    const updateUrl = `http://freedns.afraid.org/dynamic/update.php?${authHash}`;

    // Make request to FreeDNS
    const response = await fetch(updateUrl);
    const result = await response.text();

    console.log(`Registration attempt for ${subdomain}.${domain}:`, result);

    // Check if successful
    if (result.includes('Updated') || result.includes('has not changed')) {
      res.json({
        success: true,
        message: `Successfully registered ${subdomain}.${domain}`,
        subdomain: `${subdomain}.${domain}`,
        destination: destination
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: result
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FreeDNS Registration API' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FreeDNS registration server running on port ${PORT}`);
  console.log(`Update your frontend to use: http://localhost:${PORT}/register-subdomain`);
});
