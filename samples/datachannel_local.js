/*
 *  Based on WebRTC's sample at:
 *  https://github.com/webrtc/samples/blob/gh-pages/src/content/datachannel/datatransfer/js/main.js
 *
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *  Copyright (c) 2021 Ratchanan Srirattanamet.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE.WebRTCSamples file in this
 *  directory.
 */

'use strict';

const os = require('os');
const { performance } = require('perf_hooks');
const readline = require('readline');

const gi = require('node-gtk');
const GLib = gi.require('GLib', '2.0');
const Gst = gi.require('Gst', '1.0');

const { RTCPeerConnection } = require('../');

const MAX_CHUNK_SIZE = 262144;

let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;
let chunkSize;
let lowWaterMark;
let highWaterMark;
let dataString;
let timeoutHandle = null;

let sendProgressMax = 0;
let sendProgressValue = 0;
let receiveProgressMax = 0;
let receiveProgressValue = 0;

let bytesToSend = 0;
let totalTimeUsedInSend = 0;
let numberOfSendCalls = 0;
let maxTimeUsedInSend = 0;
let sendStartTime = 0;
let currentThroughput = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function newRound() {
  rl.question('Megs to send> ', (answer) => {
    const number = parseInt(answer);
    if (Number.isNaN(number)) {
      console.log(`Invalid value for MB to send: ${number}`);
      newRound();
    } else if (number <= 0) {
      // console.log('Please enter a number greater than zero.');
      console.log('Megs <= 0, exit now.');
      process.exit(0);
    } else if (number > 64) {
      console.log('Please enter a number lower or equal than 64.');
    } else {
      console.log(`Going to send ${number} megs of data over WebRTC.`);
      createConnection(number)
        .catch((e) => { console.error(e); process.exit(1); });
    }
  });
}

async function createConnection(number) {
  const servers = null;

  bytesToSend = number * 1024 * 1024;

  localConnection = new RTCPeerConnection(servers);

  // Let's make a data channel!
  const dataChannelParams = {ordered: false};
  // if (orderedCheckbox.checked) {
  //   dataChannelParams.ordered = true;
  // }
  sendChannel = localConnection.createDataChannel('sendDataChannel', dataChannelParams);
  sendChannel.addEventListener('open', onSendChannelOpen);
  sendChannel.addEventListener('close', onSendChannelClosed);
  console.log('Created send data channel: ', sendChannel);

  console.log('Created local peer connection object localConnection: ', localConnection);

  localConnection.addEventListener('icecandidate', e => onIceCandidate(localConnection, e));

  remoteConnection = new RTCPeerConnection(servers);
  remoteConnection.addEventListener('icecandidate', e => onIceCandidate(remoteConnection, e));
  remoteConnection.addEventListener('datachannel', receiveChannelCallback);

  try {
    const localOffer = await localConnection.createOffer();
    await handleLocalDescription(localOffer);
  } catch (e) {
    console.error('Failed to create session description: ', e);
    process.exit(1);
  }

  console.log('Peer connection setup complete.')
}

function sendData() {
  // Stop scheduled timer if any (part of the workaround introduced below)
  if (timeoutHandle !== null) {
    clearTimeout(timeoutHandle);
    timeoutHandle = null;
  }

  let bufferedAmount = sendChannel.bufferedAmount;
  while (sendProgressValue < sendProgressMax) {
    console.log('Sending data...');
    const timeBefore = performance.now();
    sendChannel.send(dataString);
    const timeUsed = performance.now() - timeBefore;
    if (timeUsed > maxTimeUsedInSend) {
      maxTimeUsedInSend = timeUsed;
      totalTimeUsedInSend += timeUsed;
    }
    numberOfSendCalls += 1;
    bufferedAmount += chunkSize;
    sendProgressValue += chunkSize;

    // Pause sending if we reach the high water mark
    if (bufferedAmount >= highWaterMark) {
      // This is a workaround due to the bug that all browsers are incorrectly calculating the
      // amount of buffered data. Therefore, the 'bufferedamountlow' event would not fire.
      if (sendChannel.bufferedAmount < lowWaterMark) {
        timeoutHandle = setTimeout(() => sendData(), 0);
      }
      console.log(`Paused sending, buffered amount: ${bufferedAmount} (announced: ${sendChannel.bufferedAmount})`);
      break;
    }
  }

  if (sendProgressValue === sendProgressMax) {
    console.log('Data transfer completed successfully!');
  }
}

