const connectForm = document.getElementById('connectForm');
const sitesGrid = document.getElementById('sitesGrid');

// 📊 Function: Connected websites aur unki activities ko server se la kar screen par dikhana
async function fetchConnectedWebsites() {
    try {
        const response = await fetch('/api/status');
        const sites = await response.json();

        if (Object.keys(sites).length > 0) {
            // Grid ko clear karein
            sitesGrid.innerHTML = '';

            // Har connected website ke liye card banayein
            for (let url in sites) {
                const site = sites[url];
                const siteCard = document.createElement('div');
                siteCard.className = 'site-item';
                siteCard.style.display = 'flex';
                siteCard.style.flexDirection = 'column';
                siteCard.style.gap = '10px';
                siteCard.style.padding = '15px';
                siteCard.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                siteCard.style.borderRadius = '10px';
                siteCard.style.background = '#0e1626';
                siteCard.style.marginBottom = '15px';

                // 📡 Live Activities Feeds generate karna
                let activitiesListHtml = '';
                if (site.events && site.events.length > 0) {
                    site.events.forEach(ev => {
                        activitiesListHtml += `
                            <div style="font-size: 0.8rem; background: rgba(0,0,0,0.3); padding: 6px 10px; border-radius: 6px; border-left: 3px solid #00f2fe; margin-bottom: 4px; display: flex; justify-content: space-between;">
                                <span>⚡ <b>${ev.action}</b> [${ev.tool}]</span>
                                <span style="color: #64748b;">${ev.time}</span>
                            </div>
                        `;
                    });
                } else {
                    activitiesListHtml = `<div style="font-size: 0.8rem; color: #64748b; font-style: italic; padding: 5px;">No events captured yet. Waiting for interaction...</div>`;
                }

                siteCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <div class="site-info">
                            <h4 style="margin: 0; color: #ffffff; font-size: 1.1rem;">${site.url || url}</h4>
                            <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #8fa0dd;">Linked: ${site.connectedAt ? new Date(site.connectedAt).toLocaleTimeString() : 'Just Now'}</p>
                        </div>
                        <span class="badge-active" style="background: #22c55e; color: #fff; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">${site.status}</span>
                    </div>
                    
                    <div class="activity-monitor" style="margin-top: 5px;">
                        <strong style="font-size: 0.8rem; color: #a371f7; display: block; margin-bottom: 6px;">Live Activity Feed:</strong>
                        ${activitiesListHtml}
                    </div>
                `;
                sitesGrid.appendChild(siteCard);
            }
        } else {
            sitesGrid.innerHTML = `<div class="no-sites">No websites connected yet. Waiting for handshake...</div>`;
        }
    } catch (error) {
        console.error("Data fetch karne mein masla aaya:", error);
    }
}

// 🔗 Form Submission: Jab aap "Establish Connection" par click karenge
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
            alert("Mubarak ho! Connection successfully establish ho gaya.");
            fetchConnectedWebsites();
        } else {
            alert("Error: " + result.message);
        }

    } catch (error) {
        alert("Server se connect nahi ho saka. Pehle backend run karein.");
        console.error(error);
    }
});

// ==========================================
// 🔥 NEW FEATURES: REMOTE CONTROL COMMANDS
// ==========================================

let maintenanceState = false;
const btnMaintenance = document.getElementById('btnMaintenance');

// Maintenance Button ON/OFF State Toggle
if(btnMaintenance) {
    btnMaintenance.addEventListener('click', () => {
        maintenanceState = !maintenanceState;
        if(maintenanceState) {
            btnMaintenance.innerText = "ON";
            btnMaintenance.style.background = "#ef4444"; // Red Color
        } else {
            btnMaintenance.innerText = "OFF";
            btnMaintenance.style.background = "#475569"; // Slate Color
        }
    });
}

// "Apply Supreme Commands" Button par click hone ki poori logic (Ab isme saare features hain)
const btnUpdateSettings = document.getElementById('btnUpdateSettings');
if(btnUpdateSettings) {
    btnUpdateSettings.addEventListener('click', async () => {
        const token = document.getElementById('webToken').value.trim() || 'AzanTools_Secure_786';
        const alertMessage = document.getElementById('alertMsg').value.trim();
        
        // 🎨 Naye Elements ka data pick karna
        const themeColor = document.getElementById('themeSelect') ? document.getElementById('themeSelect').value : 'default';
        const blockedTools = document.getElementById('blockedToolsInput') ? document.getElementById('blockedToolsInput').value : '';

        try {
            const response = await fetch('/api/update-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    maintenanceMode: maintenanceState,
                    alertMessage: alertMessage,
                    themeColor: themeColor,     // Server ko send ho raha hai
                    blockedTools: blockedTools   // Server ko send ho raha hai
                })
            });
            const data = await response.json();
            if(data.success) {
                alert('Supreme Commands deployed successfully!');
                document.getElementById('alertMsg').value = ''; // Alert field reset
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Settings update karne me masla aaya.');
        }
    });
}

// Initial functions trigger
fetchConnectedWebsites();

// Background Automatic Reloading Monitoring
setInterval(fetchConnectedWebsites, 5000);
            
