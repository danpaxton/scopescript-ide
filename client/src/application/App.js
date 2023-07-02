import './App.css';
import useToken from './useToken.js';

import Sidebar from './components/sidebar/Sidebar.js';
import Content from './components/content/Content.js';
import Login from './components/login/Login.js';

import axios from "axios";

import { Button, Icon } from '@mui/material';
import { Dialog, DialogActions, DialogTitle, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#304ffe',
    },
    secondary: {
      main: '#dd2c00'
    }
  },
  typography: {
    fontFamily: [
      'Roboto', 'sans-serif'
    ].join(',')
  }
});

export const api = axios.create({
  baseURL: "https://scopescript-ide.vercel.app/"
})

export const App = () => {
  // IDE Hooks
  const { token, setToken, removeToken } = useToken();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [hasChange, setHasChange] = useState(false);
  const [program, setProgram] = useState(true);
  const [delButtons, setDelButtons] = useState(false);
  const [openNewFile, setOpenNewFile] = useState(false);
  const [openNewTarget, setOpenNewTarget] = useState(false);
  const [file, setFile ] = useState({ 
    title: token ? '' : "untitled.sc", 
    id: null, 
    code: '' 
  });
  const [target, setTarget] = useState({
    name: '',
    id: null,
    messages: []
  })
  const [fileList, setFileList] = useState([]);
  const [targetList, setTargetList] = useState([]);

  // IDE Handles. 
  
  // Wait for codemirror to recognize code change before save state reset.
  const handleSetFile = (f) => {  setFile(f); setTimeout(() => setHasChange(false)); }

  const handleProgramChange = () => { setProgram(!program); setDelButtons(false) }

  const refreshToken = tok => {
    if (tok) {
      setToken({...token, access_token: tok});
    }
  }  
  
  const handleUnAuth = (err) => {
    if (err.response?.status === 401) {
      logOut();
      setTokenExpired(true);
    } else {
      console.log(err);
    }
  }

  const logOut = () => {
    setFileList([]);
    handleSetFile({title: "untitled.sc", id: null, code:''});
    setTarget({ name: '', id: null, messages: [] });
    setProgram(true);
    setOpenNewFile(false);
    setOpenNewTarget(false);
    removeToken();
  }

  const saveFile = async () => {
   try {
      await api.put(`/operate-file/${file.id}`, { code: file.code }, {
        headers: {
          'Authorization': `Bearer ${token.access_token}` 
        }
      });
      fetchFiles();
      setHasChange(false);
    } catch(err) {
      handleUnAuth(err);
    }
  }

  const loadTarget = async (id) => {
    try {
        const { data } = await api.get(`/operate-target/${id}`, {
          headers: {
            'Authorization': `Bearer ${token.access_token}` 
          }
        })
        refreshToken(data.access_token);
        setTarget(data.target);
      } catch (err) {
        handleUnAuth(err);
      }
  }

  const fetchFiles = async () => {
      try {
          const { data } = await api.get(`/fetch-files`,{
              headers: {
                  'Authorization': `Bearer ${token.access_token}` 
              }
          });
          refreshToken(data.access_token);
          setFileList(data.files);
      } catch(err) {
          handleUnAuth(err);
      }
  }

  const fetchTargets = async () => {
    try {
      const { data } = await api.get(`/fetch-targets`, {
        headers: {
          'Authorization': `Bearer ${token.access_token}`
        }
      });
      refreshToken(data.access_token);
      setTargetList(data.targets);
    } catch(err) {
      handleUnAuth(err);
    }
  }

  return (
  <Box class="wrapper">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"rel="stylesheet"></link>
    <ThemeProvider theme={theme}>
    <Box class="header"><Box class="headerText">ScopeScript <Icon size='larger'>dynamic_feed</Icon></Box>
      <Button sx={{ color: 'whitesmoke', paddingRight: '20px' }} align='right' onClick={() => window.open("https://github.com/danpaxton/scopescript")}>language</Button>
      <Button disabled={!token} sx={{ color: 'whitesmoke' }} align='right' onClick={handleProgramChange}> { program ? 'message' : 'program' }</Button>
    </Box>
    <Login token={token} setToken={setToken} handleSetFile={handleSetFile} logOut={logOut}/>
    <Sidebar openNewTarget={openNewTarget} setOpenNewTarget={setOpenNewTarget} openNewFile={openNewFile} setOpenNewFile={setOpenNewFile}
      program={program} token={token} file={file} saveFile={saveFile} hasChange={hasChange} handleSetFile={handleSetFile}
      refreshToken={refreshToken} handleUnAuth={handleUnAuth} fileList={fileList} fetchFiles={fetchFiles} fetchTargets={fetchTargets}
      target={target} setTarget={setTarget} targetList={targetList} loadTarget={loadTarget} delButtons={delButtons} setDelButtons={setDelButtons}/>
    <Content program={program} token={token} file={file} hasChange={hasChange} saveFile={saveFile} setFile={setFile} fetchTargets={fetchTargets} 
        fetchFiles={fetchFiles} fileList={fileList} refreshToken={refreshToken} loadTarget={loadTarget} handleUnAuth={handleUnAuth} setHasChange={setHasChange} target={target} setTarget={setTarget}/>
    <Dialog open={tokenExpired}>
      <DialogTitle sx={{fontSize: 17, textAlign:'center'}}>{"Access token has expired. Logging out."}</DialogTitle>
      <DialogActions>
        <Button variant="contained" size='small' color="primary" onClick={() => setTokenExpired(false)}>OK</Button>
      </DialogActions> 
    </Dialog>
  </ThemeProvider>
</Box>)
}
