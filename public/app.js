// Global State Variables for Toggles
let maintenanceState = false;
let blockPCState = false;
let bannerStatusState = false;

// Sabse pehle poore page ke load hone ka wait karein taake buttons crash na hon
document.addEventListener("DOMContentLoaded", () => {
    console.log("[🚀] Azan Tools Frontend Engine Initialized Successfully.");

    // --- 🎚️ TOGGLE SWITCHES LOGIC HANDLER ---
    const btnMaintenance = document.getElementById('btnMaintenance');
    if (btnMaintenance) {
        btnMaintenance.addEventListener('click', (e) => {
            e.preventDefault();
            maintenanceState = !maintenanceState;
            btnMaintenance.innerText = maintenanceState ? "ON" : "OFF";
            btnMaintenance.style.background = maintenanceState ? "#ef4444" : "#475569";
            console.log("Maintenance State:", maintenanceState);
        });
    }

    const btnBlockPC = document.getElementById('btnBlockPC');
    if (btnBlockPC) {
        btnBlockPC.addEventListener('click', (e) => {
            e.preventDefault();
            blockPCState = !blockPCState;
            btnBlockPC.innerText = blockPCState ? "ON" : "OFF";
            btnBlockPC.style.background = blockPCState ? "#f59e0b" : "#475569";
            console.log("Block PC State:", blockPCState);
        });
    }

    const btnBannerStatus = document.getElementById('btnBannerStatus');
    if (btnBannerStatus) {
        btnBannerStatus.addEventListener('click', (e) => {
            e.preventDefault();
            bannerStatusState = !bannerStatusState;
            btnBannerStatus.innerText = bannerStatusState ? "ON" : "OFF";
            btnBannerStatus.style.background = bannerStatusState ? "#10b981" : "#475569";
            console.log("Banner Status:", bannerStatusState);
        });
    }

    // --- 🔗 HANDSHAKE TUNNEL BRIDGE CONNECTOR ---
    const connectForm = document.getElementById('connectForm');
    if (connectForm) {
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
                alert("Tunnel offline! Make sure backend is active.");
            }
        });
    }

    // --- 🚀 ULTIMATE MASTER BROADCASTER (Deploy Button) ---
    const btnDeployMaster = document.getElementById('btnDeployMaster');
    if (btnDeployMaster) {
        btnDeployMaster.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const tokenInput = document.getElementById('webToken');
            const token = tokenInput ? tokenInput.value.trim() : 'AzanTools_Secure_786';
            
            // Safe reading pattern with default fallbacks
            const redirectUrl = document.getElementById('redirectUrl') ? document.getElementById('redirectUrl').value.trim() : "";
            const themeSelect = document.getElementById('themeSelect') ? document.getElementById('themeSelect').value : "default";
            const blockedToolsInput = document.getElementById('blockedToolsInput') ? document.getElementById('blockedToolsInput').value : "";
            const bannerText = document.getElementById('bannerText') ? document.getElementById('bannerText').value.trim() : "";
            const bannerType = document.getElementById('bannerType') ? document.getElementById('bannerType').value : "info";
            const siteTitle = document.getElementById('siteTitle') ? document.getElementById('siteTitle').value.trim() : 'AZAN TOOLS';
            const siteSubtitle = document.getElementById('siteSubtitle') ? document.getElementById('siteSubtitle').value.trim() : 'WELCOME TO OUR TOOLKIT V 4.1';

            const payload = {
                token: token || 'AzanTools_Secure_786',
                config: {
                    maintenanceMode: maintenanceState,
                    redirectUrl: redirectUrl,
                    themeColor: themeSelect,
                    blockedTools: blockedToolsInput,
                    broadcastNotification: {
                        show: bannerStatusState,
                        text: bannerText,
                        type: bannerType
                    },
                    firewall: {
                        blockPC: blockPCState
                    },
                    meta: {
                        siteTitle: siteTitle || 'AZAN TOOLS',
                        siteSubtitle: siteSubtitle || 'WELCOME TO OUR TOOLKIT V 4.1'
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
                
                if (data.success) {
                    alert('Mubarak Ho! Supreme parameters updated and deployed live successfully.');
                } else {
                    alert('Sync Fail: ' + data.error);
                }
            } catch (err) {
                alert('Data transmission error on high-security payload lanes.');
                console.error(err);
            }
        });
    }

    // --- 🛰️ REAL-TIME TELEMETRY POLLING LOOP ---
    async function pollSystemTelemetry() {
        try {
            const res = await fetch('/api/admin-stats');
            if(!res.ok) return;
            const data = await res.json();

            // 1. Live traffic counters sync
            const liveCounter = document.getElementById('liveCounter');
            if (liveCounter) liveCounter.innerText = data.activeUsersCount || 0;

            // 2. Devices list builder
            const usersList = document.getElementById('liveUsersList');
            if (usersList) {
                if (data.liveUsers && data.liveUsers.length > 0) {
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

            // 3. System streaming console log logs
            const consoleLogs = document.getElementById('logsConsole');
            if (consoleLogs) {
                if (data.logs && data.logs.length > 0) {
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
                    consoleLogs.innerHTML = `<div>&gt; Listening for incoming target client telemetry streams on secure ports...</div>`;
                }
            }

        } catch (err) {
            console.error("Telemetry connection frame shifting...");
        }
    }

    // Trigger polling immediately and loop every 2.5 seconds
    pollSystemTelemetry();
    setInterval(pollSystemTelemetry, 2500);
});
                
