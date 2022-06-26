function addTo() {
  //en la e estara o "humedades"o "movimientos"
  document.getElementById('table-container').innerHTML = "";
  document.getElementById('d3-container').innerHTML = "";
  var comboSelected = document.getElementById("combo").value;


  if (comboSelected == 'movimientos') {
    drawdiagramm('../../data/movimientos.csv');
    getvalue(comboSelected);

  } else if (comboSelected == 'humedades') {
    drawdiagramm('../../data/humedades.csv');
    getvalue(comboSelected);
  }

}