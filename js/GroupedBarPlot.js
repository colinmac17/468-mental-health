class GroupedBarPlot {

    constructor(){
        this.BarPlotDispatch = d3.dispatch("clicked")
    }

    drawGroupedBarPlot(){

        let margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        let svg = d3.select("#group-bar-chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        let dispatch = this.BarPlotDispatch

        d3.csv("/data/prevalence_mental-health_disorders.csv", function(data) {

            //Get the types of disorders
            let populations = data.columns.slice(1)

            //Get the population types
            let disorders = d3.map(data, function(d){return(d.Disorder)}).keys()

            // Add the X axis
            let x = d3.scaleBand()
                .domain(disorders)
                .range([0, width])
                .padding([0.2])
                svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0));

            let y = d3.scaleLinear()
                .domain([0, 40])
                .range([ height, 0 ]);
                svg.append("g")
                    .call(d3.axisLeft(y));

            let xSubgroup = d3.scaleBand()
                .domain(populations)
                .range([0, x.bandwidth()])
                .padding([0.05])
                
            //Add Color
            let color = d3.scaleOrdinal()
                .domain(populations)
                .range(['#2563EB','#DBEAFE'])


            //Create a tooltip
            let tooltip = d3.select("#group-bar-chart")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")


                // Three function that change the tooltip when user hover / move / leave a cell
                let mouseover = function(d) {
                    let disorder;
                    let k = d.key
                    //This is to get the disorder
                    data.forEach(dat => {
                        if(dat[k] == d.value){
                            console.log(dat["Disorder"])
                            disorder = dat["Disorder"]
                        }
                    })
                    tooltip
                        .html("<b class='text-blue-800'>" + disorder + "</b> in the " + "<b>" + d.key + "</b><br>" + "Prevalence: " + d.value + "%")
                        .style("opacity", 1)
                }
                let mousemove = function(d) {
                    tooltip
                    .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    .style("top", (d3.mouse(this)[1]) + "px")
                }
                let mouseleave = function(d) {
                    tooltip
                    .style("opacity", 0)
                }

            svg.append("g")
                .selectAll("g")
                // Enter in data = loop group per group
                .data(data)
                .enter()
                .append("g")
                  .attr("transform", function(d) { return "translate(" + x(d.Disorder) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return populations.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                  .attr("x", function(d) { return xSubgroup(d.key); })
                  .attr("y", function(d) { return y(d.value); })
                  .attr("width", xSubgroup.bandwidth())
                  .attr("height", function(d) { return height - y(d.value); })
                  .attr("fill", function(d) { return color(d.key); })
                  .on("click", function (d) {
                    dispatch.call("clicked", {}, {population: d.key, percentage: d.value});
                  })
                  .on("mouseover", mouseover)
                  .on("mousemove", mousemove)
                  .on("mouseleave", mouseleave)
        })

        

    }


}
