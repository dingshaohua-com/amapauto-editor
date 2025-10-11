import path from 'path';
import { ipcMain } from 'electron';
import parseApp from '../utils/parse-app';
import { runJava, runApkSigner } from '../utils/run-soft';
import repairAutoAmap from '../utils/repair-res/auto-amap';
import apktoolJar from '../../../resources/apktool.jar?asset';

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
});

// 重签APK（直接对apk文件签名，不需要接包）
ipcMain.handle('sign-apk', async (_, filePath: string, serialType: string) => {
  const res = await runApkSigner({ filePath, serialType });
  return res;
});
