// src/flexible-runner.ts

import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';
import javaExe from '../../../resources/jre/bin/java.exe?asset'; // win下应改为java.exe

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 通用地运行一个使用捆绑JRE的Java命令。
 *
 * @param args - 一个字符串数组，代表要传递给'java'可执行文件的所有参数。
 * @returns 当 Java 进程成功完成时 resolve，失败时 reject 的 Promise。
 */
export function runJava(args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    // const baseDir: string = path.resolve(__dirname, '..')
    // 根据不同平台选择不同的java可执行文件
    // const javaPath: string = path.resolve(baseDir, 'jre-win', 'bin', 'java.exe')
    const javaPath = javaExe;

    // console.log(`[Node.js] ready commd:`);
    // console.log(`  -> Java path: ${javaPath}`);
    // console.log(`  -> params: ${args.join(' ')}`);

    const javaProcess: ChildProcess = spawn(javaPath, args); // 直接使用传入的args

    // ... (后面的事件监听代码和之前完全一样) ...
    javaProcess.stdout?.on('data', (data) => console.log(`[Java]: ${data.toString().trim()}`));
    javaProcess.stderr?.on('data', (data) => console.error(`[Java ERR]: ${data.toString().trim()}`));
    javaProcess.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Java process exited with code ${code}`));
    });
    javaProcess.on('error', (err) => reject(err));
  });
}

// // ------ 如何使用这个灵活的函数 ------
// async function main() {
//   console.log('--- check Java version ---')
//   try {
//     await runJava(['-version'])
//   } catch (e) {
//     console.error('检查版本失败', e)
//   }

//   console.log('\n--- 运行 JAR 文件 ---')
//   try {
//     const jarPath = path.resolve(__dirname, '..', 'my-java-app.jar')
//     await runJava(['-jar', jarPath, 'arg1', 'arg2'])
//   } catch (e) {
//     console.error('运行JAR失败', e)
//   }
// }

// main()
