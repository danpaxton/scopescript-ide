import "./Login.css";
import { api } from "../../App.js";
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { TextField, Icon, Button, IconButton, } from "@mui/material";

const Login = (props) => {
    //Login Hooks
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [openLogin, setOpenLogin] = useState(false);
    const [openNewUser, setOpenNewUser] = useState(false);
    const [registerError, setRegisterError] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [showPass, setShowPass] = useState(false);
    // Login Handles
    const handleCloseLogin = () => {
        setOpenLogin(false);
        setLoginError(null); 
        setShowPass(false);
    }
  
    const handleCloseNewUser = () => {
        setOpenNewUser(false);
        setRegisterError(null); 
        setShowPass(false);
    }

    const handleLogin = async () => {
      try {
        const { data } = await api.post(`/login`, { username, password })
        props.setToken(data);
        props.handleSetFile({title: '', id: null, code: ''});
        handleCloseLogin();
      } catch (err) {
        if (err.response?.status === 401) {
          setLoginError("Invalid username or password.");
        } else {
          console.log(err);
        }
      }
    }

    const handleNewUser = async () => {
        if (username.length > 50) {
            setRegisterError('Maximum username length exceeded.');
        }
        else if (username.includes(' ')) {
            setRegisterError('Username cannot contain spaces.');
        } else {
            try {
                await api.post(`/new-user`, { username, password })
                handleLogin();
                handleCloseNewUser();
            } catch(err) {
                if (err.response?.status === 401) {
                    setRegisterError('User already exists.')
                } else {
                    console.log(err);
                }
            }
        }
    }
    const validCredentials = () => username.length && password.length
    // Login component
    return (
    <div className='login'>
      <Dialog open={openLogin}> 
        <DialogTitle sx={{fontSize: 17}} id="alert-dialog-title">{"User login"}</DialogTitle>
        <DialogContent>
        <DialogContentText sx={{fontSize: 13}}>{loginError ? loginError : "Enter user credentials."}
          </DialogContentText>
            <DialogActions>
              <TextField  error={loginError} label={"Enter username."} 
                variant="standard" onChange={f => setUsername(f.target.value)}/>
              <TextField error={loginError} label={"Enter password."} 
                variant="standard" type={showPass ? "text" : "password"} onChange={f => setPassword(f.target.value)}/>
              <IconButton onClick={() => setShowPass(!showPass)}>
                {showPass ? (<Icon>visibility</Icon>) : (<Icon>visibility_off</Icon>)}</IconButton>
              <Button disabled={!validCredentials()} variant="contained" 
                size='small' color="primary" onClick={handleLogin}>Login</Button>
              <Button variant="contained" size='small' color="secondary" onClick={handleCloseLogin}>Cancel</Button>
            </DialogActions> 
            </DialogContent>
        </Dialog>
        <Dialog open={openNewUser}> 
          <DialogTitle sx={{fontSize: 17}} id="alert-dialog-title">{"Create new user"}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{fontSize: 13}}>{registerError ? registerError : "Enter new user information."}
            </DialogContentText>
            <DialogActions>
              <TextField error={registerError} label={"Enter username."} 
                variant="standard" onChange={f => setUsername(f.target.value)}/>
              <TextField error={registerError} label={"Enter password."}
                variant="standard" type={showPass ? "text" : "password"} onChange={f => setPassword(f.target.value)}/>
              <IconButton onClick={() => setShowPass(!showPass)}>{showPass ? (<Icon>visibility</Icon>) : (<Icon>visibility_off</Icon>)}</IconButton>
              <Button disabled={!validCredentials()} 
                size='small' variant="contained" color="primary" onClick={handleNewUser}>Create</Button>
              <Button variant="contained" size='small' color="secondary" onClick={handleCloseNewUser}>Cancel</Button>
            </DialogActions> 
          </DialogContent>
        </Dialog>
        <Button variant="text" sx={{color: 'whitesmoke'}} onClick={() => props.token ? props.logOut() : setOpenLogin(true)}>{props.token ? "Logout" : "Login"}</Button>
            { props.token ? props.token.username + " :": <Button variant='contained' sx={{color:"whitesmoke"}} onClick={() => setOpenNewUser(true)}>New User</Button>}
    </div>
    );
}
export default Login;
