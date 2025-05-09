import { runPythonModel } from "../utils/runPythonModel"



export const predictFromModel = async (userInput: any) => {
    const result = await runPythonModel(userInput)
    return result
}

