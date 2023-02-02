const https = require('https');
const fs = require('fs');

function boop(){
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

req.end();}

// // Write a function called `getPeople` that will retrieve list of all the available people on the `northcoders` server . This should:
// 1. Use node's `https` module to make a request to `https://nc-leaks.herokuapp.com/api/people`.
// 2. Once you have the response as a useable object, look through the people to find anyone who has `northcoders` as the workplace.
// 3. Save these `northcoders` employees to a file called `northcoders.json` - remember that the data argument of `fs.writeFile` must be of type string\* so you may need to manipulate the data before saving it.

function getPeople() {
    const options = {
    hostname: 'nc-leaks.herokuapp.com',
    path: '/api/people',
    method: 'GET'
};

const req = https.request(options, (response) => {
    let body = '';

    response.on('data', (packet) => {
        body += packet.toString();
    });

    response.on('end', () => {
        const parsedBody = JSON.parse(body);
        const obtainObject = parsedBody.people
        const northcoderPeople = obtainObject.filter(person => person.job.workplace === "northcoders")
        // console.log(northcoderPeople);

        let Str = ""
        northcoderPeople.forEach(element => { Str += JSON.stringify(element)
        });;
        
        console.log(Str);
        fs.writeFile(`northcoder.json`, Str, () => {});
    });
});

req.end()


}

getPeople()
