/**
 * @Author: 刘谦 <qianliu>
 * @Email:  112486391@qq.com
 */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
const socket = io()

// 设置当前的语言
// https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi.html#dfn-lang
recognition.lang = 'zh-guoyu'

// 控制是否应该返回临时结果
recognition.interimResults = false

// 开始语音识别
document.querySelector('button').addEventListener('click', () => {
  recognition.start()
})

// 一旦语音识别开始，监听语音并检索
recognition.addEventListener('result', ({ results }) => {
  const last = results.length - 1
  const text = results[last][0].transcript

  console.log('Confidence:', results[0][0].confidence)

  socket.emit('chat message', text)
})

// 合成语音
function synthVoice (text) {
  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance()
  utterance.text = text
  synth.speak(utterance) // 说话
}

socket.io('bot reply', (replyText) => {
  synthVoice(replyText)
})
