'use strict';

const fs = require('fs');
const https = require('https');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

// HackerRank's NodeJS environment allows the `request` package.
const request = require('request');

function fetch(url) {
    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (error)
                reject(error)
            else
                resolve(body)
        });
    });
}

async function getCountryName(countryCode) {
    let pageNumber = 1;
    let countryName = null;

    while (countryName === null) {
        let url = `https://jsonmock.hackerrank.com/api/countries?page=${pageNumber}`;
        let response = await fetch(url);
        let responseBody = JSON.parse(response);

        responseBody.data.forEach((countryData) => {
            if (countryData.alpha2Code === countryCode) 
                countryName = countryData.name;
        });
        if (responseBody.total_pages == pageNumber++)
            break;
    }

    if (countryName === null) {
        throw new Error("Country code not found.");
    }
    return countryName;
}


getCountryName("AF").then((result) => {
    console.log(result);
});
getCountryName("ZW").then((result) => {
    console.log(result);
});
getCountryName("NaN").then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error.message);
});
async function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const code = readLine().trim();

  const name = await getCountryName(code);

  ws.write(`${name}\n`);

}
