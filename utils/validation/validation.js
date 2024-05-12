import domains from 'disposable-email-domains/index.js';
import { pingSMTP } from './smtp/smtp.js';
import { getMxRecord } from './getMxRecord.js';

const createOutput = (valid, failLevel, failReason) => {
  const result = { valid };

  if (failLevel) {
    result.failLevel = failLevel;
    result.failReason = failReason;
  }

  return result;
};

export const validate = async (email) => {
  // Format validaton
  /* eslint-disable no-useless-escape */
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const isValidFormat = emailRegex.test(email);

  if (!isValidFormat)
    return createOutput(false, 'format', `Invalid email format.`);

  // Disposable email validation

  const domain = email.split('@')[1];

  if (domains.includes(domain)) {
    return createOutput(
      false,
      'disposable',
      `Email was created using a disposable email service.`,
    );
  }

  // MX record validation

  const mx = await getMxRecord(domain);

  if (!mx) return createOutput(false, 'mx', 'MX record not found.');

  // SMTP validation
  const pingResult = await pingSMTP(email, email, mx.exchange);

  if (!pingResult.pinged) return createOutput(false, 'smtp', pingResult.msg);

  return createOutput(true);
};
