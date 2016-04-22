var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var async = require('async');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/callback', function(req, res){

  var json = req.body;

  var answers = ['うん', 'はい', 'そうですね'];
  var number = Math.floor(Math.random() * 3);

  var answer = answers[number];

  var headers = {
    'Content-Type' : 'application/json; charset=UTF-8',
    'X-Line-ChannelID' : <YOUR.XLineChannelID>,
    'X-Line-ChannelSecret'        : <YOUR.XLineChannelSecret>,
    'X-Line-Trusted-User-With-ACL': <YOUR.XLineTrustedUserWithACL>
  };

  var to_array = [];
  to_array.push(json['result'][0]['content']['from']);

  var data = {
    'to': to_array,
    'toChannel': 1383378250,
    'eventType':'140177271400161403',
    "content": {
      "messageNotified": 0,
      "messages": [
        {
          "contentType": 1,
          "text": answer,
        }
      ]
    }
  };

  var options = {
    url: 'https://trialbot-api.line.me/v1/events',
    proxy : process.env.FIXIE_URL,
    headers: headers,
    json: true,
    body: data
  };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.log('error: '+ JSON.stringify(response));
    }
  });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running');
});
