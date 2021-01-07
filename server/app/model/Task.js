const mongoose = require("mongoose")
const {
    Schema,
    model
} = mongoose

const TaskSchema = new Schema({
    videoId: { //根据videoId获得视频路径和自定义名称 Video _id
        type: String
    },
    title: {
        type: String,
    },
    diffList: { //文本比较数据
        type: Array,
        default: []
    },
    userList: { //成员名单，将任务发送到成员的个人主页
        type: Array,
        default: []
    },
    deadline: { //积分有效期，超过该时间，不计算积分
        type: Date
    },
    authcode: { //验证码
        type: String
    },
    publisher: { //发布者
        type: String
    },
    comments: { //评论列表
        type: Array,
        default: []
    }
})

const Task = model('Task', TaskSchema)

module.exports = Task