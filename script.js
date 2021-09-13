const socket = io('/')
const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const videoGrid = document.getElementById('video-grid');

// Video object uses stream.
const myVideo = document.createElement('video')
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    videoAddStream(myVideo, stream)

    // Answer calls and send current stream.
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            videoAddStream(video, userVideoStream)
        })

        // Allows to be connected with other users
        socket.on('user-connected', userId =>{
            // When a new user connects, this function will be called
            // When new user has joined the room, sends video stream to the new user.
            connectedToUser(userId, stream)
        })

    })
})
// Adding video stream
function videoAddStream(video, stream) {
    video.srcObject = stream

    //once video is loaded on stream, loaded on page, plays the video
    video.addEventListener('loadedmetadata', () =>{
        video.play()
    })
    videoGrid.append(video)
}

function connectedToUser(userId, stream){
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    // Listens for event stream, calls user, video stream sends.
    call.on('stream', userVideoStream => {
        videoAddStream(video, userVideoStream)

    })
    call.on('close', () => {
        // Closes video call after user disconnects.
        video.remove()
    })
}

// Listen for event for when user disconnects.
socket.on('user-disconnected', userId => {
    console.log(userId)
})


peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})

// Sends event to server
// socket.emit('join-room', ROOM_ID, 10)

// socket.on('user-connected', userId =>{
//     console.log('User connected: ' + userId)
// })

