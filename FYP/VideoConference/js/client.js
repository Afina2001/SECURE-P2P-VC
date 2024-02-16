const socket = io('https://your-secure-server.com');

const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com:3478?transport=udp', username: 'user', credential: 'password' }
  ]
};

const pc = new RTCPeerConnection(configuration);

pc.addEventListener('icecandidate', (event) => {
  if (event.candidate) {
    socket.emit('exchange', {'type': 'candidate', 'candidate': event.candidate});
  }
});

pc.addEventListener('addstream', (event) => {
  remoteVideo.srcObject = event.stream;
});

navigator.mediaDevices.getUserMedia(mediaConstraints)
  .then((stream) => {
    localVideo.srcObject = stream;
    pc.addStream(stream);
  })
  .catch((error) => {
    console.error('Error accessing user media:', error);
  });

socket.on('exchange', (message) => {
  if (message.type === 'offer') {
    pc.setRemoteDescription(new RTCSessionDescription(message.offer))
      .then(() => pc.createAnswer())
      .then((answer) => pc.setLocalDescription(answer))
      .then(() => {
        socket.emit('exchange', {'type': 'answer', 'answer': pc.localDescription});
      });
  } else if (message.type === 'answer') {
    pc.setRemoteDescription(new RTCSessionDescription(message.answer));
  } else if (message.type === 'candidate') {
    pc.addIceCandidate(new RTCIceCandidate(message.candidate));
  }
});