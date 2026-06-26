const connectForm = document.getElementById('connectForm');
const sitesGrid = document.getElementById('sitesGrid');

// 📊 Function: Connected websites ko server se la kar screen par dikhana
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
                
                // Date format set karne ke liye
                const date = new Date(site.connectedAt).toLocaleTimeString();

                siteCard.innerHTML = `
                    <div class="site-info">
                        <h4>${site.url}</h4>
                        <p>Linked at: ${date}</p>
                    </div>
                    <span class="badge-active">${site.status}</span>
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
            fetchConnectedWebsites(); // List ko फौरन update karein
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
          
