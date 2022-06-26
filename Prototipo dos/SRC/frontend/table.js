function getvalue(value) {
  document.getElementById('table-container').innerHTML = "";

  console.log(value);
  if (value == 'movimientos') {
    var csvfile = '../../data/movimientos.csv';

    d3.csv(csvfile, function (data) {
      var columns = ['id', 'Valor', 'SensorId', 'Time']
      tabulate(data, columns)
    })
  } else if (value == 'humedades') {
    var csvfile = '../../data/humedades.csv';
    d3.csv(csvfile, function (data) {
      var columns = ['id', 'Valor', 'SensorId', 'Time']
      tabulate(data, columns)
    })
  } else {
    console.log('no hay nada seleccionado');
  }

}

var tabulate = function (data, columns, table) {
  var table = d3.select('#table-container').append('table')

  var thead = table.append('thead')
  var tbody = table.append('tbody')

  thead.append('tr')
    .selectAll('th')
    .data(columns)
    .enter()
    .append('th')
    .text(function (d) { return d })

  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')

  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {

        return { column: column, value: row[column] }
      })
    })
    .enter()
    .append('td')
    .text(function (d) {
      if (d.column == 'Valor') {
        var att = d3.select(this);
        if (d.value < 10) {
          att.classed(att.attr("class", 'bajo'));
        } else if (d.value > 10 && d.value < 31) {

          att.classed(att.attr("class", 'medio'));
        } else {

          att.classed(att.attr("class", 'alto'));
        }

      }
      return d.value
    })

  return table;
}






