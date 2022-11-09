import { runProgram } from "scopescript";
export const run = code => { 
    const res = runProgram(code);
    return { ok: res.kind === 'ok', output: res.out.join("") };
}
