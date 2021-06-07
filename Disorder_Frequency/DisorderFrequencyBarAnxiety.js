var drawSortBarAnxiety = function(svg, data, x, y, height) {

  x.domain(data.map(function(d) { return d.Position; }));

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
      .attr("x", function(d) { return x(d.Position); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return height - (d.Count); })
      .attr("height", function(d) { return (d.Count); });

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.Count - a.Count; }
        : function(a, b) { return d3.ascending(a.Position, b.Position); })
        .map(function(d) { return d.Position; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.Position) - x0(b.Position); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.Position); });

    transition.select(".x.axis")
        .call(d3.axisBottom(x))
      .selectAll("g")
        .delay(delay);
  }
};