require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twilio = require('twilio');
const xml = require('xml');
const cors = require('cors');
const fs = require('fs');

// API KEYS 
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

app.use((req, res, next) => { 
  res.header('Access-Control-Allow-Origin', "*"); 
  res.header('Access-Control-Allow-Methods','GET,POST'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization'); 
  next(); 
})

app.post('/callPhone', async (req, res) => {
  let result;
  if (!req.body || !req.body.phoneNumber) 
    return res.status(400).send('Missing phone number in body');

  await client.calls.create({
    url: process.env.TWILIO_URL,
    to: req.body.phoneNumber,
    from: '+12029153834'
  })
  .then(resp => result = resp)
  .catch(err => result = err);

  res.json(result); 
}); 

app.get('/twilioXml', (req, res) => {
  fs.readFile('./twilioConfig.xml', 'utf8', (err, data) => {
    res.set('Content-Type', 'text/xml');
    return res.send(xml(data));
  })
})

app.listen(process.env.PORT, () => console.log(`Listening at port: ${process.env.PORT}`));