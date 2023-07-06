var Generator = require('yeoman-generator');
var path = require('path');

module.exports = class extends Generator {
  packageJson() {
    const packageName = path.basename(this.destinationPath());

    this.fs.copy(
      this.templatePath("."),
      this.destinationPath("."),
    );
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { packageName }
    );
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      { packageName }
    );
  }
};
