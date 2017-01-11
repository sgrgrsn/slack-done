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
  var channel = config['channel'];
  var asUser = true;
  
  var url = baseUrl + '?token=' + token + '&channel=' + channel + '&attachments=' + getAttachment() + '&as_user=' + asUser;
  
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsedBody = JSON.parse(body);

      if (parsedBody.ok) {
        console.log('The following tasks are sucessfully sent to Slack 🎉');
        console.log(getText());
      } else {
        console.log('Slack error.. 💩');
      }
    } else {
      console.log('Something went wrong.. 💩');
      console.log(error);
    }
  });
}

function getAttachment() {
  var attachments = [
    {
      pretext: getPreText(),
      text: getText()
    }
  ];

  return encodeURIComponent(JSON.stringify(attachments));
}

function getPreText() {
  var pretext = '';

  if (doneTasks.length === 1) {
    pretext = 'New task done!';
  } else {
    pretext = 'New tasks done!';
  }

  return ':tada: ' + pretext + ' :tada:';
}

function getText() {
  var text = '';

  for (var i = 0; i < doneTasks.length; i++) {
    text = text + '✅ ' + doneTasks[i] + '\n';
  }

  return text;
}