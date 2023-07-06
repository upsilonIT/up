var Generator = require('yeoman-generator');
var path = require('path');

module.exports = class extends Generator {
  packageJson() {
    const packageName = path.basename(this.destinationPath());

    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { packageName }
    );
  }
};
