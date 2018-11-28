const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

//  express parser
app.use(express.urlencoded());

//  Static Folder
app.use(express.static(path.join(__dirname, 'dist')));

//  Sign-up Form Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  //  Validate Form Info
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }
  //  Construct req Data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us19.api.mailchimp.com/3.0/lists/167fdbca51',
    method: 'POST',
    headers: {
      Authorization: 'auth c85f86eb661bb87ed8ab3362ec8f9383-us19'
    },
    body: postData
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect('/fail.html');
    } else {
      if (response.statusCode === 200) {
        res.redirect('/success.html');
      } else {
        res.redirect('/fail.html');
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
