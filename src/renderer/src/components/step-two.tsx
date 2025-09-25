import { useState } from 'react'
import { useAppCtx } from '@renderer/hooks/use-app-ctx'
import { Combobox } from '@renderer/components/ui/combobox'
import appList from '@renderer/lib/apps'


export default function StepTwo(): React.JSX.Element {
  const { unPackPath } = useAppCtx()
  const [packageName, setPackageName] = useState('')

  const onClick = () => {
    electron.ipcRenderer.invoke('build-apk', { unPackPath, packageName })
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 ">
        <div className='text-sm text-gray-400'>🌼解包路径在 {unPackPath}</div>

        <div className="flex  gap-2 items-center">
          <label className="text-sm font-medium">设置包名：</label>
          <Combobox
            options={appList}
            value={packageName}
            onValueChange={setPackageName}
            placeholder="选择或输入包名..."
            searchPlaceholder="搜索或输入包名..."
            className="w-[300px] "
            emptyMessage="没有找到匹配的包名"
          />
        </div>

        <div
          className="m-auto mt-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg px-4 py-3 cursor-pointer w-40 text-center text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          onClick={onClick}
        >
          重新生成APK
        </div>
      </div>
    </div>
  )
}
