var path = require('path');
var glob = require('glob');
var fs = require('fs');
var ejs = require('ejs');

function EJSRenderPlugin(options) {
    this.paths = getPaths();
}

function getPaths() {
    var all = glob.sync(path.join(__dirname, '../src/**/*.ejs'));
    return all.filter( function(v) {
        return !v.match('partials/');
    });
}

EJSRenderPlugin.prototype.render = function() {
    var results = []

    this.paths.forEach( function(ejsPath) {
        var html = '';
        fs.readFile( ejsPath, 'utf8', function (err, fileContent) {
            html = ejs.render(fileContent, {
                filename: 'src/partials/'
            });
        });

        var dist = ejsPath.replace(path.join(__dirname, '../'), '../');
        var key = dist.replace(/\.ejs$/,'.html')
        results.push({
            dist: dist,
            key: key,
            content: html
        });
    });

    return results;
};

EJSRenderPlugin.prototype.apply = function(compiler) {

    console.log('Start EJS rendering...');
    
    var self = this;

    compiler.plugin("compile", function(params) {
        console.log("The compiler is starting to compile...");
        var results = self.render();
        console.log('path:::: ' + path.join(__dirname, results[0].dist));
        results.forEach(function(result) {
            fs.writeFileSync(
                path.join(__dirname, result.dist),
                //JSON.stringify(stats.toJson().assetsByChunkName, 'utf8')
                result.content
            );
        });
        console.log('Pre generating HTML files.')
    });

//    //compiler.plugin('emit', function (compilation, callback) {
//    compiler.plugin('compilation', function (compilation) {
//
//        var results = self.render();
//
//        results.forEach(function(result) {
//            compilation.assets[result.key] = {
//                source: function() {
//                    return result.content;
//                },
//                size: function() {
//                    return result.content.length;
//                }
//            };
//        });
//    });
}

module.exports = EJSRenderPlugin;
