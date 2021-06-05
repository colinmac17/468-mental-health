class PieChartMaker {

    constructor() {
        this.PieDispatch = d3.dispatch("clicked");
    }

    drawPieChart() {

        var width = 450;
        var height = 450;
        var margin = 100;

        var radius = Math.min(width, height) / 2 - margin

        // Create svg with the origin translated to the center
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Adding Title
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0 - height / 2 + 25)
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Diagnosed Anxiety and/or Mood Disorders Versus Other")

        // Adding data descriptions
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0 - height / 2 + 45)
            .style("text-anchor", "middle")
            .style("font-size", "13px")
            .text("Anxiety Disorder: Generalized, Social, Phobia, etc")
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0 - height / 2 + 65)
            .style("text-anchor", "middle")
            .style("font-size", "13px")
            .text("Mood Disorder: Depression, Bipolar Disorder, etc")

        // Just hardcoded the data for now, since its only two values    
        var data = { "Anxiety and/or Mood Disorder": 632, "Other": 84 }

        // set the color scale
        var color = d3.scaleOrdinal()
            .domain(data)
            .range(["#4393c3", "#d6604d"]);

        // Compute the position of each group on the pie:
        var pie = d3.pie()
            .value(function (d) { return d.value; })
        var data_ready = pie(d3.entries(data))
        // Now I know that group A goes from 0 degrees to x degrees and so on.

        // shape helper to build arcs:
        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        // Get Dispatch
        var dispatch = this.PieDispatch;

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
            .selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function (d) { return (color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .on("click", function (d) {
                dispatch.call("clicked", {}, d.data.key);
            })

        // Now add the annotation. Use the centroid method to get the best coordinates
        svg
            .selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function (d) { return d.data.key })
            .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .style("font-size", 12)
    }
}