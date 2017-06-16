var path = require('path');
var glob = require('glob');
var fs = require('fs');
var ejs = require('ejs');
var watch = require('watch');

function EJSRenderPlugin(options) {
    //generateHTML(getEjsFullPaths());

    // for monitor
    this.startTime = Date.now();
    this.prevTimestamps = {};
}

/** return array() */
function getEjsFullPaths() {
    return glob.sync(path.join(__dirname, '../src/**/*.ejs'));
}

/** return void */
function generateHTML(paths) {
    paths.forEach( function(ejsPath) {
        var ejsContent = fs.readFileSync( ejsPath, 'utf8');
        htmlContent = ejs.render(ejsContent, { filename: 'src/partials/' });

        var relativePathEjs = ejsPath.replace(path.join(__dirname, '../'), '../');
        var relativePathHtml = relativePathEjs.replace(/\.ejs$/,'.html');
        var fullPathHtml = path.join(__dirname, relativePathHtml);

        fs.writeFileSync( fullPathHtml, htmlContent);
        console.log("[Generate HTML]: " + fullPathHtml);
    });
}

///** return void */
//function addCompilationAssets(compilation, paths = []) {
//    paths.forEach( function(ejsPath) {
//        var ejsContent = fs.readFileSync( ejsPath, 'utf8');
//        htmlContent = ejs.render(ejsContent, { filename: 'src/partials/' });
//
//        var relativePathEjs = ejsPath.replace(path.join(__dirname, '../'), '../');
//        var relativePathHtml = relativePathEjs.replace(/\.ejs$/,'.html')
//
//        compilation.assets[relativePathHtml] = {
//            source: function() {
//                return htmlContent;
//            },
//            size: function() {
//                return htmlContent.length;
//            }
//        };
//    });
//}

///** return void */
//function addAssetsToCompilation(compilation, values) {
//    values.forEach(function(val) {
//        compilation.assets[val.key] = {
//            source: function() {
//                return val.content;
//            },
//            size: function() {
//                return val.content.length;
//            }
//        };
//    });
//}

EJSRenderPlugin.prototype.apply = function(compiler) {
    console.log('Start: EJS-Render-Plugin...');
    
    var self = this;

//    compiler.plugin('compilation', function (compilation) {
//        console.log('<<<<<< compiler.pugin(\'compilation\') >>>>>>');
//
//        compilation.plugin(
//            'html-webpack-plugin-before-html-processing', 
//            function(htmlPluginData, callback) {
//                console.log('<<<<<< HTML-WEBPACK-PLUGIN-BEFORE-HTML-PROCESSING >>>>>>');
//
//                //generateHTML(getEjsFullPaths());
//
//                callback(null, htmlPluginData);
//            }
//        );
//    });

    compiler.plugin('emit', function (compilation, callback) {
        console.log('<<<<<< compiler.plugin(\'emit\') >>>>>>');

        var changedFiles = Object.keys(compilation.fileTimestamps).filter(function(watchfile) {
            return (this.prevTimestamps[watchfile] || this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity);
        }.bind(this));
        this.prevTimestamps = compilation.fileTimestamps;

//        changedFiles.forEach( v => console.log('[ChangedFiles]: ' + v));
        changedFiles = changedFiles.filter( v => (v.indexOf('.ejs') != -1));
//        changedFiles.forEach( v => console.log('[ChangedFiles](Filtered): ' + v));

        generateHTML(changedFiles);

        var targetFiles = changedFiles.length > 0 ? changedFiles : getEjsFullPaths();
        //addCompilationAssets(compilation, targetFiles);

        if(!compilation.fileDependencies) {
            compilation.fileDependencies = [];
        }

        targetFiles.forEach(function(ejsPath) {
            console.log('[fileDependencies]: ' + ejsPath);
            compilation.fileDependencies.push(ejsPath);
//            compilation.fileDependencies.push(ejsPath.replace(/\.ejs$/, '.html'));
        });


//        var changedFiles = Object.keys(compilation.fileTimestamps).filter(function(watchfile) {
//            return (this.prevTimestamps[watchfile] || this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity);
//        }.bind(this));
//        this.prevTimestamps = compilation.fileTimestamps;
//
//        if(changedFiles.length > 0 ) {
//            console.log('FileChanged!!!!!!!!!!!');
////            changedFiles.forEach( v => console.log('[ChangedFiles]: ' + v));
//            changedFiles = changedFiles.filter( v => (v.indexOf('.ejs') != -1));
////            changedFiles.forEach( v => console.log('[ChangedFiles](Filtered): ' + v));
//            //addCompilationAssets(compilation, changedFiles);
//            generateHTML(changedFiles);
//        } else {
//            console.log('File \'NOT\' Changed!!!!!!!!!!!');
//            //addAssetsToCompilation(compilation, self.render(getEjsFullPaths()));
////            generateHTML(getEjsFullPaths());
//        }
//
//        if(!compilation.fileDependencies) {
//            compilation.fileDependencies = [];
//        }
//
//        var paths = changedFiles.length > 0 ? changedFiles : getEjsFullPaths();
//        paths.forEach(function(ejsPath) {
//            console.log('[fileDependencies]: ' + ejsPath);
//            compilation.fileDependencies.push(ejsPath);
////            compilation.fileDependencies.push(ejsPath.replace(/\.ejs$/, '.html'));
//        });

        callback(null);

    }.bind(this));

}

EJSRenderPlugin.prototype.render = function(paths = []) {
    var results = []

    paths.forEach( function(ejsPath) {

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
