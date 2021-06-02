var drawSortBar = function(svg, data) {

  x.domain(data.map(function(d) { return d.Diagnosis; }));

  svg.append("g")
	  .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
      .enter()
	  .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Diagnosis); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return height - (d.Total); })
      .attr("height", function(d) { return (d.Total); });

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.Total - a.Total; }
        : function(a, b) { return d3.ascending(a.Diagnosis, b.Diagnosis); })
        .map(function(d) { return d.Diagnosis; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.Diagnosis) - x0(b.Diagnosis); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.Diagnosis); });

    transition.select(".x.axis")
        .call(d3.axisBottom(x))
      .selectAll("g")
        .delay(delay);
  }
};