import { useState } from 'react';
import { match } from 'ts-pattern';
import { useRequest } from 'ahooks';
import { useNavigate } from 'react-router';
import { Button } from '@renderer/components/ui/button';
import { ArrowLeft, Folder, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog';

interface PatchScript {
  label: string;
  value: string;
  script: string;
  desc: string;
  detail: string;
}

interface PatchState {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function PatchApp(): React.JSX.Element {
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');
  const [patchState, setPatchState] = useState<PatchState>({ type: 'idle' });
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  // 获取可执行脚本列表
  const { data: patchScripts = [] } = useRequest(() => electron.ipcRenderer.invoke('patch-script'));

  // 选择目录
  const selectDirectory = async () => {
    const directoryPath = await electron.ipcRenderer.invoke('select-dir');
    setSelectedDirectory(directoryPath);
  };

  // 执行patch脚本
  const executePatchScript = async (script: PatchScript) => {
    if (!selectedDirectory) {
      alert('请先选择接包目录');
      return;
    }

    setShowDialog(true);
    setPatchState({ type: 'loading' });

    const result = await electron.ipcRenderer.invoke('execute-patch-script', script.script, selectedDirectory);

    if (result.success) {
      setPatchState({ type: 'success', message: result.message });
    } else {
      setPatchState({ type: 'error', message: result.message });
    }
  };

  // 关闭对话框
  const closeDialog = () => {
    setShowDialog(false);
    setPatchState({ type: 'idle' });
  };

  return (
    <>
      <div className="h-screen">
        {/* 顶部导航栏 */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">Patch 脚本</h1>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* 目录选择区域 */}
            <div className="p-6 mb-8 border-b-2 border-violet-400">
              <div className="flex items-center gap-4">
                <Button onClick={selectDirectory} variant="outline" className="flex-shrink-0">
                  <Folder className="w-4 h-4 mr-2" />
                  选择APK目录
                </Button>
                {selectedDirectory && <div className="flex-1 text-sm text-blue-900 font-medium mb-1">已选择目录：{selectedDirectory}</div>}
              </div>
            </div>

            {/* 脚本列表区域 */}
            <div className="p-6">
              {patchScripts.map((script, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-medium text-gray-900">{script.label}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-mono">{script.value}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{script.desc}</p>
                      {script.detail && script.detail !== 'xxx' && <p className="text-xs text-gray-500">{script.detail}</p>}
                    </div>
                    <Button onClick={() => executePatchScript(script)} disabled={!selectedDirectory} className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500">
                      <Play className="w-4 h-4 mr-2" />
                      执行
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 执行状态对话框 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>
              {match(patchState.type)
                .with('loading', () => '正在执行中...')
                .with('success', () => '执行成功')
                .with('error', () => '执行失败')
                .otherwise(() => '')}
            </DialogTitle>
            <DialogDescription>
              {match(patchState)
                .with({ type: 'loading' }, () => (
                  <div className="flex items-center gap-3 py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>正在执行 patch 脚本，请稍候...</span>
                  </div>
                ))
                .with({ type: 'success' }, ({ message }) => (
                  <div className="flex items-center gap-3 py-4 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    <span>{message || 'patch 脚本执行成功'}</span>
                  </div>
                ))
                .with({ type: 'error' }, ({ message }) => (
                  <div className="flex items-center gap-3 py-4 text-red-600">
                    <AlertCircle className="w-6 h-6" />
                    <span>{message || 'patch 脚本执行失败'}</span>
                  </div>
                ))
                .otherwise(() => null)}
            </DialogDescription>
          </DialogHeader>

          {patchState.type !== 'loading' && (
            <div className="flex justify-end mt-4">
              <Button onClick={closeDialog} variant="outline">
                关闭
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
