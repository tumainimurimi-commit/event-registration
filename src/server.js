const http = require('node:http');
const { entryPointHandler } = require('./routes');

const PORT = 3001;

const server = http.createServer((req, res) => {
    const date = new Date().toISOString();
    console.log(`[${date}] ${req.method} ${req.url}`);

    entryPointHandler(req, res).catch((error) => {
        console.error('Unhandled error in router:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});