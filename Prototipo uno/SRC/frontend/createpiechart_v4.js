//parametros que se pueden cambiar
const csvfilename3 = "../../data/temp.csv";
// set the dimensions and margins of the graph
var margin2 = 40
    labelHeight = 18

d3.csv(csvfilename3,
    function (d) {
        //console.log(d[csvfieldname_barheight__yvalue]);
        return d;

    },
    function (data) {

    var frio = 0;
    var templado = 0;
    var caliente = 0;

    for(var i = 0; i<data.length; i++){

        if (data[i].Grados < 16 ){
            frio +=1;
        }else if(data[i].Grados > 15 && data[i].Grados< 26){
            templado +=1;
        }else{
            caliente +=1;
        }
    }
    console.log(frio);
    console.log(templado);
    console.log(caliente);

     var dataString = data[0].Time.toString();
        d3.selectAll('#temperatura h2')
        .text("Visualizar temperatura:" + " "+ dataString.substring(0, 16));


// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin2

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#temperatura")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// create 2 data_set
var data1 = {Frio: frio, Templado: templado, Caliente: caliente}
var data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(["Frio", "Templado", "Caliente"])
  .range(["#91D4FC", "#F1B67C", "#F18A7C"]);

// Handmade legend
svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#F18A7C")
svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#F1B67C")
svg.append("circle").attr("cx",200).attr("cy",190).attr("r", 6).style("fill", "#91D4FC")
svg.append("text").attr("x", 220).attr("y", 130).text("Temperatura caliente (25°, 40°)").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 160).text("Temperatura templada (25°, 15°)").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 190).text("Temperatura fria (15°, -10°)").style("font-size", "15px").attr("alignment-baseline","middle")


// A function that create / update the plot for a given variable:
function update(data) {

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  var data_ready = pie(d3.entries(data))

  // map to data
  var u = svg.selectAll("path")
    .data(data_ready)

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

    svg
        .selectAll('mySlices')
        .data(data_ready)
      .enter()
      .append('text')
      .text(function(d){ return  d.value + "%"})
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)

  // remove the group that is not present anymore
  u
    .exit()
    .remove()

}

// Initialize the plot with the first dataset
update(data1);

});