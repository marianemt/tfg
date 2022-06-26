const destcontainer = '#d3-containersensors';
const csvfieldname_xaxis = "xname";
const csvfieldname_barheight__yvalue = "yval";
const namereplace1 = "<index_";
const namereplace2 = ">";
const praefixxnames = "i_";

const margin = { top: 50, bottom: 90, left: 50, right: 50 };
const axisfontsize = '14px';
const showtooltip = true;//false;

/*
// curl Example von influxxDB Cloud https://eu-central-1-1.aws.cloud2.influxdata.com/orgs/b2b8ef5d82258fa1

curl--request POST \
https://eu-central-1-1.aws.cloud2.influxdata.com/api/v2/query?orgID=b2b8ef5d82258fa1  \
--header 'Authorization: Token ZuyBTx6eTQqfaVgWpS-gMJXduFJakGoxFgnC740pR4vC5ip0msELrC_cUYC6RwEr_9zr92tmsiG6Aaf3pCVrdg==' \
--header 'Accept: application/csv' \
--header 'Content-type: application/vnd.flux' \
--data 'from(bucket: "movimientos")
    |> range(start: 2022 - 06 - 17T00: 00: 00Z, stop: 2022 - 06 - 17T10: 00: 00Z)' > lsite4.csv


 //filter By tags possible     
from(bucket: "temperatures")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["tagkey"] == "temperture") 
  |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
  |> yield(name: "mean")


*/

const bucket = '"' + localStorage.getItem("bucketid") + '"';
console.log('bucket depends on user login:', bucket);

//const dataquest = 'from(bucket: ' + bucket + ') |> range(start: 2022-06-17T00:00:00Z, stop: 2022-06-17T10:00:00Z)'; //FLUX Query just data range 
const dataquest = 'from(bucket: ' + bucket + ') |> range(start: 2022-06-17T00:06:30Z, stop: 2022-06-17T12:00:00Z) |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)'; //FLUX Query data range with data "Downsampling" for high Volume data
//SEE Video https://youtu.be/4YaOcLdXB9s : "Kristina Robinson | Understand and Visualize Your Data with InfluxDB Cloud | InfluxDays EMEA 2021"
var csvdata;

var data0 = [];
var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
var time;
var yval;
var sensor;
var data = [];

