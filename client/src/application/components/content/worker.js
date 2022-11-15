import { runProgram } from "scopescript";
export const run = code => { 
    const start = Date.now();
    const res = runProgram(code);
    const millis = Date.now() - start;
    
    return { ok: res.kind === 'ok', 
            output: res.out.join(""), 
            time: Number(millis / 1000).toFixed(2)
        };
}
