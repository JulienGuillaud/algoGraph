function createSVG(lesNodes, lesLinks) {
    // set up SVG for D3
    var width = 960,
        height = 500,
        colors = function() { return "#FFF"; }; //d3.scale.category10();

    var svg = d3.select('#graphSVG')
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 -150 800 800") // 0 0 700 700
        .attr('width', width)
        .attr('height', height);

    var nodes = lesNodes;
    var links = lesLinks;

    // init D3 force layout
    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .linkDistance(150)
        .charge(-500)
        .on('tick', tick)


    // handles to link and node element groups
    var path = svg.append('svg:g').selectAll('path'),
        circle = svg.append('svg:g').selectAll('g');

    // define arrow markers for graph links
    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#000');

    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow-blue')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#0030ff');

    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', '#000');
    // mouse event vars
    var selected_node = null,
        selected_link = null,
        mousedown_link = null,
        mousedown_node = null,
        mouseup_node = null;

    function resetMouseVars() {
        mousedown_node = null;
        mouseup_node = null;
        mousedown_link = null;
    }

    // update force layout (called automatically each iteration)
    function tick() {
        path.attr('id', function(d) {
            return d.value
        });
        
        path.attr('data', function(d) {
            return d.data
        });
        
        path.attr('d', function(d) {
            var x1 = d.source.x,
                y1 = d.source.y,
                x2 = d.target.x,
                y2 = d.target.y,
                dx = x2 - x1,
                dy = y2 - y1,
                dr = Math.sqrt(dx * dx + dy * dy),
                normX = dx / dr,
                normY = dy / dr,
                targetPadding = d.right ? 38 : 30,
                targetX = d.target.x - (targetPadding * normX),
                targetY = d.target.y - (targetPadding * normY);

            // Defaults for normal edge.
            drx = dr,
            dry = dr,
            xRotation = 0, // degrees
            largeArc = 0, // 1 or 0
            sweep = 1; // 1 or 0

            // Self edge.
            if (x1 === x2 && y1 === y2) {
                // Fiddle with this angle to get loop oriented.
                xRotation = -45;

                // Needs to be 1.
                largeArc = 1;
                // Change sweep to change orientation of loop. 
                //sweep = 0;
                drx = 30;
                dry = 20;
                x2 = x2 + 10;
                y2 = y2 + 10;
                return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
            }
            //                                                                                                            x2             y2
            return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + targetX + "," + targetY;
        });

        circle.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });
    }

    // update graph (called when needed)
    function restart() {
        // path (link) group
        path = path.data(links);

        // update existing links
        path.classed('selected', function(d) { return d === selected_link; })
            .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
            .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });


        // add new links
        path.enter().append('svg:path')
            .attr('class', 'link')
            .classed('selected', function(d) { return d === selected_link; })
            .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
            .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })


        // remove old links
        path.exit().remove();


        // circle (node) group
        // NB: the function arg is crucial here! nodes are known by id, not by index!
        circle = circle.data(nodes, function(d) { return d.id; });

        // update existing nodes (reflexive & selected visual states)
        circle.selectAll('circle')
            .style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).darker().toString() : colors(d.id); })
            .classed('reflexive', function(d) { return d.reflexive; });

        // add new nodes
        var g = circle.enter().append('svg:g');

        g.append('svg:circle')
            .attr('class', 'node')
            .attr('r', 30)
            .style('fill', function(d) { return "rgb(255 255 255 / 100%)" })
            .style('stroke', function(d) { return "rgb(227 227 227)" })
            .style('stroke-width', function(d) { return "3px" })
            .classed('reflexive', function(d) { return d.reflexive; })

        // show node IDs
        g.append('svg:text')
            .attr('x', 0)
            .attr('y', 4)
            .attr('class', 'id')
            .style('font-size', function(d) { return "10px" })
            .text(function(d) { return d.id; });

        // remove old nodes
        circle.exit().remove();

        // set the graph in motion
        force.start();
    }

    function mousedown() {
        if (document.activeElement.id == "graphSVG") {
            // prevent I-bar on drag
            //d3.event.preventDefault();

            // because :active only works in WebKit?
            circle.call(force.drag);
            svg.classed('ctrl', true);
            svg.classed('active', true);

            if (d3.event.ctrlKey || mousedown_node || mousedown_link) return;
        }
    }

    function mousemove() {
        if (document.activeElement.id == "graphSVG") {
            if (!mousedown_node) return;

            // update drag line
            drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

            restart();
        }
    }

    function mouseup() {
        if (document.activeElement.id == "graphSVG") {

            if (mousedown_node) {
                // hide drag line
                drag_line
                    .classed('hidden', true)
                    .style('marker-end', '');
            }

            // because :active only works in WebKit?
            svg.classed('active', false);

            // clear mouse event vars
            resetMouseVars();
        }
    }

    function spliceLinksForNode(node) {
        var toSplice = links.filter(function(l) {
            return (l.source === node || l.target === node);
        });
        toSplice.map(function(l) {
            links.splice(links.indexOf(l), 1);
        });
    }

    // only respond once per keydown
    var lastKeyDown = -1;

    function keydown() {
        if (document.activeElement.id == "graphSVG") {
            d3.event.preventDefault();

            if (lastKeyDown !== -1) return;
            lastKeyDown = d3.event.keyCode;
        }
    }

    function keyup() {
        if (document.activeElement.id == "graphSVG") {

            lastKeyDown = -1;

            // ctrl
            if (d3.event.keyCode === 17) {
                circle
                    .on('mousedown.drag', null)
                    .on('touchstart.drag', null);
                svg.classed('ctrl', false);
            }
        }
    }

    svg.classed('ctrl', true);
    svg.classed('active', true);
    // app starts here
    svg.on('mousedown', mousedown)
        .on('mousemove', mousemove)
        .on('mouseup', mouseup);
    d3.select(window)
        .on('keydown', keydown)
        .on('keyup', keyup);
    restart();
}