import "./Sidebar.css"
import { api } from '../../App.js'

import { useState, useEffect } from 'react';
import { List, ListItemSecondaryAction, ListItemButton, ListItemText, ListItem } from '@mui/material';
import { TextField,Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Button, Icon, IconButton, ButtonGroup, Box } from '@mui/material';
import ScrollToBottom from "react-scroll-to-bottom";

const Sidebar = (props) => {
    const [openNoSave, setOpenNoSave] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [newTargetName, setNewTargetName] = useState("");
    const [nameError, setNameError] = useState([]);
    const [nextId, setNextId] = useState(null);
 
    const handleCloseNewFile = () => { setNewFileName(""); setNameError([false]); props.setOpenNewFile(false) };
    const handleCloseNewTarget = () => { setNewTargetName(""); setNameError([false]); props.setOpenNewTarget(false) };

    const handleUnsavedSave = () => { props.saveFile(); loadFile(nextId); setOpenNoSave(false) };
    const handleUnsavedIgnore = () => { loadFile(nextId); setOpenNoSave(false) };
    
    const deleteFile = async (id) => {
        try {
            const { data } = await api.delete(`/operate-file/${id}`,{
                headers: {
                  'Authorization': `Bearer ${props.token.access_token}` 
                }
              })
            props.fetchFiles();
            props.setDelButtons(false);
            if (id === props.file.id) {
                props.handleSetFile(data.file ?? {title: '', id: null, code:''});
            }
        } catch (err) {
          props.handleUnAuth(err);
        }
    }

    const loadFile = async (id) => {
        try {
          const { data } = await api.get(`/operate-file/${id}`, {
            headers: {
              'Authorization': `Bearer ${props.token.access_token}` 
            }
          })
          props.refreshToken(data.access_token);
          props.handleSetFile(data.file);
        } catch (err) {
          props.handleUnAuth(err);
        }
      }
    
    const deleteTarget = async (id) => {
         try {
            const { data } = await api.delete(`/operate-target/${id}`, {
              headers: {
                'Authorization': `Bearer ${props.token.access_token}` 
              }
            })
            props.fetchTargets();
            props.setDelButtons(false);
            if (id === props.target.id) {
                props.setTarget(data.target ?? { name: '', id: null, messages: [] });
            }
          } catch (err) {
            props.handleUnAuth(err);
          }
    }


    const handleLoadFile = (id) => {
        props.setDelButtons(false);
        if (props.file.id !== id) {
            if (!props.hasChange || !props.file.id) {
                loadFile(id);
            } else {
                setNextId(id);
                setOpenNoSave(true); 
            } 
        }
    }

    const handleLoadTarget = (id) => {
        props.setDelButtons(false);
        if (props.target.id !== id) {
            props.loadTarget(id);
        }
    }
    
    const newFile = async (title) => {
        try {
            const { data } = await api.post(`/new-file`, {title: title.trim(), code: ""}, {
               headers: {
                   'Authorization': `Bearer ${props.token.access_token}` 
               }
            })
            props.fetchFiles();
            handleLoadFile(data.file.id);
            handleCloseNewFile();
        } catch(err) {
            props.handleUnAuth(err);
        }   
    }

    const newTarget = async (name) => {
        try {
            const { data } = await api.post(`/new-target`, { name: name.trim() }, {
                headers: {
                'Authorization': `Bearer ${props.token.access_token}` 
                }
            })
            props.fetchTargets();
            handleLoadTarget(data.target.id);
            handleCloseNewTarget();
        } catch(err) {
            if (err.response?.status === 401) {
                setNameError([true, "User does not exist."])
            } else {
                console.log(err);
            }
        }   
    }


    const invalidFileName = () => {
        const fileName = newFileName.trim().toLowerCase()
        const nameArr = fileName.split('.');
        if (nameArr.length !== 2 || nameArr[1] !== 'sc') {
            return [true, "File name must end in '.sc'."]
        }
        if (nameArr[0].includes(" ")) {
            return [true, "File name must be one word."];
        }
        if (nameArr[0].length > 100) {
            return [true, "Max character limit exceeded."];
        }
        for(const e of props.fileList) {
            if (e.title.toLowerCase() === fileName.toLowerCase()) {
                return [true, "Duplicate file name."];
            }
        }
        return [false];
    }

    const invalidTargetName = () => {
        const targetName = newTargetName.trim().toLowerCase();
        if (targetName.includes(" ")) {
            return [true, "Username must be one word."];
        }
        if (targetName.length > 50) {
            return [true, "Max character limit exceeded."];
        }

        return [false];
    }
    
    const handleNewFile = () => {
        const err = invalidFileName();
        setNameError(err);
        if (!err[0]) {
            newFile(newFileName);
        }
    };

    const handleNewTarget = () => {
        const err = invalidTargetName();
        setNameError(err);
        if (!err[0]) {
            newTarget(newTargetName);
        }
    }

    // Fetch files everytime token is modified.
    useEffect(() => {
        if (props.token) {
            props.fetchFiles();
            props.fetchTargets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.token])

    return (
    <Box class="sidebar">
        <Dialog open={props.openNewFile}>
            <DialogActions>
                <TextField id="standard-basic" error={nameError[0]} label={nameError[0] ? nameError[1]: "Enter file name."} 
                    variant="standard" onChange={f => setNewFileName(f.target.value)}/>
                <Button variant="contained" size='small' color="primary" onClick={handleNewFile}>Enter</Button>
                <Button variant="contained" size='small' color="secondary" onClick={handleCloseNewFile}>Cancel</Button>
            </DialogActions> 
        </Dialog>
        <Dialog open={openNoSave}>
            <DialogTitle sx={{fontSize: 17, textAlign:'center'}} id="alert-dialog-title">{"Unsaved Changes."}</DialogTitle>
            <DialogActions>
                <Button variant="contained" size='small' color="primary" onClick={handleUnsavedSave}>Save Changes</Button>
                <Button variant="contained" size='small' color="secondary" onClick={handleUnsavedIgnore}>Ignore</Button>
            </DialogActions> 
        </Dialog>
        <Dialog open={props.openNewTarget}> 
            <DialogActions>
                <TextField id="standard-basic" error={nameError[0]} label={nameError[0] ? nameError[1]: "Enter username."} 
                    variant="standard" onChange={f => setNewTargetName(f.target.value)}/>
                <Button variant="contained" size='small' color="primary" onClick={handleNewTarget}>Enter</Button>
                <Button variant="contained" size='small' color="secondary" onClick={handleCloseNewTarget}>Cancel</Button>
            </DialogActions> 
        </Dialog>
        <Box class='listHeader'>
            {props.program ? 
            <ButtonGroup variant="text" fullWidth={true}>
                <Button color="primary" disabled={!props.token} onClick={() => props.setOpenNewFile(true)} > <Icon>post_add</Icon>New File</Button>
                <Button color="secondary" disabled={!props.token || !props.fileList.length} onClick={() => props.setDelButtons(!props.delButtons)}> <Icon>delete</Icon>Delete</Button>
            </ButtonGroup> 
                : 
            <ButtonGroup variant="text" fullWidth={true}>
                <Button color="primary" onClick={() => props.setOpenNewTarget(true)}> <Icon>post_add</Icon>Add user</Button>
                <Button color="secondary" disabled={!props.targetList.length} onClick={() => props.setDelButtons(!props.delButtons)}> <Icon>delete</Icon>Delete</Button>
            </ButtonGroup>
            }
        </Box>
        { props.program ? 
            <Box class='changes'>{ props.token ? (props.file.id ? (props.hasChange ? `Unsaved changes.` :  "All changes saved.") : "Create or load file.") : "Login to create files." }</Box>
            : <Box class='changes'>Select user.</Box> 
        }
        <ScrollToBottom className='list'>
            <List dense={true}>
                {props.program ? props.fileList.map(curr_file => (
                <ListItem class="listItem" disablePadding key={curr_file.id}>
                    <ListItemButton selected={curr_file.id === props.file.id} onClick={() => handleLoadFile(curr_file.id)}> 
                        <ListItemText primary={curr_file.title}/>
                    </ListItemButton>
                    <ListItemSecondaryAction>
                        { props.delButtons ? <IconButton size='small' color='secondary' onClick={() => deleteFile(curr_file.id)}>
                        <Icon>delete</Icon></IconButton> : null}
                    </ListItemSecondaryAction>
                </ListItem>)
                ) :
                 props.targetList.map(curr_target => (
                <ListItem class="listItem" disablePadding key={curr_target.id}>
                    <ListItemButton selected={curr_target.id === props.target.id} onClick={() => handleLoadTarget(curr_target.id)}> 
                        <ListItemText primary={curr_target.name}/>
                    </ListItemButton>
                    <ListItemSecondaryAction>
                        { props.delButtons ? <IconButton size='small' color='secondary' onClick={() => deleteTarget(curr_target.id)}>
                        <Icon>delete</Icon></IconButton> : null }
                    </ListItemSecondaryAction>
                </ListItem>)
                )
                }
            </List>
        </ScrollToBottom>
    </Box>
    )
}
export default Sidebar;
