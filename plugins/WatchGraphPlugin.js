function WatchGraphPlugin() {
  this.startTime = Date.now();
  this.prevTimestamps = {};
}

WatchGraphPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', function(compilation, callback) {

        var changedFiles = Object.keys(compilation.fileTimestamps).filter(function(watchfile) {
            return (this.prevTimestamps[watchfile] || this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity);
        }.bind(this));

        this.prevTimestamps = compilation.fileTimestamps;
        callback();
    }.bind(this));
};

module.exports = WatchGraphPlugin;
