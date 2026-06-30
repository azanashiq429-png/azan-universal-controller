// State variables initialize karein (Buttons toggles ke liye)
let maintenanceState = false;
let blockPCState = false;
let bannerStatusState = false;

// Toggles Logic Controller Handler
const setupToggleSwitch = (btnId, toggleType) => {
    const btn = document.getElementById(btnId);
    if(btn) {
        btn.addEventListener('click', () => {
            if(toggleType === 'maintenance') {
                maintenanceState = !maintenanceState;
                btn.innerText = maintenanceState ? "ON" : "OFF";
                btn.style.background = maintenanceState ? "#ef4444" : "#475569";
            }
            if(toggleType === 'blockPC') {
                blockPCState = !blockPCState;
                btn.innerText = blockPCState ? "ON" : "OFF";
                btn.style.background = blockPCState ? "#f59e0b" : "#475569";
            }
            if(toggleType === 'bannerStatus') {
                bannerStatusState = !bannerStatusState;
                btn.innerText = bannerStatusState ? "ON" : "OFF";
                btn.style.background = bannerStatusState ? "#10b981" : "#475569";
            }
        });
    }
};

// Teeno specialized dashboard buttons trigger apply karein
setupToggleSwitch('btnMaintenance', 'maintenance');
setupToggleSwitch('btnBlockPC', 'blockPC');
setupToggleSwitch('btnBannerStatus', 'bannerStatus');

// 🚀 ULTIMATE MASTER BROADCASTER (Deploy All Supreme Settings Button)
const btnDeployMaster = document.getElementById('btnDeployMaster');
if(btnDeployMaster) {
    btnDeployMaster.addEventListener('click', async () => {
        const tokenInput = document.getElementById('webToken');
        const token = (tokenInput && tokenInput.value.trim()) || 'AzanTools_Secure_786';
        
        const redirectEl = document.getElementById('redirectUrl');
        const themeEl = document.getElementById('themeSelect');
        const blockedEl = document.getElementById('blockedToolsInput');
        const bannerTextEl = document.getElementById('bannerText');
        const bannerTypeEl = document.getElementById('bannerType');
        const titleEl = document.getElementById('siteTitle');
        const subtitleEl = document.getElementById('siteSubtitle');

        // Complex payload formatting schema mapping match
        const payload = {
            token: token,
            config: {
                maintenanceMode: maintenanceState,
                redirectUrl: redirectEl ? redirectEl.value.trim() : "",
                themeColor: themeEl ? themeEl.value : "default",
                blockedTools: blockedEl ? blockedEl.value.trim() : "",
                broadcastNotification: {
                    show: bannerStatusState,
                    text: bannerTextEl ? bannerTextEl.value.trim() : "",
                    type: bannerTypeEl ? bannerTypeEl.value : "info"
                },
                firewall: {
                    blockPC: blockPCState
                },
                meta: {
                    siteTitle: (titleEl && titleEl.value.trim()) || 'AZAN TOOLS',
                    siteSubtitle: (subtitleEl && subtitleEl.value.trim()) || 'WELCOME TO OUR TOOLKIT V 4.1'
                }
            }
        };

        try {
            // Relative routing handled securely
            const res = await fetch(window.location.origin + '/api/update-master', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if(data.success) {
                alert('Mubarak Ho! Supreme parameters updated and deployed live successfully.');
            } else {
                alert('Sync Fail: ' + data.error);
            }
        } catch(err) {
            alert('Data transmission error on high-security payload lanes.');
            console.error(err);
        }
    });
}

// 🔗 HANDSHAKE TUNNEL BRIDGE (Form Connection Manager)
const connectForm = document.getElementById('connectForm');
if(connectForm) {
    connectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert("Handshake Bridge Verified! Connection successfully established.");
        pollSystemTelemetry();
    });
}

