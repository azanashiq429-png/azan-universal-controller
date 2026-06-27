const connectForm = document.getElementById('connectForm');
const sitesGrid = document.getElementById('sitesGrid');

// 📊 Function: Connected websites aur unki activities ko server se la kar screen par dikhana
async function fetchConnectedWebsites() {
    try {
        const response = await fetch('/api/websites');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            // Grid ko clear karein
            sitesGrid.innerHTML = '';

            // Har connected website ke liye card banayein
            result.data.forEach(site => {
                const siteCard = document.createElement('div');
                siteCard.className = 'site-item';
                siteCard.style.display = 'flex';
                siteCard.style.flexDirection = 'column';
                siteCard.style.gap = '10px';
                siteCard.style.padding = '15px';
                siteCard.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                siteCard.style.borderRadius = '10px';
                siteCard.style.background = '#0e1626';
                
                // Date format set karne ke liye
                const date = new Date(site.connectedAt).toLocaleTimeString();

                // 📡 Live Activities Feeds generate karna
                let activitiesListHtml = '';
                if (site.activities && site.activities.length > 0) {
                    // Sabse latest 4 activities ko ulta (reverse) karke dikhana
                    const latestActivities = [...site.activities].reverse().slice(0, 4);
                    
                    latestActivities.forEach(act => {
                        const actTime = new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        activitiesListHtml += `
                            <div style="font-size: 0.8rem; background: rgba(0,0,0,0.3); padding: 6px 10px; border-radius: 6px; border-left: 3px solid #00f2fe; margin-bottom: 4px; display: flex; justify-content: space-between;">
                                <span>⚡ <b>${act.action}</b> [${act.toolName}]</span>
                                <span style="color: #64748b;">${actTime}</span>
                            </div>
                        `;
                    });
                } else {
                    activitiesListHtml = `<div style="font-size: 0.8rem; color: #64748b; font-style: italic; padding: 5px;">No events captured yet. Waiting for interaction...</div>`;
                }

                siteCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <div class="site-info">
                            <h4 style="margin: 0; color: #ffffff; font-size: 1.1rem;">${site.url}</h4>
                            <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #8fa0dd;">Linked: ${date}</p>
                        </div>
                        <span class="badge-active" style="background: #22c55e; color: #fff; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">${site.status}</span>
                    </div>
                    
                    <div class="activity-monitor" style="margin-top: 5px;">
                        <strong style="font-size: 0.8rem; color: #a371f7; display: block; margin-bottom: 6px;">Live Activity Feed:</strong>
                        ${activitiesListHtml}
                    </div>
                `;
                sitesGrid.appendChild(siteCard);
            });
        } else {
            // Agar koi site nahi hai toh default text show karein
            sitesGrid.innerHTML = `<div class="no-sites">No websites connected yet. Waiting for handshake...</div>`;
        }
    } catch (error) {
        console.error("Data fetch karne mein masla aaya:", error);
    }
}

// 🔗 Form Submission: Jab aap "Establish Connection" par click karenge
connectForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Page refresh hone se rokna

    const websiteUrl = document.getElementById('webUrl').value;
    const connectorToken = document.getElementById('webToken').value;

    try {
        const response = await fetch('/api/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ websiteUrl, connectorToken })
        });

        const result = await response.json();

        if (result.success) {
            alert("Mubarak ho! Connection successfully establish ho gaya.");
            connectForm.reset(); // Form inputs clear karein
            fetchConnectedWebsites(); // List ko fawran update karein
        } else {
            alert("Error: " + result.message);
        }

    } catch (error) {
        alert("Server se connect nahi ho saka. Pehle backend run karein.");
        console.error(error);
    }
});

// Page load hote hi connected websites check karein
fetchConnectedWebsites();

// Har 5 second baad background mein automatic update karein (Live Monitoring)
setInterval(fetchConnectedWebsites, 5000);
                    
