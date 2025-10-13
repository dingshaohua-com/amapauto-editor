import path from 'path';
import { ipcMain } from 'electron';
import parseApp from '../utils/parse-app';
import patchScript from '../utils/patch-script/index';
import { runJava, runApkSigner } from '../utils/run-soft';
import repairAutoAmap from '../utils/patch-script/auto-amap';
import apktoolJar from '../../../resources/apktool.jar?asset';
import { updateAppName, updatePackageName } from '../utils/update-app';

// 解包APK
ipcMain.handle('unpack-apk', async (_, filePath: string) => {
  // 使用path.parse解析路径，从而获取文件名（不含后缀）
  const { name: fileName, dir: fileDir } = path.parse(filePath);
  const unpackPath = path.join(fileDir, fileName); // 文件路径（目录）
  const params = ['-Dfile.encoding=UTF-8', '-jar', apktoolJar, 'd', '-k', filePath, '-f', '-o', unpackPath];
  await runJava(params);
  return unpackPath;
});

// 打包APK
ipcMain.handle('build-apk', async (_, inputPath: string) => {
  const params = ['-Dfile.encoding=UTF-8', '-jar', apktoolJar, 'b', inputPath];
  console.log('开始打包APK...', params);

  await runJava(params);

  // 构建输出APK文件路径
  // apktool 默认会在输入目录的 dist 子目录中生成 APK 文件
  const { name: dirName } = path.parse(inputPath);
  const outputApkPath = path.join(inputPath, 'dist', `${dirName}.apk`);

  console.log('APK打包完成，输出路径:', outputApkPath);
  return outputApkPath;
});

// 读取应用信息（从AndroidManifest.xml和其他文件）
ipcMain.handle('read-app-info', async (_, appPath: string) => {
  return parseApp(appPath);
});

// 重签APK（直接对apk文件签名，不需要接包）
ipcMain.handle('sign-apk', async (_, filePath: string, serialType: string) => {
  const res = await runApkSigner({ filePath, serialType });
  return res;
});

// 更新APK
ipcMain.handle('update-app-info', async (_, filePath: string, values: Record<string, string>) => {
  if (Object.keys(values).includes('name')) {
    return await updateAppName(filePath, values.name);
  } else if (Object.keys(values).includes('package')) {
    return await updatePackageName(filePath, values.package);
  }

  // Return a default value when no matching condition is found
  return { success: false, message: 'No valid update operation specified' };
});

// 获取patch脚本列表
ipcMain.handle('patch-script', () => {
  return patchScript;
});

// 执行patch脚本
ipcMain.handle('execute-patch-script', async (_, scriptName: string, directoryPath: string) => {
  try {
    console.log(`执行patch脚本: ${scriptName}, 目录: ${directoryPath}`);

    switch (scriptName) {
      case 'patchAutoAmap':
        repairAutoAmap(directoryPath);
        break;
      default:
        throw new Error(`未知的patch脚本: ${scriptName}`);
    }

    return { success: true, message: 'patch脚本执行成功' };
  } catch (error) {
    console.error('执行patch脚本失败:', error);
    return { success: false, message: (error as Error).message || 'patch脚本执行失败' };
  }
});
