import { useAppCtx } from '@renderer/hooks/use-app-ctx'
import { useState } from 'react'
import loadingImg from '../assets/loading.gif'

export default function StepOne(): React.JSX.Element {
  const { path, setApp } = useAppCtx()
  const [loading, setLoading] = useState(false)
  const onSelectFile = async () => {
    const filePath = await electron.ipcRenderer.invoke('select-file')
    if(!filePath) return;
    setApp((draft) => {
      draft.path = filePath
    })
    setLoading(true)

    const res = await electron.ipcRenderer.invoke('unpack-apk', filePath)
    console.log(res)
    setLoading(false)
    setApp((draft) => {
      draft.step = 'two'
      draft.unPackPath = res; 
    })
  }
  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="text-white flex-col ">
          <img src={loadingImg} alt="" className="w-60" />
          <div className="text-center mt-2">解包中</div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2">
          <input className="border-b border-amber-200 w-160 outline-none" readOnly value={path} />
          <div
            className="bg-blue-400 rounded p-2 cursor-pointer w-40 text-center"
            onClick={onSelectFile}
          >
            选择安装包
          </div>
        </div>
      )}
    </div>
  )
}
