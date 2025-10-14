import fs from 'fs';
import path from 'path';
import { sleepSync } from '../sleep';

/**
 * 修复启动报错：应用出现异常错误
 */
function fixLaunchErr(apkDir: string): void {
  // 读取 smali 目录下的所有 .smali 文件
  const smaliDir = path.join(apkDir, 'smali');
  const files = fs.readdirSync(smaliDir);
  const smaliFiles = files.filter((file) => file.endsWith('.smali')).map((file) => path.join(smaliDir, file));
  const y80SmaliFile = smaliFiles.find((item) => path.join(smaliDir, 'y80.smali') === item)!;

  // 文件路径
  const filePath = y80SmaliFile;

  // 读取文件内容
  let content = fs.readFileSync(filePath, 'utf8');

  // 要替换的新方法内容
  const newMethod = `.method public static d(Landroid/content/Context;)Z
    .locals 1

    .line 1
    const/4 p0, 0x1

    return p0
.end method`;

  // 简单替换：找到以指定开头和结尾的内容并替换
  const startStr = '.method public static d(Landroid/content/Context;)Z';
  const endStr = '.end method';

  const startIndex = content.indexOf(startStr);
  if (startIndex !== -1) {
    const endIndex = content.indexOf(endStr, startIndex) + endStr.length;

    // 替换这部分内容
    content = content.substring(0, startIndex) + newMethod + content.substring(endIndex);

    // 写回文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('方法替换成功！');
  } else {
    console.log('未找到指定方法');
  }
}

/**
 * 修复APK资源文件 - 注释掉不存在的anim资源引用
 * @param apkDir - APK解包目录路径
 */
function patchAutoAmap(apkDir: string) {
  console.log('开始修复APK资源文件...');
  sleepSync(1000);

  // 修复启动报错
  fixLaunchErr(apkDir);

  console.log('资源修复完成');
}

export default patchAutoAmap;
