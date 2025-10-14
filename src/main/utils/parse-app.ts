import path from 'path';
import fs from 'fs';
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
  // 优先使用 values-zh 目录下的 strings.xml
  const zhStringsPath = path.join(appPath, 'res', 'values-zh', 'strings.xml');
  const defaultStringsPath = path.join(appPath, 'res', 'values', 'strings.xml');

  let stringsPath = defaultStringsPath;

  // 检查 values-zh 目录下的文件是否存在
  try {
    await fs.promises.access(zhStringsPath, fs.constants.F_OK);
    stringsPath = zhStringsPath;
  } catch (error) {
    // values-zh 文件不存在，使用默认的 values 目录
    console.log('values-zh/strings.xml not found, using values/strings.xml');
  }

  const stringsJson: any = await parseXml(stringsPath);
  const res: any = {};
  stringsJson.resources.string.forEach((item: any) => {
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
