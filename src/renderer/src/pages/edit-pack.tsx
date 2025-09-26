import { useNavigate } from 'react-router';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';

export default function EditPack(): React.JSX.Element {
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate('/');
  };
  return (
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
                <Package className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">APP 编辑</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        1233
       </div>
    </div>
  );
}
