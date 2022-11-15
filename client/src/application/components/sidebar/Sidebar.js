import "./Sidebar.css"
import { api } from '../../App.js'

import { useState, useEffect } from 'react';
import { List, ListItemSecondaryAction, ListItemButton, ListItemText, ListItem } from '@mui/material';
import { TextField,Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Button, Icon, IconButton, ButtonGroup } from '@mui/material';

const Sidebar = (props) => {
    const [openNewFile, setOpenNewFile] = useState(false);
    const [openNoSave, setOpenNoSave] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [newNameError, setNewNameError] = useState([]);
    const [nextId, setNextId] = useState(null);
    const [delButtons, setDelButtons] = useState(false);
    const handleOpenNewFile = () => { setNewFileName(""); setOpenNewFile(true) }
    const handleCloseNewFile = () => { setNewFileName(""); setNewNameError([false]); setOpenNewFile(false) };

    const handleUnsavedSave = () => { props.saveFile(); loadFile(nextId); setOpenNoSave(false) };
    const handleUnsavedIgnore = () => { loadFile(nextId); setOpenNoSave(false) };
    
    const deleteFile = async (id) => {
        try {
            const { data } = await api.delete(`/fetch-file/${id}`,{
                headers: {
                  'Authorization': `Bearer ${props.token.access_token}` 
                }
              })
            props.refresh(data.access_token);
            props.setFileList(props.fileList.filter(f => f.id !== id));
            setDelButtons(false);
            if (id === props.file.id) {
                props.handleSetFile(data.file ?? {title: '', id: null, code:''});
            }
        } catch (err) {
          props.handleUnAuth(err);
        }
    }

    const loadFile = async (id) => {
        try {
          const { data } = await api.get(`/fetch-file/${id}`, {
            headers: {
              'Authorization': `Bearer ${props.token.access_token}` 
            }
          })
          props.refresh(data.access_token);
          props.handleSetFile(data.file);
        } catch (err) {
          props.handleUnAuth(err);
        }
      }

    const handleLoadFile = (id) => {
        setDelButtons(false);
        if (props.file.id !== id) {
            if (!props.hasChange || !props.file.id) {
                loadFile(id);
            } else {
                setNextId(id);
                setOpenNoSave(true); 
            } 
        }
    }
    
    const newFile = async (title) => {
        try {
            const { data } = await api.post(`/new-file`, {title: title, code: ""}, {
            headers: {
                'Authorization': `Bearer ${props.token.access_token}` 
            }
            })
            props.refresh(data.access_token); 
            props.setFileList([...props.fileList, data.file]);
            handleLoadFile(data.file.id);
        } catch(err) {
            props.handleUnAuth(err);
        }   
    } 

    const invalidInput = () => {
        const f_name = newFileName.trim().toLowerCase()
        const name_arr = f_name.split('.');
        if (name_arr.length !== 2 || name_arr[1] !== 'sc') {
        return [true, "File name must end in '.sc'."]
        }
        if (name_arr[0].includes(" ")) {
        return [true, "File name must be one word."];
        }
        if (name_arr[0].length > 100) {
        return [true, "Max character limit exceeded."];
        }
        for(const e of props.fileList) {
            if (e.title.toLowerCase() === f_name) {
                return [true, "Dulpicate file name."];
            }
        }
        return [false];
    }

    const handleNewFile = () => {
        const err = invalidInput();
        setNewNameError(err);
        if (!err[0]) {
            newFile(newFileName);
            handleCloseNewFile();
        }
    };

    const fetchFiles = async () => {
        try {
            const { data } = await api.get(`/fetch-files`,{
                headers: {
                'Authorization': `Bearer ${props.token.access_token}` 
                }
            });
            props.refresh(data.access_token);
            props.setFileList(data.files);
        } catch(err) {
            props.handleUnAuth(err);
        }
    }

    // Fetch files everytime token is modified.
    useEffect(() => {
        if (props.token) {
            fetchFiles();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.token])

    return (
    <div className="sidebar">
        <Dialog open={openNewFile} aria-labelledby="alert-dialog-title"> 
            <DialogActions>
                <TextField id="standard-basic" error={newNameError[0]} label={newNameError[0] ? newNameError[1]: "Enter file name."} 
                    variant="standard" onChange={f => setNewFileName(f.target.value)}/>
                <Button variant="contained" size='small' color="primary" onClick={handleNewFile}>Enter</Button>
                <Button variant="contained" size='small' color="secondary" onClick={handleCloseNewFile}>Cancel</Button>
            </DialogActions> 
        </Dialog>
        <Dialog open={openNoSave} aria-labelledby="alert-dialog-title">
            <DialogTitle sx={{fontSize: 17, textAlign:'center'}} id="alert-dialog-title">{"Unsaved Changes."}</DialogTitle>
            <DialogActions>
                <Button variant="contained" size='small' color="primary" onClick={handleUnsavedSave}>Save Changes</Button>
                <Button variant="contained" size='small' color="secondary" onClick={handleUnsavedIgnore}>Ignore</Button>
            </DialogActions> 
        </Dialog>
        <div className='listHeader'>
            <ButtonGroup variant="text" fullWidth={true}>
                <Button color="primary" disabled={!props.token} onClick={handleOpenNewFile} > <Icon>post_add</Icon>New File</Button>
                <Button color="secondary" disabled={!props.token || !props.fileList.length} onClick={() => setDelButtons(!delButtons)}> <Icon>delete</Icon>Delete</Button>
            </ButtonGroup>
        </div>
        <div className='changes'>{ props.token ? (props.file.id ? (props.hasChange ? `Unsaved changes.` :  "All changes saved.") : "Create or load file.") : "Login to create files." }</div>
        <div className='list'>
            <List dense={true}>
                {props.fileList.map(curr_file => (
                <ListItem class="listItem" disablePadding key={curr_file.id}>
                    <ListItemButton selected={curr_file.id === props.file.id} onClick={() => handleLoadFile(curr_file.id)}> 
                        <ListItemText primary={curr_file.title}/>
                    </ListItemButton>
                    <ListItemSecondaryAction>
                        { delButtons ? <IconButton size='small' color='secondary' onClick={() => deleteFile(curr_file.id)}>
                        <Icon>delete</Icon></IconButton> : null}
                    </ListItemSecondaryAction>
                </ListItem>)
                )}
            </List>
        </div>
    </div>
    )
}
export default Sidebar;
