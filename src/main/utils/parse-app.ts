import path from 'path';
import parseXml from './parse-xml';

const handleAndroidManifest = async (appPath: string) => {
  const manifestPath = path.join(appPath, 'AndroidManifest.xml');
  const manifestJson: any = await parseXml(manifestPath);

  return {
    ...manifestJson.manifest,
    $$: manifestJson.manifest.$,
    $usesPermission: manifestJson.manifest['uses-permission'].map((item) => item.$['android:name']),
  };
};

const handleStringsXml = async (appPath: string) => {
  const stringsPath = path.join(appPath, 'res', 'values', 'strings.xml');
  const stringsJson: any = await parseXml(stringsPath);
  const res: any = {};
  stringsJson.resources.string.forEach((item) => {
    res[item.$.name] = item._;
  });

  return res;
};

const parseApp = async (appPath: string) => {
  const manifest = await handleAndroidManifest(appPath);
  const strings = await handleStringsXml(appPath);
  return {
    name: strings.app_name,
    package: manifest.$$.package,
  };
};

export default parseApp;
