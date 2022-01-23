// The server (and browser) part of this code is at:
// https://github.com/peat-psuwit/stupid-webrtc-server
// (The browser code is actually usable on its own)

const { io } = require('socket.io-client');
const gi = require('node-gtk');

const GLib = gi.require('GLib', '2.0');

// TODO: expose public interfaces. Well, not all of them.

const RTCPeerConnection = require('../lib/webrtc/RTCPeerConnection').default;

const StandaloneStreamOutput = require('../lib/media/StandaloneStreamOutput').default;

let outputs = [];

let peerConnection;
let currentSelfId;
let currentPeerId;

let socket

function connect() {
  socket = io("ws://localhost:8080");

  socket.on('connected', ({ selfId }) => {
    currentSelfId = selfId;
    console.log(`Connected. My id is: ${selfId}`);
  });

  socket.on('ring', ({ callerId, sdp }) => {
    if (peerConnection) {
      socket.emit('reject', { callerId });
    }

    currentPeerId = callerId;
    answerCall(sdp);
  });

  socket.on('answer', ({ calleeId, sdp }) => {
    if (currentPeerId !== calleeId) {
      console.error('Answer received at an invalid state.');
    }

    acceptAnswer(sdp);
  });

  socket.on('ice', ({ peerId, candidate }) => {
    if (!peerConnection || currentPeerId !== peerId) {
      console.error('ICE received at incorrect time.');
      return;
    }

    peerConnection.addIceCandidate(candidate);
  });

  socket.on('failure', ({ error }) => {
    console.error(error);
    hangup();
  });
}

function POSTIce(candidate) {
  socket.emit('ice', { peerId: currentPeerId, candidate });
}

function POSTOfferSDP(sdp) {
  socket.emit('call', { calleeId: currentPeerId, sdp });
}

function POSTAnswerSDP(sdp) {
  socket.emit('answer', { callerId: currentPeerId, sdp });
}

function createPeerConnection() {
  peerConnection = new RTCPeerConnection({
    iceServers : [
      { urls : "stun:stun.l.google.com:19302" },
    ],
  });

  peerConnection.addEventListener('icecandidate', (event) => {
    const { candidate } = event;
    if (!candidate) return;

    console.log('Get local candidate: ', candidate);
    POSTIce(candidate);
  });

  peerConnection.addEventListener('track', (event) => {
    const { streams } = event;

    console.log('Get remote tracks: ', streams);

    let output = new StandaloneStreamOutput();
    output.srcObject = streams[0];
    outputs.push(output);
  });

  peerConnection.addEventListener('iceconnectionstatechange', () => {
    if (peerConnection && (
      peerConnection.iceConnectionState === "failed" ||
      peerConnection.iceConnectionState === "disconnected" ||
      peerConnection.iceConnectionState === "closed"
    )) {
      hangup();  
    }
  });
}

function answerCall(offerSDP) {
  createPeerConnection();
  peerConnection.setRemoteDescription(offerSDP);

  return peerConnection.createAnswer({
    mandatory: { 
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    }
  }).then((answerSDP) => {
    console.log('Answer created: ', answerSDP);
    peerConnection.setLocalDescription(answerSDP);

    POSTAnswerSDP(answerSDP);
  }).catch((e) => {
    console.error(e);
  });
}

function acceptAnswer(answerSDP) {
  if (!peerConnection) {
    console.error('Answer received at incorrect time.');
    return;
  }

  peerConnection.setRemoteDescription(answerSDP);
}

function stopStreamTracks(stream) {
  if (!stream) return;

  stream.getTracks().forEach((track) => track.stop());
}

function hangup() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = undefined;
  }

  currentPeerId = undefined;

  for (let o of outputs) {
    stopStreamTracks(o.srcObject);
  }
  outputs = [];
}

let mainLoop = GLib.MainLoop.new(null, false);
gi.startLoop();

// Start connection after running (inner) loop to avoid race condition.
setImmediate(connect);

mainLoop.run();
