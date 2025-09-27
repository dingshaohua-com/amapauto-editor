import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { runJava } from '../utils/run-java';
import apktoolJar from '../../../resources/apktool_2.9.3.jar?asset';
import { app, shell, BrowserWindow, ipcMain, dialog, OpenDialogOptions } from 'electron';

const tmpDir = app.getPath('temp');
const unpackPath = path.join(tmpDir, 'gaode');

// 选择文件
ipcMain.handle('select-file', async () => {
  // 使用Electron的dialog模块打开文件选择对话框
  const opt: OpenDialogOptions = {
    properties: ['openFile'], // 允许用户选择多个文件
    filters: [{ name: 'All Files', extensions: ['apk'] }],
  };
  const result = await dialog.showOpenDialog(opt);

  // 检查用户是否取消了操作或者选择了文件
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  } else {
    console.log('No file selected');
    return null;
  }
});

// 解包APK
ipcMain.handle('unpack-apk', async (evnet, filePath: string) => {
  // 使用path.parse解析路径
  const pathObj = path.parse(filePath);
  // 文件名（不含后缀）
  const fileNameWithoutExt = pathObj.name;
  // 文件路径（目录）
  const directory = pathObj.dir;
  const unpackPath = path.join(directory, fileNameWithoutExt);

  console.log(1122, unpackPath);
  
  const params = ['-Dfile.encoding=UTF-8', '-jar', apktoolJar, 'd', filePath, '-f', '-o', unpackPath];
  const res = await runJava(params);
  return unpackPath;
});

// 打包APK
ipcMain.handle('build-apk', async (evnet, path: string) => {
  console.log(path);
  const params = ['-Dfile.encoding=UTF-8', '-jar', apktoolJar, 'b', path];

  console.log(123, params);

  const res = await runJava(params);
  return unpackPath;
});

// 打开目录
ipcMain.handle('open-folder', async (event, folderPath: string) => {
  try {
    await shell.openPath(folderPath);
    return true;
  } catch (error) {
    console.error('Failed to open folder:', error);
    return false;
  }
});

// 选择目录
ipcMain.handle('select-dir', async () => {
  const opt: OpenDialogOptions = {
    properties: ['openDirectory'],
    title: '选择应用目录',
  };
  const result = await dialog.showOpenDialog(opt);

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  } else {
    return null;
  }
});

// 读取应用信息（从AndroidManifest.xml和其他文件）
ipcMain.handle('read-app-info', async (event, appPath: string) => {
  try {
    const manifestPath = path.join(appPath, 'AndroidManifest.xml');
    const stringsPath = path.join(appPath, 'res', 'values', 'strings.xml');

    const appInfo: any = {
      path: appPath,
      name: '',
      packageName: '',
      icon: null,
    };

    // 读取AndroidManifest.xml
    if (existsSync(manifestPath)) {
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');

      // 提取包名
      const packageMatch = manifestContent.match(/package="([^"]+)"/);
      if (packageMatch) {
        appInfo.packageName = packageMatch[1];
      }

      // 提取应用图标
      const iconMatch = manifestContent.match(/android:icon="([^"]+)"/);
      if (iconMatch) {
        const iconPath = iconMatch[1].replace('@drawable/', '').replace('@mipmap/', '');
        // 查找图标文件
        const possibleIconPaths = [path.join(appPath, 'res', 'drawable', `${iconPath}.png`), path.join(appPath, 'res', 'drawable-hdpi', `${iconPath}.png`), path.join(appPath, 'res', 'drawable-mdpi', `${iconPath}.png`), path.join(appPath, 'res', 'drawable-xhdpi', `${iconPath}.png`), path.join(appPath, 'res', 'drawable-xxhdpi', `${iconPath}.png`), path.join(appPath, 'res', 'mipmap-hdpi', `${iconPath}.png`), path.join(appPath, 'res', 'mipmap-mdpi', `${iconPath}.png`), path.join(appPath, 'res', 'mipmap-xhdpi', `${iconPath}.png`), path.join(appPath, 'res', 'mipmap-xxhdpi', `${iconPath}.png`)];

        for (const iconFilePath of possibleIconPaths) {
          if (existsSync(iconFilePath)) {
            appInfo.icon = iconFilePath;
            break;
          }
        }
      }
    }

    // 读取strings.xml获取应用名称
    if (existsSync(stringsPath)) {
      const stringsContent = await fs.readFile(stringsPath, 'utf-8');
      const appNameMatch = stringsContent.match(/<string name="app_name">([^<]+)<\/string>/);
      if (appNameMatch) {
        appInfo.name = appNameMatch[1];
      }
    }

    // 如果没有找到应用名称，使用目录名
    if (!appInfo.name) {
      appInfo.name = path.basename(appPath);
    }

    return appInfo;
  } catch (error) {
    console.error('Failed to read app info:', error);
    return null;
  }
});

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
