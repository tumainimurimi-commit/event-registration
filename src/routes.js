const { validateRegistration } = require('./validators');
const { addRegistration, getAllRegistrations, findByRegNo, findByEmail } = require('./storage');
const fs = require('node:fs/promises');
const path = require('node:path');

async function entryPointHandler(req, res) {

     res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
    
        return;
    }
    const method = req.method;
    const path = req.url;

    if (method === 'POST' && path === '/api/register') {
        return await postRegistration(req, res);
    }

    if (method === 'GET' && path === '/api/registrations') {
        return await getRegistration(req, res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
}

function readBody(req) {
    const data = new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
    return data;
}

async function postRegistration(req, res) {
    try {
        const raw = await readBody(req);
        console.log('RAW BODY RECEIVED:', JSON.stringify(raw));
        console.log('RAW LENGTH:', raw.length);

        if (raw.length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Request body is empty' }));
            return;
        }

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (parseError) {
            console.log('PARSE ERROR:', parseError.message);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON body', received: raw }));
            return;
        }

        const result = validateRegistration(parsed);

        if (result.isValid === false) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ errors: result.errors }));
            return;
        }

        if (findByRegNo(result.studentData.regNo)) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Registration number already registered' }));
            return;
        }

        if (findByEmail(result.studentData.emailInfo)) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Email already registered' }));
            return;
        }

        const stored = addRegistration(result.studentData);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stored));

    } catch (error) {
        console.log('UNEXPECTED ERROR:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error', details: error.message }));
    }
}

async function getRegistration(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getAllRegistrations()));
}

module.exports = { entryPointHandler };