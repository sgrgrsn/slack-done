var inquirer = require('inquirer');
var fs = require('fs');

promptForToken();

function promptForToken() {
    var questions = [
        {
            type: 'input',
            name: 'token',
            message: 'What is your Slack api token? 🔐  (Get a token here: https://api.slack.com/docs/oauth-test-tokens)'
        },
        {
            type: 'input',
            name: 'channel',
            message: 'Which Slack channel do you want to use? 📢 '
        }
    ];


    inquirer.prompt(questions).then(function (answers) {
        writeConfigToFile(answers);
    });
}

function writeConfigToFile(config) {
    var json = JSON.stringify(config);
    fs.writeFile("./config.json", json, 'utf8', function() {
        console.log("Config written, have fun!");
    });
}