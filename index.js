const axios = require("axios");
const http = require("http");
const fs = require('fs');

const client_id = "0ba6d2a2-d7ad-48ed-9533-fec297ce1465"
const client_secret = "33aqFtF0G6CqIT5WhYXIaHL7r6ZjKjiK2jCnx5W5L8nnqUxCM995dK10pHDZTToB"
const code = "def50200589a889f0d5c2bd6c5ba4a0b152a8d41db7a952cb287d3d2a84d7624fa8d71f541404c26b04b49e177fea8cff9119a284eccb61435d2720308118c98396ffa98debf804f464c28cd042286e6c64c77267ca9281aa5b1eed60c31369ca8affe29769e9c86b137138c966ec991f77b5f6741c08ab7fea1b5591db4a6313502caf70c17af6f90ffb42d291f6ee0520f683e13ed08e82d7ed059b93d5d0ef5506aa9cd21aa1408880deec02def1eedf42e14ca64af977713e3b7e956df6b93751029ff4bc2b73c1700e92e799d5242daaa57d10b0084c9bb5d1495f50dda4a702cdc27116352d2f97c1dc57b9ffc28a92ead31c4034d29cea5ea785c33749fe25012d162bda82eb12fd344537f1579e0df5431a6074b6098464e5a265cc4a2d8f8b24bd0634677c4f3aed29ef22ae25cd6172bc894b9b8e30b9c0edd7a635d4ec8066acf28e43541e1052a4ef3e6caa46208371709863cff9bdc451003c0cbb5f0c2187cfe98efddd6b3493e69f56389cc48cecd6f21747479712bbdee6f0b3ad46badd111f53cb8473a8d7f8d47f800ce61c3c1cb04a0611c162dc8429b3ffb461c27c5c714e41aad358df1ff080f9cc73e76d3e523daea7a15e6448829283b91326a66c88a80fd7a042ae1d7ff116c7bd2b5ebdd0423f58e993d370f368b15f9864d7cbb11"
const redirect_uri = "http://localhost:3002/"

const port = 3002;
const subdomain = "https://d1vashechkin.amocrm.ru/"
let contacts_without_leads = []
 


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
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,
      };
    const get_contacts = await axios.get(subdomain+'/api/v4/contacts?with=leads', {
        headers: headers
    },
    ).then(await function (response) {
        let lenght_of_contacts = Object.keys(response.data._embedded.contacts).length // Создание лишних переменных не является наилучшей практикой, но мне кажется так код будет более "читабельным"
        for (i=0; i !== lenght_of_contacts; i++){
            if (response.data._embedded.contacts[i]._embedded["leads"]=="")
            contacts_without_leads.push(response.data._embedded.contacts[i]["id"])
        }
        console.log( contacts_without_leads )
      })
    for (i=0; i<contacts_without_leads.length; i++){
    const create_task = axios.post(subdomain+'api/v4/tasks', [{
        "text": "Контакт без сделки",
        "complete_till": 1706883961,
        "entity_id": contacts_without_leads[i],
        "entity_type": "contacts",
    }], {
        headers: headers
    }).catch(function (response) {
        if (response.response.data["validation-errors"] != undefined ){
        console.log(response.response.data["validation-errors"][0])
        }
        console.log(response.response.data)
})
}
}).listen(port, 'localhost', (error) => {
    error ? console.log(error[0]) : console.log("Server working on: " + port)
})




