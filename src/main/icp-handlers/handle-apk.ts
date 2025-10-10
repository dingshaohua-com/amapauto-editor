import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { ipcMain } from 'electron';
import { spawn } from 'child_process';
import parseXml from '../utils/parse-xml';
import { runJava } from '../utils/run-java';
import getSomeFile from '../utils/some-file.js';
import repairAutoAmap from '../utils/repair-res/auto-amap';
import apktoolJar from '../../../resources/apktool.jar?asset';
import oneCertJks from '../../../resources/jks/one-cert.jks?asset';
import parseApp from '../utils/parse-app';

const apksigner = getSomeFile('apksigner');

// 解包APK
ipcMain.handle('unpack-apk', async (_, filePath: string) => {
  // 使用path.parse解析路径，从而获取文件名（不含后缀）
  const { name: fileName, dir: fileDir } = path.parse(filePath);
  const unpackPath = path.join(fileDir, fileName); // 文件路径（目录）
  const params = ['-Dfile.encoding=UTF-8', '-jar', apktoolJar, 'd', '-k', filePath, '-f', '-o', unpackPath];
  await runJava(params);
  repairAutoAmap(unpackPath);
  return unpackPath;
});

// 打包APK
ipcMain.handle('build-apk', async (_, path: string) => {
  const params = ['-Dfile.encoding=UTF-8', '-jar', apktoolJar, 'b', path];
  const res = await runJava(params);
  return res;
});

// 读取应用信息（从AndroidManifest.xml和其他文件）
ipcMain.handle('read-app-info', async (_, appPath: string) => {
  return parseApp(appPath);

  // try {
  //   const manifestPath = path.join(appPath, 'AndroidManifest.xml');
  //   const stringsPath = path.join(appPath, 'res', 'values', 'strings.xml');

  //   const appInfo: any = {
  //     path: appPath,
  //     name: '',
  //     packageName: '',
  //     icon: null,
  //   };

  //   // 读取AndroidManifest.xml
  //   if (existsSync(manifestPath)) {
  //     const manifestContent = await fs.readFile(manifestPath, 'utf-8');

  //     // 提取包名
  //     const packageMatch = manifestContent.match(/package="([^"]+)"/);
  //     if (packageMatch) {
  //       appInfo.packageName = packageMatch[1];
  //     }

  //     // 提取应用图标
  //     const iconMatch = manifestContent.match(/android:icon="([^"]+)"/);
  //     if (iconMatch) {
  //       const iconPath = iconMatch[1].replace('@drawable/', '').replace('@mipmap/', '');
  //       // 查找图标文件
  //       const possibleIconPaths = [path.join(appPath, 'res', 'drawable', `${iconPath}.png`), path.join(appPath, 'res', 'drawable-hdpi', `${iconPath}.png`), path.join(appPath, 'res', 'drawable-mdpi', `${iconPath}.png`), path.join(appPath, 'res', 'drawable-xhdpi', `${iconPath}.png`), path.join(appPath, 'res', 'drawable-xxhdpi', `${iconPath}.png`), path.join(appPath, 'res', 'mipmap-hdpi', `${iconPath}.png`), path.join(appPath, 'res', 'mipmap-mdpi', `${iconPath}.png`), path.join(appPath, 'res', 'mipmap-xhdpi', `${iconPath}.png`), path.join(appPath, 'res', 'mipmap-xxhdpi', `${iconPath}.png`)];

  //       for (const iconFilePath of possibleIconPaths) {
  //         if (existsSync(iconFilePath)) {
  //           appInfo.icon = iconFilePath;
  //           break;
  //         }
  //       }
  //     }
  //   }

  //   // 读取strings.xml获取应用名称
  //   if (existsSync(stringsPath)) {
  //     const stringsContent = await fs.readFile(stringsPath, 'utf-8');
  //     const appNameMatch = stringsContent.match(/<string name="app_name">([^<]+)<\/string>/);
  //     if (appNameMatch) {
  //       appInfo.name = appNameMatch[1];
  //     }
  //   }

  //   // 如果没有找到应用名称，使用目录名
  //   if (!appInfo.name) {
  //     appInfo.name = path.basename(appPath);
  //   }

  //   return appInfo;
  // } catch (error) {
  //   console.error('Failed to read app info:', error);
  //   return null;
  // }
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

// 执行命令的工具函数
function runCommand(command: string, args: string[], options: any = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, options);
    let stdout = '';
    let stderr = '';

    process.stdout?.on('data', (data) => {
      stdout += data.toString('utf8');
    });

    process.stderr?.on('data', (data) => {
      stderr += data.toString('utf8');
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

// 重签APK
ipcMain.handle('sign-apk', async (event, filePath: string, serialType: string) => {
  try {
    // apksigner sign --ks $tempDir/cert.jks --ks-key-alias "cert" --ks-pass pass:123456789 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled false --out $newApkFilePath $filePath
    // 使用apksigner签名
    // 使用path.parse解析路径
    const pathObj = path.parse(filePath);
    // 文件名（不含后缀）
    const fileNameWithoutExt = pathObj.name;
    // 文件路径（目录）
    const directory = pathObj.dir;

    // 构建输出文件的完整路径
    const outputApkPath = path.join(directory, `${fileNameWithoutExt}-signed.apk`);

    console.log('start sign APK', apksigner);
    console.log('Input APK:', filePath);
    console.log('Output APK:', outputApkPath);

    await runCommand(
      apksigner,
      [
        'sign',
        '--ks',
        oneCertJks,
        '--ks-key-alias',
        'cert',
        '--ks-pass',
        'pass:123456789',
        '--v1-signing-enabled',
        'true',
        '--v2-signing-enabled',
        'true',
        '--v3-signing-enabled',
        'false',
        '--out',
        outputApkPath,
        filePath, // 输入的APK文件
      ],
      { shell: true },
    );

    return outputApkPath;
  } catch (error) {
    console.error('签名失败:', error);
    throw error;
  }
});
