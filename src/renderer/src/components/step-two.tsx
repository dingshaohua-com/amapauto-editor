import { useAppCtx } from '@renderer/hooks/use-app-ctx'
import { Combobox } from '@renderer/components/ui/combobox'

export default function StepTwo(): React.JSX.Element {
  const { unPackPath } = useAppCtx()

  const onClick = () => {
    electron.ipcRenderer.invoke('build-apk', unPackPath)
  }

  return (
    <div className="flex flex-col text-white">
      <div>解包路径：{unPackPath}</div>
      <div>
        设置包名：
        <Combobox />
      </div>

      <div className="bg-blue-400 rounded p-2 cursor-pointer w-40 text-center" onClick={onClick}>
        重新生成APK
      </div>
    </div>
  )
}
