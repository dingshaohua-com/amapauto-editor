import fs from 'fs';
import path from 'path';

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

    // 注释掉不存在的anim资源
    content = content.replace(/(\s*)(<item[^>]*type="anim"[^>]*>.*?<\/item>)/g, (match: string, indent: string, fullTag: string) => {
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

    // 注释掉不存在的anim引用
    content = content.replace(/(\s*)(<public[^>]*type="anim"[^>]*\/>)/g, (match: string, indent: string, fullTag: string) => {
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

    if (commentedCount > 0) {
      fs.writeFileSync(publicXmlPath, content, 'utf8');
      console.log(`✅ public.xml: 注释了 ${commentedCount} 个不存在的引用`);
    }
  } catch (error) {
    console.error('修复 public.xml 失败:', error);
  }
}

/**
 * 修复APK资源文件 - 注释掉不存在的anim资源引用
 * @param apkDir - APK解包目录路径
 */
function patchAutoAmap(apkDir: string): void {
  console.log('开始修复APK资源文件...');

  // 修复 anims.xml
  fixAnimsXml(apkDir);

  // 修复 public.xml
  fixPublicXml(apkDir);

  console.log('资源修复完成');
}

export default patchAutoAmap;
