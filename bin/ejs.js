var path = require('path');
var glob = require('glob');
var fs = require('fs');
var ejs = require('ejs');

var paths = glob.sync(path.join(__dirname, '../src/**/*.ejs'));
paths.forEach( ejsPath => {
    fs.readFile(ejsPath, 'utf8', (err, ejsFileData) => {
        let html = ejs.render(ejsFileData, {
            filename: 'src/partials/'
        });

        fs.writeFileSync(
            ejsPath.replace(/ejs$/, 'html'), html
        );
    });
});
console.log('updated!');
