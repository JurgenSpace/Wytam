sstartHttpsTunnelProxy(8888);
const { logIP } = require('WebConfig');
const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { start } = require('repl');

const app = express();
const PORT = 8443;

const startHttpsTunnelProxy = require('Proxylib');
startHttpsTunnelProxy(8888);


// Wczytaj certyfikat SSL
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

app.use((req, res, next) => {
    logIP(req);
    next();
});

// Ustawienia bezpieczeństwa
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.disable('x-powered-by');

// Serwowanie statycznych plików
app.use(express.static(path.join(__dirname, '../Public')));

// Middleware blokujący cookies i śledzenie
app.use((req, res, next) => {
  res.setHeader('Set-Cookie', 'none; Max-Age=0; Secure; HttpOnly; SameSite=Strict');
  res.removeHeader('Set-Cookie');
  res.setHeader('Clear-Site-Data', '"cookies", "storage"');
  next();
});

// Prosta strona główna
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/index.html'));
});

// Obsługa błędów 404
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Start serwera HTTPS
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`AnonWeb HTTPS działa na https://localhost:${PORT}`);
});