import Program from "../program/Program"
import Message from "../message/Message"

const Content = (props) => {
  return (
    props.program ? 
      <Program token={props.token} file={props.file} hasChange={props.hasChange} saveFile={props.saveFile}
      setFile={props.setFile} setHasChange={props.setHasChange}/> : 
      <Message token={props.token} handleUnAuth={props.handleUnAuth} target={props.target} setTarget={props.setTarget} 
        fetchTargets={props.fetchTargets} fileList={props.fileList} refreshToken={props.refreshToken} fetchFiles={props.fetchFiles}/>
  )
}
export default Content;