//Use influx API V2 to Get data with AJAX, authorization with TOKEN von InfluxDB Cloud, where I have imported some Sensor Data
//https://eu-central-1-1.aws.cloud2.influxdata.com/orgs/b2b8ef5d82258fa1
d3.request('https://eu-central-1-1.aws.cloud2.influxdata.com/api/v2/query')
    .header('Authorization', 'Token ZuyBTx6eTQqfaVgWpS-gMJXduFJakGoxFgnC740pR4vC5ip0msELrC_cUYC6RwEr_9zr92tmsiG6Aaf3pCVrdg==')
    .header('Accept', 'application/csv')
    .header('Content-type', 'application/vnd.flux')
    .response(function (xhr) {
        console.log('RESPONSE');
        //console.log(xhr.responseText);
        //csvdata = d3.csvParse(xhr.responseText, row);
        data0 = d3.csvParse(xhr.responseText);
        //console.log(data);
        //Transform Data
    })
    //Dataquest is the flux query
    .post(dataquest, function (resdata) {
        console.log('POSTED', dataquest);

        //ForEach create true data convert string to numbers and dates 
        data0.forEach((item) => {
            timevar = parseDate(item._time); //datetime
            sensor = item._measurement; //String
            yval = item._value - 0; //number
            if (sensor != "") data.push({ "time": timevar, "sensor": sensor, "yval": yval });
        });

        //From here to the end teh code is the same as in the timline code where the code ciomes from local csv file

        //console.log(data1);
        data.sort((a, b) => a.time - b.time);//sort by date

        // group the data: I want to draw one line per group
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.sensor; }) //each sensor get hsi line 
            .entries(data);
        console.log(sumstat);

        const svg = d3.select(destcontainer)
            .append('svg')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom)
            .attr("viewBox", [0, 0, width, height]);

        /*const x = d3.scaleBand()
            .domain(d3.range(bardata.length))
            .range([margin.left, width - margin.right])
            .padding(0.1);*/

        /*let mydate1 = new Date("2/1/22 10:00:00");
        console.log(mydate1);
        let mydate2 = new Date("2/1/22 19:00:00");
        console.log(mydate2);*/

        var barminvalueX = d3.min(data, d => d.time); //erster Timestamp
        var barmaxvalueX = d3.max(data, d => d.time); //letzer timestamp

        var numberOfMlSeconds = barminvalueX.getTime();
        var addMlSeconds = 60 * 5000; //5min
        var barminvalueXMinus1 = new Date(numberOfMlSeconds - addMlSeconds);


        console.log("Xachse von Bis:", barmaxvalueX, barminvalueX, barminvalueXMinus1);
        var x = d3.scaleTime()
            .domain([barminvalueXMinus1, barmaxvalueX])
            //.range([0, width]);
            .range([margin.left, width - margin.right]);

        var xAxis = d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%d.%m %H:%M"))
            .ticks(20); //anzahl der Striche auf der X Achse

        var barmaxvalue = d3.max(data, d => d.yval - 0) + 5; //damit es Zahl wird
        var barminvalue = d3.min(data, d => d.yval - 0) - 5; //damit es Zahl wird
        console.log("barmaxvalue:", barmaxvalue, barminvalue);

        const y = d3.scaleLinear()
            //.domain([0, barmaxvalue])
            .domain([barminvalue, barmaxvalue])
            .range([height - margin.bottom, margin.top]);

        if (showtooltip) var tooltip = d3.select("#sensors").append("div").attr("class", "toolTip");


        function yAxis(g) {
            g.attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(y).ticks(null, data.format))
                .attr("font-size", axisfontsize);
        }

        function xAxistime(g) {
            g.attr("transform", `translate(0, ${height - margin.bottom})`)
                //.call(d3.axisBottom(x).tickFormat(i => bardata[i].xname))
                .attr("class", "x axis")
                //.attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("font-size", axisfontsize)
                .style("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");
        }


        //Draw grid lines
        var xgrid = svg.append("g")
            .attr("transform", `translate(0, ${margin.top})`)
            .call(d3.axisBottom(x).ticks(10).tickSizeInner(height - margin.bottom - margin.top))
            .attr("font-size", 0);

        var ygrid = svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisRight(y).ticks(10).tickSizeInner(width - margin.left - margin.right))
            .attr("font-size", 0);

        xgrid.selectAll("line").style("stroke", "#DFDFDF");
        xgrid.selectAll("path").style("stroke", "white");
        ygrid.selectAll("line").style("stroke", "#DFDFDF");

        //Draw axis
        svg.append("g").call(xAxistime);

        svg.append("g").call(yAxis);


        var mediaName = sumstat.map(d => d.key)
        var color = d3.scaleOrdinal().domain(mediaName).range(colorbrewer.Set2[8])


        console.log("color: ", color);

        //append legends
        var legend = d3.select("svg")
            .selectAll('g.legend')
            .data(sumstat)
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("circle")
            .attr("cx", 870)
            .attr('cy', (d, i) => i * 30 + 20)
            .attr("r", 6)
            .style("fill", d => color(d.key))

        legend.append("text")
            .attr("x", 880)
            .attr("y", (d, i) => i * 30 + 25)
            .text(d => d.key)
            .attr("font-size", axisfontsize);



        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", d => color(d.key))
            .attr("stroke-width", 1.5)

            .attr("d", function (d) {
                return d3.line()
                    .x(d => x(d.time))
                    .y(d => y(d.yval))//.curve(d3.curveCatmullRom.alpha(0.5))
                    (d.values)
            })

        //append circle 
        d3.select("svg")
            .selectAll("circle")
            .append("g")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", d => x(d.time))
            .attr("cy", d => y(d.yval))
            .style("fill", d => color(d.sensor))
            .on("mousemove", function (d) {
                var matrix = this.getScreenCTM()
                    .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));
                tooltip
                    .style("left", (window.pageXOffset + matrix.e + 15) + "px")
                    .style("top", (window.pageYOffset + matrix.f - 30) + "px")
                    //.style("left", x(d.time) + "px") //todo tooltip an richtige pos                  
                    //.style("top", y(d.yval) - 30 + "px")
                    .style("display", "inline-block")
                    .html(d3.timeFormat("%d.%m %H:%M")(d.time) + " <br><strong> " + (d.yval) + "</strong>");
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); });



        svg.node();




    });




/* Alternative Methode 1 um die daten zu holen: */
/* 
//Fetch:
fetch('https://eu-central-1-1.aws.cloud2.influxdata.com/api/v2/query', {
    method: 'POST', // or 'PUT'
    headers: {
        'Authorization': 'Token ZuyBTx6eTQqfaVgWpS-gMJXduFJakGoxFgnC740pR4vC5ip0msELrC_cUYC6RwEr_9zr92tmsiG6Aaf3pCVrdg==',
        'Accept': 'application/csv',
        'Content-type': 'application/vnd.flux'
    },
    body: dataquest,
})
    .then(response => {
        console.log('response');
        console.log('response:', response.text());
        csvdata = "";
    })
    .then(data => {
        console.log('Erfolg');
        console.log('Success:', data);
    })
    .catch((error) => {
        console.log('ERROR');
        console.error('Error:', error);
    });
    
console.log(csvdata);*/
