const express = require('express');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock Database (Yahan connected websites ka data save hoga)
let connectedWebsites = {};

// 🔗 1. Connector Endpoint (Jahan se doosri webs connect hongi)
app.post('/api/connect', (req, res) => {
    const { websiteUrl, connectorToken } = req.body;

    // Basic Validation
    if (!websiteUrl || !connectorToken) {
        return res.status(400).json({ success: false, message: "URL aur Token zaroori hain!" });
    }

    // Security Check: Token length aur format verification
    if (connectorToken.length < 10) {
        return res.status(401).json({ success: false, message: "Invalid Connector Code!" });
    }

    // Website ko dashboard se link karna
    connectedWebsites[connectorToken] = {
        url: websiteUrl,
        connectedAt: new Date(),
        status: "Active"
    };

    console.log(`[+] New Web Connected: ${websiteUrl}`);
    res.json({ success: true, message: "Website successfully connected to Azaan Tool!" });
});

// 📊 2. Get Connected Webs (Dashboard par show karne ke liye)
app.get('/api/websites', (req, res) => {
    res.json({ success: true, data: Object.values(connectedWebsites) });
});

// Vercel aur local dono ke liye port handle karna
const PORT = process.env.PORT || 3000;

// Sirf tabhi listen karein jab local chal raha ho (Vercel serverless functions khud handle karta hai)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[🚀] Control Server running on port ${PORT}`);
    });
}

// Vercel Serverless Architecture ke liye export karna zaroori hai
module.exports = app;
  
