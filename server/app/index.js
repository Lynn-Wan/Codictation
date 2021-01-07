const express = require('express')
const mongo = require('./config/db')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')


const bodyParser = require('body-parser')
const routes = require('./router/index')
const app = new express()

var objMulter = multer({
    dest: '../codictation/src/assets/video/'
}) //上传文件储存路径
app.use(objMulter.any()) //允许所有类型的文件传递过来

mongo(app)
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
routes(app)


app.listen(3000,()=>{
    console.log('server listen at 3000')
})