const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

const app = express();

// 🔐 LIGHTWEIGHT NATIVE FIREBASE INITIALIZATION
const firebaseConfig = {
  apiKey: "AIzaSyBgUlcykzcAEfvfVV7Dqi4lcTbmwC_hIzM",
  authDomain: "azan-universal-controller.firebaseapp.com",
  projectId: "azan-universal-controller",
  storageBucket: "azan-universal-controller.firebasestorage.app",
  messagingSenderId: "1070198405348",
  appId: "1:1070198405348:web:61f1f4d9e90bce182c94f1"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const docRef = doc(db, 'system', 'liveSettings');

// Middlewares setup
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('public'));

// 📡 CORS OVERWRITE HEADERS FOR ALL REQUESTS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const defaultSettings = {
    maintenanceMode: false,
    alertMessage: "",
    themeColor: "default", 
    blockedTools: [],       
    redirectUrl: "",        
    broadcastNotification: { show: false, text: "", type: "info" },
    firewall: { blockPC: false },
    meta: { siteTitle: "AZAN TOOLS", siteSubtitle: "WELCOME TO OUR TOOLKIT V 4.1" }
};

let liveSessions = {}; 
let activityLogs = [];

// Helper: Fast fetch settings from Firebase
async function fetchCurrentSettings() {
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            await setDoc(docRef, defaultSettings);
            return defaultSettings;
        }
    } catch (e) {
        console.error("Firebase Read Error:", e);
        return defaultSettings;
    }
}

// 📡 Traffic tracking middleware
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = ip.split(',')[0].trim().replace('::1', '127.0.0.1');
    const userAgent = req.headers['user-agent'] || '';
    
    if (req.url.startsWith('/api/')) {
        const isPC = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        liveSessions[cleanIp] = {
            lastSeen: Date.now(),
            device: isPC ? "💻 PC / Desktop" : "📱 Mobile Device",
            ip: cleanIp
        };
    }
    next();
});

// Periodic session cleaner
setInterval(() => {
    const now = Date.now();
    for (let ip in liveSessions) {
        if (now - liveSessions[ip].lastSeen > 20000) delete liveSessions[ip];
    }
}, 10000);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/report-activity', (req, res) => {
    const { action, tool, device } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = ip.split(',')[0].trim().replace('::1', '127.0.0.1');

    activityLogs.unshift({
        action: action || 'Tool Opened',
        tool: tool || 'Component',
        device: device || 'Unknown',
        ip: cleanIp,
        time: new Date().toLocaleTimeString()
    });
    if (activityLogs.length > 25) activityLogs.pop();

    res.json({ success: true });
});

app.get('/api/admin-stats', async (req, res) => {
    const currentSettings = await fetchCurrentSettings();
    res.json({
        settings: currentSettings,
        activeUsersCount: Object.keys(liveSessions).length,
        liveUsers: Object.values(liveSessions),
        logs: activityLogs
    });
});

app.get('/api/get-settings', async (req, res) => {
    const currentSettings = await fetchCurrentSettings();
    res.json(currentSettings);
});

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

            await setDoc(docRef, updatedSettings, { merge: true });
            return res.json({ success: true, currentSettings: updatedSettings });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }
    res.status(400).json({ success: false, error: 'Bad Payload Matrix' });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`[🚀] Light-core running on port ${PORT}`));
}

module.exports = app;
    
