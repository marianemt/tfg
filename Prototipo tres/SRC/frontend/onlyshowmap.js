const iconwidthheight = 32;
const sensorcoordinates = [
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d1", sensor: "<ID_sensor_1>", sensorshortname: "sensor_1", x: 180, y: 180 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d2", sensor: "<ID_sensor_2>", sensorshortname: "sensor_2", x: 180, y: 380 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d3", sensor: "<ID_sensor_3>", sensorshortname: "sensor_3", x: 180, y: 580 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d4", sensor: "<ID_sensor_4>", sensorshortname: "sensor_4", x: 520, y: 130 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d5", sensor: "<ID_sensor_5>", sensorshortname: "sensor_5", x: 430, y: 270 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d6", sensor: "<ID_sensor_6>", sensorshortname: "sensor_6", x: 430, y: 410 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d7", sensor: "<ID_sensor_7>", sensorshortname: "sensor_7", x: 430, y: 560 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d8", sensor: "<ID_sensor_8>", sensorshortname: "sensor_8", x: 680, y: 270 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d9", sensor: "<ID_sensor_9>", sensorshortname: "sensor_9", x: 680, y: 410 },
    { id: "daf9edd7-b5c2-4c63-81fc-dca7eb6bd8d0", sensor: "<ID_sensor_10>", sensorshortname: "sensor_10", x: 680, y: 560 },
];
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

//?date=2022-05-18&time1=11:30:00&time2=11:45:00
// recuperamos el querystring

const parameters = window.location.search;
console.log(parameters);

const url = new URL('http://localhost' + parameters);

var getdate = "2022-05-18";
var gettime1 = "10:30:00";
var gettime2 = "10:45:00";

if (url.searchParams.has('date')) getdate = url.searchParams.get('date');
if (url.searchParams.has('time1')) gettime1 = url.searchParams.get('time1') + ':00';
if (url.searchParams.has('time2')) gettime2 = url.searchParams.get('time2') + ':00';

console.log(getdate, gettime1, gettime2);

var h1 = document.getElementById('topheading');
h1.innerHTML = getdate + " " + gettime1 + ' - ' + gettime2;


/*var result = parameters.replace('?', '').split('&')
   .map(param => param.split('=')).forEach(item)
console.log(result);*/

var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
//done von bis aus Parameter in URL
const timefrom = parseDate(getdate + ' ' + gettime1);
const timeto = parseDate(getdate + ' ' + gettime2);

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(32," + (height / 2) + ")"),
    map = d3.floorplan(); // initialize floor plan



const csvfilename = "../../data/movimientos.csv";

d3.csv(csvfilename,
    function (d) {
        //console.log(d);
        //return d;
        var datevar = new Date(d.Time);
        //console.log(datevar);
        return { time: d3.timeFormat("%Y-%m-%d %H:%M:%S")(datevar), yval: d.Valor - 0, sensor: d.SensorId }

    },
    function (data) {
        // format the data

        data.forEach(function (d) {
            d.time = parseDate(d.time); //aus String wird echter Datentyp timestamp
        });

        data.sort((a, b) => a.time - b.time);//Chronologisch sortieren

        console.log(data);

        ///FILTER ARRAY
        const filtereditems = data.filter((item) => {
            //console.log(item.time, item.time > timeto, timeto);
            return (item.time > timefrom) && (item.time < timeto)  // nur die Zeilen bleiben die True ergeben
        });
        console.log("Gefiltert nach Zeit");
        console.log(filtereditems);


        // group the data
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.sensor; }) //jeder sensor hat sein eLinie
            .entries(filtereditems);

        console.log(sumstat);

        // Set data
        var mapdata = {
            floors: [
                {
                    id: "f5f7f0c7-8118-4c6e-8d2d-36116d32833f",
                    name: "Floor 1",
                    image: {
                        url: "../../data/plano3.png",
                        x: 0,
                        y: 0,
                        w: 866,
                        h: 853
                    },
                    zones: [
                    ],
                    sensors: [
                    ]
                }
            ]
        };

        sensorcoordinates.forEach((sensorfixed) => {
            var founditem = sumstat.find((sensoritems) => {
                return sensoritems.key === sensorfixed.sensor; // erste wo es wahr ist
            });
            var urlimage = "../../data/images/whitecircle.png";
            var sensorvaluemiddle = "n/a";

            if (founditem !== undefined) {

                //durchschnitt der Messwerte berechnen
                var i = 0;
                var summe = 0;
                founditem.values.forEach((value) => {
                    summe += value.yval;
                    i++;
                })
                sensorvaluemiddle = summe / i;
                if (sensorvaluemiddle < 25) {
                    urlimage = "../../data/images/greencircle.png";
                } else if (sensorvaluemiddle > 75) {
                    urlimage = "../../data/images/redcircle.png";
                } else {
                    urlimage = "../../data/images/orangecircle.png";
                }
            }
            mapdata.floors[0].sensors.push(
                {
                    id: sensorfixed.id,
                    name: sensorfixed.sensor,
                    value: sensorvaluemiddle,
                    output: sensorfixed.sensorshortname + ': ' + sensorvaluemiddle,
                    url: urlimage,
                    x: sensorfixed.x,
                    y: sensorfixed.y,
                    w: iconwidthheight,
                    h: iconwidthheight
                });

        })

        // Load Floor image layers
        map.imageLayers(svg, mapdata.floors);
        // Load default polygons.
        //map.zonePolygons(svg, mapdata.floors[0].zones);

        // Load and Draw sensors
        mapdata.floors[0].sensors.forEach(function (sensor) {
            new map.sensorImageLayer(svg, mapdata.floors[0], sensor);
        });

        // Draw Zone function
        // Draw Sensor Image function
        // Show data
        //$('#mapdata').html(library.json.prettyPrint(mapdata));

        // Helper to automatically refresh data
        // Helper to splice json array
        function findAndRemove(array, property, value) {
            array.forEach(function (result, index) {
                if (result[property] === value) {
                    //Remove from array
                    array.splice(index, 1);
                }
            });
        }

        // Helper to add uuids
        function uuid() {
            var uuid = "", i, random;
            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;

                if (i == 8 || i == 12 || i == 16 || i == 20) {
                    uuid += "-"
                }
                uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
            }
            return uuid;
        }


        //Ausgabe der Werte in Tabelle
        function encodeHTMLEntities(text) {
            var textArea = document.createElement('textarea');
            textArea.innerText = text;
            return textArea.innerHTML;
        }



        function buildTable(data) {
            var table = document.getElementById('myTable')

            for (var i = 0; i < data.length; i++) {
                data[i].values.forEach((item) => {
                    var row = `<tr>
                <td> ${encodeHTMLEntities(item.sensor)}</td>
                <td>${item.time.toLocaleString()}</td>
                <td class="text-right">${item.yval}</td>
                </tr>`;
                    table.innerHTML += row
                })
            }
        }

        const sumstatsort = sumstat.sort((a, b) => {
            namealszahla = parseInt(a.key.substr(11, 2));
            namealszahlb = parseInt(b.key.substr(11, 2));
            if (namealszahla < namealszahlb) return -1;
            return 1;

            // wenn negativ a vor b, wenn positiv a nach b, wenn gleich keine reihenfolgeänderung
        });

        buildTable(sumstatsort);


    });

// Uncomment for testing
//
// map.drawText(g, alphabet);
// Grab a random sample of letters from the alphabet, in alphabetical order.
// d3.interval(function() {
//     map.drawText(g, d3.shuffle(alphabet)
//         .slice(0, Math.floor(Math.random() * 26))
//         .sort());
// }, 1500);