import { getMenuItems } from './helper';
import { useNavigate } from 'react-router';
import { MenuItemProps } from '@renderer/types';
import { Button } from '@renderer/components/ui/button';

const MenuItem = ({ icon, title, description, onClick, variant = 'default' }: MenuItemProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg';
      case 'secondary':
        return 'bg-gradient-to-br from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 border-0 shadow-lg';
      default:
        return 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 hover:border-gray-300 shadow-sm hover:shadow-md';
    }
  };

  return (
    <Button
      variant="outline"
      className={`
        cursor-pointer
        h-28 p-4 flex flex-col items-center justify-center gap-2
        transition-all duration-300 transform hover:scale-105 hover:shadow-xl
        rounded-xl group relative overflow-hidden
        ${getVariantStyles()}
      `}
      onClick={onClick}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="text-xl transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <div className="text-center">
          <div className="font-semibold text-sm leading-tight">{title}</div>
          <div className="text-xs opacity-75 mt-1 leading-tight">{description}</div>
        </div>
      </div>
    </Button>
  );
};

export default function Home(): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">APK 编辑器</h1>
          <p className="text-lg text-gray-600">专业的 Android 应用包编辑工具</p>
        </div>

        {/* 功能菜单 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {getMenuItems(navigate).map((item, index) => (
            <MenuItem key={index} icon={item.icon} title={item.title} description={item.description} variant={item.variant} onClick={item.onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