// 🛰️ REAL-TIME POLLING ENGINE
async function pollSystemTelemetry() {
    try {
        const res = await fetch(window.location.origin + '/api/admin-stats');
        const data = await res.json();

        // 1. Dynamic Live Traffic Badge Sync
        const liveCounter = document.getElementById('liveCounter');
        if(liveCounter) liveCounter.innerText = data.activeUsersCount || 0;

        // 2. Active User Devices Matrix Renderer
        const usersList = document.getElementById('liveUsersList');
        if(usersList) {
            if(data.liveUsers && data.liveUsers.length > 0) {
                usersList.innerHTML = data.liveUsers.map(u => `
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.02); padding:6px 0; font-family: monospace;">
                        <span style="color:#00f2fe; font-weight:bold;">📍 ${u.ip}</span>
                        <span style="color:#94a3b8; font-size:11px; background:rgba(255,255,255,0.05); padding:2px 8px; border-radius:4px;">${u.device}</span>
                    </div>
                `).join('');
            } else {
                usersList.innerHTML = `<div style="color: #4b5563; font-style: italic;">No active device packets found. Waiting for traffic...</div>`;
            }
        }

        // 3. Cyber Operations Console Log Streaming Engine
        const consoleLogs = document.getElementById('logsConsole');
        if(consoleLogs) {
            if(data.logs && data.logs.length > 0) {
                consoleLogs.innerHTML = data.logs.map(l => `
                    <div style="margin-bottom:6px; font-family: monospace; line-height: 1.5; color: #a7f3d0;">
                        <span style="color:#64748b;">[${l.time}]</span> 
                        <span style="color:#34d399;">IP: ${l.ip}</span> 
                        <span style="color:#f43f5e;">(${l.device})</span> executed 
                        <span style="color:#00f2fe; font-weight:bold;">${l.action}</span> 
                        targeting <span style="color:#fbbf24; font-weight:bold;">[${l.tool}]</span>
                    </div>
                `).join('');
            } else {
                consoleLogs.innerHTML = `<div>&gt; Listening for incoming target client telemetry streams on port 3000...</div>`;
            }
        }

    } catch (err) {
        console.error("Telemetry parsing broken or connection closed.");
    }
}

// Polling core initialization loop
pollSystemTelemetry();
setInterval(pollSystemTelemetry, 2500);

// 🔥 Boot Loader Matrix
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch(window.location.origin + '/api/admin-stats');
        const data = await res.json();
        if(data.settings) {
            maintenanceState = data.settings.maintenanceMode || false;
            blockPCState = data.settings.firewall ? data.settings.firewall.blockPC : false;
            bannerStatusState = data.settings.broadcastNotification ? data.settings.broadcastNotification.show : false;

            // Apply Toggle States to UI
            const btnMaint = document.getElementById('btnMaintenance');
            if(btnMaint) {
                btnMaint.innerText = maintenanceState ? "ON" : "OFF";
                btnMaint.style.background = maintenanceState ? "#ef4444" : "#475569";
            }
            const btnPC = document.getElementById('btnBlockPC');
            if(btnPC) {
                btnPC.innerText = blockPCState ? "ON" : "OFF";
                btnPC.style.background = blockPCState ? "#f59e0b" : "#475569";
            }
            const btnBanner = document.getElementById('btnBannerStatus');
            if(btnBanner) {
                btnBanner.innerText = bannerStatusState ? "ON" : "OFF";
                btnBanner.style.background = bannerStatusState ? "#10b981" : "#475569";
            }
            
            if(data.settings.redirectUrl && document.getElementById('redirectUrl')) {
                document.getElementById('redirectUrl').value = data.settings.redirectUrl;
            }
            
            if(data.settings.blockedTools && document.getElementById('blockedToolsInput')) {
                document.getElementById('blockedToolsInput').value = Array.isArray(data.settings.blockedTools) ? data.settings.blockedTools.join(', ') : data.settings.blockedTools;
            }

            if(data.settings.meta) {
                if(document.getElementById('siteTitle')) document.getElementById('siteTitle').value = data.settings.meta.siteTitle || "";
                if(document.getElementById('siteSubtitle')) document.getElementById('siteSubtitle').value = data.settings.meta.siteSubtitle || "";
            }

            if(data.settings.broadcastNotification && document.getElementById('bannerText')) {
                document.getElementById('bannerText').value = data.settings.broadcastNotification.text || "";
            }
            if(data.settings.broadcastNotification && document.getElementById('bannerType')) {
                document.getElementById('bannerType').value = data.settings.broadcastNotification.type || "info";
            }
            if(data.settings.themeColor && document.getElementById('themeSelect')) {
                document.getElementById('themeSelect').value = data.settings.themeColor || "default";
            }
        }
    } catch(e) { 
        console.error("Initial boot tracking parameter failure.", e); 
    }
});
            
