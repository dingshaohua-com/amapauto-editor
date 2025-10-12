import { useState } from 'react';
import { match } from 'ts-pattern';
import appList from '@renderer/lib/apps';
import { useNavigate } from 'react-router';
import { Input } from '@renderer/components/ui/input';
import { Button } from '@renderer/components/ui/button';
import { Combobox } from '@renderer/components/ui/combobox';
import { ArrowLeft, Package, Folder, Edit2, Check, X } from 'lucide-react';

interface AppInfo {
  path: string;
  name: string;
  package: string;
  icon: string | null;
}

interface EditingState {
  field: 'name' | 'package' | null;
  value: string;
}

export default function EditPack(): React.JSX.Element {
  const navigate = useNavigate();
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<EditingState>({ field: null, value: '' });

  const handleBackToHome = () => {
    navigate('/');
  };

  const selectAppDirectory = async () => {
    try {
      setLoading(true);
      const directoryPath = await electron.ipcRenderer.invoke('select-dir');
      if (directoryPath) {
        const info = await electron.ipcRenderer.invoke('read-app-info', directoryPath);
        if (info) {
          console.log(999, info);

          setAppInfo({ ...info, path: directoryPath });
        } else {
          alert('无法读取应用信息，请确保选择的是有效的应用目录');
        }
      }
    } catch (error) {
      console.error('选择目录失败:', error);
      alert('选择目录失败');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (field: 'name' | 'package') => {
    if (!appInfo) return;
    setEditing({
      field,
      value: field === 'name' ? appInfo.name : appInfo.package,
    });
  };

  const cancelEditing = () => {
    setEditing({ field: null, value: '' });
  };

  const saveEdit = async () => {
    if (!appInfo || !editing.field) return;

    try {
      setLoading(true);
      let success = false;

      if (editing.field === 'name') {
        success = await electron.ipcRenderer.invoke('update-app-info', appInfo.path, { name: editing.value });
      } else if (editing.field === 'package') {
        success = await electron.ipcRenderer.invoke('update-app-info', appInfo.path, { package: editing.value });
      }

      if (success) {
        // 更新本地状态
        setAppInfo((prev) =>
          prev
            ? {
                ...prev,
                [editing.field === 'name' ? 'name' : 'package']: editing.value,
              }
            : null,
        );

        // 重新获取应用信息以确保同步
        const updatedInfo = await electron.ipcRenderer.invoke('read-app-info', appInfo.path);
        if (updatedInfo) {
          setAppInfo(updatedInfo);
        }

        setEditing({ field: null, value: '' });
      } else {
        alert('更新失败，请重试');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const buildApk = async () => {
    await electron.ipcRenderer.invoke('build-apk', appInfo?.path);
    console.log('打包完成');
  };

  return (
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
                <Package className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">APP 编辑</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <div className="w-full max-w-2xl">
          {match(appInfo)
            .with(null, () => (
              <>
                <div className="text-center">
                  <Button onClick={selectAppDirectory} disabled={loading} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Folder className="w-5 h-5 mr-2" />
                    {loading ? '读取中...' : '选择APK解包目录'}
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 请选择已解包的应用目录</li>
                    <li>• 编辑后的信息将直接保存到文件中</li>
                  </ul>
                </div>
              </>
            ))
            .otherwise(() => (
              <>
                <div className="space-y-6">
                  {/* 应用图标和基本信息 */}
                  {/* <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                    {match(appInfo.icon)
                      .with(null, () => (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      ))
                      .otherwise((icon) => (
                        <img
                          src={`file://${icon}`}
                          alt="应用图标"
                          className="w-16 h-16 rounded-lg shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ))}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{appInfo.name}</h2>
                      <p className="text-sm text-gray-500">{appInfo.path}</p>
                    </div>
                  </div> */}

                  {/* 应用名称编辑 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700 w-20">应用名称</label>
                      {match(editing.field)
                        .with('name', () => (
                          <>
                            <Input value={editing.value} onChange={(e) => setEditing((prev) => ({ ...prev, value: e.target.value }))} className="flex-1" placeholder="输入应用名称" disabled={loading} />
                            <Button onClick={saveEdit} disabled={loading || !editing.value.trim()} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button onClick={cancelEditing} disabled={loading} size="sm" variant="outline">
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ))
                        .otherwise(() => (
                          <>
                            <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                              <span className="text-gray-900">{appInfo?.name}</span>
                            </div>
                            <Button onClick={() => startEditing('name')} disabled={loading || editing.field !== null} size="sm" variant="outline">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </>
                        ))}
                    </div>
                  </div>

                  {/* 包名编辑 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 h-10">
                      <label className="text-sm font-medium text-gray-700 w-20">包名</label>
                      {match(editing.field)
                        .with('package', () => (
                          <>
                            <Combobox
                              options={appList}
                              value={editing.value}
                              onValueChange={(value) => setEditing((prev) => ({ ...prev, value }))}
                              placeholder="选择或输入包名..."
                              searchPlaceholder="搜索或输入包名..."
                              className="flex w-full pl-6"
                              emptyMessage="没有找到匹配的包名"
                              renderOption={(option) => (
                                <div className="flex items-center justify-between w-full gap-2 p-1">
                                  <div className="flex items-center gap-2">
                                    <img src={`./imgs/pkgs/${option.label}.png`} alt="" className="w-6" />
                                    <div>
                                      <div className="font-medium">{option.label}</div>
                                      <div className="text-sm">{option.value}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
                            <Button onClick={saveEdit} disabled={loading || !editing.value.trim()} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button onClick={cancelEditing} disabled={loading} size="sm" variant="outline">
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ))
                        .otherwise(() => (
                          <>
                            <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                              <span className="text-gray-900 font-mono text-sm">{appInfo?.package}</span>
                            </div>
                            <Button onClick={() => startEditing('package')} disabled={loading || editing.field !== null} size="sm" variant="outline">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </>
                        ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3 pt-6">
                    <Button onClick={buildApk} className="cursor-pointer bg-green-600 hover:bg-green-700 text-white flex items-center m-auto">
                      生成新APK
                    </Button>
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
