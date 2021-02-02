import axios from 'axios'
import JSZip from 'jszip'

const sendFolder = (files,port) => {
    const formData = new FormData()
    const zip = JSZip()
    
    for(let file of files){
        zip.file(file.webkitRelativePath,file)
    }
    
    return zip.generateAsync({type:"blob"}).then(async (content) => {
        formData.append('folderName',port)
        formData.append("folderZip",content)
        try {
            const res = await axios.post('http://localhost:8000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            })
            return res
        } catch (err) {
            return err
        }
    })
}

const getPort = async () => {
    const res = await axios.get('http://localhost:8000/avaibleport')
    return res
}

export {sendFolder,getPort}