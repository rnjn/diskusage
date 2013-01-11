var breadcrumbs = function(path) {
  var createLink = function(link, text) {
      var a = document.createElement('a');
      a.innerHTML = text + " ";
      a.href = "/?dir=" + link;
      return a;
    };

  if(!path) {
    return;
  }

  var steps = _.without(path.split("/"), "");

  var paths = _.map(steps, function(step, index) {
    return '/' + steps.slice(0, index + 1).join('/');
  });

  steps = ["/"].concat(steps);
  paths = ["/"].concat(paths);

  _.each(steps, function(step, index) {
    var link = createLink(paths[index], step);
    document.getElementById("breadcrumbs").appendChild(link);
  });

  };


var findNode = function(data, path) {
    if(path === data.path) return data;
    if(!data.nodes) return data;

    var node = _.find(data.nodes, function(n) {
      return path.indexOf(n.path) !== -1;
    });

    return node ? findNode(node, path) : data;
  };

var immediateChildren = function(data) {
    if(!data.nodes) return data;

    var d = {
      name: data.name,
      size: data.size,
      nodes: [],
      path: data.path,
      hiddenNodes: []
    };

    for(var i = 0; i < data.nodes.length; i++) {
      d.nodes.push({
        name: data.nodes[i].name,
        size: data.nodes[i].size,
        path: data.nodes[i].path,
        hiddenNodes: data.nodes[i].nodes
      });
    }

    return d;
  };

var limitDepth = function(data, depth) {
    if(!data.nodes) return data;
    if(depth == 1) return immediateChildren(data);

    var d = {
      name: data.name,
      size: data.size,
      path: data.path,
      nodes: []
    };
    for(var i = 0; i < data.nodes.length; i++) {
      d.nodes.push(limitDepth(data.nodes[i], depth - 1));
    }
    return d;
  };

var getReadableFileSize = function(bytes) {
    var i = -1,
      size = bytes;
    var byteUnits = [' kB', ' MB', ' GB'];
    do {
      size = size / 1024;
      i++;
    } while (size > 1024);

    return Math.max(size, 0.1).toFixed(1) + byteUnits[i];
  };

var getFolderText = function(d) {
    var fileSize = getReadableFileSize(d.size);
    return d.name + "(" + fileSize + ")";
  };

var w = 1280,
  h = 800,
  r = 800,
  x = d3.scale.linear().range([0, r]),
  y = d3.scale.linear().range([0, r]),
  node, root;

var pack = d3.layout.pack().size([r, r]).value(function(d) {
  return d.size;
}).children(function(d) {
  return d.nodes;
});

var svg = d3.select("div#pack")
.insert("svg:svg", "h2")
.attr("width", w)
.attr("height", h)
.append("svg:g")
.attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");



var zoom = function(d) {
    var k = r / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);

    var t = svg.transition().duration(1000);

    t.selectAll("circle").attr("cx", function(d) {
      return x(d.x);
    }).attr("cy", function(d) {
      return y(d.y);
    }).attr("r", function(d) {
      return k * d.r;
    });

    t.selectAll("text").attr("x", function(d) {
      return x(d.x);
    }).attr("y", function(d) {
      return y(d.y);
    }).style("opacity", function(d) {
      return k * d.r > 20 ? 1 : 0;
    });

    node = d;
    d3.event.stopPropagation();
  };


var renderData = function(data) {
    var childNode = findNode(data, document.getElementById("dir").value);
    node = root = limitDepth(childNode, 1);

    var nodes = pack.nodes(root);

    //draw all circles
    svg.selectAll("circle").data(nodes).enter().append("svg:circle").attr("class", function(d) {
      return d.hiddenNodes ? "parent" : "child";
    }).attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("r", function(d) {
      return d.r;
    }).on("click", function(d) {
      if(node.name == d.name) window.location = "./?dir=" + d.path;
      return zoom(d);
    }).append("svg:title").text(function(d) {
      return d.path;
    });

    //write all the lables
    svg.selectAll("text").data(nodes).enter().append("svg:text").attr("class", function(d) {
      return d.hiddenNodes ? "parent" : "child";
    }).attr("x", function(d) {
      return d.x;
    }).attr("y", function(d) {
      return d.y;
    }).attr("dy", ".35em").attr("text-anchor", "middle").style("opacity", function(d) {
      return d.r > 20 ? 1 : 0;
    }).text(getFolderText);

    d3.select(window).on("click", function() {
      zoom(root);
    });
  };



d3.json("/xtree.json", renderData);
breadcrumbs(document.getElementById("dir").value);
