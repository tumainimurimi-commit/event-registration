//Importing module to the route.js file
const { validateRegistration } = require('./validators');
const {
    addRegistration,
    getAllRegistrations,
    findByRegNo,
    findByEmail,
    findById,
    updateRegistrationById,
    deleteRegistrationById,
    toggleAttendanceById
} = require('./storage');

//the main enrty point function that determine what request was made to the server and how to handle it
async function entryPointHandler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const method = req.method;
    const urlPath = req.url;

    if (method === 'POST' && urlPath === '/api/register') {
        return await postRegistration(req, res);
    }

    if (method === 'GET' && urlPath === '/api/registrations') {
        return await getRegistration(req, res);
    }

    if (method === 'PUT' && urlPath.startsWith('/api/registrations/')) {
        return await updateRegistrationHandler(req, res);
    }

    if (method === 'DELETE' && urlPath.startsWith('/api/registrations/')) {
        return await deleteRegistrationHandler(req, res);
    }

    if (method === 'PATCH' && urlPath.startsWith('/api/registrations/') && urlPath.endsWith('/attendance')) {
        return await toggleAttendanceHandler(req, res);
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

        if (raw.length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Request body is empty' }));
            return;
        }

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (parseError) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
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
        console.error('postRegistration error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
}

async function updateRegistrationHandler(req, res) {
    try {
        // Step 1: Extract the id from the URL
        const id = req.url.slice('/api/registrations/'.length);
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing student id' }));
            return;
        }

        // Step 2: Read the body
        const raw = await readBody(req);

        // Step 3: Parse JSON
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
        }

        // Step 4: Validate
        const result = validateRegistration(parsed);
        if (result.isValid === false) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ errors: result.errors }));
            return;
        }

        // Step 5: Find the student
        const existing = findById(id);
        if (!existing) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Student not found' }));
            return;
        }

        // Step 6: Update the fields
        const updated = updateRegistrationById(id, result.studentData);
        if (!updated) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Could not update student' }));
            return;
        }

        // Step 7: Respond with the updated record
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updated));

    } catch (error) {
        console.error('updateRegistrationHandler error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
}

async function deleteRegistrationHandler(req, res) {
    try {
        // Step 1: Extract the id from the URL
        const id = req.url.slice('/api/registrations/'.length);
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing student id' }));
            return;
        }

        // Step 2: Remove from storage
        const removed = deleteRegistrationById(id);
        if (!removed) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Student not found' }));
            return;
        }

        // Step 3: Respond with confirmation
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Student deleted', id }));

    } catch (error) {
        console.error('deleteRegistrationHandler error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
}

async function toggleAttendanceHandler(req, res) {
    try {
        // Step 1: Extract the id from the URL
        // URL shape: /api/registrations/<id>/attendance
        const start = '/api/registrations/'.length;
        const end = req.url.length - '/attendance'.length;
        const id = req.url.slice(start, end);

        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing student id' }));
            return;
        }

        // Step 2: Toggle attendance in storage
        const updated = toggleAttendanceById(id);
        if (!updated) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Student not found' }));
            return;
        }

        // Step 3: Respond with the updated record
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updated));

    } catch (error) {
        console.error('toggleAttendanceHandler error:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
}

async function getRegistration(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getAllRegistrations()));
}

module.exports = { entryPointHandler };