const express = require('express');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock Database (Purana tracker state preserved)
let connectedWebsites = {};

// 🧠 ULTIMATE SUPREME CONTROL STATE (Upgraded with Pro Features)
let systemSettings = {
    maintenanceMode: false,
    alertMessage: "",
    themeColor: "default", // default, green, red
    blockedTools: [],       // Blocked tools array
    redirectUrl: "",        // NEW: Maintenance hone par redirect link
    broadcastNotification: { // NEW: Top banner engine
        show: false,
        text: "",
        type: "info" // info, warning, danger
    },
    firewall: {             // NEW: Smart Firewall rules
        blockPC: false
    },
    meta: {                 // NEW: Website Title/Subtitle controller
        siteTitle: "AZAN TOOLS",
        siteSubtitle: "WELCOME TO OUR TOOLKIT V 4.1"
    }
};

// 🛰️ LIVE TELEMETRY ENGINE VARIABLES
let liveSessions = {}; 
let activityLogs = [];

// 📡 PRO TRAFFIC FILTER MIDDLEWARE (Live User tracking & PC Blocker)
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    
    if (req.url.includes('/api/get-settings')) {
        const isPC = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        
        // 🚫 Smart Firewall Verification
        if (systemSettings.firewall.blockPC && isPC) {
            return res.status(403).json({ firewallBlock: true, reason: "PC Users are restricted by Admin Shield." });
        }

        // Active Session update/create
        liveSessions[ip] = {
            lastSeen: Date.now(),
            device: isPC ? "💻 PC / Desktop" : "📱 Mobile Device",
            ip: ip.includes('::1') ? '127.0.0.1 (Localhost)' : ip
        };
    }
    next();
});

// Clean idle live users every 8 seconds
setInterval(() => {
    const now = Date.now();
    for (let ip in liveSessions) {
        if (now - liveSessions[ip].lastSeen > 10000) {
            delete liveSessions[ip];
        }
    }
}, 8000);

// 🔗 1. Connector Endpoint (Handshake preserved)
app.post('/api/connect', (req, res) => {
    const { url, token } = req.body;

    if (!url || !token) {
        return res.status(400).json({ success: false, message: "URL aur Token zaroori hain!" });
    }

    if (token !== 'AzanTools_Secure_786') {
        return res.status(401).json({ success: false, message: "Invalid Connector Code!" });
    }

    connectedWebsites[token] = {
        url: url,
        connectedAt: new Date().toISOString(),
        status: "Active",
        events: connectedWebsites[token] ? connectedWebsites[token].events : []
    };

    console.log(`[+] New Web Connected: ${url}`);
    res.json({ success: true, message: "Website successfully connected to Azan Tools!" });
});

// ⚡ 2. Telemetry Event Receiver (Upgraded to handle dynamic logs stream)
app.post('/api/report-activity', (req, res) => {
    const { token, action, tool, device } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const nativeIp = ip.includes('::1') ? '127.0.0.1' : ip;
    const currentDevice = device || 'Unknown';

    if (connectedWebsites[token]) {
        if (!connectedWebsites[token].events) {
            connectedWebsites[token].events = [];
        }
        
        connectedWebsites[token].events.unshift({
            action: action,
            tool: tool || 'None',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });

        if (connectedWebsites[token].events.length > 10) {
            connectedWebsites[token].events.pop();
        }
    }

    // Push globally into terminal streaming array
    activityLogs.unshift({
        action: action,
        tool: tool || 'System Base',
        device: currentDevice,
        ip: nativeIp,
        time: new Date().toLocaleTimeString()
    });
    if (activityLogs.length > 50) activityLogs.pop();

    res.json({ success: true });
});

// 📊 3. Get Connected Webs & Live Monitor Stats Combined Endpoint
app.get('/api/status', (req, res) => {
    res.json(connectedWebsites);
});

// 📈 NEW ENDPOINT: Dashboard UI elements data sync
app.get('/api/admin-stats', (req, res) => {
    res.json({
        settings: systemSettings,
        activeUsersCount: Object.keys(liveSessions).length,
        liveUsers: Object.values(liveSessions),
        logs: activityLogs.slice(0, 15)
    });
});

// ⚙️ 4. Endpoint: Target Web Live Rules Fetch Engine
app.get('/api/get-settings', (req, res) => {
    res.json(systemSettings);
});

// 🎚️ 5. Endpoint: Legacy & Supreme Update Route handler combined
app.post('/api/update-settings', (req, res) => {
    const { token, maintenanceMode, alertMessage, themeColor, blockedTools } = req.body;

    if (token !== 'AzanTools_Secure_786') {
        return res.status(403).json({ success: false, error: 'Unauthorized token' });
    }

    if (maintenanceMode !== undefined) systemSettings.maintenanceMode = maintenanceMode;
    if (alertMessage !== undefined) systemSettings.alertMessage = alertMessage;
    if (themeColor !== undefined) systemSettings.themeColor = themeColor;
    
    if (blockedTools !== undefined) {
        systemSettings.blockedTools = blockedTools.split(',')
            .map(t => t.trim().toLowerCase())
            .filter(t => t !== "");
    }

    res.json({ success: true, currentSettings: systemSettings });
});

// 🚀 NEW MASTER ROUTE: Handles complex payload from advanced controller panel
app.post('/api/update-master', (req, res) => {
    const { token, config } = req.body;

    if (token !== 'AzanTools_Secure_786') {
        return res.status(403).json({ success: false, error: 'Access Denied!' });
    }

    if (config) {
        systemSettings = { ...systemSettings, ...config };
        
        if (config.blockedTools && typeof config.blockedTools === 'string') {
            systemSettings.blockedTools = config.blockedTools.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== "");
        }
        if (config.broadcastNotification) systemSettings.broadcastNotification = config.broadcastNotification;
        if (config.firewall) systemSettings.firewall = config.firewall;
        if (config.meta) systemSettings.meta = config.meta;
    }

    res.json({ success: true, currentSettings: systemSettings });
});

// Port Handling
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[🚀] Master Control Server running on port ${PORT}`);
    });
}

module.exports = app;
        
