var fs = require('fs'),
path = require('path'),
util = require('util'),
rjson = require('rjson'),
_ = require('underscore');


var start = Date.now();

function xDirTree(fileName){
    try {
        var stats = fs.lstatSync(fileName);
    } 
    catch (err) {
        console.log(err);
        return {
            path : fileName,
            name: path.basename(fileName),
            size : 0
        };
    }

    var info = {
        path : fileName,
        name: path.basename(fileName),
        size : stats.size
    };

    if(stats.isDirectory()){
        info.nodes = [];
        try {
            var children = fs.readdirSync(fileName);
        } 
        catch (err) {
            console.log(err);
            return info;
        }

        _.each(children, function(child){
            var separator = fileName[fileName.length - 1] !== "/" ? "/" : "";
            var childInfo = xDirTree(fileName + separator + child);
            info.size += childInfo.size;
            info.nodes.push(childInfo);
        });
    }
    return info;
}

var tree = xDirTree(process.argv[2]);

console.log("parent size : " + (tree.size / (1024*1024*1024)) + " GBs");
console.log("done creating tree in mem :" +  (Date.now() - start)/1000 + " seconds") ;
fs.writeFileSync("./public/xtree.json", JSON.stringify(tree));
console.log("done writing tree to file :" +(Date.now() - start)/1000 + " seconds") ;
