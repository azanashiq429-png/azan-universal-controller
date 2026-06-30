let multiTenantConfigurations = {
    "azan_toolkit_suite": {
        maintenanceMode: false,
        redirectUrl: "https://google.com",
        blockPC: false,
        antiBot: false,
        blacklistedModules: [],
        broadcastNotification: { show: false, text: "System Online", type: "info" },
        meta: { siteTitle: "AZAN TOOLS PRO", siteSubtitle: "UNIVERSAL TOOLKIT EDITION" }
    }
};
let telemetryLogs = [];
let onlineTerminals = [];

module.exports = { multiTenantConfigurations, telemetryLogs, onlineTerminals };
