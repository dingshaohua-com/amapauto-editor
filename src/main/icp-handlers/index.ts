import { app, shell, BrowserWindow, ipcMain, dialog, OpenDialogOptions } from 'electron'
import { runJava } from '../utils/run-java'
import apktoolJar from '../../../resources/apktool_2.12.1.jar?asset'
import path from 'path'

const tmpDir = app.getPath('temp')
const unpackPath = path.join(tmpDir, 'gaode')

ipcMain.handle('select-file', async () => {
  // 使用Electron的dialog模块打开文件选择对话框
  const opt: OpenDialogOptions = {
    properties: ['openFile'], // 允许用户选择多个文件
    filters: [{ name: 'All Files', extensions: ['apk'] }]
  }
  const result = await dialog.showOpenDialog(opt)

  // 检查用户是否取消了操作或者选择了文件
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  } else {
    console.log('No file selected')
    return null
  }
})

ipcMain.handle('unpack-apk', async (evnet, path: string) => {
  console.log(path)
  const params = ['-Dfile.encoding=UTF-8', '-jar', apktoolJar , 'd', path, '-f', '-o', unpackPath]
  const res = await runJava(params)
  return unpackPath
})

ipcMain.handle('build-apk', async (evnet, path: string) => {
  console.log(path)
  const params = ['-Dfile.encoding=UTF-8', '-jar', apktoolJar , 'b', path, '-f', '-o', unpackPath]
  const res = await runJava(params)
  return unpackPath
})



