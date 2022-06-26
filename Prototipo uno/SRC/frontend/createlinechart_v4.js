const csvfilename2 = "../../data/vie.csv";
const csvfieldname_xaxis2 = "SensorMedia";
const csvfieldname_barheight__yvalue2 = "kmh";


d3.csv(csvfilename2,
    function (d) {

        return d;

    },
    function (data) {

        // format the data
      //  var chk = d3.selectAll("h2")
        //        .insert("hello");

        var keyvaluesdict = new Object();
        var bardata = [];

        data.forEach(getsum_of_csvdata); //con los datos del csvdata creamos el diccionario keyvaluesdict
        function getsum_of_csvdata(item, index, arr) {
            //arr[index] = item.yval * 10;

            var key = createsortablename(item[csvfieldname_xaxis2]);
            //console.log(key);
            value = item[csvfieldname_barheight__yvalue2] - 0;//entonces se convierte en un número faslls fue visto como una cadena
            //console.log(value); // AQUÍ en lugar de yval introduzca el nombre del valor en los datos csv

            if (keyvaluesdict[key] > 0) {
                keyvaluesdict[key] = value + keyvaluesdict[key];
            } else {
                keyvaluesdict[key] = value;
            }
        }
        function createsortablename(rawname) {
            //der name ist besser sortierbar so
            var newname = rawname.replace(namereplace1, ""); // aqui en vez de "<index_" el nombre se puede ordenar mejor así
            newname = newname.replace(namereplace2, "");
            //ahora el nombre solo tiene el número, hacemos el número con ceros a la izquierda para que se pueda ordenar
            newname = praefixxnames + newname.padStart(3, '0'); //primero una "i_" y luego el número con el cero inicial delante
            return newname;
        }
        console.log(keyvaluesdict);

        //entonces convertimos keyvaluesdict en el array objext con los nuevos nombres y las sumas en bardata
        var obj = {};

        Object.keys(keyvaluesdict).map(function (key, index) {
            const obj = {};
            obj['xname'] = key;
            obj['yval'] = keyvaluesdict[key];
            bardata.push(obj);
        });
        console.log("LineData:");
        console.log(bardata);

        var dataString = data[0].Time.toString();
        d3.selectAll('#viento h2')
        .text("Visualizar viento:" + " "+ dataString.substring(0, 16));

        const svg = d3.select('#viento')
            .append('svg')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom)
            .attr("viewBox", [0, 0, width, height]);

        //d3.range(bardata.length)
        const x = d3.scaleBand()
            .domain(d3.range(bardata.length))
            .range([margin.left, width - margin.right]);

        console.log("barmaxvalue:");
        var barmaxvalue = (d3.max(bardata, d => d.yval));
        console.log(barmaxvalue);

        const y = d3.scaleLinear()
            .domain([0, barmaxvalue])
            .range([height - margin.bottom, margin.top]);

        if (showtooltip) var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    const currentbandwidth = x.bandwidth();
    // Add the line
    svg.append("path")
      .datum(bardata.sort((a, b) => d3.ascending(a.xname, b.xname)))
      .attr('title', (d) => d.yval)
      .attr("fill", "none")
      .attr("stroke", "pink")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x((d, i) => x(i)+ currentbandwidth/2)
        .y(d => y(d.yval))
        );

                 // Circles
                svg.selectAll("mycircle")
                    .data(bardata.sort((a, b) => d3.ascending(a.xname, b.xname)))
                    .enter()
                    .append("circle")
                    .attr("cx", (d, i) => x(i) + currentbandwidth/2)
                    .attr("cy", function (d) { return y(d.yval); })
                    .attr("r", "5")
                    .style("fill", "#FFFFFF")
                    .attr("stroke", "pink")
                    .on("mousemove", function (d) {
                    tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 30 + "px")
                    .style("display", "inline-block")
                    .html((d.yval)+ "Km/h");
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); });



        function yAxis(g) {
            g.attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(y).ticks(null, bardata.format))
                .attr("font-size", axisfontsize);
        }

        function xAxis(g) {
            g.attr("transform", `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickFormat(i => bardata[i].xname))
                .attr("font-size", axisfontsize);
        }

        function xAxis2(g) {
            g.attr("transform", `translate(0, 24)`)
                .call(d3.axisBottom(x).tickFormat(i => bardata[i].yval))
                .attr("font-size", '16px');
        }
        //BIEN FUNCIONA
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height -30 )
            .text("Sensores");

        //BIEN FUNCIONA
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 30)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Km/h");

        //BIEN FUNCIONA
        svg.append("g").call(xAxis);
        if (showtopvalues) svg.append("g").call(xAxis2);
        svg.append("g").call(yAxis);
        svg.node();

    });

