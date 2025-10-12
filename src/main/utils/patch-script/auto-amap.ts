import fs from 'fs';
import path from 'path';
import { sleepSync } from '../sleep';

/**
 * 修复 anims.xml 文件 - 注释掉不存在的anim资源
 */
function fixAnimsXml(apkDir: string): void {
  const animsPath = path.join(apkDir, 'res', 'values', 'anims.xml');
  const animDir = path.join(apkDir, 'res', 'anim');

  if (!fs.existsSync(animsPath)) {
    return;
  }

  try {
    let content = fs.readFileSync(animsPath, 'utf8');
    let commentedCount = 0;

    // 使用更安全的方法：先检查是否已经被注释，然后处理
    content = content.replace(/^(\s*)(<item[^>]*type="anim"[^>]*>.*?<\/item>)$/gm, (match: string, indent: string, fullTag: string) => {
      // 提取资源名
      const nameMatch = fullTag.match(/name="([^"]*)"/);
      if (!nameMatch) return match;

      const resourceName = nameMatch[1];
      const animFile = path.join(animDir, `${resourceName}.xml`);

      if (!fs.existsSync(animFile)) {
        commentedCount++;
        return `${indent}<!-- ${fullTag} -->`;
      }

      return match;
    });

    // 避免重复注释：移除已经被多重注释的行
    content = content.replace(/^(\s*)<!--\s*(<!--.*?-->)\s*-->$/gm, '$1$2');

    if (commentedCount > 0) {
      fs.writeFileSync(animsPath, content, 'utf8');
      console.log(`✅ anims.xml: 注释了 ${commentedCount} 个不存在的资源`);
    }
  } catch (error) {
    console.error('修复 anims.xml 失败:', error);
  }
}

/**
 * 修复 public.xml - 注释掉不存在的anim资源引用
 */
function fixPublicXml(apkDir: string): void {
  const publicXmlPath = path.join(apkDir, 'res', 'values', 'public.xml');
  const animDir = path.join(apkDir, 'res', 'anim');

  if (!fs.existsSync(publicXmlPath)) {
    return;
  }

  try {
    let content = fs.readFileSync(publicXmlPath, 'utf8');
    let commentedCount = 0;

    // 使用更安全的方法：先检查是否已经被注释，然后处理
    content = content.replace(/^(\s*)(<public[^>]*type="anim"[^>]*\/?>)$/gm, (match: string, indent: string, fullTag: string) => {
      // 提取资源名
      const nameMatch = fullTag.match(/name="([^"]*)"/);
      if (!nameMatch) return match;

      const resourceName = nameMatch[1];
      const animFile = path.join(animDir, `${resourceName}.xml`);

      if (!fs.existsSync(animFile)) {
        commentedCount++;
        return `${indent}<!-- ${fullTag} -->`;
      }

      return match;
    });

    // 避免重复注释：移除已经被多重注释的行
    content = content.replace(/^(\s*)<!--\s*(<!--.*?-->)\s*-->$/gm, '$1$2');

    if (commentedCount > 0) {
      fs.writeFileSync(publicXmlPath, content, 'utf8');
      console.log(`✅ public.xml: 注释了 ${commentedCount} 个不存在的引用`);
    }
  } catch (error) {
    console.error('修复 public.xml 失败:', error);
  }
}

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

  // 修复 anims.xml
  fixAnimsXml(apkDir);

  // 修复 public.xml
  fixPublicXml(apkDir);

  // fixLaunchErr
  fixLaunchErr(apkDir);

  console.log('资源修复完成');
}

export default patchAutoAmap;
