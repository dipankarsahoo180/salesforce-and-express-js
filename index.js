const username = 'YOUR_SFDC_USERNAME';
const password = 'YOUR_SFDC_PWD'
const security_token = 'YOUR_SFDC_SEC_TOKEN'

const jsforce = require('jsforce');
const conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://login.salesforce.com'
});

const login = async () => {
    await conn.login(username, password+security_token, (err, userInfo) => {
        if (err) { return console.error(err); }
        //console.log("Con INFO: " ,conn);
        // logged in user property
        console.log("User INFO: " , userInfo);
    });
}
login();

const port = 3000
const express = require('express');
const app = express();
app.get('/',(req,res)=>{
    res.send('WELCOME to SFDC DATA CONNECTION')
})

app.get('/Accounts', async (req, res) => {
    let sf_res;
    await conn.query("SELECT Id, Name,(Select FirstName,LastName from Contacts) FROM Account", (err, result) =>{
        if (err) { 
            console.log('error occured', err)
            sf_res= null
        }
        sf_res = result;
    });
    res.json(sf_res?.records);
})

app.get('/Contacts', async (req, res) => {
    let sf_res;
    await conn.query("Select FirstName,LastName,Account.Name from Contact", (err, result) =>{
        if (err) { 
            console.log('error occured', err)
            sf_res= null
        }
        sf_res = result;
    });
    res.json(sf_res?.records);
})

app.get('/Opportunities', async (req, res) => {
    let sf_res;
    await conn.query("SELECT Id,Name,StageName,(SELECT Id,Opportunity.Id,StageName FROM OpportunityHistories) FROM Opportunity", (err, result) =>{
        if (err) { 
            console.log('error occured', err)
            sf_res= null
        }
        sf_res = result;
    });
    res.json(sf_res?.records);
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
