const mongoose = require('mongoose')
const Schema= mongoose.Schema
const feld={
    snumber: String,
    name: String,
    class: String,
    phone: String,
    password: String,
    path: String,
    videoId: String,
}
//自动添加更新时间创建时间:
let schema = new Schema(feld, {timestamps: {createdAt: 'created', updatedAt: 'updated'}})
module.exports= mongoose.model('test',schema)
