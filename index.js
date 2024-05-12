#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import inquirer from 'inquirer';

import { checkEmail } from './utils/cli/emailChecker.js';
import { readEmails } from './utils/cli/readEmails.js';

const listQuestions = [
  {
    type: 'input',
    name: 'filepath',
    message: chalk.green('Enter the complete path of the input file:'),
  },
  {
    type: 'input',
    name: 'filename',
    message: chalk.green('Enter a name for the output file (without .txt):'),
  },
];

const singleQuestion = [
  {
    type: 'input',
    name: 'email',
    message: chalk.green('Enter an email address:'),
  },
  {
    type: 'confirm',
    name: 'reason',
    message: chalk.green(
      'Would you like to know the reason if the emails prove to be invalid?:',
    ),
  },
];

program
  .version('1.0.0')
  .name('mailtive')
  .description(
    'Mailtive is a command-line utility that may assist anyone detect whether an email is active or not. It is also useful in filtering active emails from a list of emails',
  );

program
  .argument('<email>', 'email address')
  .option('-r', 'To display reason why it is not valid')
  .description('Enter an email address')
  .action((email, options) => {
    const showReason = options.r;
    checkEmail(email, showReason);
  });

program
  .command('single')
  .description('Enter an email address to check its validity')
  .action(() => {
    console.log('\n');
    inquirer.prompt(singleQuestion).then((answers) => {
      const showReason = answers.reason;
      checkEmail(answers.email, showReason);
    });
  });

program
  .command('list')
  .description(
    'Filter active emails from a .txt file of emails. Note: Please make sure you start each email on a different line',
  )
  .action(() => {
    console.log('\n');
    inquirer.prompt(listQuestions).then((answers) => {
      readEmails(answers.filepath, answers.filename);
    });
  });

program.parse(process.argv);
