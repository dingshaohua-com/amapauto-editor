import path from 'path';
import getSomeFile from './some-file';
import { getJks } from './jks-helper';
import { spawn, ChildProcess } from 'child_process';

const java = getSomeFile('java');
const apksigner = getSomeFile('apksigner');

// 执行命令的工具函数
export function runCommand(command: string, args: string[], options = {}): Promise<string> {
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

/**
 * 通用地运行一个使用捆绑JRE的Java命令。
 *
 * @param args - 一个字符串数组，代表要传递给'java'可执行文件的所有参数。
 * @returns 当 Java 进程成功完成时 resolve，失败时 reject 的 Promise。
 */
export function runJava(args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    // console.log(`[Node.js] ready commd:`);
    // console.log(`  -> Java path: ${javaPath}`);
    // console.log(`  -> params: ${args.join(' ')}`);
    const javaProcess: ChildProcess = spawn(java, args);
    javaProcess.stdout?.on('data', (data) => console.log(`[Java]: ${data.toString().trim()}`));
    javaProcess.stderr?.on('data', (data) => console.error(`[Java ERR]: ${data.toString().trim()}`));
    javaProcess.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Java process exited with code ${code}`));
    });
    javaProcess.on('error', (err) => reject(err));
  });
}

export async function runApkSigner(args: { filePath: string; serialType: string }): Promise<string> {
  // apksigner sign --ks $tempDir/cert.jks --ks-key-alias "cert" --ks-pass pass:123456789 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled false --out $newApkFilePath $filePath
  // 使用path.parse解析路径
  const pathObj = path.parse(args.filePath);
  // 文件名（不含后缀）
  const fileNameWithoutExt = pathObj.name;
  // 文件路径（目录）
  const directory = pathObj.dir;
  // 构建输出文件的完整路径
  const outputApkPath = path.join(directory, `${fileNameWithoutExt}-signed.apk`);
  await runCommand(
    apksigner,
    [
      'sign',
      '--ks',
      getJks(args.serialType).path,
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
      args.filePath, // 输入的APK文件
    ],
    { shell: true },
  );
  return outputApkPath;
}
