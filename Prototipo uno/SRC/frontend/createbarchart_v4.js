const csvfilename1 = "../../data/precip.csv";
const csvfieldname_xaxis = "SensorMedia";
const csvfieldname_barheight__yvalue = "Milimetros";
const namereplace1 = "<ID_sensor_";
const namereplace2 = ">";
const praefixxnames = "s_";


//const width = 1200;
//const height = 450;
const margin = { top: 50, bottom: 50, left: 50, right: 50 };
const axisfontsize = '12px';
const fillcolor = 'teal';//'deeppink';//'none';
const border = '1';
const bordercolor = 'teal'; //'none';//'darkmagenta';//'royalblue';
const showtopvalues = false;
const showtooltip = true;//false;

d3.csv(csvfilename1,
    function (d) {
        //console.log(d[csvfieldname_barheight__yvalue]);
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

            var key = createsortablename(item[csvfieldname_xaxis]);
            //console.log(key);
            value = item[csvfieldname_barheight__yvalue] - 0;//entonces se convierte en un número faslls fue visto como una cadena
            //console.log(value); // AQUÍ en lugar de yval introduzca el nombre del valor en los datos csv

            if (keyvaluesdict[key] > 0) {
                keyvaluesdict[key] = value + keyvaluesdict[key];
            } else {
                keyvaluesdict[key] = value;
            }
        }
        function createsortablename(rawname) {
            //el nombre se puede ordenar mejor así
            var newname = rawname.replace(namereplace1, ""); // Aqui en vez de "<index_" lo que hay que borrar del nombre
            newname = newname.replace(namereplace2, "");
            //ahora el nombre solo tiene el número, hacemos el número con ceros a la izquierda para que se pueda ordenar
            newname = praefixxnames + newname.padStart(3, '0'); //primero una "i_" y luego el número con el cero inicial delante
            return newname;
        }

        //entonces convertimos keyvaluesdict en el array objext con los nuevos nombres y las sumas en bardata
        var obj = {};

        Object.keys(keyvaluesdict).map(function (key, index) {
            const obj = {};
            obj['xname'] = key;
            obj['yval'] = keyvaluesdict[key];
            bardata.push(obj);
        });
        console.log("BarData:");
        console.log(bardata);

        const svg = d3.select('#precipitaciones')
            .append('svg')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom)
            .attr("viewBox", [0, 0, width, height]);

        var dataString = data[0].Time.toString();
        d3.selectAll('#precipitaciones h2')
        .text("Visualizar precipitaciones:" + " "+ dataString.substring(0, 16));

        const x = d3.scaleBand()
            .domain(d3.range(bardata.length))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        console.log("barmaxvalue:");
        var barmaxvalue = (d3.max(bardata, d => d.yval));
        console.log(barmaxvalue);

        const y = d3.scaleLinear()
            .domain([0, barmaxvalue])
            .range([height - margin.bottom, margin.top]);

        if (showtooltip) var tooltip = d3.select("body").append("div").attr("class", "toolTip");

        svg
            .append("g")
            .attr("fill", fillcolor)
            .style("stroke", bordercolor)
            .style("stroke-width", border)
            .selectAll(".bar")
            .data(bardata.sort((a, b) => d3.ascending(a.xname, b.xname))) //sortiere X-Achse
            //.data(bardata.sort((a, b) => d3.descending(a.yval, b.yval))) //sortiere Y-Achse
            //.join("rect") //versions 5 and 6
            .enter().append("rect") //version 4
            .attr('title', (d) => d.yval)
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.yval))
            .attr("class", "rect")
            .attr("height", d => y(0) - y(d.yval))
            .attr("width", x.bandwidth())
            .on("mousemove", function (d) {
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 30 + "px")
                    .style("display", "inline-block")
                    .html((d.yval)+ "mm");
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

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width + 20)
            .attr("y", height -30 )
            .text("Sensores");


        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -25)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("milimetros");

        svg.append("g").call(xAxis);
        if (showtopvalues) svg.append("g").call(xAxis2);
        svg.append("g").call(yAxis);
        svg.node();

    });

