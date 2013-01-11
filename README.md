diskusage
=========

Simple node application to visualise disk usage on a computer. Run the following in order.

1. run: node walker.js [path]
> this creates a json representation of your file system (with the path above as root), and
> and saves it as public/xTree.json

2. run: node app.js
> starts a express app which reads from the xTree.json file. You should see a bubble graph.
  * Rendering SVG is very slow for a lot of data (or maybe I am doing something wrong)
  * Renders upto "n" levels in the same page - see call to limitDepth method.
  * GETs the next level of depth on click, after zoom.
  * Why zoom? Because its fancy :)

TODO: 
* Slow performance - serve only the relevant levels



