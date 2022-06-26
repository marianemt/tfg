/*
function change_visualitationTEST(){
 //alert("hallo");
 parent.open('dashboard.html');
 return false;
}


function change_visualitation(){
  const check = document.querySelectorAll('input[type=checkbox]:checked');
    //var p = document.getElementById('precipitaciones');
    //var v = document.getElementById('viento');
     //var t = document.getElementById('temperatura');
     //console.log(p);

  for(var i =0; i<check.length; i++){
    if(check[i].value =='first_checkbox'){
        var p='yes';

        //window.location.href = "./dashboard.html";
       //prec.style.visibility = 'visible';
    }
    if(check[i].value == 'second_checkbox'){
            var v = 'yes';


          //vie.style.visibility = 'visible';
    }
     if(check[i].value == 'third_checkbox'){
        var t = 'yes';

       // temp.style.visibility = 'visible';
    }
  }
    //send(p,v,t);
   // window.location.href="./dashboard.html";

    parent.open('dashboard.html');
    return false;
}

function send(p,v,t){
    alert(p);
     var p1 = document.getElementById('precipitaciones');
    var v1 = document.getElementById('viento');
     var t1 = document.getElementById('temperatura');
     p1.style.visibility = 'visible';
     v1.style.visibility = 'visible';
     t1.style.visibility = 'visible';
}*/



var optionform = document.querySelector('form');
optionform.addEventListener('submit', event => {
    event.preventDefault();
    var checkElements = optionform.querySelectorAll('input[type=checkbox]:checked');
    var querystr = "";
    checkElements.forEach(
        function (input) {
            var emptystr = querystr.localeCompare("");
            if (emptystr == 0) {
                querystr += '?';
            } else {
                querystr += '&';
            }
            querystr += input.name + '=' + input.value;
        }
    );

    window.location.href = 'dashboard.html' + querystr;
})

