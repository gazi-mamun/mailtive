import net from 'net';
import { hasCode, ErrorCodes } from './errorCodes.js';

const log = (...args) => {
  if (process.env.DEBUG === 'true') {
    console.log(...args);
  }
};

export const pingSMTP = async (sender, recipient, exchange) => {
  const timeout = 1000 * 10; // 10 seconds
  return new Promise((r) => {
    let receivedData = false;
    let closed = false;
    const socket = net.createConnection(25, exchange);
    socket.setEncoding('ascii');
    socket.setTimeout(timeout);
    socket.on('error', (error) => {
      log('error', error);
      socket.emit('fail', error);
    });
    socket.on('close', (hadError) => {
      if (!receivedData && !hadError) {
        socket.emit(
          'fail',
          'Mail server closed connection without sending any data.',
        );
      }
      if (!closed) {
        socket.emit('fail', 'Mail server closed connection unexpectedly.');
      }
    });
    socket.once('fail', (msg) => {
      closed = true;
      r({ pinged: false, msg });
      if (socket.writable && !socket.destroyed) {
        socket.write(`quit\r\n`);
        socket.end();
        socket.destroy();
      }
    });

    socket.on('success', () => {
      closed = true;
      if (socket.writable && !socket.destroyed) {
        socket.write(`quit\r\n`);
        socket.end();
        socket.destroy();
      }
      r({ pinged: true, msg: '' });
    });

    const commands = [
      `helo ${exchange}\r\n`,
      `mail from: <${sender}>\r\n`,
      `rcpt to: <${recipient}>\r\n`,
    ];
    let i = 0;
    socket.on('next', () => {
      if (i < 3) {
        if (socket.writable) {
          socket.write(commands[i++]);
        } else {
          socket.emit('fail', 'SMTP communication unexpectedly closed.');
        }
      } else {
        socket.emit('success');
      }
    });

    socket.on('timeout', () => {
      socket.emit('fail', 'Timeout');
    });

    socket.on('connect', () => {
      socket.on('data', (msg) => {
        receivedData = true;
        log('data', msg);
        if (hasCode(msg, 220) || hasCode(msg, 250)) {
          socket.emit('next', msg);
        } else if (hasCode(msg, 550)) {
          socket.emit('fail', 'Mailbox not found.');
        } else {
          const [code] = Object.keys(ErrorCodes).filter((x) => hasCode(msg, x));
          socket.emit(
            'fail',
            ErrorCodes[code] || 'Unrecognized SMTP response.',
          );
        }
      });
    });
  });
};
