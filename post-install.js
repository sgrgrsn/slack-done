var inquirer = require('inquirer');
var fs = require('fs');

promptForToken();

function promptForToken() {
    var question = {
        type: 'input',
        name: 'token',
        message: 'What is your Slack api token? Goto: https://api.slack.com/docs/oauth-test-tokens'
    };


    inquirer.prompt(question).then(function (answer) {
        var config = {
            token: answer.token
        };

        writeConfigToFile(config);
    });
}

function writeConfigToFile(config) {
    var json = JSON.stringify(config);
    fs.writeFile("./config.json", json, 'utf8', function() {
        console.log("Config written, have fun!");
    });
}