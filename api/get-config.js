const store = require('./_store');

module.exports = (req, res) => {
    const { siteId } = req.query;
    if (!siteId) return res.status(400).json({ error: "Missing identity space target" });
    
    if (!store.multiTenantConfigurations[siteId]) {
        store.multiTenantConfigurations[siteId] = {
            maintenanceMode: false, redirectUrl: "https://google.com", blockPC: false, antiBot: false,
            blacklistedModules: [], broadcastNotification: { show: false, text: "", type: "info" },
            meta: { siteTitle: "Managed Portal", siteSubtitle: "Cloud Node Active" }
        };
    }
    res.status(200).json(store.multiTenantConfigurations[siteId]);
};
