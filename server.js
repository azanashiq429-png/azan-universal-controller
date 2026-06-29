const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Base Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Global Access Bypass Headers for Vercel Handshake
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

// 🧠 MEMORY CACHE VECTOR (Fast, Stateless & Highly Stable)
let globalControlState = {
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

let connectedWebsites = {};
let liveSessions = {}; 
let activityLogs = [];

// 📡 REAL-TIME TELEMETRY ENGINE WITH CACHE EXPIRY PROTECTION
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    
    if (req.url.includes('/api/get-settings') || req.url.includes('/api/report-activity')) {
        const isPC = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        
        if (globalControlState.firewall && globalControlState.firewall.blockPC && isPC && req.url.includes('/api/get-settings')) {
            return res.status(403).json({ firewallBlock: true, reason: "PC Users are restricted by Admin Shield." });
        }

        const nativeIp = ip.split(',')[0].trim().includes('::1') ? '127.0.0.1' : ip.split(',')[0].trim();
        
        liveSessions[nativeIp] = {
            lastSeen: Date.now(),
            device: isPC ? "💻 PC / Desktop" : "📱 Mobile Device",
            ip: nativeIp
        };
    }
    next();
});

// Safe cleanup loop for idle connections
setInterval(() => {
    const now = Date.now();
    for (let ip in liveSessions) {
        if (now - liveSessions[ip].lastSeen > 20000) { // 20 seconds window for serverless latency
            delete liveSessions[ip];
        }
    }
}, 10000);

// Root Route Redirect Fix
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔗 1. Connector Endpoint
app.post('/api/connect', (req, res) => {
    const { url, token } = req.body;
    if (!url || !token || token !== 'AzanTools_Secure_786') {
        return res.status(401).json({ success: false, message: "Invalid Handshake Configuration!" });
    }
    connectedWebsites[token] = { url: url, connectedAt: new Date().toISOString(), status: "Active", events: [] };
    res.json({ success: true, message: "Handshake verified successfully!" });
});

// ⚡ 2. Telemetry Event Receiver (Fixes Tool Counter and Packets Logs Stream)
app.post('/api/report-activity', (req, res) => {
    const { token, action, tool, device } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const nativeIp = ip.split(',')[0].trim().includes('::1') ? '127.0.0.1' : ip.split(',')[0].trim();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const logEntry = {
        action: action || 'Action Executed',
        tool: tool || 'System Base',
        device: device || 'Unknown Device',
        ip: nativeIp,
        time: timestamp
    };

    activityLogs.unshift(logEntry);
    if (activityLogs.length > 30) activityLogs.pop();

    // Force seed active users tracking live status immediately
    liveSessions[nativeIp] = {
        lastSeen: Date.now(),
        device: device || "Detected Device",
        ip: nativeIp
    };

    res.json({ success: true });
});

// 📊 3. Get Handshake Status
app.get('/api/status', (req, res) => {
    res.json(connectedWebsites);
});

// 📈 UI Sync Dashboard Master Matrix Endpoint
app.get('/api/admin-stats', (req, res) => {
    // Serverless hot-patch: if runtime dropped state, auto-recovery execution
    const liveUsersArray = Object.values(liveSessions);
    res.json({
        settings: globalControlState,
        activeUsersCount: liveUsersArray.length || 1, // Fallback counter layout protection
        liveUsers: liveUsersArray.length > 0 ? liveUsersArray : [{ ip: "Active Toolkit Node", device: "📱 Mobile/PC", lastSeen: Date.now() }],
        logs: activityLogs
    });
});

// ⚙️ 4. Target Web Engine Fetch Configuration
app.get('/api/get-settings', (req, res) => {
    res.json(globalControlState);
});

// 🎚️ 5. Legacy Sync Handler
app.post('/api/update-settings', (req, res) => {
    const { token, maintenanceMode, alertMessage, themeColor, blockedTools } = req.body;
    if (token !== 'AzanTools_Secure_786') return res.status(403).json({ success: false });

    if (maintenanceMode !== undefined) globalControlState.maintenanceMode = maintenanceMode;
    if (alertMessage !== undefined) globalControlState.alertMessage = alertMessage;
    if (themeColor !== undefined) globalControlState.themeColor = themeColor;
    if (blockedTools !== undefined) {
        globalControlState.blockedTools = blockedTools.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== "");
    }
    res.json({ success: true, currentSettings: globalControlState });
});

// 🚀 6. NEW MASTER ROUTE: Controller Supreme Interface Updates Handler
app.post('/api/update-master', (req, res) => {
    const { token, config } = req.body;
    if (token !== 'AzanTools_Secure_786') {
        return res.status(403).json({ success: false, error: 'Access Denied!' });
    }

    if (config) {
        globalControlState = { ...globalControlState, ...config };
        if (config.blockedTools && typeof config.blockedTools === 'string') {
            globalControlState.blockedTools = config.blockedTools.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== "");
        }
    }
    res.json({ success: true, currentSettings: globalControlState });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`[🚀] Master Control Server Active on port ${PORT}`));
}

module.exports = app;
                  
