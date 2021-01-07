const test = require('./test')
const UserRoutes = require('./api')

module.exports = app =>{
    app.use('/test',test)
    app.use('/api',UserRoutes)
}