function startSendingData() {
  console.log('Start sending data.')
  sendProgressMax = bytesToSend;
  receiveProgressMax = sendProgressMax;
  sendProgressValue = 0;
  receiveProgressValue = 0;
  sendStartTime = performance.now();
  maxTimeUsedInSend = 0;
  totalTimeUsedInSend = 0;
  numberOfSendCalls = 0;
  sendData();
}

function maybeReset() {
  if (localConnection === null && remoteConnection === null) {
    newRound();
  }
}

async function handleLocalDescription(desc) {
  localConnection.setLocalDescription(desc);
  console.log('Offer from localConnection:\n', desc.sdp);
  remoteConnection.setRemoteDescription(desc);
  try {
    const remoteAnswer = await remoteConnection.createAnswer();
    handleRemoteAnswer(remoteAnswer);
  } catch (e) {
    console.error('Error when creating remote answer: ', e);
    process.exit(0);
  }
}

function handleRemoteAnswer(desc) {
  remoteConnection.setLocalDescription(desc);
  console.log('Answer from remoteConnection:\n', desc.sdp);
  localConnection.setRemoteDescription(desc);
}

function getOtherPc(pc) {
  return (pc === localConnection) ? remoteConnection : localConnection;
}

async function onIceCandidate(pc, event) {
  const candidate = event.candidate;
  if (candidate === null) {
    return;
  } // Ignore null candidates
  try {
    await getOtherPc(pc).addIceCandidate(candidate);
    console.log('AddIceCandidate successful: ', candidate);
  } catch (e) {
    console.error('Failed to add Ice Candidate: ', e);
  }
}

function receiveChannelCallback(event) {
  console.log('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.binaryType = 'arraybuffer';
  receiveChannel.addEventListener('close', onReceiveChannelClosed);
  receiveChannel.addEventListener('message', onReceiveMessageCallback);
}

function onReceiveMessageCallback(event) {
  receiveProgressValue += event.data.length;
  currentThroughput = receiveProgressValue / (performance.now() - sendStartTime);
  console.log('Current Throughput is:', currentThroughput, 'bytes/sec');

  // Workaround for a bug in Chrome which prevents the closing event from being raised by the
  // remote side. Also a workaround for Firefox which does not send all pending data when closing
  // the channel.
  if (receiveProgressValue === receiveProgressMax) {
    sendChannel.close();
    receiveChannel.close();
  }
}

function onSendChannelOpen() {
  console.log('Send channel is open');

  // FIXME: sctp property is not implemented yet.
  // chunkSize = Math.min(localConnection.sctp.maxMessageSize, MAX_CHUNK_SIZE);
  chunkSize = 1024;
  console.log('Determined chunk size: ', chunkSize);
  dataString = new Array(chunkSize).fill('X').join('');
  // lowWaterMark = chunkSize; // A single chunk
  // Workaround off-by-one problem in bufferedAmountLowThreshold handling
  // in GstWebRTC 1.16 (fixed in 1.18).
  lowWaterMark = chunkSize + 1;
  highWaterMark = Math.max(chunkSize * 8, 1048576); // 8 chunks or at least 1 MiB
  console.log('Send buffer low water threshold: ', lowWaterMark);
  console.log('Send buffer high water threshold: ', highWaterMark);
  sendChannel.bufferedAmountLowThreshold = lowWaterMark;
  sendChannel.addEventListener('bufferedamountlow', (e) => {
    console.log('BufferedAmountLow event:', e);
    sendData();
  });

  startSendingData();
}

function onSendChannelClosed() {
  console.log('Send channel is closed');
  localConnection.close();
  localConnection = null;
  console.log('Closed local peer connection');
  maybeReset();
  console.log('Average time spent in send() (ms): ' +
              totalTimeUsedInSend / numberOfSendCalls);
  console.log('Max time spent in send() (ms): ' + maxTimeUsedInSend);
  const spentTime = performance.now() - sendStartTime;
  console.log('Total time spent: ' + spentTime);
  console.log('MBytes/Sec: ' + (bytesToSend / 1000) / spentTime);
}

function onReceiveChannelClosed() {
  console.log('Receive channel is closed');
  remoteConnection.close();
  remoteConnection = null;
  console.log('Closed remote peer connection');
  maybeReset();
}

gi.startLoop();
Gst.init(null);

const loop = GLib.MainLoop.new(null, false);

function quit(ret) {
  console.log('Quitting...');
  process.exit(ret);
}

GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGINT, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGTERM, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGHUP, () => { quit(0); return false; });

GLib.idleAdd(GLib.PRIORITY_DEFAULT, () => { newRound(); return false; });

process.on('uncaughtException', (e) => {
  console.error(e);
  process.exit(1);
})

loop.run();