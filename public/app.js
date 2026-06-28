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
        const token = document.getElementById('webToken').value.trim() || 'AzanTools_Secure_786';
        
        const payload = {
            token: token,
            config: {
                maintenanceMode: maintenanceState,
                redirectUrl: document.getElementById('redirectUrl').value.trim(),
                themeColor: document.getElementById('themeSelect').value,
                blockedTools: document.getElementById('blockedToolsInput').value,
                broadcastNotification: {
                    show: bannerStatusState,
                    text: document.getElementById('bannerText').value.trim(),
                    type: document.getElementById('bannerType').value
                },
                firewall: {
                    blockPC: blockPCState
                },
                meta: {
                    siteTitle: document.getElementById('siteTitle').value.trim() || 'AZAN TOOLS',
                    siteSubtitle: document.getElementById('siteSubtitle').value.trim() || 'WELCOME TO OUR TOOLKIT V 4.1'
                }
            }
        };

        try {
            const res = await fetch('/api/update-master', {
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

// 🔗 HANDSHAKE TUNNEL BRIDGE (Form Connection Manager - FIXED FOR ALL VERSIONS)
const connectForm = document.getElementById('connectForm');
if(connectForm) {
    connectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = document.getElementById('webUrl').value.trim();
        const token = document.getElementById('webToken').value.trim();

        try {
            const response = await fetch('/api/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, token })
            });
            const result = await response.json();

            if (result.success) {
                alert("Handshake Bridge Verified! Connection successfully established.");
                pollSystemTelemetry();
            } else {
                alert("Access Denied: " + result.message);
            }
        } catch (error) {
            alert("Tunnel offline! Make sure backend server is running and fully deployed.");
        }
    });
}

// 🛰️ REAL-TIME POLLING ENGINE (Fixed to support both new console logs and legacy backup checks)
async function pollSystemTelemetry() {
    try {
        // Fallback sync check for legacy networks
        fetch('/api/status').catch(e => console.log("Legacy status route idle."));

        const res = await fetch('/api/admin-stats');
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
                    <div style="margin-bottom:6px; font-family: monospace; line-height: 1.5;">
                        <span style="color:#64748b;">[${l.time}]</span> 
                        <span style="color:#34d399;">IP: ${l.ip}</span> 
                        <span style="color:#f43f5e;">(${l.device})</span> executed 
                        <span style="color:#00f2fe; font-weight:bold;">${l.action}</span> 
                        targeting <span style="color:#fbbf24; font-weight:bold;">[${l.tool}]</span>
                    </div>
                `).join('');
            } else {
                consoleLogs.innerHTML = `<div>&gt; Listening for incoming target client telemetry streams on secure API ports...</div>`;
            }
        }

    } catch (err) {
        console.error("Telemetry parsing broken or connection closed.");
    }
}

// Polling core initialization
pollSystemTelemetry();
// Run interval loop
setInterval(pollSystemTelemetry, 2500);
            
