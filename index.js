const https = require('https');
const fs = require('fs');
const superagent = require('superagent');

function boop() {
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

function getInterestsUsingSuperagent() {
    fs.readFile('northcoder.json', (err, data) => {
        if (err) throw err;
        else {
            const northcoderPeopleInJson = JSON.parse(data);
            const personAndInterests = [];
            let count = 0;

            northcoderPeopleInJson.people.forEach((northcoder, i) => {
                const username = northcoder.username;

                superagent
                .get(`https://nc-leaks.herokuapp.com/api/people/${username}/interests`)
                .end((err, response) => {
                    if (err) {
                        console.log(err);

                        count++;
                    } else {
                        personAndInterests[i] = response.body.person;
                        
                        count++;
                        
                        if (count === northcoderPeopleInJson.people.length) {
                            const personAndInterestsInJson = { personAndInterests: personAndInterests};

                            fs.writeFile(`interestss.json`, JSON.stringify(personAndInterestsInJson), () => {});
                        }
                    }
                });
            });
        }
    });
}

//getInterestsUsingSuperagent();     

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
                            
                            fs.writeFile(`pets.json`, JSON.stringify(personAndPetsInJson), () => {});
                        }
                    });
                });

                req.end();
            });
        }

    });
}

function getPetsUsingSuperagent() {
    fs.readFile('northcoder.json', (err, data) => {
        if (err) throw err;
        else {
            const northcoderPeopleInJson = JSON.parse(data);
            const personAndPets = []
            let count = 0

            northcoderPeopleInJson.people.forEach((northcoder, i) => {
                const username = northcoder.username;

                superagent 
                .get(`https://nc-leaks.herokuapp.com/api/people/${username}/pets`)
                .end((err, response) => {
                    if (err) 
                    {
                        console.log("error")
                        count++
                    } else {
                        personAndPets[i] = response.body.person;
                        count++;
                        
                        if (count === northcoderPeopleInJson.people.length) {
                            const filteredPersonAndPets = personAndPets.filter(element => element !== undefined)
                            const personAndPetsInJson = { personAndPets: filteredPersonAndPets};

                            fs.writeFile(`petss.json`, JSON.stringify(personAndPetsInJson), () => {});  
                        }
                    }
                })
            })
        }    
    })
}

//getPetsUsingSuperagent();

function scavengeForNcData() {
    getPeople();
}

//scavengeForNcData();
