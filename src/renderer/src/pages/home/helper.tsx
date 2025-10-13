import editAppImg from '@renderer/assets/imgs/edit-app.svg';
import packAppImg from '@renderer/assets/imgs/pack-app.svg';
import signAppImg from '@renderer/assets/imgs/sign-app.svg';
import patchAppImg from '@renderer/assets/imgs/patch-app.svg';
import unpackAppImg from '@renderer/assets/imgs/unpack-app.svg';

export const getMenuItems = (navigate) => {
  return [
    {
      icon: <img className="w-7 h-7" src={unpackAppImg} />,
      title: '解包',
      description: '解析 APK 文件结构',
      variant: 'primary' as const,
      onClick: () => {
        navigate('/unpack-app');
      },
    },
    {
      icon: <img className="w-8 h-8" src={patchAppImg} />,
      title: '修补',
      description: '针对打包失败或优化',
      variant: 'secondary' as const,
      onClick: () => {
        navigate('/patch-app');
      },
    },
    {
      icon: <img className="w-7 h-7" src={editAppImg} />,
      title: '编辑包',
      description: '修改APP信息',
      variant: 'danger' as const,
      onClick: () => {
        navigate('/edit-app');
      },
    },
    {
      icon: <img className="w-7 h-7" src={packAppImg} />,
      title: '重打包',
      description: '重新生成 APK 文件',
      variant: 'info' as const,
      onClick: () => {
        navigate('/pack-app');
      },
    },
    {
      icon: <img className="w-8 h-8" src={signAppImg} />,
      title: '签名',
      description: '为 APK 添加数字签名',
      variant: 'warning' as const,
      onClick: () => {
        navigate('/sign-app');
      },
    },

    // {
    //   icon: <FileText className="w-6 h-6" />,
    //   title: '资源管理',
    //   description: '管理应用资源文件',
    //   onClick: () => console.log('资源管理'),
    // },

    // {
    //   icon: <Database className="w-6 h-6" />,
    //   title: '数据库工具',
    //   description: '管理应用数据库',
    //   onClick: () => console.log('数据库工具'),
    // },
    // {
    //   icon: <Globe className="w-6 h-6" />,
    //   title: '网络调试',
    //   description: '网络请求分析',
    //   onClick: () => console.log('网络调试'),
    // },
  ];
};

export const getVariantStyles = (variant) => {
  switch (variant) {
    case 'primary':
      return 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg';
    case 'secondary':
      return 'bg-gradient-to-br from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 border-0 shadow-lg';
    case 'danger':
      return 'bg-gradient-to-br from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 border-0 shadow-lg';
    case 'warning':
      return 'bg-gradient-to-br from-orange-500 to-yellow-600 text-white hover:from-orange-600 hover:to-yellow-700 border-0 shadow-lg';
    case 'info':
      return 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg';
    case 'success':
      return 'bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 border-0 shadow-lg';
    case 'purple':
      return 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 border-0 shadow-lg';
    case 'pink':
      return 'bg-gradient-to-br from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 border-0 shadow-lg';
    case 'indigo':
      return 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 border-0 shadow-lg';
    case 'teal':
      return 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 border-0 shadow-lg';
    case 'amber':
      return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 border-0 shadow-lg';
    case 'lime':
      return 'bg-gradient-to-br from-lime-500 to-green-600 text-white hover:from-lime-600 hover:to-green-700 border-0 shadow-lg';
    case 'violet':
      return 'bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 border-0 shadow-lg';
    case 'rose':
      return 'bg-gradient-to-br from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 border-0 shadow-lg';
    case 'sky':
      return 'bg-gradient-to-br from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 border-0 shadow-lg';
    case 'emerald':
      return 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 border-0 shadow-lg';
    case 'slate':
      return 'bg-gradient-to-br from-slate-500 to-gray-600 text-white hover:from-slate-600 hover:to-gray-700 border-0 shadow-lg';
    case 'neutral':
      return 'bg-gradient-to-br from-neutral-500 to-stone-600 text-white hover:from-neutral-600 hover:to-stone-700 border-0 shadow-lg';
    case 'dark':
      return 'bg-gradient-to-br from-gray-800 to-black text-white hover:from-gray-900 hover:to-gray-800 border-0 shadow-lg';
    case 'light':
      return 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 border border-gray-300 shadow-sm hover:shadow-md';
    default:
      return 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 hover:border-gray-300 shadow-sm hover:shadow-md';
  }
};
