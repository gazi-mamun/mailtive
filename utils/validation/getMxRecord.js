import dns from 'dns';

export const getMxRecord = async (domain) => {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, records) => {
      if (err || !records) return resolve(undefined);

      let bestIndex = 0;

      for (let i = 0; i < records.length; i++) {
        if (records[i].priority < records[bestIndex].priority) {
          bestIndex = i;
        }
      }

      resolve(records[bestIndex]);
    });
  });
};
