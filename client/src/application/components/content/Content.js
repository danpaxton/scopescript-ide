import "./Content.css"

import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/material-darker.css';

import { Button, Icon } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { List, Box, ListItem } from '@mui/material';

import { useState } from "react";

// Import language worker.
import worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax
const instance = worker();

const Content = (props) => {
  const [openClear, setOpenClear] = useState(false);
  const [running, setRunning] = useState(false);
  
  // Executes after program run.
  instance.onmessage = (e) => {
    setRunning(false);
    const { result } = e.data;
    if (result) {
      const { ok, output } = result;
      if (output)  {
        props.out.list.unshift({ ok, text: output });
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
    props.setOut({...props.out, msg: "Program aborted." });
    setRunning(false);
  };
  
  const handleClear = () => { 
    props.setFile({...props.file, code: ''});  
    props.setHasChange(true); 
    setOpenClear(false); 
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const download = new Blob([props.file.code], { type: "text/plain" });
    element.href = URL.createObjectURL(download);
    element.download = `${props.file.title.split('.')[0] + ".txt"}`;
    document.body.appendChild(element);
    element.click();
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
      <div className="codebox">
          <Dialog open={openClear}>
            <DialogTitle sx={{fontSize: 17, textAlign:'center'}} id="alert-dialog-title">{"Clear all code?"}</DialogTitle>
            <DialogActions>
              <Button variant="contained" size='small' color="primary" onClick={() => setOpenClear(false)}>Cancel</Button>
              <Button variant="contained" size='small' color="secondary" onClick={handleClear}>Clear</Button>
            </DialogActions> 
          </Dialog>
          <CodeMirror
              value={props.file.code}
              options={{
                readOnly: props.token && !props.file.id ? 'nocursor': false,
                theme: "material-darker",
                keymap: "sublime",
                mode: "jsx"
              }}
              onChange={(editor, change) => {
                if(!props.hasChange) {
                  props.setHasChange(true);
                }
                props.setFile({...props.file, code: editor.getValue()});
              }}
            />
          </div>
            <div className='footerHeader'>
              <Icon size="large">chevron_right</Icon>{'  ' + props.out.msg}
            </div>
          <div className="footer">
            <List dense={true}>
              {props.out.list.map((e, i) => (
                <ListItem divider sx={{ borderColor:'#212121', color: 'whitesmoke' }} key={i}>
                  <Box key={i} sx={{ color: e.ok ? '#8c9eff' : '#ff6e40', overflow:'auto', fontFamily:'Source Code Pro, monospace'}}>{e.text}</Box>
                </ListItem>)
              )}
            </List>
          </div>
      </div>
    )
}
export default Content;