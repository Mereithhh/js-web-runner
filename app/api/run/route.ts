import { NextResponse } from "next/server";
import { spawn } from "node:child_process"
import fs from "node:fs"
import { Base64 } from "js-base64";

const jsonSuccess = (obj: any) => NextResponse.json({
  data: obj,
  success: true,
})

const jsonError = (err: any) => NextResponse.json({
  success: false,
  error: err?.message || "未知错误",
})

export async function POST(request: Request) {
  try {
    const resuestBody = await request.json();
    const { code, timeout } = resuestBody;
    if (!code) {
      return jsonError(new Error("code 不能为空"));
    }
    const decodeCode = Base64.decode(code)
    const codeResult: RunCodeResult = (await runCodeWithChildProcess(decodeCode, timeout)) as any as RunCodeResult;
    return jsonSuccess(codeResult)
  } catch (err) {
    console.log(err)
    return jsonError(err);
  }
}

interface RunCodeResult {
  stdout: string;
  stderr: string;
  success: boolean;
  cost: number;
  err: any;
}

const runCodeWithChildProcess = (code: string, timeout = 5000) => {

  return new Promise((resolve) => {
    // save code
    const name = `${Date.now()}-${Math.random()}.js`;
    const codePath = `/tmp/${name}`;
    fs.writeFileSync(codePath, code, { encoding: "utf-8" });
    const st = new Date().valueOf();
    // run code
    const child = spawn("node", [codePath]);
    const stdout: any = [];
    const stderr: any = [];
    setTimeout(() => {
      child.kill();
      resolve({
        stdout: stdout.join(""),
        stderr: stderr.join(""),
        success: false,
        err: new Error("执行超时"),
        cost: new Date().valueOf() - st,
      });
    }, timeout)
    child.stdout.on("data", (data) => {
      stdout.push(data.toString());
    })
    child.stderr.on("data", (data) => {
      stderr.push(data.toString());
    })
    child.on("close", (code) => {
      if (code === 0) {
        resolve({
          stdout: stdout.join(""),
          stderr: stderr.join(""),
          success: true,
          err: null,
          cost: new Date().valueOf() - st,
        })
      } else {
        resolve({
          stdout: stdout.join(""),
          stderr: stderr.join(""),
          success: false,
          err: null,
          cost: new Date().valueOf() - st,
        })
      }
    })
  })


}