import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface FireworksProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
}

export default function Fireworks({ show, onComplete, duration = 3000 }: FireworksProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {/* 背景闪烁效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/10 to-pink-200/10 animate-pulse"></div>
      
      {/* 星星烟花 - 更多更分散 */}
      <div className="absolute top-10 left-10 animate-bounce">
        <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute top-20 right-16 animate-bounce delay-300">
        <Sparkles className="w-6 h-6 text-pink-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute bottom-20 left-20 animate-bounce delay-500">
        <Sparkles className="w-7 h-7 text-blue-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute bottom-16 right-12 animate-bounce delay-700">
        <Sparkles className="w-6 h-6 text-green-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute top-32 left-1/3 animate-bounce delay-200">
        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute bottom-32 right-1/3 animate-bounce delay-600">
        <Sparkles className="w-7 h-7 text-orange-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute top-1/4 right-1/4 animate-bounce delay-400">
        <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-bounce delay-800">
        <Sparkles className="w-5 h-5 text-red-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute top-1/3 left-1/2 animate-bounce delay-100">
        <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse drop-shadow-lg" />
      </div>
      <div className="absolute bottom-1/3 right-1/2 animate-bounce delay-900">
        <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse drop-shadow-lg" />
      </div>
      
      {/* 中心爆炸效果 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-75 shadow-2xl"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping delay-150">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-60 shadow-xl"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping delay-300">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full opacity-50 shadow-lg"></div>
      </div>
      
      {/* 表情符号动画 */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
        <span className="text-4xl font-bold drop-shadow-lg">🎉</span>
      </div>
      <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-bounce delay-200">
        <span className="text-3xl font-bold drop-shadow-lg">✨</span>
      </div>
      <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 animate-bounce delay-400">
        <span className="text-3xl font-bold drop-shadow-lg">🎊</span>
      </div>
      <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2 animate-bounce delay-600">
        <span className="text-2xl font-bold drop-shadow-lg">🌟</span>
      </div>
      <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2 animate-bounce delay-800">
        <span className="text-2xl font-bold drop-shadow-lg">💫</span>
      </div>
      
      {/* 飘落的彩带效果 */}
      <div className="absolute top-0 left-1/4 w-2 h-16 bg-gradient-to-b from-yellow-400 to-transparent animate-pulse opacity-70"></div>
      <div className="absolute top-0 left-1/2 w-2 h-20 bg-gradient-to-b from-pink-400 to-transparent animate-pulse delay-200 opacity-70"></div>
      <div className="absolute top-0 right-1/4 w-2 h-12 bg-gradient-to-b from-blue-400 to-transparent animate-pulse delay-400 opacity-70"></div>
      <div className="absolute top-0 left-1/3 w-2 h-18 bg-gradient-to-b from-green-400 to-transparent animate-pulse delay-600 opacity-70"></div>
      <div className="absolute top-0 right-1/3 w-2 h-14 bg-gradient-to-b from-purple-400 to-transparent animate-pulse delay-800 opacity-70"></div>
      
      {/* 成功文字 */}
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-2xl border-2 border-yellow-300">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-pink-600">
            🎉 解包成功！ 🎉
          </span>
        </div>
      </div>
    </div>
  );
}
