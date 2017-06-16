var path = require('path');
var glob = require('glob');
var fs = require('fs');
var ejs = require('ejs');
var watch = require('watch');

function EJSRenderPlugin(options) {
    this.paths = getPaths();
    generateHtmlToStorage(this.render());

    // for monitor
    this.startTime = Date.now();
    this.prevTimestamps = {};
}

function getPaths() {
//    return glob.sync(path.join(__dirname, '../src/**/*.ejs'));
    var all = glob.sync(path.join(__dirname, '../src/**/*.ejs'));
    return all.filter( function(v) {
        return !v.match('partials/');
    });
}

function generateHtmlToStorage(values) {
    console.log("Generate HTML files to Storage...");
    values.forEach(function(val) {
        fs.writeFileSync(
            path.join(__dirname, val.key),
            val.content
        );
    });
}

function addAssetsToCompilation(values) {
    console.log("Add assets to the compilation...");
    values.forEach(function(val) {
        compilation.assets[val.key] = {
            source: function() {
                return val.content;
            },
            size: function() {
                return val.content.length;
            }
        };
//        var watchFile = path.join(__dirname, result.key.replace(/\.html$/,'.ejs'));
//        compilation.fileDependencies = [ watchFile ];
    });
}

function monitorChangeFiles() {
    var changedFiles = Object.keys(compilation.fileTimestamps).filter(function(watchfile) {
        return (this.prevTimestamps[watchfile] || this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity);
    }.bind(this));

    console.log('File Changed!!! ' + changedFiles);
    this.prevTimestamps = compilation.fileTimestamps;
}

EJSRenderPlugin.prototype.apply = function(compiler) {

    console.log('Start EJS rendering...');
    
    var self = this;

    compiler.plugin('compilation', function (compilation) {
        compilation.plugin(
            'html-webpack-plugin-before-html-processing', 
            function(htmlPluginData, callback) {
                console.log('HTML-WEBPACK-PLUGIN-BEFORE-HTML-PROCESSING');
                var results = self.render();
                generateHtmlToStorage(results);
                callback(null, htmlPluginData);
            }
        );
    });

    compiler.plugin('emit', function (compilation, callback) {

        self.paths.forEach(function(ejsPath) {
            console.log('[' + ejsPath + ']');
            compilation.fileDependencies = [ ejsPath ];
            compilation.fileDependencies = [ ejsPath.replace(/\.ejs$/, '.html') ];
        });

        callback(null);

//    }.bind(this));
    });
}

EJSRenderPlugin.prototype.render = function() {
    var results = []

    this.paths.forEach( function(ejsPath) {

        var html = fs.readFileSync( ejsPath, 'utf8');
        html = ejs.render(html, { filename: 'src/partials/' });

        var dist = ejsPath.replace(path.join(__dirname, '../'), '../');
        var key = dist.replace(/\.ejs$/,'.html')

        results.push({
            key: key,
            content: html
        });
    });

    return results;
};

module.exports = EJSRenderPlugin;
