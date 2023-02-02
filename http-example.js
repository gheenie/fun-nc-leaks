const https = require('https');

const options = {
    hostname: 'itunes.apple.com',
    path: '/search?term=beyonce&limit=100',
    method: 'GET'
};

const request = https.request(options, (response) => {
    let body = '';

    // A longer response will be split - increase limit to test.
    response.on('data', (packet) => {
        // Packet original data type is buffer - convert to string, finally to JSON.
        body += packet.toString();
    });

    response.on('end', () => {
        const parsedBody = JSON.parse(body);
        console.log(parsedBody);
    });
});

request.end();
