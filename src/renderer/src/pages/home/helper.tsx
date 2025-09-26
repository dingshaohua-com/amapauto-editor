import { Package, FileText, Smartphone, Code, Shield, Zap, Database, Globe } from 'lucide-react';

export const getMenuItems = (navigate) => {
  return [
    {
      icon: <Package className="w-6 h-6" />,
      title: 'APK 解包',
      description: '解析 APK 文件结构',
      variant: 'primary' as const,
      onClick: () => {
        navigate('/unpack');
      },
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'APK 重打包',
      description: '重新生成 APK 文件',
      variant: 'secondary' as const,
      onClick: () => console.log('APK 重打包'),
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: '代码编辑',
      description: '修改应用代码',
      onClick: () => console.log('代码编辑'),
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: '资源管理',
      description: '管理应用资源文件',
      onClick: () => console.log('资源管理'),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '签名工具',
      description: '为 APK 添加数字签名',
      onClick: () => console.log('签名工具'),
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '性能优化',
      description: '优化应用性能',
      onClick: () => console.log('性能优化'),
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: '数据库工具',
      description: '管理应用数据库',
      onClick: () => console.log('数据库工具'),
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: '网络调试',
      description: '网络请求分析',
      onClick: () => console.log('网络调试'),
    },
  ];
};
