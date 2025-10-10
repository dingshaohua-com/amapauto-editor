import fs from 'fs';
import { parseString } from 'xml2js';

const parseXml = (path: string) => {
  const manifestTxt = fs.readFileSync(path, 'utf8');
  return new Promise((resolve, reject) => {
    parseString(manifestTxt, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
export default parseXml;
