import fs from 'fs/promises';
import { existsSync } from 'fs';

// 更新应用名称
ipcMain.handle('update-app-name', async (event, appPath: string, newName: string) => {
  try {
    const stringsPath = path.join(appPath, 'res', 'values', 'strings.xml');

    if (existsSync(stringsPath)) {
      let stringsContent = await fs.readFile(stringsPath, 'utf-8');

      // 更新app_name
      const appNameRegex = /(<string name="app_name">)[^<]+(<\/string>)/;
      if (appNameRegex.test(stringsContent)) {
        stringsContent = stringsContent.replace(appNameRegex, `$1${newName}$2`);
      } else {
        // 如果没有app_name，添加一个
        const resourcesMatch = stringsContent.match(/(<resources[^>]*>)/);
        if (resourcesMatch) {
          stringsContent = stringsContent.replace(resourcesMatch[1], `${resourcesMatch[1]}\n    <string name="app_name">${newName}</string>`);
        }
      }

      await fs.writeFile(stringsPath, stringsContent, 'utf-8');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to update app name:', error);
    return false;
  }
});

// 更新包名
ipcMain.handle('update-package-name', async (event, appPath: string, newPackageName: string) => {
  try {
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
  } catch (error) {
    console.error('Failed to update package name:', error);
    return false;
  }
});