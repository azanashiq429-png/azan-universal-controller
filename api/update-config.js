const store = require('./_store');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { token, siteId, config } = req.body;
    
    if (token !== "AzanTools_Secure_786") {
        return res.status(401).json({ success: false, error: "Token Key Mismatch" });
    }

    store.multiTenantConfigurations[siteId] = config;
    store.telemetryLogs.unshift({
        time: new Date().toLocaleTimeString(),
        ip: "NEXUS_ADMIN",
        action: "CONFIG_SET_BROADCAST",
        siteId: siteId
    });

    res.status(200).json({ success: true });
};
           
