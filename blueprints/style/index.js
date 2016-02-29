var fs   = require('fs-extra');
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');

module.exports = {
  podsDir: '',

  description: 'Generates a style.sass file',

  beforeInstall: function (options) {
      // replace \ with / for compatibility with windows-style nested paths
      this.podsDir = this._locals(options).fileMap.__path__.replace(/\\/g, '/');
      this.podsDir = this.podsDir.replace('/' + options.entity.name, '');
      this.podsDir = this.podsDir.replace(options.entity.name, '');

      if (!options.taskOptions.pod) {
          throw new Error('You must use pods with ember-cli-sass-pods. Run with --pod.');
      }
  },

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall: function (options) {
      //console.log(util.inspect(options.project, false, null));
      var entity = options.entity;

      addSassToImportFile(entity.name, {
          name: entity.name,
          root: options.project.root,
          podsDir: this.podsDir
      });
  }
};

function addSassToImportFile (name, options) {
      var importFile = options.podsDir ? options.podsDir.replace(/(\\|\/)$/, '') : 'pods',
          filePath = path.join(options.root, 'app/styles'),
          importSassPath = path.join(filePath, importFile + '.sass'),
          podsDir = options.podsDir ? importFile + '/' : '',
          newLine = '@import "app/' + podsDir + options.name + '/style";\n',
          source;

      if (!fs.existsSync(filePath)) {
        mkdirp(filePath);
      }

      if (!fs.existsSync(importSassPath)) {
          fs.writeFileSync(importSassPath, newLine, 'utf8');
      } else {
          source = fs.readFileSync(importSassPath, 'utf-8');
          source += newLine;
          fs.writeFileSync(importSassPath, source);
      }
  }
