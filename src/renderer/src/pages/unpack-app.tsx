import { useState } from 'react';
import { match } from 'ts-pattern';
import { useNavigate } from 'react-router';
import loadingImg from '../assets/imgs/loading.gif';
import Fireworks from '@renderer/components/fireworks';
import { Button } from '@renderer/components/ui/button';
import { ArrowLeft, Package, CheckCircle, AlertCircle, ExternalLink, RotateCcw, Folder } from 'lucide-react';

type UnpackState = { type: 'idle' } | { type: 'loading' } | { type: 'success'; unPackPath: string } | { type: 'error'; message: string };

export default function Unpack(): React.JSX.Element {
  const [state, setState] = useState<UnpackState>({ type: 'idle' });
  const [showFireworks, setShowFireworks] = useState(false);
  const navigate = useNavigate();

  const onSelectFile = async () => {
    try {
      setState({ type: 'idle' });
      const filePath = await electron.ipcRenderer.invoke('select-file');
      if (!filePath) return;

      setState({ type: 'loading' });

      const res = await electron.ipcRenderer.invoke('unpack-apk', filePath);

      // 显示成功状态和烟花效果
      setState({ type: 'success', unPackPath: res });
      setShowFireworks(true);
    } catch (err) {
      setState({ type: 'error', message: '解包过程中出现错误，请重试' });
      console.error('Unpack error:', err);
    }
  };

  const openUnpackFolder = async () => {
    match(state)
      .with({ type: 'success' }, ({ unPackPath }) => {
        if (unPackPath) {
          electron.ipcRenderer.invoke('open-folder', unPackPath).catch((err) => console.error('Failed to open folder:', err));
        }
      })
      .otherwise(() => {});
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // 渲染成功状态的组件
  const renderSuccessState = (unPackPath: string) => {
    return (
      <div className="mb-6 relative">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                🎉 解包成功！
                <span className="text-2xl animate-bounce">😊</span>
              </h3>
              <p className="text-green-700 text-sm">APK 文件已成功解包到本地目录</p>
            </div>
          </div>

          <div className="bg-white/70 p-3 rounded-lg border border-green-200 mb-4">
            <p className="text-sm text-green-800 font-mono break-all">📁 {unPackPath}</p>
          </div>

          <div className="flex gap-3 flex-wrap mt-10">
            <Button onClick={() => setState({ type: 'idle' })} size="sm" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              重新开始
            </Button>
            <Button onClick={openUnpackFolder} size="sm" className="cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              打开解包目录
            </Button>
            <Button onClick={() => navigate('/step-two')} size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              {'下一步->修改包？'}
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

      <div className="h-screen ">
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
                  <Package className="w-5 h-5 text-blue-600" />
                  <h1 className="text-lg font-semibold text-gray-900">APK 解包</h1>
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
                      <li>• 支持标准的 apk 文件</li>
                      <li>• 解包需要点时间，请耐心等待</li>
                    </ul>
                  </div>
                </>
              ))
              .with({ type: 'loading' }, () => (
                <>
                  <div className="flex flex-col items-center">
                    <img src={loadingImg} alt="Loading" className="w-32 h-32 object-contain" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">正在解包中...</h3>
                      <p className="text-gray-400 text-sm">请稍候，正在解包 APK，一般20秒左右！</p>
                    </div>
                  </div>
                </>
              ))
              .with({ type: 'success' }, ({ unPackPath }) => renderSuccessState(unPackPath))
              .with({ type: 'error' }, ({ message }) => (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">{message}</span>
                    </div>
                  </div>

                  {/* 选择文件按钮 */}
                  <div className="text-center">
                    <Button onClick={onSelectFile} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Package className="w-5 h-5 mr-2" />
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
