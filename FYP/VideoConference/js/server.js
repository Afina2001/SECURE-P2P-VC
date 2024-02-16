const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

// Secure the signaling server using HTTPS
const fs = require('fs')
const https = require('https')
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}
const server = https.createServer(options, app)
const ioSecure = require('socket.io')(server)

// Implement access control using JWT
const jwt = require('jsonwebtoken')
const secret = 'your-secret-key'

ioSecure.on('connection', (socket) => {
  const token = socket.handshake.query.token
  try {
    const decoded = jwt.verify(token, secret)
    console.log(`User ${decoded.username} joined the room`)
    socket.username = decoded.username
  } catch (error) {
    console.log('Invalid token')
    socket.disconnect()
    return
  }

  socket.on('disconnect', () => {
    console.log(`User ${socket.username} left the room`)
  })

  // Handle signaling messages
  socket.on('signal', (data) => {
    socket.to(data.room).emit('signal', { sender: socket.username, signal: data.signal })
  })
})

// Start the HTTPS server
server.listen(3000, () => {
  console.log('Secure server listening on port 3000')
})