document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const toggleCameraButton = document.getElementById('toggleCamera');
    const socket = io();
    let localStream = null;
    let cameraEnabled = true;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            localVideo.srcObject = stream;
            const peerConnection = new RTCPeerConnection();

            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });

            peerConnection.ontrack = event => {
                remoteVideo.srcObject = event.streams[0];
            };

            socket.on('offer', (offer, senderId) => {
                peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                peerConnection.createAnswer()
                    .then(answer => {
                        peerConnection.setLocalDescription(answer);
                        socket.emit('answer', answer, senderId);
                    });

                peerConnection.onicecandidate = event => {
                    if (event.candidate) {
                        socket.emit('candidate', event.candidate, senderId);
                    }
                };
            });

            socket.on('answer', answer => {
                peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            });

            socket.on('candidate', candidate => {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            });

            // Toggle camera functionality
            toggleCameraButton.addEventListener('click', () => {
                if (!localStream) return;

                const videoTrack = localStream.getVideoTracks()[0];
                if (videoTrack) {
                    cameraEnabled = !cameraEnabled;
                    videoTrack.enabled = cameraEnabled;
                    toggleCameraButton.textContent = cameraEnabled ? "Turn Camera Off" : "Turn Camera On";
                }
            });
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
});
