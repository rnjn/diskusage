var fs = require('fs'),
path = require('path'),
util = require('util'),
rjson = require('rjson');

var start = Date.now();

function dirTree(filename) {
    var stats = fs.lstatSync(filename),
    i = {
        path: path.basename(filename),
        size: stats.size
    };

    if (stats.isDirectory()) {
        i.type = "d";
        i.nodes = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
       
    } else {
        i.type = "f";
    }
    return i;
}

function totalSize(node){
    var folderSize = node.size;
    if(!node.nodes) return folderSize;
    for(var i = 0; i < node.nodes.length; i++){
        var child = node.nodes[i];
        if(node.type === "f") {
            folderSize += child.size;
        }
        else{
            child.folderSize = totalSize(child);
            folderSize += child.folderSize;
        }
    }
    return folderSize 
}


var tree = dirTree(process.argv[2]);

tree.folderSize = totalSize(tree);



fs.writeFileSync("tree.json", rjson.pack(util.inspect(tree, false, null)));

console.log((Date.now() - start)/1000 + " seconds") ;
