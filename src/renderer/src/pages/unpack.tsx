import { match } from 'ts-pattern';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import loadingImg from '../assets/imgs/loading.gif';
import { Button } from '@renderer/components/ui/button';
import { ArrowLeft, Package, CheckCircle, AlertCircle, ExternalLink, Sparkles, RotateCcw, Folder } from 'lucide-react';

type UnpackState = { type: 'idle' } | { type: 'loading' } | { type: 'success'; unPackPath: string } | { type: 'error'; message: string };

export default function Unpack(): React.JSX.Element {
  const [state, setState] = useState<UnpackState>({ type: 'idle' });
  const [showFireworks, setShowFireworks] = useState(false);
  const navigate = useNavigate();

  // 添加烟花效果的useEffect
  useEffect(() => {
    if (showFireworks) {
      console.log('开始播放烟花');
      
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 3000); // 3秒后隐藏烟花效果
      return () => clearTimeout(timer);
    }
  }, [showFireworks]);

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
  const renderSuccessState = (unPackPath: string) => (
    <div className="mb-6 relative">
      {/* 烟花效果 */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute top-2 left-4 animate-bounce">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute top-4 right-6 animate-bounce delay-300">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-8 animate-bounce delay-500">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          </div>
          <div className="absolute bottom-2 right-4 animate-bounce delay-700">
            <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-75"></div>
          </div>
        </div>
      )}

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

        <div className="flex gap-3">
          <Button onClick={() => setState({ type: 'idle' })} size="sm" className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            重新开始
          </Button>
          <Button onClick={openUnpackFolder} size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            打开解包目录
          </Button>
          <Button onClick={() => navigate('/step-two')} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            {'下一步->修改包？'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToHome} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
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
                    <li>• 解包过程可能需要几分钟时间，请耐心等待</li>
                  </ul>
                </div>
              </div>
            ))
            .with({ type: 'loading' }, () => (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="flex flex-col items-center gap-6">
                  <img src={loadingImg} alt="Loading" className="w-32 h-32 object-contain" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">正在解包中...</h3>
                    <p className="text-gray-600">请稍候，正在解析 APK 文件结构</p>
                  </div>
                </div>
              </div>
            ))
            .with({ type: 'success' }, ({ unPackPath }) => <div className="bg-white rounded-2xl shadow-xl p-8">{renderSuccessState(unPackPath)}</div>)
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
  );
}
