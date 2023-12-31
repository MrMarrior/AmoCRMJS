// import axios from "axios" Если не на node.js
const axios = require("axios");
const http = require("http");
const fs = require('fs');

const client_id = "0ba6d2a2-d7ad-48ed-9533-fec297ce1465"
const client_secret = "33aqFtF0G6CqIT5WhYXIaHL7r6ZjKjiK2jCnx5W5L8nnqUxCM995dK10pHDZTToB"
const code = "def50200bdb27a1b30c632b80fcfe63388eaa2a5dea4d597be7da1dbf5018fc3fc4a15b20173fc86b7ce84b6c2940e2821abfbfb5815ae5866a346164bb2642d3b6a4b3a6615448dcdc8c2921a311b160a70562ba8b413221cdc2c1fea65d9e800f4e88b396e7ad9ec5b7840557e9fd365029be3da6633fdf2c413a8b73e22c97dfd89771874bfc08e9075bfe0f873f37b1f3408d68bd4da03e8a33c13fd43f4aceab4547d71a135cbe3fc902ccaa61512d7cdabd145d5d1cda70bc905887111b9b2703aef24abedc9af84b4663cace393fbb0e51b9ae26df867cd96d44145006d225a2c747cfa8d867abeb3a25f5176d84bde751ff1de4af24e664b12309c65b003c83042195db9e01a7cea0d8920fa9e9d2b4111614caf19d5d427b5326c3a576eecee2e4f93c3ce2ef9cd30dc4be7a1b81a7911cac9aced74b7ba15266dfa982e2728a7057490d746e8322b40ac331da1aa3b7f3970e723566edb5f80849577a5264906085b9ebdc65dc5d1374fc3335cc65ac4465204fd9ff1178689da95b9f00839e788017902960942d9a8b6fc0a6749746538330f7e71fb79fa22c22861abb3ee474c11c0776735c7cc3db00864255665bba651d661711d202dbb674267936add855d757782c58139d9ef254c115948cfa380679c9f398098c2c5d3b378e625dc84121ba1"
const redirect_uri = "http://localhost:3002/"

const port = 3002;
const subdomain = "https://d1vashechkin.amocrm.ru/"

const server = http.createServer(async (req, res) => {
    if (!fs.existsSync("access_token.txt")){
   const get_token = await axios.post (subdomain+'/oauth2/access_token', {
            "client_id":client_id,
            "client_secret": client_secret,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
    }).then(function (response) {
        fs.writeFileSync('access_token.txt', response.data["access_token"]);
        fs.writeFileSync('refresh_token.txt', response.data["refresh_token"]);
      })
    }
    const access_token = fs.readFileSync('access_token.txt', 'utf-8');
    const get_clients = await axios.get(subdomain+'/api/v4/contacts?with=leads', {
        
        headers: {
            'Authorization': 'Bearer ' + access_token,
        }
    },
    ).then(function (response) {
        console.log(response.data._embedded.contacts);
        // without_leads = response.data._embedded.map((item) => {
        //     console.log(item._embedded["leads"]) //123
        // })
      })
}).listen(port, 'localhost', (error) => {
    error ? console.log(error) : console.log("Server working on: " + port)
})




