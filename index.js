/**
 * @Author: 刘谦 <qianliu>
 * @Email:  112486391@qq.com
 */

const apiai = require('apiai')(APIAI_TOKEN) // https://docs.api.ai/docs/get-started
const io = require('socket.io')
const express = require('express')
const app = express()

app.use(express.static(`${__dirname}/views`))
app.use(express.static(`${__dirname}/public`))

const server = app.listen(5000)

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

// 建立连接并收到消息后，使用 API​​.AI 检索对用户消息的回复
io.on('connection', (socket) => {
  socket.on('chat message', (text) => {
    // Get a reply from API.AI
    const apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    })

    apiaiReq.on('response', ({ result }) => {
      const aiText = result.fulfillment.speech
      socket.emit('bot reply', aiText)
    })

    apiaiReq.on('error', (error) => {
      console.error(error)
    })

    apiaiReq.end()
  })
})
