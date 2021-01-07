//用来做人员管理的路由处理
const express = require("express")
// const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs')

const User = require('../model/User')
const Version = require('../model/Version')
const Tag = require('../model/Tag')
const Video = require('../model/Video')
const Task = require('../model/Task')

const {
    secret
} = require('../config/key')
const router = express.Router()

//注册接口
router.post('/register', async (req, res) => {
    // console.log(req.body)
    const user = await User.findOne({
        name: req.body.name
    })
    if (user) {
        return res.status(409).send('该用户已存在')
    }
    const newUser = await new User(req.body).save()
    res.send(newUser)
})

//登录接口
router.post('/login', async (req, res) => {
    //查询用户是否存在
    const user = await User.findOne({
        name: req.body.name
    })
    if (!user) {
        return res.status(422).send('该用户不存在')
    }
    // let isPassword = await bcrypt.compareSync(req.body.password, user.password)
    // if (!isPassword) {
    //     return res.status(422).send('密码错误')
    // }
    if (req.body.password !== user.password) {
        return res.status(422).send('密码错误')
    }
    const {
        _id,
        name
    } = user
    const token = jwt.sign({
        _id,
        name
    }, secret, {
        expiresIn: '24h'
    })
    //返回token
    res.send(token)
    // res.send({token, user})
})

//后台登录接口
router.post('/adminLogin', async (req, res) => {
    //查询用户是否存在
    const user = await User.findOne({
        name: req.body.name
    })
    if (!user) {
        return res.status(422).send('该用户不存在')
    }
    // let isPassword = await bcrypt.compareSync(req.body.password, user.password)
    // if (!isPassword) {
    //     return res.status(422).send('密码错误')
    // }
    if (req.body.password !== user.password) {
        return res.status(422).send('密码错误')
    } else {
        if (!user.status === '3') {
            return res.status(422).send('没有权限')
        }
    }
    const {
        _id,
        name
    } = user
    const token = jwt.sign({
        _id,
        name
    }, secret, {
        expiresIn: '24h'
    })
    //返回token
    res.send(token)
    // res.send({token, user})
})

//获取数据库中所有的title
router.get('/titleList', async (req, res) => {
    const list = await Video.find()
    res.send(list)
    console.log(list)
})

//获取数据库中所有的task
router.get('/taskList', async (req, res) => {
    const list = await Task.find()
    res.send(list)
    console.log(list)
})

//获取数据库中属于当前用户的tag列表
router.get('/tagList', async (req, res) => {
    const list = await Tag.find({
        owner: req.query.owner
    })
    res.send(list)
    console.log(list)
})

//返回当前用户的信息文档 profile
router.get('/profile', async (req, res) => {
    const list = await User.find({
        name: req.query.name
    })
    res.send(list)
    console.log(list)
})

//发布任务
router.post('/task', async (req, res) => {
    var info = req.files[0]
    var otherInfo = req.body //可获取表单传过来的其他信息，如label和title
    var title = otherInfo.title //用户自定义标题
    var fileName = info.filename + '.' + info.originalname.split('.').pop() //实际储存的名字
    var newName = info.destination + fileName
    var deadline = otherInfo.deadline
    var authcode = otherInfo.authcode
    var publisher = otherInfo.publisher
    console.log('---------' + otherInfo.tag)
    var userList = []
    if (otherInfo.tag) {
        var tagItem = await Tag.findOne({
            tagName: otherInfo.tag
        })
        userList = tagItem.userList
    }
    // 利用fs模块的文件重命名
    // info.path是文件的在传递中被修改的路径+名字（没有文件名后缀），newName加了后缀
    fs.rename(info.path, newName, async (err) => {
        if (err) {
            res.send('失败')
        } else {
            let newVideo = {
                title: title,
                fileName: fileName,
                path: info.destination,
                label: otherInfo.label
            }

            const newVideo2 = await new Video(newVideo).save()
            // res.send(newVideo2)
            var video_id = newVideo2._id
            let newTask = {
                videoId: video_id, //视频ID相当于任务ID
                deadline: deadline,
                authcode: authcode,
                publisher: publisher,
                userList: userList,
                title: title,
                label: otherInfo.label
            }
            await new Task(newTask).save()
            // res.send(newTask2)
            res.redirect('http://localhost:8080/#/profile/') //此处地址待更改
            fs.access(info.path, (err) => {
                if (err) {
                    console.log("不存在该文件");
                } else {
                    fs.unlink(info.path, function (error) {
                        if (error) {
                            console.log(error);
                            return false;
                        }
                        console.log('删除文件成功');
                    }) //如果产生多余文件，则删除
                }
            })

        }
    })

})

//导入名单，加上标签
router.post('/addUsers', async (req, res) => {
    const newTag = await new Tag(req.body).save()
    res.send(newTag)
    var userList = req.body.userList;
    // console.log(userList)
    for (let i = 0; i < userList.length; i++) {
        var user = await User.findOne({
            name: userList[i].name
        })
        if (user) {
            return res.status(409).send('该用户已存在')
        } else {
            await new User(userList[i]).save()
        }

    }
})

//返回当前任务文档
router.get('/currentTask', async (req, res) => {
    const list = await Task.find({
        _id: req.query._id
    })
    res.send(list)
    console.log(list)
})

//返回当前视频文档
router.get('/currentVideo', async (req, res) => {
    const list = await Video.find({
        _id: req.query._id
    })
    res.send(list)
    console.log(list)
})

//处理文本比较数据（好像没用了，可删）
router.post('/diff', async (req, res) => {
    let diffList = []
    let sentences = req.body.params.sentences
    for (var i = 0; i < sentences.length; i++) {
        diffListItem = {
            sentence: sentences[i],
            diffs: [] //记录该句子的修改情况
        }
        diffList.push(diffListItem)
    }
    //存储第一位用户提交的第一版本句子
    await Task.find({
        _id: req.body.params._id
    }, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            Task.updateOne({
                _id: req.body.params._id
            }, {
                $set: {
                    diffList: diffList,
                    userList: req.body.params.userList
                }
            }, err => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("更新成功")
                }
            })
        }
    })
    let newversion = [{
        taskId: req.body.params._id,
        name: req.body.params.username,
        version: req.body.params.version1,
        time: req.body.params.time
    }]
    //向数据库更新版本列表-重写 新建文档
    const newVersion = new Version(newversion).save()
    res.send(newVersion)
})

//更新版本列表
router.post('/updateVersion', async (req, res) => {
    console.log(req.body)
    let newversion = {
        taskId: req.body.params._id,
        version: req.body.params.new_version,
        name: req.body.params.username,
        time: req.body.params.time
    }
    const newVersion = new Version(newversion).save()
    res.send(newVersion)
})

//返回当前任务的所有版本
router.get('/allVersions', async (req, res) => {
    const list = await Version.find({
        taskId: req.query._id
    })
    res.send(list)
    console.log(list)
})

//更新文本比较数据
router.post('/updatediff', async (req, res) => {
    await Task.updateOne({
        _id: req.body.params._id
    }, {
        $set: {
            diffList: req.body.params.diffList,
            userList: req.body.params.userList
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

//更新评论数据
router.post('/updateComment', async (req, res) => {
    await Task.updateOne({
        _id: req.body.params._id
    }, {
        $set: {
            comments: req.body.params.comments
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

module.exports = router