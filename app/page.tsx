'use client'
import { useEffect, useState } from 'react'
import { MyEditor } from './components/Editor'
import { postRunCode } from './service/api'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { warn } from './service/toast';
import { Tag } from './components/Tag';
import { GithubIcon } from './components/Github';
interface RunCodeResult {
  stdout: string;
  stderr: string;
  success: boolean;
  cost: number;
  err: any;
}
export default function Home() {

  const [val, setVal] = useState("")
  const [result, setResult] = useState<RunCodeResult>({
    stdout: "",
    stderr: "",
    success: false,
    cost: 0,
    err: null
  })
  const [loading, setLoading] = useState(false)

  const runCode = () => {
    const r = eval(val)
    console.log("r", r)
    setResult(r)
  }

  const runCodeRemote = async () => {
    if (val.trim() === "") {
      warn("代码不能为空！")
      return;
    }
    try {
      setLoading(true)
      const res = (await postRunCode(val)) as RunCodeResult
      console.log(res)
      setResult(res)
    } catch (err) {
      warn("运行失败！")
      console.log(err)
      return;
    } finally {
      setLoading(false)
    }

  }

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "F5") {
      runCodeRemote()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])


  return (
    <main className="flex min-h-screen items-center justify-between p-4 h-screen">
      <div className='flex-grow flex-shrink-0 h-full rounded p-2 bg-white ' >
        <div className='w-full flex items-center justify-between pb-2 border-gray-200 px-2 pt-1' style={{
          borderBottom: "1px solid #e2e8f0"
        }}>
          <div className='title flex items-center '>js 代码在线运行器 <span className='ml-2'><GithubIcon /></span></div>
          <div className='flex items-center'>

            {/* <div className='button' onClick={runCode}>本地运行</div> */}
            <div className='button ml-2' onClick={runCodeRemote}>{
              loading ? "运行中..." : "点击运行 F5"
            }</div>
          </div>
        </div>
        <div className='mt-2' style={{
          height: "calc(100% - 60px)"
        }}>

          <MyEditor height={"100%"} setValue={setVal} />
        </div>
      </div>
      {/* <div className='dragger'>
        <div className='line'></div>
      </div> */}
      <div className=' ml-8 h-full  flex-shrink-0 flex-grow-0' style={{
        width: "40%"
      }}>
        <pre className='w-full h-full rounded bg-gray-300 p-2 flex flex-col '>
          <div className='flex items-center justify-between flex-grow-0 flex-shrink-0 py-2 px-1' style={{
            borderBottom: "1px solid gray"
          }}>
            <div className='title flex items-center '>运行结果</div>
            <div className='flex items-center '>

              <div className='mr-2'>
                {
                  result.cost === 0 ? null : <Tag color='blue' text={`${result.cost}ms`} />
                }
              </div>

              {
                result.cost === 0 ? <Tag text="未开始" color="green" /> : result.success ? <Tag text="成功" color="green" /> : <Tag text="失败" color="red" />
              }


            </div>

          </div>
          <code className='pt-2 flex-grow overflow-auto' style={{
            whiteSpace: "pre-wrap",
            // wordBreak: "break-all"
          }}>
            {result.success ? result.stdout : result.stderr}
          </code>

        </pre>
      </div>
      <ToastContainer />
    </main>
  )
}
