import "./Content.css"

import CodeMirror from '@uiw/react-codemirror';
import { scopescript } from 'codemirror-lang-scopescript';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight'

import { Button, Icon } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { List, Box, ListItem } from '@mui/material';

import { useState } from "react";

// Import language worker.
import worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax

// Codemirror theme.
const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#101010',
    foreground: '#f5f5f5',
    caret: '#ffc107',
    selection: 'rgba(101, 115, 195, 0.33)',
    selectionMatch: 'rgba(101, 115, 195, 0.33)',
    lineHighlight: '#8a91991a',
    gutterBackground: '#101010',
    gutterForeground: '#616161',
  },
  styles: [
       { tag: t.controlKeyword, color: '#ef6c00'},
       { tag: t.namespace, color: '#f5f5f5' },
       { tag: t.variableName, color: '#f5f5f5' },
       { tag: t.special(t.variableName), color: '#8c9eff' },
       { tag: t.propertyName, color: '#ffab40' }, 
       { tag: t.bool, color: '#8c9eff' },
       { tag: t.string, color: '#8bc34a'},
       { tag: t.number, color: '#8c9eff' },
       { tag: t.null, color: '#8c9eff' },
       { tag: t.updateOperator, color: '#ff9800' },
       { tag: t.arithmeticOperator, color: '#ff9800' },
       { tag: t.logicOperator, color: '#ff9800' },
       { tag: t.bitwiseOperator, color: '#ff9800' },
       { tag: t.compareOperator, color: '#ff9800' },
       { tag: t.lineComment, color:'#616161' },
       { tag: t.definitionOperator, color: '#ff9800' },
       { tag: t.function(t.punctuation), color: '#ff9800' },
       { tag: t.paren, color: '#f5f5f5' },
       { tag: t.brace, color: '#f5f5f5' },
       { tag: t.squareBracket, color: '#f5f5f5' },
       { tag: t.derefOperator, color: '#ff9800' },
       { tag: t.separator, color: '#f5f5f5' },
  ],
});

const Content = (props) => {
  const [openClear, setOpenClear] = useState(false);
  const [running, setRunning] = useState(false);
  
  let instance = worker();
  // Executes after program run.
  instance.onmessage = (e) => {
    setRunning(false);
    const { result } = e.data;
    if (result) {
      const { ok, output, time } = result;
      const { list } = props.out;
      const clock = new Date();
      if (ok) {
        list.unshift({ isTime: true, time, date: clock.toLocaleTimeString() });
      }
      if (output)  {
        list.unshift({ isTime: false, ok, text: output });
      }
      props.setOut({...props.out, msg: ok ? 'Program terminated successfully.' : 'Program error.' });
    }
  }

  // Run code handle.
  const runCode = () => {
    setRunning(true); 
    props.setOut({...props.out, msg: "Running..." });
    instance.run(props.file.code);
  }

  // Abort code handle.
  const abortCode = () => {
    instance.terminate();
    instance = worker();
    props.setOut({...props.out, msg: "Program aborted." });
    setRunning(false);
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

  const { hasChange, setHasChange, file, setFile } = props;
  // Handle for when code is changed.
  const codeChange = (value, viewUpdate) => {
    if(!hasChange) {
      setHasChange(true);
    }
    setFile({...file, code: value });
  };

  return (
    <div className="content">
      <div className="contentButtons">
            <Button variant="text" color="primary" disabled={running || (props.token && !props.file.id)} onClick={runCode} > 
              <Icon>play_arrow</Icon>Run</Button>
            <Button variant="text" color="secondary" disabled={!running} onClick={abortCode}> 
              <Icon>stop</Icon>Stop</Button>
            <Button variant="text" color="primary" disabled={!props.file.id || !props.hasChange} onClick={props.saveFile}>
              <Icon>playlist_add_check</Icon>Save</Button>
            <Button variant="text" color="primary" disabled={props.token && !props.file.id} onClick={downloadCode} > 
              <Icon>download</Icon>Download</Button>
            <Button variant="text" color="secondary" disabled={props.token && !props.file.id} onClick={() => setOpenClear(true)} >
              <Icon>refresh</Icon>Clear </Button>
      </div>
      <Dialog open={openClear}>
          <DialogTitle sx={{fontSize: 17, textAlign:'center'}} id="alert-dialog-title">{"Clear all code?"}</DialogTitle>
          <DialogActions>
            <Button variant="contained" size='small' color="primary" onClick={() => setOpenClear(false)}>Cancel</Button>
            <Button variant="contained" size='small' color="secondary" onClick={handleClear}>Clear</Button>
          </DialogActions> 
      </Dialog>
      <div className="codebox">
        <CodeMirror style={{ height: '100%'}}
            value={props.file.code}
            onChange={codeChange}
            extensions={[scopescript()]}
            theme={myTheme}
            height="100%"
            editable={(props.token && props.file.id) || !props.token }
            indentWithTab={true}
          />
      </div>
      <div className='footerHeader'>
        <Icon size="large">chevron_right</Icon>{'  ' + props.out.msg}
      </div>
      <div className="footer">
        <List dense={true}>
            {props.out.list.map((e, i) => (
              <ListItem divider sx={{ borderColor:'#212121', color: 'whitesmoke' }} key={i}>
                { e.isTime ? <Box className="runTime" key={i}><Icon size='small'>subdirectory_arrow_right</Icon>Runtime: {e.time} s, at {e.date}.</Box>
                  :<Box className="outputLine" key={i} sx={{ color: e.ok ? '#8c9eff' : '#ff6e40' }}>{e.text}</Box>
              }</ListItem>)
            )}
        </List>
      </div>
    </div>
    )
}
export default Content;