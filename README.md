diskusage
=========

Simple node application to visualise disk usage on a computer. Run the following in order.

1. run: node walker.js [path]
> this creates a json representation of your file system (with the path above as root), and
> and saves it as public/xTree.json
> File sizes are in multiples of 1024. Many (eg. Macintosh) OSes follow the base 10 system, so 
> your observation might differ from what your OS tells you, but not by a lot.

2. run: node app.js
> starts a express app which reads from the xTree.json file. You should see a bubble graph like below.
  * Rendering SVG is very slow for a lot of data (or maybe I am doing something wrong)
  * Renders upto "n" levels in the same page - see call to limitDepth method.
  * GETs the next level of depth on click, after zoom.
  * Why zoom? Because its fancy :)


![alt text](https://lh3.googleusercontent.com/-TI0zTZ8TMuk/UPBRUpTmzPI/AAAAAAAACsM/Xvdrw1F4mHU/s626/filesize-bubbles.png "example")


TODO: 
* Slow performance - serve only the relevant levels



