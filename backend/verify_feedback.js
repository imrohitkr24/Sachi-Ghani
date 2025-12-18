
const https = require('https');

const data = JSON.stringify({
    name: 'Antigravity Test',
    message: 'Automated test of feedback submission',
    rating: 5
});

const options = {
    hostname: 'sachi-ghani-backend.onrender.com',
    port: 443,
    path: '/api/feedback',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
