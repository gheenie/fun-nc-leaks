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

    req.end();
}

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
            const obtainObject = parsedBody.people;
            const northcoderPeople = obtainObject.filter(person => person.job.workplace === "northcoders");
            const northcoderPeopleInJson = { people: northcoderPeople };

            fs.writeFile(`northcoder.json`, JSON.stringify(northcoderPeopleInJson), () => {});

            getInterests();
        });
    });

    req.end()
}

//getPeople();

/*Write a function called getInterests that uses the newly found usernames for each northcoder to retrieve information on everyone's interests. This function should:

    Use fs to read the northcoders.json file you created in task 1
    
    For every person, use their username and make a request to https://nc-leaks.herokuapp.com/api/people/:username/interests to get their interests.
    Each response will be an object with a person key. Collect up the data at this person key into an array.
    Once you have all responses in the array, save it to a file called interests.json.
*/

function getInterests() {
    fs.readFile('northcoder.json', (err, data) => {
        if (err) throw err;
        else {
            const northcoderPeopleInJson = JSON.parse(data);
            const personAndInterests = [];
            let count = 0;

            northcoderPeopleInJson.people.forEach((northcoder, i) => {
                const username = northcoder.username;
                const options = {
                    hostname: 'nc-leaks.herokuapp.com',
                    path: `/api/people/${username}/interests`,
                    method: 'GET'
                };

                const req = https.request(options, (response) => {
                    let body = '';
            
                    response.on('data', (packet) => {
                        body += packet.toString();
                    });
            
                    response.on('end', () => {
                        const parsedBody = JSON.parse(body);
                        
                        personAndInterests[i] = parsedBody.person;

                        count++;
                        
                        if (count === northcoderPeopleInJson.people.length) {
                            const personAndInterestsInJson = { personAndInterests: personAndInterests};

                            fs.writeFile(`interests.json`, JSON.stringify(personAndInterestsInJson), () => {});

                            getPets();
                        }
                    });
                });
            
                req.end()
            });
        }
    });
}

//getInterests();

// ### Task 3

// Write a function called `getPets` that does the same as the Task 2 but for pets. The endpoint is `https://nc-leaks.herokuapp.com/api/people/:username/pets`;

// > Note: Some of the users do not have pets and so the server will respond with a person but an empty pets array! These responses should not be included in the `pets.json`.

function getPets() {
    fs.readFile('northcoder.json', (err, data) => {
        if (err) throw err;
        else {
            const northcoderPeopleInJson = JSON.parse(data);
            const personAndPets = []
            let count = 0

            northcoderPeopleInJson.people.forEach((northcoder, i) => {
                const username = northcoder.username;
                const options = {
                    hostname: 'nc-leaks.herokuapp.com',
                    path: `/api/people/${username}/pets`,
                    method: 'GET'
                };

                const req = https.request(options, (response) => {
                    let body = '';
            
                    response.on('data', (packet) => {
                        body += packet.toString();
                    });
            
                    response.on('end', () => {
                        const parsedBody = JSON.parse(body);
                        personAndPets[i] = parsedBody.person;
                        count++;
                        
                        if (count === northcoderPeopleInJson.people.length) {
                            const filteredPersonAndPets = personAndPets.filter(element => element !== undefined)
                            const personAndPetsInJson = { personAndPets: filteredPersonAndPets};
                            console.log(filteredPersonAndPets);
                            fs.writeFile(`pets.json`, JSON.stringify(personAndPetsInJson), () => {});
                        }
                    });
                });
                req.end()
            });
        }

    });
}

//getPets()

/*Automation is great. Create a function called scavengeForNcData that uses all of the functions you created in Tasks 1-3 to automate your hunt for data.

    Note: Remember getInterests and getPets must only be used when you can be sure that the northcoders.json has finished being created. Considering these are all asynchronous functions, how can you ensure this?
*/

function scavengeForNcData() {
    getPeople();
}

scavengeForNcData();
