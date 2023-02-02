const https = require('https');
const fs = require('fs');

const options = {
    hostname: 'nc-leaks.herokuapp.com',
    path: '/api/confidential',
    method: 'GET'
};

const req = https.request(options, (response) => {
    let body = '';

    response.on('data', (packet) => {
        body += packet.toString();
    });

    response.on('end', () => {
        const parsedBody = JSON.parse(body);
        //console.log(parsedBody);

        const instructions = parsedBody.instructions;
        //console.log(instructions);
        fs.writeFile(`instructions.md`, instructions, () => {});
    });
});

req.end();
