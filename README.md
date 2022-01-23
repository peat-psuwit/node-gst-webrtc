node-gst-webrtc
===============

Implement [WebRTC Javascript API](https://www.w3.org/TR/webrtc/) using Gstreamer's
[webrtcbin](https://gstreamer.freedesktop.org/documentation/webrtc/index.html) and
friends. Uses [node-gtk](https://github.com/romgrk/node-gtk/).

Why?
----

I was inspired by how many of major browsers uses libwebrtc as the basis of their
WebRTC implementations, and (allegedly) how hard it is to add a new HW acceleration
to it. Implementing this wrapper opens WebRTC to the world of Gstreamer's flexibility
and support for multiple HW-accelerated plugins.

...That is, until I realized that WebKitGTK already incoperated Gstreamer into their
WebRTC implementation (on top of libwebrtc). Still, this project is fun regardless.
Let's see how far I can push this wrapper.

Current state
-------------
- Can send, receive data using data channel.
- Can receive media.
- Cannot send media yet.
