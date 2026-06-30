const store = require('./_store');

module.exports = (req, res) => {
    const clientKey = req.query.key;
    let siteId = (clientKey === "AzanTools_Secure_786") ? "azan_toolkit_suite" : "client_realm_" + (clientKey || "unknown");

    if (!store.multiTenantConfigurations[siteId]) {
        store.multiTenantConfigurations[siteId] = {
            maintenanceMode: false, redirectUrl: "https://google.com", blockPC: false, antiBot: false,
            blacklistedModules: [], broadcastNotification: { show: false, text: "", type: "info" },
            meta: { siteTitle: "Remote Shield Engine", siteSubtitle: "SaaS Layer Verified" }
        };
    }

    const currentConfig = store.multiTenantConfigurations[siteId];
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Client Node";

    if (!store.onlineTerminals.find(t => t.ip === clientIp && t.siteId === siteId)) {
        store.onlineTerminals.push({ ip: clientIp, device: "Node Engine", siteId: siteId });
    }
    store.telemetryLogs.unshift({
        time: new Date().toLocaleTimeString(),
        ip: clientIp,
        action: "SDK_BRIDGE_HOOK",
        siteId: siteId
    });

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(`
        (function() {
            console.log("⚡ Universal Controller Active on: ${siteId}");
            const config = ${JSON.stringify(currentConfig)};
            if (config.maintenanceMode) {
                window.location.href = config.redirectUrl || "https://google.com";
                return;
            }
            if (config.meta && config.meta.siteTitle) {
                document.title = config.meta.siteTitle;
            }
        })();
    `);
};
            
