import { runProgramVars } from "scopescript";

export const run = (main, code, oldVars) => { 
    const start = Date.now();
    const { kind, vars, out, last } = runProgramVars(code, oldVars);
    const millis = Date.now() - start;
    return { 
            main,
            last,
            vars,
            code,
            ok: kind === 'ok', 
            output: out.join(""),
            time: Number(millis / 1000).toFixed(2)
        };
}
