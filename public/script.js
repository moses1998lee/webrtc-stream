const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const constraints = { video: true, audio: false };
const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const peerConnection = new RTCPeerConnection(servers);
const socket = io();

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    localVideo.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  })
  .catch(error => console.error('Error accessing media devices.', error));

peerConnection.onicecandidate = event => {
  if (event.candidate) {
    socket.send(JSON.stringify({ 'candidate': event.candidate }));
  }
};

peerConnection.ontrack = event => {
  remoteVideo.srcObject = event.streams[0];
};

socket.on('message', async message => {
  const data = JSON.parse(message);
  if (data.offer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.send(JSON.stringify({ 'answer': answer }));
  } else if (data.answer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  } else if (data.candidate) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
});

socket.on('connect', async () => {
  if (location.hash === '#init') {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.send(JSON.stringify({ 'offer': offer }));
  }
});
