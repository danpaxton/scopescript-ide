import "./Program.css"

import CodeMirror from '@uiw/react-codemirror';
import { scopescript } from 'codemirror-lang-scopescript';
import { myTheme } from "../Theme";

import { Button, Icon } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { List, Box, ListItem } from '@mui/material';

import ScrollToBottom from 'react-scroll-to-bottom';
import { useState } from "react";

// Import language worker.
import worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax
let instance = worker();

// Tracks terminal history, current index is maintained as a hook;
const terminal = [];

// Tracks program and terminal output.
const out = [];

const Program = (props) => {
    const [openClear, setOpenClear] = useState(false);
    const [programRun, setProgramRun] = useState(false);
    const [terminalRun, setTerminalRun] = useState(false);
    const [terminalVars, setTerminalVars] = useState(new Map());
    const [terminalCode, setTerminalCode] = useState('');
    const [terminalId, setTerminalId] = useState(0);
    
  
    // Executes after program run.
    instance.onmessage = (e) => {
      const { result } = e.data;
      if (result) {
        const { main, ok, vars, last, code, output, time } = result;
        if (!main) {
          setTerminalVars(vars);
          out.push({ kind: 'code', code });
          if (output) {
            out.push({ kind: 'out', ok, text: output });
          }
          if (ok) {
            out.push({ kind: 'out', ok, text: last });
          }
        } else {
          if (output) {
            out.push({ kind: 'out', ok, text: output });
          }
          if (ok) {
            const clock = new Date();
            out.push({ kind: 'text', msg: 'Program terminated successfully.' })
            out.push({ kind: 'time', time, date: clock.toLocaleTimeString() });
          } else {
            out.push({ kind: 'text', msg: 'Program error.' })
          }
        }
        setProgramRun(false);
        setTerminalRun(false);
      }
    }
  
    // Run code handle.
    const runCode = () => {
      setProgramRun(true);
      out.push({ kind: 'text', msg: 'Running...' })
      instance.run(true, props.file.code, new Map());
    }
    
    // Checks if enter was pressed, and then runs the terminal code.
    const terminalEnter = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const curr = terminalCode;
            if (curr.length && !programRun) {
              setTerminalCode('');
              // Add to terminal list, and reset.
              setTerminalId(terminal.push(curr));
              // Run the code.
              setTerminalRun(true);
              instance.run(false, curr, terminalVars);
            }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (terminalId > 0) {
            setTerminalCode(terminal[terminalId - 1]);
            setTerminalId(terminalId - 1);
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (terminalId <= terminal.length - 1) {
            setTerminalCode(terminalId < terminal.length - 1 ? terminal[terminalId + 1] : '');
            setTerminalId(terminalId + 1);
          }
        }
    }
  
    // Abort code handle.
    const abortCode = () => {
      instance.terminate();
      instance = worker();
      if (programRun) {
        out.push({ kind: 'text', msg: 'Program aborted.' })
      }
      setProgramRun(false);
      setTerminalRun(false);
    };
    
    // Clear code.
    const handleClear = () => { 
      props.setFile({...props.file, code: ''});  
      props.setHasChange(true); 
      setOpenClear(false); 
    };
  
    // Download current code.
    const downloadCode = () => {
      const element = document.createElement("a");
      const download = new Blob([props.file.code], { type: "text/plain" });
      element.href = URL.createObjectURL(download);
      element.download = `${props.file.title.split('.')[0] + ".txt"}`;
      document.body.appendChild(element);
      element.click();
    };
  
    // Handle for when code is changed.
    const codeChange = (value, viewUpdate) => {
      if (!props.hasChange) {
        props.setHasChange(true);
      }
      props.setFile({...props.file, code: value });
    };
  
    return (
        <Box class="program">
            <Box class="programButtons">
                <Button variant="text" color="primary" disabled={programRun || terminalRun || (props.token && !props.file.id)} onClick={runCode} > 
                    <Icon>play_arrow</Icon>Run</Button>
                <Button variant="text" color="secondary" disabled={!programRun && !terminalRun} onClick={abortCode}> 
                    <Icon>stop</Icon>Stop</Button>
                <Button variant="text" color="primary" disabled={!props.file.id || !props.hasChange} onClick={props.saveFile}>
                    <Icon>playlist_add_check</Icon>Save</Button>
                <Button variant="text" color="primary" disabled={props.token && !props.file.id} onClick={downloadCode} > 
                    <Icon>download</Icon>Download</Button>
                <Button variant="text" color="secondary" disabled={props.token && !props.file.id} onClick={() => setOpenClear(true)} >
                    <Icon>refresh</Icon>Clear </Button>
            </Box>
            <Dialog open={openClear}>
                <DialogTitle sx={{fontSize: 17, textAlign:'center'}} id="alert-dialog-title">{"Clear all code?"}</DialogTitle>
                <DialogActions>
                <Button variant="contained" size='small' color="primary" onClick={() => setOpenClear(false)}>Cancel</Button>
                <Button variant="contained" size='small' color="secondary" onClick={handleClear}>Clear</Button>
                </DialogActions> 
            </Dialog>
            <CodeMirror className="codeBox"
                value={props.file.code}
                onChange={codeChange}
                extensions={[scopescript()]}
                theme={myTheme}
                height="100%"
                editable={(props.token && props.file.id) || !props.token }
                />
            <ScrollToBottom className="footer">
                <List>
                    {out.map((e, i) => (
                    <ListItem divider sx={{ borderColor:'#212121', color: 'whitesmoke'}} key={i}>
                        { 
                        e.kind === 'code' ? <Box className="codeLine" key={i}><Icon sx={{ color: '#616161' }}>chevron_right</Icon>{e.code}</Box> :
                        e.kind === 'out' ? <Box className="line" key={i} sx={{ color: e.ok ? '#8c9eff' : '#ff6e40' }}>{e.text}</Box> :
                        e.kind === 'text' ? <Box className="line" key={i}>{e.msg}</Box> :
                        e.kind === 'time' ? <Box className="line" key={i}>Runtime: {e.time} s, at {e.date}.</Box> :
                        null
                        }
                    </ListItem>
                    )
                    )}
                </List>
            </ScrollToBottom>
            <Box class='terminal'>
                <Icon size="large">chevron_right</Icon>
                <CodeMirror className='codeTerminal'
                value={terminalCode}
                onKeyDownCapture={terminalEnter}
                onChange={(val, update) => { setTerminalCode(val); }}
                theme={myTheme}
                extensions={[scopescript()]}
                basicSetup={{
                    lineNumbers: false,
                    autocompletion: false,
                    highlightActiveLineGutter: false,
                    highlightActiveLine: false
                }}
                />
            </Box>
        </Box>
      )
}

export default Program;