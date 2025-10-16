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
    const [packageAttr] = packageRegex.exec(manifestContent)!;
    const oldPackageName = packageAttr.split('"')[1];

    // 高德地图特殊处理
    if (oldPackageName === 'com.autonavi.amapauto') {
      const permissionRegex = new RegExp(`\\b${'com.autonavi.amapautolite.provider'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.provider`, 'g');
      manifestContent = manifestContent.replace(permissionRegex, `${newPackageName}.provider`);
    }

    manifestContent = manifestContent.replace(packageRegex, `$1${newPackageName}$2`);

    // 更新权限引用：将 oldPackageName.permission 替换为 newPackageName.permission
    const permissionRegex = new RegExp(`\\b${oldPackageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.permission`, 'g');
    manifestContent = manifestContent.replace(permissionRegex, `${newPackageName}.permission`);

    // 更新provider的authorities属性：将 oldPackageName.xxx 替换为 newPackageName.xxx
    const authoritiesRegex = new RegExp(`(android:authorities=["']?)${oldPackageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\.\\w+["']?)`, 'g');
    manifestContent = manifestContent.replace(authoritiesRegex, `$1${newPackageName}$2`);

    await fs.writeFile(manifestPath, manifestContent, 'utf-8');
    return true;
  }

  return false;
};
