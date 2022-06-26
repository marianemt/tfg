const destcontainer = '#d3-containersensors';
const csvfilename = "../../data/movimientos.csv";
const csvfieldname_xaxis = "xname";
const csvfieldname_barheight__yvalue = "yval";
const namereplace1 = "<index_";
const namereplace2 = ">";
const praefixxnames = "i_";

const margin = { top: 50, bottom: 90, left: 50, right: 50 };
const axisfontsize = '14px';
const showtooltip = true;//false;



d3.csv(csvfilename,
    function (d) {
        console.log(d);
        //return d;
        var datevar = new Date(d.Time);

        console.log(datevar);
        return { time: d3.timeFormat("%Y-%m-%d %H:%M:%S")(datevar), yval: d.Valor - 0, sensor: d.SensorId }

    },
    function (data) {
        // format the data
        var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        data.forEach(function (d) {
            d.time = parseDate(d.time); //aus String wird echter Datentyp timestamp
        });



        data.sort((a, b) => a.time - b.time);//Chronologisch sortieren


        console.log(data);

        // group the data: I want to draw one line per group
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.sensor; }) //jeder sensor hat sein eLinie
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
            .attr("r", 6)
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

