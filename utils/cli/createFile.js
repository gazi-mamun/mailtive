import os from 'os';
import * as fs from 'fs';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';

export const fileRenaming = (name, count = 0) => {
  let finalName = name;
  if (fs.existsSync(`${os.homedir()}\\${name}.txt`)) {
    const newName = `${name.split(` (${count})`)[0]} (${count + 1})`;
    finalName = fileRenaming(newName, count + 1);
  }
  return finalName;
};

export const createTxtFile = (arr, filename) => {
  console.log('\n');
  const spinner = createSpinner();
  spinner.start({
    text: ' Creating a new file for active emails.',
    color: 'cyan',
  });

  const checkedFilename = fileRenaming(filename);

  const file = fs.createWriteStream(`${os.homedir()}\\${checkedFilename}.txt`);
  file.on('error', () => {
    spinner.stop({
      text: chalk.red('Something went wrong when creating the file!'),
      mark: chalk.red('🧨'),
    });
  });
  arr.forEach((v) => {
    file.write(`${v}\n`);
  });
  file.end();

  spinner.success({
    text: chalk.cyan(
      ` Active emails are listed in the file ${checkedFilename}.txt \n    Complete path is:` +
        chalk.white(` ${os.homedir()}\\${checkedFilename}.txt`),
    ),
    mark: chalk.cyan('✔'),
  });
};
