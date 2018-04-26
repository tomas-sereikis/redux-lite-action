const pkg = require('./package.json');

require('dts-generator').default({
  name: pkg.name,
  project: '.',
  out: pkg.types,
  resolveModuleId: params => {
    return params.currentModuleId === 'index'
      ? `${pkg.name}`
      : `${pkg.name}/${params.currentModuleId}`;
  },
});