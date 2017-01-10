#!/usr/bin/env node

var inquirer = require('inquirer');
var request = require('request');

var doneTasks = [];

var config = require('./config.json');

askWhatIsDone();

function askWhatIsDone() {
  var question = {
    type: 'input',
    name: 'task',
    message: 'What is done? ✅ '
  };

  inquirer.prompt(question).then(function (answer) {
    doneTasks.push(answer.task);
    askToSend();
  });
}

function askToSend() {
  var question = {
    type: 'list',
    name: 'send',
    message: 'Ready to send?',
    choices: [
      '🚀  Send to Slack', 
      new inquirer.Separator(),
      '📝  Add more tasks'
    ]
  };

  inquirer.prompt(question).then(function (answer) {
    if (answer.send === question['choices'][0]) {
      sendToSlack();
    } else {
      askWhatIsDone();
    }
  });
}

function sendToSlack(tasks) {
  var baseUrl = 'https://slack.com/api/chat.postMessage';
  var token = config['token'];
  var channel = 'emplate-udvikling';
  var asUser = true
  var text = '';

  for (var i = 0; i < doneTasks.length; i++) {
    text = text + '• ' + doneTasks[i] + '\n';
  }

  var attachments = [
    {
      "pretext": ":tada: Ny opgave fuldført! :tada:", 
      "text": text
    }
  ];

  var encodedAttachments = encodeURIComponent(JSON.stringify(attachments));
  
  var url = baseUrl + '?token=' + token + '&channel=' + channel + '&attachments=' + encodedAttachments + '&as_user=' + asUser;
  
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsedBody = JSON.parse(body);

      if (parsedBody.ok) {
        console.log('The following tasks are sucessfully sent to Slack 🎉');
        console.log(text);
      } else {
        console.log('Slack error.. 💩');
      }
    } else {
      console.log(error);
    }
  });
}