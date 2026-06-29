const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// 📁 Vercel Secure temporary path for state persistence (Bypasses Serverless Reset)
const SETTINGS_FILE = path.join('/tmp', 'systemSettings.json');

// Default initial configurations matrix
const defaultSettings = {
    maintenanceMode: false,
    alertMessage: "",
    themeColor: "default", 
    blockedTools: [],       
    redirectUrl: "",        
    broadcastNotification: { 
        show: false,
        text: "",
        type: "info" 
    },
    firewall: {             
        blockPC: false
    },
    meta: {                 
        siteTitle: "AZAN TOOLS",
        siteSubtitle: "WELCOME TO OUR TOOLKIT V 4.1"
    }
};

// 🧠 Helper Function: Read configuration safely from Serverless cache
function getStoredSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading settings state container:", e);
    }
    return defaultSettings;
}

// 💾 Helper Function: Write configuration safely to Serverless cache
function saveStoredSettings(settings) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing settings state container:", e);
    }
}

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ✨ FORCE ALLOW CORS HEADERS FOR VERCEL CROSS-DOMAIN TRAFFIC (Bypass Target Restrictions)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Mock Database (Purana tracker state preserved)
let connectedWebsites = {};

// 🛰️ LIVE TELEMETRY ENGINE VARIABLES
let liveSessions = {}; 
let activityLogs = [];

// 📡 PRO TRAFFIC FILTER MIDDLEWARE (Live User tracking & PC Blocker)
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    
    if (req.url.includes('/api/get-settings')) {
        const isPC = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const currentSettings = getStoredSettings();
        
        // 🚫 Smart Firewall Verification
        if (currentSettings.firewall && currentSettings.firewall.blockPC && isPC) {
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

// Clean idle live users every 8 seconds (Runs safely during active requests)
setInterval(() => {
    const now = Date.now();
    for (let ip in liveSessions) {
        if (now - liveSessions[ip].lastSeen > 10000) {
            delete liveSessions[ip];
        }
    }
}, 8000);

// 🏠 NEW HOME ROUTE: Render Dashboard and Fix 'Cannot GET /' Error
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

// 📈 UI Sync Endpoint: Pulls data safely combining persisted settings
app.get('/api/admin-stats', (req, res) => {
    res.json({
        settings: getStoredSettings(),
        activeUsersCount: Object.keys(liveSessions).length,
        liveUsers: Object.values(liveSessions),
        logs: activityLogs.slice(0, 15)
    });
});

// ⚙️ 4. Endpoint: Target Web Live Rules Fetch Engine
app.get('/api/get-settings', (req, res) => {
    res.json(getStoredSettings());
});

// 🎚️ 5. Endpoint: Legacy Update Route handler combined with storage persistence
app.post('/api/update-settings', (req, res) => {
    const { token, maintenanceMode, alertMessage, themeColor, blockedTools } = req.body;

    if (token !== 'AzanTools_Secure_786') {
        return res.status(403).json({ success: false, error: 'Unauthorized token' });
    }

    let currentSettings = getStoredSettings();

    if (maintenanceMode !== undefined) currentSettings.maintenanceMode = maintenanceMode;
    if (alertMessage !== undefined) currentSettings.alertMessage = alertMessage;
    if (themeColor !== undefined) currentSettings.themeColor = themeColor;
    
    if (blockedTools !== undefined) {
        currentSettings.blockedTools = blockedTools.split(',')
            .map(t => t.trim().toLowerCase())
            .filter(t => t !== "");
    }

    saveStoredSettings(currentSettings);
    res.json({ success: true, currentSettings: currentSettings });
});

// 🚀 MASTER ROUTE: Handles advanced merged configuration blocks
app.post('/api/update-master', (req, res) => {
    const { token, config } = req.body;

    if (token !== 'AzanTools_Secure_786') {
        return res.status(403).json({ success: false, error: 'Access Denied!' });
    }

    if (config) {
        let currentSettings = getStoredSettings();
        let updatedSettings = { ...currentSettings, ...config };
        
        if (config.blockedTools && typeof config.blockedTools === 'string') {
            updatedSettings.blockedTools = config.blockedTools.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== "");
        }
        
        saveStoredSettings(updatedSettings);
        return res.json({ success: true, currentSettings: updatedSettings });
    }

    res.status(400).json({ success: false, error: 'No configuration payload matrix found.' });
});

// Port Handling
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[🚀] Master Control Server running on port ${PORT}`);
    });
}

module.exports = app;
         
