const https = require('https');
const http = require('http');
const net = require('net');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Opcje SSL do tunelowania HTTPS
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

// HTTPS Proxy Tunnel (CONNECT)
function startHttpsTunnelProxy(port = 8888) {
    const server = https.createServer(sslOptions);

    server.on('connect', (req, clientSocket, head) => {
        const { port, hostname } = url.parse(`//${req.url}`, false, true);

        const serverSocket = net.connect(port || 443, hostname, () => {
            clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
            serverSocket.write(head);
            serverSocket.pipe(clientSocket);
            clientSocket.pipe(serverSocket);
        });

        serverSocket.on('error', () => clientSocket.end());
    });

    server.on('request', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('HTTPS Tunnel Proxy działa.\n');
    });

    server.listen(port, () => {
        console.log(`HTTPS Tunnel Proxy nasłuchuje na porcie ${port}`);
    });
}

module.exports = { startHttpsTunnelProxy };