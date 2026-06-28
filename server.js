const express = require('express');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock Database (Yahan connected websites ka data save hoga)
let connectedWebsites = {};

// 🎛️ Supreme Control State variables (In-memory storage)
let systemSettings = {
    maintenanceMode: false,
    alertMessage: "",
    themeColor: "default", // default, green, red
    blockedTools: []       // Blocked tools ki list array string
};

// 🔗 1. Connector Endpoint (Jahan se doosri webs connect hongi)
app.post('/api/connect', (req, res) => {
    const { url, token } = req.body; // HTML aur JS variables ke mutabiq keys match ki hain

    // Basic Validation
    if (!url || !token) {
        return res.status(400).json({ success: false, message: "URL aur Token zaroori hain!" });
    }

    // Security Check: Master Token Verification
    if (token !== 'AzanTools_Secure_786') {
        return res.status(401).json({ success: false, message: "Invalid Connector Code!" });
    }

    // Website ko dashboard se link karna (Aapka object structure)
    connectedWebsites[token] = {
        url: url,
        connectedAt: new Date().toISOString(),
        status: "Active",
        events: connectedWebsites[token] ? connectedWebsites[token].events : [] // Purani activities preserve rakhne ke liye
    };

    console.log(`[+] New Web Connected: ${url}`);
    res.json({ success: true, message: "Website successfully connected to Azan Tools!" });
});

// ⚡ 2. Telemetry Event Receiver (Activities capture karne ke liye)
app.post('/api/report-activity', (req, res) => {
    const { token, url, action, tool } = req.body;

    // Check custom registration profile
    if (connectedWebsites[token]) {
        if (!connectedWebsites[token].events) {
            connectedWebsites[token].events = [];
        }
        
        // Naye event ko top par push karna
        connectedWebsites[token].events.unshift({
            action: action,
            tool: tool || 'None',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });

        // Maximum 10 items list limit optimization
        if (connectedWebsites[token].events.length > 10) {
            connectedWebsites[token].events.pop();
        }
    }
    res.json({ success: true });
});

// 📊 3. Get Connected Webs (Dashboard par show karne ke liye)
app.get('/api/status', (req, res) => {
    // App.js ke dynamic state render engine ke mutabiq return format set kiya hai
    res.json(connectedWebsites);
});

// ⚙️ 4. Endpoint: Target Web ke liye commands return karna
app.get('/api/get-settings', (req, res) => {
    res.json(systemSettings);
});

// 🎚️ 5. Endpoint: Dashboard se commands deploy karne ke liye
app.post('/api/update-settings', (req, res) => {
    const { token, maintenanceMode, alertMessage, themeColor, blockedTools } = req.body;

    if (token !== 'AzanTools_Secure_786') {
        return res.status(403).json({ success: false, error: 'Unauthorized token' });
    }

    if (maintenanceMode !== undefined) systemSettings.maintenanceMode = maintenanceMode;
    if (alertMessage !== undefined) systemSettings.alertMessage = alertMessage;
    if (themeColor !== undefined) systemSettings.themeColor = themeColor;
    
    if (blockedTools !== undefined) {
        // String text ko safe array format me parse kar ke sanitize karna
        systemSettings.blockedTools = blockedTools.split(',')
            .map(t => t.trim().toLowerCase())
            .filter(t => t !== "");
    }

    res.json({ success: true, currentSettings: systemSettings });
});

// Vercel aur local dono ke liye port handle karna
const PORT = process.env.PORT || 3000;

// Sirf tabhi listen karein jab local chal raha ho
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[🚀] Control Server running on port ${PORT}`);
    });
}

// Vercel Serverless Architecture ke liye export karna zaroori hai
module.exports = app;
           
