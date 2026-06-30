const store = require('./_store');

module.exports = (req, res) => {
    res.status(200).json({
        activeCount: store.onlineTerminals.length,
        terminals: store.onlineTerminals.slice(0, 10),
        logs: store.telemetryLogs.slice(0, 20)
    });
};
