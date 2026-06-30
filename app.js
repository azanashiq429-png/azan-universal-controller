let maintenanceState = false;
let blockPCState = false;
let antiBotState = false;
let tickerState = false;

function syncToggleUI(id, state, activeBg) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.innerText = state ? "ON" : "OFF";
    btn.style.background = state ? activeBg : "#1e293b";
}

function bindToggleAction(id, getter, setter, color) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', () => {
            setter(!getter());
            syncToggleUI(id, getter(), color);
        });
    }
}

bindToggleAction('toggleMaintenance', () => maintenanceState, (v) => maintenanceState = v, '#ef4444');
bindToggleAction('toggleBlockPC', () => blockPCState, (v) => blockPCState = v, '#f59e0b');
bindToggleAction('toggleAntiBot', () => antiBotState, (v) => antiBotState = v, '#a855f7');
bindToggleAction('toggleTickerStatus', () => tickerState, (v) => tickerState = v, '#10b981');

const selector = document.getElementById('activeSiteSelector');

async function pullActiveConfig() {
    try {
        const res = await fetch(`/api/get-config?siteId=${selector.value}`);
        const config = await res.json();
        
        maintenanceState = config.maintenanceMode || false;
        blockPCState = config.blockPC || false;
        antiBotState = config.antiBot || false;
        tickerState = config.broadcastNotification?.show || false;

        syncToggleUI('toggleMaintenance', maintenanceState, '#ef4444');
        syncToggleUI('toggleBlockPC', blockPCState, '#f59e0b');
        syncToggleUI('toggleAntiBot', antiBotState, '#a855f7');
        syncToggleUI('toggleTickerStatus', tickerState, '#10b981');

        document.getElementById('redirectRouteUrl').value = config.redirectUrl || "";
        document.getElementById('blacklistedModulesInput').value = (config.blacklistedModules || []).join(', ');
        document.getElementById('tickerMsgText').value = config.broadcastNotification?.text || "";
        document.getElementById('tickerThemeType').value = config.broadcastNotification?.type || "info";
        document.getElementById('metaSiteTitle').value = config.meta?.siteTitle || "";
        document.getElementById('metaSiteSubtitle').value = config.meta?.siteSubtitle || "";
    } catch (err) {
        console.error("Buffer transmission sync failed.");
    }
}

selector.addEventListener('change', pullActiveConfig);

document.getElementById('btnDeployGlobalMaster').addEventListener('click', async () => {
    const payload = {
        token: document.getElementById('userMasterToken').value.trim(),
        siteId: selector.value,
        config: {
            maintenanceMode: maintenanceState,
            redirectUrl: document.getElementById('redirectRouteUrl').value.trim(),
            blockPC: blockPCState,
            antiBot: antiBotState,
            blacklistedModules: document.getElementById('blacklistedModulesInput').value.split(',').map(s => s.trim()).filter(Boolean),
            broadcastNotification: {
                show: tickerState,
                text: document.getElementById('tickerMsgText').value.trim(),
                type: document.getElementById('tickerThemeType').value
            },
            meta: {
                siteTitle: document.getElementById('metaSiteTitle').value.trim(),
                siteSubtitle: document.getElementById('metaSiteSubtitle').value.trim()
            }
        }
    };

    try {
        const res = await fetch('/api/update-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            alert('Mubarak Ho Bhai! Configurations broadcasted to decentralized realms.');
        } else {
            alert('Auth Error: ' + data.error);
        }
    } catch (e) {
        alert('Data layer routing crash.');
    }
});

async function streamTelemetry() {
    try {
        const res = await fetch('/api/telemetry-stats');
        const data = await res.json();
        document.getElementById('globalTrafficCount').innerText = data.activeCount || 0;

        document.getElementById('liveClientTerminalsList').innerHTML = data.terminals.length === 0 ? 
            '<div class="text-slate-600 text-center pt-12 font-mono">// Waiting for node handshake packet...</div>' :
            data.terminals.map(t => `<div class="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex justify-between items-center"><span class="font-mono text-cyan-400">📍 ${t.ip}</span><span class="text-[9px] px-2 py-0.5 bg-slate-900 border border-white/5 text-purple-400 rounded-md">${t.siteId}</span></div>`).join('');

        document.getElementById('telemetryStreamConsole').innerHTML = data.logs.length === 0 ? 
            '<div class="text-slate-600">&gt; Listener online... waiting for signals pipelines.</div>' :
            data.logs.map(l => `<div><span class="text-slate-600">[${l.time}]</span> <span class="text-cyan-500">${l.ip}</span> executed <span class="text-yellow-400">[${l.action}]</span> target -> <span class="text-purple-400">${l.siteId}</span></div>`).join('');
    } catch (e) {}
}

setInterval(streamTelemetry, 3000);
window.addEventListener('DOMContentLoaded', () => {
    pullActiveConfig();
    streamTelemetry();
});
          
