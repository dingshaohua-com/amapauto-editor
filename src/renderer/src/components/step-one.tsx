import { useAppCtx } from '@renderer/hooks/use-app-ctx'
import { useState } from 'react'
import loadingImg from '../assets/imgs/loading.gif'

export default function StepOne(): React.JSX.Element {
  const { path, setApp } = useAppCtx()
  const [loading, setLoading] = useState(false)
  const onSelectFile = async () => {
    const filePath = await electron.ipcRenderer.invoke('select-file')
    if (!filePath) return
    setApp((draft) => {
      draft.path = filePath
    })
    setLoading(true)

    const res = await electron.ipcRenderer.invoke('unpack-apk', filePath)
    console.log(res)
    setLoading(false)
    setApp((draft) => {
      draft.step = 'two'
      draft.unPackPath = res
    })
  }
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col">
        {loading ? (
          <div className=" flex-col ">
            <img src={loadingImg} alt="" className="w-60" />
            <div className="text-center mt-2">解包中</div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-2">
            <input className="border-b border-blue-200 w-160 outline-none" readOnly value={path} />
            <div
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg px-4 py-3 cursor-pointer w-40 text-center text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              onClick={onSelectFile}
            >
              选择安装包
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
