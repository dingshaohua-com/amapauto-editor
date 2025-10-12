import { useState } from 'react';
import { match } from 'ts-pattern';
import { useNavigate } from 'react-router';
import loadingImg from '../assets/imgs/loading.gif';
import Fireworks from '@renderer/components/fireworks';
import { Button } from '@renderer/components/ui/button';

import { ArrowLeft, FileCheck, CheckCircle, AlertCircle, ExternalLink, RotateCcw, Folder } from 'lucide-react';

type SignState = { type: 'idle' } | { type: 'file-selected'; filePath: string } | { type: 'loading' } | { type: 'success'; signedApkPath: string } | { type: 'error'; message: string };

// 车型选项
const carTypeOptions = [
  { label: '梧桐系', value: 'tinnove' },
  { label: '飞鱼系', value: 'feiyu' },
  { label: 'G318', value: 'g318' },
  { label: 'A07', value: 'a07' },
];

export default function ReSign(): React.JSX.Element {
  const [state, setState] = useState<SignState>({ type: 'idle' });
  const [carType, setCarType] = useState('');
  const [showFireworks, setShowFireworks] = useState(false);
  const navigate = useNavigate();

  const onSelectFile = async () => {
    try {
      const filePath = await electron.ipcRenderer.invoke('select-file');
      if (!filePath) return;

      setState({ type: 'file-selected', filePath });
    } catch (err) {
      setState({ type: 'error', message: '选择文件失败，请重试' });
      console.error('Select file error:', err);
    }
  };

  const onStartSign = async () => {
    try {
      if (state.type !== 'file-selected') return;
      if (!carType) {
        setState({ type: 'error', message: '请选择车型' });
        return;
      }

      setState({ type: 'loading' });

      const signedApkPath = await electron.ipcRenderer.invoke('sign-apk', state.filePath, carType);

      // 显示成功状态和烟花效果
      setState({ type: 'success', signedApkPath });
      setShowFireworks(true);
    } catch (err) {
      setState({ type: 'error', message: '签名过程中出现错误，请重试' });
      console.error('Sign error:', err);
    }
  };

  const openSignedFolder = async () => {
    match(state)
      .with({ type: 'success' }, ({ signedApkPath }) => {
        if (signedApkPath) {
          const folderPath = signedApkPath.substring(0, signedApkPath.lastIndexOf('\\'));
          electron.ipcRenderer.invoke('open-folder', folderPath).catch((err) => console.error('Failed to open folder:', err));
        }
      })
      .otherwise(() => {});
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleReset = () => {
    setState({ type: 'idle' });
    setCarType('');
  };

  // 渲染成功状态的组件
  const renderSuccessState = (signedApkPath: string) => {
    return (
      <div className="mb-6 relative">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                🎉 签名成功！
                <span className="text-2xl animate-bounce">😊</span>
              </h3>
              <p className="text-green-700 text-sm">APK 文件已成功签名</p>
            </div>
          </div>

          <div className="bg-white/70 p-3 rounded-lg border border-green-200 mb-4">
            <p className="text-sm text-green-800 font-mono break-all">📁 {signedApkPath}</p>
          </div>

          <div className="flex gap-3 flex-wrap mt-10">
            <Button onClick={handleReset} size="sm" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              重新开始
            </Button>
            <Button onClick={openSignedFolder} size="sm" className="cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              打开文件目录
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 烟花效果组件 - 最外层 */}
      <Fireworks show={showFireworks} onComplete={() => setShowFireworks(false)} duration={5000} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* 顶部导航栏 */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBackToHome} className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4" />
                  返回主菜单
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <h1 className="text-lg font-semibold text-gray-900">APK 签名</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <div className="w-full max-w-2xl">
            {match(state)
              .with({ type: 'idle' }, () => (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  {/* 选择文件按钮 */}
                  <div className="text-center">
                    <Button onClick={onSelectFile} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Folder className="w-5 h-5 mr-2" />
                      选择 APK
                    </Button>
                  </div>

                  {/* 提示信息 */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">温馨提示：</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 支持标准的 .apk 文件格式</li>
                      <li>• 签名过程需要选择对应的车型</li>
                      <li>• 签名后的文件将保存在原文件同目录下</li>
                    </ul>
                  </div>
                </div>
              ))
              .with({ type: 'file-selected' }, ({ filePath }) => (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  {/* 文件信息 */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium mb-2">已选择文件：</p>
                    <p className="text-sm text-blue-800 font-mono break-all">{filePath}</p>
                  </div>

                  {/* 车型选择 */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">选择车型：</label>
                    <select
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">请选择车型...</option>
                      {carTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3">
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      重新选择
                    </Button>
                    <Button onClick={onStartSign} disabled={!carType} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                      <FileCheck className="w-4 h-4 mr-2" />
                      开始签名
                    </Button>
                  </div>
                </div>
              ))
              .with({ type: 'loading' }, () => (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <img src={loadingImg} alt="Loading" className="w-32 h-32 object-contain" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">正在签名中...</h3>
                      <p className="text-gray-600">请稍候，正在为 APK 签名，一般需要30秒左右！</p>
                    </div>
                  </div>
                </div>
              ))
              .with({ type: 'success' }, ({ signedApkPath }) => <div className="bg-white rounded-2xl shadow-xl p-8">{renderSuccessState(signedApkPath)}</div>)
              .with({ type: 'error' }, ({ message }) => (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">{message}</span>
                    </div>
                  </div>

                  {/* 重试按钮 */}
                  <div className="text-center">
                    <Button onClick={handleReset} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      重新开始
                    </Button>
                  </div>
                </div>
              ))
              .otherwise(() => null)}
          </div>
        </div>
      </div>
    </>
  );
}
