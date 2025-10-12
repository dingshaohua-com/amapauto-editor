import { shell, ipcMain, dialog, OpenDialogOptions } from 'electron';

// 选择文件
ipcMain.handle('select-file', async () => {
  const opt: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [{ name: 'All Files', extensions: ['apk'] }],
    title: '选择安装包',
  };
  const result = await dialog.showOpenDialog(opt);
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  } else {
    return null;
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

// 打开目录
ipcMain.handle('open-folder', async (_, folderPath: string) => {
  try {
    await shell.openPath(folderPath);
    return true;
  } catch (error) {
    console.error('Failed to open folder:', error);
    return false;
  }
});
