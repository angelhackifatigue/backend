require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twilio = require('twilio');

// API KEYS 
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/callPhone', async (req, res) => {
  let result;
  if (!req.body || !req.body.phoneNumber) 
    return res.status(400).send('Missing phone number in body');

  await client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: req.body.phoneNumber,
    from: '+12029153834'
  })
  .then(resp => result = resp)
  .catch(err => result = err);

  res.json(result);
}); 

app.listen(process.env.PORT, () => console.log(`Listening at port: ${process.env.PORT}`));