const childProcess = require('child_process');
const uniq = require('lodash/uniq');

const GstBuildDir = process.env['GST_BUILD_DIR'];

let girDirs = ['/usr/share/gir-1.0'];

if (GstBuildDir) {
  // Various Girs are spread accross build directories. Use `find` to
  // find where they are. They'll include some non-Gst dependencies too,
  // but I guess that's fine.

  let dirs = childProcess.spawnSync(
    'find', [GstBuildDir, '-name', '*.gir', '-printf', '%h\n'],
    { encoding: 'utf8' }).stdout.split('\n');

  // Specify the discovered directories first.
  girDirs = [...uniq(dirs), '/usr/share/gir-1.0']
}

module.exports = {
  pretty: false,
  print: false,
  verbose: true,
  environments: ['node'],
  outdir: '@types',
  modules: ['Gst-1.0', 'GstWebRTC-1.0'],
  buildType: 'lib',
  ignore: [],
  girDirectories: girDirs,
}
