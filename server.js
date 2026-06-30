const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = express();

// 🔐 FIREBASE CLOUD INITIALIZATION (Using Your Project ID)
const projectId = "azan-universal-controller";
if (!getApps().length) {
    initializeApp({
        projectId: projectId
    });
}
const db = getFirestore();
const settingsRef = db.collection('system').doc('liveSettings');

// Middleware setup
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('public'));

// 📡 CROSS-DOMAIN HANDSHAKE HEADERS (CORS Block Absolute Fix)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Mock Database (Purana tracker state preserved)
let connectedWebsites = {};

// 🧠 ULTIMATE SUPREME CONTROL STATE (Fallback Default Structure)
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

// Helper Function: Database se settings fetch karne ka fast method
async function fetchCurrentSettings() {
    try {
        const doc = await settingsRef.get();
        if (doc.exists) {
            return doc.data();
        } else {
            // Agar database khali hai toh default settings save kar do
            await settingsRef.set(defaultSettings);
            return defaultSettings;
        }
    } catch (e) {
        console.error("Firebase Read Error:", e);
        return defaultSettings;
    }
}

// 🛰️ LIVE TELEMETRY ENGINE VARIABLES
let liveSessions = {}; 
let activityLogs = [];

// 📡 PRO TRAFFIC FILTER MIDDLEWARE (Live User tracking & PC Blocker)
app.use(async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = ip.split(',')[0].trim().replace('::1', '127.0.0.1');
    const userAgent = req.headers['user-agent'] || '';
    
    if (req.url.includes('/api/get-settings')) {
        const isPC = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const currentSettings = await fetchCurrentSettings();
        
        // 🚫 Smart Firewall Verification
        if (currentSettings.firewall && currentSettings.firewall.blockPC && isPC) {
            return res.status(403).json({ firewallBlock: true, reason: "PC Users are restricted by Admin Shield." });
        }

        // Active Session update/create
        liveSessions[cleanIp] = {
            lastSeen: Date.now(),
            device: isPC ? "💻 PC / Desktop" : "📱 Mobile Device",
            ip: cleanIp
        };
    }
    next();
});

// Clean idle live users every 8 seconds
setInterval(() => {
    const now = Date.now();
    for (let ip in liveSessions) {
        if (now - liveSessions[ip].lastSeen > 12000) {
            delete liveSessions[ip];
        }
    }
}, 8000);

// 🏠 FIX: Root Route to serve dashboard UI properly
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
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = ip.split(',')[0].trim().replace('::1', '127.0.0.1');
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
        ip: cleanIp,
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
app.get('/api/admin-stats', async (req, res) => {
    const currentSettings = await fetchCurrentSettings();
    res.json({
        settings: currentSettings,
        activeUsersCount: Object.keys(liveSessions).length,
        liveUsers: Object.values(liveSessions),
        logs: activityLogs.slice(0, 15)
    });
});

// ⚙️ 4. Endpoint: Target Web Live Rules Fetch Engine
app.get('/api/get-settings', async (req, res) => {
    const currentSettings = await fetchCurrentSettings();
    res.json(currentSettings);
});

// 🎚️ 5. Endpoint: Legacy & Supreme Update Route handler combined
app.post('/api/update-settings', async (req, res) => {
    const { token, maintenanceMode, alertMessage, themeColor, blockedTools } = req.body;

    if (token !== 'AzanTools_Secure_786') {
        return res.status(403).json({ success: false, error: 'Unauthorized token' });
    }

    try {
        let currentSettings = await fetchCurrentSettings();

        if (maintenanceMode !== undefined) currentSettings.maintenanceMode = maintenanceMode;
        if (alertMessage !== undefined) currentSettings.alertMessage = alertMessage;
        if (themeColor !== undefined) currentSettings.themeColor = themeColor;
        
        if (blockedTools !== undefined) {
            currentSettings.blockedTools = blockedTools.split(',')
                .map(t => t.trim().toLowerCase())
                .filter(t => t !== "");
        }

        // Firebase Firestore par permanently save karein
        await settingsRef.set(currentSettings, { merge: true });
        res.json({ success: true, currentSettings: currentSettings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🚀 NEW MASTER ROUTE: Handles complex payload from advanced controller panel
app.post('/api/update-master', async (req, res) => {
    const { token, config } = req.body;

    if (token !== 'AzanTools_Secure_786') {
        return res.status(403).json({ success: false, error: 'Access Denied!' });
    }

    if (config) {
        try {
            let currentSettings = await fetchCurrentSettings();
            let updatedSettings = { ...currentSettings, ...config };
            
            if (config.blockedTools && typeof config.blockedTools === 'string') {
                updatedSettings.blockedTools = config.blockedTools.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== "");
            }
            if (config.broadcastNotification) updatedSettings.broadcastNotification = config.broadcastNotification;
            if (config.firewall) updatedSettings.firewall = config.firewall;
            if (config.meta) updatedSettings.meta = config.meta;

            // Firebase Firestore par save execution
            await settingsRef.set(updatedSettings, { merge: true });
            res.json({ success: true, currentSettings: updatedSettings });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    } else {
        res.status(400).json({ success: false, error: 'Empty configuration payload' });
    }
});

// Port Handling
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[🚀] Master Control Server running on port ${PORT}`);
    });
}

module.exports = app;
    
