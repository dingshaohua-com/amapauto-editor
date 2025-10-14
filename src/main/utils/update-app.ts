import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// 更新应用名称
export const updateAppName = async (appPath: string, newName: string) => {
  // 优先使用 values-zh 目录下的 strings.xml
  const zhStringsPath = path.join(appPath, 'res', 'values-zh', 'strings.xml');
  const defaultStringsPath = path.join(appPath, 'res', 'values', 'strings.xml');

  let stringsPath = defaultStringsPath;

  // 检查 values-zh 目录下的文件是否存在
  if (existsSync(zhStringsPath)) {
    stringsPath = zhStringsPath;
  }

  if (existsSync(stringsPath)) {
    let stringsContent = await fs.readFile(stringsPath, 'utf-8');

    // 更新app_name
    const appNameRegex = /(<string name="app_name">)[^<]+(<\/string>)/;
    stringsContent = stringsContent.replace(appNameRegex, `$1${newName}$2`);

    await fs.writeFile(stringsPath, stringsContent, 'utf-8');
    return true;
  }

  return false;
};

// 更新包名
export const updatePackageName = async (appPath: string, newPackageName: string) => {
  const manifestPath = path.join(appPath, 'AndroidManifest.xml');

  if (existsSync(manifestPath)) {
    let manifestContent = await fs.readFile(manifestPath, 'utf-8');

    // 更新package属性
    const packageRegex = /(package=")[^"]+(")/;
    if (packageRegex.test(manifestContent)) {
      manifestContent = manifestContent.replace(packageRegex, `$1${newPackageName}$2`);
      await fs.writeFile(manifestPath, manifestContent, 'utf-8');
      return true;
    }
  }

  return false;
};
