import React,{useState,useEffect} from 'react'
import {sendFolder,getPort} from '../utils/server'
import {randomstring} from 'randomstring-js'
import '../styles/Home.css'

import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

const Home = () => {
    const [folder,setFolder] = useState(null)
    const [port,setPort] = useState(null)

    const sendToServer = async (e) => {
        e.preventDefault()

        let res = await sendFolder(folder,port)
        
        if(res.status === 200){
            if(alert("Folder uploaded!")){

            } else {
                window.location.reload()
            }
        }
    }

    const overFolder = () => {
        var files = []
        
        for(let file of folder){
            files.push(file)
        }

        return (
            <>
            {files.map((file) => {
                return <span key={randomstring()}>&#8226; {file.webkitRelativePath}</span>
            })}
            </>
        )
    }

    useEffect(() => {
        const getPortFromServer = async () => {
            setPort(await (await getPort()).data.msg)
        }
        getPortFromServer()
    },[])

    return (
        <>
        <div className="mainHome">
            <form onSubmit={(e) => {sendToServer(e)}}>
                <div className="titleDiv">
                    <img onClick={() => {console.log(folder)}} alt="" src={`${process.env.PUBLIC_URL}/images/raspberry.svg`}/>
                    <h1>Raspberry PI Server</h1>
                </div>
                <div className="uploadDiv">
                    <div onClick={() => {
                        document.getElementById("inputFolder").click()
                    }} className={`uploadSubDiv ${!folder ? "noItem" : ""}`}>
                        {folder ? overFolder() : (
                            <>
                            <SystemUpdateAltIcon style={{fontSize: 50,opacity: .5}} />
                            <h3>Choose file</h3>
                            </>
                        )}
                        <input onChange={(e) => {setFolder(e.target.files)}} id="inputFolder" type="file" webkitdirectory={"true"} multiple />
                    </div>
                </div>
                <div className="configDiv">
                    <h3>Available port: {port}</h3>
                    <button type="submit">Send folder</button>
                </div>
            </form>
        </div>
        </>
    );
}

export default Home
