import './Message.css'
import { api } from '../../App';

import { Button, Icon, IconButton, List, ListItem, Box, 
    ListItemButton, DialogTitle, ListItemText, Dialog } from '@mui/material';

import ScrollToBottom from 'react-scroll-to-bottom';
import { useState } from 'react';

const Message = (props) => {

    const [fileExists, setFileExists] = useState(false);
    const [fileSaved, setFileSaved] = useState(false);
    const [selectFile, setSelectFile] = useState(false);

    const sendMessage = async (text, title, code) => {
        try {
            const { data } = await api.post(`operate-target/${props.target.id}`, { name: props.target.name, text, title, code }, {
                headers: {
                    'Authorization': `Bearer ${props.token.access_token}` 
                }
            })
            props.refreshToken(data.access_token);
            props.setTarget(data.target);
        } catch (err) {
            props.handleUnAuth(err);
        }
    }
    
    const downloadFile = async (title, code) => {
        try {
            await api.post(`/new-file`, {title, code}, {
               headers: {
                   'Authorization': `Bearer ${props.token.access_token}` 
               }
            })
            props.fetchFiles();
            setFileSaved(true);
        } catch(err) {
            props.handleUnAuth(err);
        }   
    }

    const handleDownloadFile = (title, code) => {
        for (const e of props.fileList) {
            if (e.title.equalsIgnoreCase(title)) {
                setFileExists(true);
                return;
            }
        }
        downloadFile(title, code)
        return;
    }

    const handleSendFile = (title, code) => {
        sendMessage(code, title, true);
        setSelectFile(false);
    }

    const handleRefresh = () => {
        props.fetchTargets();
        props.loadTarget(props.target.id);
    }
        
    const enterSend = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const text = e.target.value;
            if (text !== "") {
                sendMessage(e.target.value, "", false);
                e.target.value = "";
            }
        }
    }
    // Make new route for file download from text. Dialog for confirmation
    return (
        <Box class="messaging">
        <Dialog open={fileExists}>
            <DialogTitle sx={{fontSize: 17, textAlign:'center'}}>{"File already exists."}</DialogTitle>
            <Button size='small' color="secondary" onClick={() => setFileExists(false)}>Close</Button>
        </Dialog>
        <Dialog open={fileSaved}>
            <DialogTitle sx={{fontSize: 17, textAlign:'center'}}>{"File saved."}</DialogTitle>
            <Button size='small' color="primary" onClick={() => setFileSaved(false)}>Ok</Button>
        </Dialog>
        <Dialog open={selectFile}>
            <DialogTitle>{"Select file."}</DialogTitle>
            <Box class="shareList">
                <List dense={true} >
                    {props.fileList.map(f => (
                        <ListItem  disablePadding key={f.id}>
                            <ListItemButton onClick={() => handleSendFile(f.title, f.code)}>
                                <ListItemText primary={f.title}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Button size="small" color="secondary" onClick={() => setSelectFile(false)}>Cancel</Button>
        </Dialog>
            <Box class='topBar'>
                <Button color="primary" onClick={handleRefresh}><Icon>refresh</Icon>refresh</Button>
             </Box>
            <ScrollToBottom className="messageArea">
                <List>
                    {props.target.messages.map(curr => (
                        curr.sent ? 
                            <ListItem class="message sentM" key={curr.id}>
                                <Icon size="small">chevron_left</Icon>
                                { curr.code ? <Box onClick={() => handleDownloadFile(curr.title, curr.text)} class="sent file">{curr.title}</Box>
                                    : <Box class="box sent">{curr.text}</Box> }
                            </ListItem>
                        :   <ListItem class="message" key={curr.id}>
                                <Icon size="small">chevron_right</Icon>
                                { curr.code ? <Box onClick={() => handleDownloadFile(curr.title, curr.text)} class="recieved file">{curr.title}</Box>
                                    : <Box class="box recieved">{curr.text}</Box> }
                            </ListItem>
                    ))
                    }
                </List>
            </ScrollToBottom>
            <Box class="typeBox"><IconButton disabled={!props.target.id} color='primary' onClick={() => setSelectFile(true)}><Icon>share</Icon></IconButton>
                <textarea disabled={!props.target.id} placeholder='Text message' rows={3} class="typeArea" onKeyDown={enterSend}></textarea>
            </Box>
        </Box>
    )
}

export default Message;