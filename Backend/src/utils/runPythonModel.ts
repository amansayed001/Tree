import { spawn } from "child_process"

export const runPythonModel = (input: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(input)

    const python = spawn("python", ["tree_model.py", jsonString])

    let output = ""
    let errorOutput = ""

    python.stdout.on("data", (data) => {
      output += data.toString()
    })

    python.stderr.on("data", (data) => {
      errorOutput += data.toString()
    })

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(errorOutput || `Python process exited with code ${code}`))
      } else {
        try {
          resolve(JSON.parse(output))
        } catch (err) {
          reject(new Error("Invalid JSON from Python output: " + output))
        }
      }
    })
  })
}
