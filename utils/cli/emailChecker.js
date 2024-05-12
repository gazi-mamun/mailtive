import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import cliProgress from 'cli-progress';

import { validate } from '../validation/validation.js';

export const checkEmail = async (mail, showReason = false) => {
  const spinner = createSpinner();
  console.log('\n');
  spinner.start({ text: chalk.cyan(' Checking the email \n'), color: 'cyan' });

  const res = await validate(mail);

  // valid
  if (res.valid) {
    spinner.success({
      text: chalk.green(
        ' ' +
          chalk.cyan(`${mail}`) +
          ` is an valid and active email address. \n`,
      ),
      mark: chalk.green('✔ ✉'),
    });
  }
  // not valid
  else {
    // without reason
    if (!showReason) {
      spinner.success({
        text: chalk.red(
          ' ' + chalk.cyan(`${mail}`) + ` is a fake email address. \n`,
        ),
        mark: chalk.red('❌ 🧧'),
      });

      return 0;
    }
    // with reason
    spinner.success({
      text: chalk.red(
        ` ` + chalk.cyan(`${mail}`) + ` is a fake email address. \n`,
      ),
      mark: chalk.red('❌ 🧧'),
    });

    console.log(
      chalk.yellow(
        chalk.inverse(chalk.bold(`Reason:`)) + ` ` + res.failReason + `\n`,
      ),
    );
  }
};

export const checkEmails = async (mails) => {
  console.log(chalk.cyan(` * Filtering active emails: \n`));

  const totalMails = mails.length;
  let checked = 0;

  // create a new progress bar instance and use shades_classic theme
  const bar1 = new cliProgress.SingleBar(
    {
      format:
        chalk.cyan(' {bar}') +
        chalk.cyan(
          ' {percentage}% | {value}/{total} | ETA: {eta_formatted} | ET: {duration_formatted}',
        ),
    },
    cliProgress.Presets.shades_classic,
  );

  // start the progress bar with a total value of 200 and start value of 0
  bar1.start(totalMails, checked);

  const activeMails = [];

  /* eslint-disable */
  for (const mail of mails) {
    const res = await validate(mail);

    checked++;
    // update the current value in your application..
    bar1.update(checked);

    if (res.valid) {
      activeMails.push(mail);
    }
  }

  // stop the progress bar
  bar1.stop();
  return activeMails;
};
