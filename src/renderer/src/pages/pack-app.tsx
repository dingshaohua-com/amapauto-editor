import { useState } from 'react';
import { match } from 'ts-pattern';
import { useNavigate } from 'react-router';
import loadingImg from '../assets/imgs/loading.gif';
import Fireworks from '@renderer/components/fireworks';
import { Button } from '@renderer/components/ui/button';
import { ArrowLeft, Package, CheckCircle, AlertCircle, ExternalLink, RotateCcw, Folder, FileArchive } from 'lucide-react';

type PackState = { type: 'idle' } | { type: 'directory-selected'; directoryPath: string } | { type: 'loading' } | { type: 'success'; outputPath: string } | { type: 'error'; message: string };

export default function Pack(): React.JSX.Element {
  const [state, setState] = useState<PackState>({ type: 'idle' });
  const [showFireworks, setShowFireworks] = useState(false);
  const navigate = useNavigate();

  const onSelectDirectory = async () => {
    const directoryPath = await electron.ipcRenderer.invoke('select-dir');
    if (!directoryPath) return;

    setState({ type: 'directory-selected', directoryPath });
  };

  const onStartPack = async () => {
    if (state.type !== 'directory-selected') return;

    setState({ type: 'loading' });

    const result = await electron.ipcRenderer.invoke('build-apk', state.directoryPath);

    // 显示成功状态和烟花效果
    setState({ type: 'success', outputPath: result || state.directoryPath });
    setShowFireworks(true);
  };

  const openOutputFolder = async () => {
    if (state.type === 'success') {
      // 打开包含输出文件的目录
      const outputPath = state.outputPath;
      const outputDir = outputPath.includes('.apk')
        ? outputPath.substring(0, Math.max(outputPath.lastIndexOf('/'), outputPath.lastIndexOf('\\')))
        : outputPath;
      console.log(11122,outputPath, outputDir);
      
      electron.ipcRenderer.invoke('open-folder', outputDir).catch((err) => console.error('Failed to open folder:', err));
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleReset = () => {
    setState({ type: 'idle' });
    setShowFireworks(false);
  };

  // 渲染成功状态的组件
  const renderSuccessState = (outputPath: string) => {
    return (
      <div className="mb-6 relative">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                🎉 打包成功！
                <span className="text-2xl animate-bounce">😊</span>
              </h3>
              <p className="text-green-700 text-sm">APK 文件已成功生成</p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-900 font-medium mb-1">输出路径：</p>
            <p className="text-sm text-green-800 font-mono break-all">{outputPath}</p>
          </div>

          <div className="flex gap-3 flex-wrap mt-6">
            <Button onClick={handleReset} size="sm" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              重新开始
            </Button>
            <Button onClick={openOutputFolder} size="sm" className="cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              打开输出目录
            </Button>
            <Button onClick={() => navigate('/sign-app')} size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              下一步 → 签名
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

      <div className="h-screen">
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
                  <FileArchive className="w-5 h-5 text-blue-600" />
                  <h1 className="text-lg font-semibold text-gray-900">APK 重打包</h1>
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
                <>
                  {/* 选择目录按钮 */}
                  <div className="text-center">
                    <Button onClick={onSelectDirectory} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Folder className="w-5 h-5 mr-2" />
                      选择解包目录
                    </Button>
                  </div>

                  {/* 提示信息 */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">温馨提示：</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 请选择已解包的 APK 目录</li>
                      <li>• 打包需要一些时间，请耐心等待</li>
                    </ul>
                  </div>
                </>
              ))
              .with({ type: 'directory-selected' }, ({ directoryPath }) => (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  {/* 目录信息 */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium mb-2">已选择目录：</p>
                    <p className="text-sm text-blue-800 font-mono break-all">{directoryPath}</p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3 justify-center">
                    <Button onClick={onSelectDirectory} variant="outline" className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      重新选择
                    </Button>
                    <Button onClick={onStartPack} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      开始打包
                    </Button>
                  </div>
                </div>
              ))
              .with({ type: 'loading' }, () => (
                <>
                  <div className="flex flex-col items-center">
                    <img src={loadingImg} alt="Loading" className="w-32 h-32 object-contain" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">正在打包中...</h3>
                      <p className="text-gray-400 text-sm">请稍候，正在重新打包 APK，一般需要30秒左右！</p>
                    </div>
                  </div>
                </>
              ))
              .with({ type: 'success' }, ({ outputPath }) => renderSuccessState(outputPath))
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
                      <RotateCcw className="w-5 h-5 mr-2" />
                      重新尝试
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
