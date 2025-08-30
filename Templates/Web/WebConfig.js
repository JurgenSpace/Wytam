const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'ip-log.txt');

function logIP(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    const logEntry = `[${new Date().toISOString()}] ${ip}\n`;
    fs.appendFile(logFile, logEntry, err => {
        if (err) console.error('Błąd zapisu IP:', err);
    });
}

module.exports = { logIP };