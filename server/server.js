const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const {exec} = require('child_process')
const utils = require('./utils/functions')
const unzipper = require('unzipper')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(fileUpload())

app.post('/upload', (req,res) => {
    if(req.files === null){
        return res.status(400).json({msg:'No file uploaded'})
    }

    const files = req.files.folderZip
    const folderName = req.body.folderName

    try{
        fs.writeFile(`uploads/${folderName}.zip`, files.data, async () => {
            var readStream = fs.createReadStream(`uploads/${folderName}.zip`)
    
            readStream.on('open', () => {
                readStream.pipe(unzipper.Extract({ path: `uploads/${folderName}`})).on('close', () => {
                    exec(`sudo mv -v uploads/${folderName}/build/* uploads/${folderName}/`)
                    exec(`sudo rm -r uploads/${folderName}/build`)
                    exec(`sudo rm -r uploads/${folderName}.zip`)
                    return res.status(200).json({msg:'File uploaded'})
                })
            })
        })
    }catch (err){
        return res.status(400).json({msg:err})
    }
})

app.get('/avaibleport',(req,res) => {
    fs.readdir('uploads/',async (err,folder) => {
        var port = null

        do{
            port = await (await utils.portFinder(parseInt(folder[folder.length-1]))).toString()
        }while(folder.includes(port))
        
        return res.status(200).json({msg:port})
    })
})

app.listen(8000, () => {
    console.log('Server Started :5000')
})