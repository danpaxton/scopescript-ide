import './App.css';
import useToken from './useToken.js';

import Sidebar from './components/sidebar/Sidebar.js';
import Content from './components/content/Content.js';
import Login from './components/login/Login.js';

import axios from "axios";

import { Button, Icon } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
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
  baseURL: process.env.BASE_URL ?? "http://localhost:5000"
})

export const App = () => {
  // IDE Hooks
  const { token, setToken, removeToken } = useToken();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [hasChange, setHasChange] = useState(true);
  const [out, setOut] = useState({ list: [], msg: "Run program." });
  const [file, setFile ] = useState({ 
    title: token ? '' : "untitled.sc", 
    id: null, 
    code: '' 
  });
  const [fileList, setFileList] = useState([]);

  // IDE Handles
  const handleSetFile = (f) => {  setFile(f); setOut({ list: [], msg: "Run program." }); setHasChange(false) }

  // Refreshes token if it needs to be updated (not undefined).
  const refresh = tok => {
    if (tok) {
      setToken({...token, access_token: tok});
    }
  }  
  
  // Checks for unauthorized error and logs out, or logs error.
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
    removeToken();
  }


  const saveFile = async () => {
   try {
      const { data } = await api.put(`/fetch-file/${file.id}`, { code: file.code }, {
        headers: {
          'Authorization': `Bearer ${token.access_token}` 
        }
      });
      refresh(data.access_token);
      setHasChange(false);
    } catch(err) {
      handleUnAuth(err);
    }
  }

  return (
  <div className="wrapper">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"rel="stylesheet"></link>
    <ThemeProvider theme={theme}>
    <div className="header"><div className="headerText">ScopeScript <Icon size='larger'>dynamic_feed</Icon></div>
      <Button sx={{color: 'whitesmoke'}} align='right' onClick={() => window.open("https://github.com/danpaxton/scopescript/blob/main/README.md")}>language information</Button>
    </div>
    <Login token={token} setToken={setToken} handleSetFile={handleSetFile} logOut={logOut}/>
    <Sidebar token={token} file={file} saveFile={saveFile} hasChange={hasChange} handleSetFile={handleSetFile}
      refresh={refresh} handleUnAuth={handleUnAuth} fileList={fileList} setFileList={setFileList}/>
    <Content file={file} hasChange={hasChange} out={out} setOut={setOut} saveFile={saveFile}
      setFile={setFile} setHasChange={setHasChange}/>
    <Dialog open={tokenExpired}>
      <DialogTitle sx={{fontSize: 17, textAlign:'center'}}>{"Access token has expired. Logging out."}</DialogTitle>
      <DialogActions>
        <Button variant="contained" size='small' color="primary" onClick={() => setTokenExpired(false)}>OK</Button>
      </DialogActions> 
    </Dialog>
  </ThemeProvider>
</div>)
}
