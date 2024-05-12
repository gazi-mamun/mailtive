import * as fs from 'fs';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { checkEmails } from './emailChecker.js';
import { createTxtFile } from './createFile.js';

export const readEmails = (filepath, filename) => {
  const spinner = createSpinner();
  console.log('\n');
  spinner.start({ text: ' Extracting emails', color: 'cyan' });

  try {
    const dividedPath = filepath.split('/');
    const dividedName = dividedPath[dividedPath.length - 1].split('.');
    const fileExtension = dividedName[dividedName.length - 1];

    if (fileExtension !== 'txt') {
      return spinner.stop({
        text: chalk.red('Please select a text file!'),
        mark: chalk.red('🧨'),
      });
    }

    const emails = fs
      .readFileSync(filepath)
      .toString()
      .replace(/\r\n/g, '\n')
      .split('\n');

    spinner.success({
      text: chalk.cyan(' Extraction of emails completed'),
      mark: chalk.cyan('✔'),
    });
    console.log('\n');

    if (emails.length <= 0) {
      return;
    }

    checkEmails(emails).then((aEmails) => createTxtFile(aEmails, filename));
  } catch (err) {
    if (err.code === 'ENOENT') {
      spinner.stop({
        text: chalk.red('File not found!'),
        mark: chalk.red('🧨'),
      });
    } else {
      throw err;
    }
  }
};
