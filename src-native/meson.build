project('NgwNative', 'c',
  version : '0.1',
  default_options : ['warning_level=3'])

# These arguments are only used to build the shared library
# not the executables that use the library.
lib_args = ['-DBUILDING_NGWNATIVE']

src_files = [
  'NgwNativePromise.c',
  'NgwNativeRTCDataChannel.c'
]

header_files = [
  'NgwNativePromise.h',
  'NgwNativeRTCDataChannel.h'
]

glib = dependency('glib-2.0', required: true)
gst = dependency('gstreamer-1.0', required: true)
gstwebrtc = dependency('gstreamer-webrtc-1.0', required: true)

shlib = shared_library('ngwnative', src_files,
  install : true,
  dependencies: [glib, gst, gstwebrtc],
  c_args : lib_args,
  gnu_symbol_visibility : 'hidden',
)

gnome = import('gnome')
gir = gnome.generate_gir(
  shlib,
  sources: src_files + header_files,
  namespace: 'NgwNative',
  nsversion: '0.0',
  identifier_prefix: 'NgwNative',
  symbol_prefix: 'ngw_native',
  export_packages: 'ngwnative',
  includes: [ 'GObject-2.0', 'GstWebRTC-1.0' ],
)

# Make this library usable as a Meson subproject.
ngwnative_dep = declare_dependency(
  include_directories: include_directories('.'),
  link_with : shlib)

