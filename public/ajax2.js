window.addEventListener('load',function () {
    staviGrupeUselect();

});

function staviGrupeUselect() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload=function() {
        if (this.readyState==4 && this.status==200){
            let res=this.responseText.toString();
        let rez = JSON.parse(res);
        let body = document.getElementById("studentibody");
        let div = document.getElementById("div");
        let select = document.createElement('select');
        select.setAttribute('id','grupe');
        select.id="grupe";
        for (let i =0;i<rez.length;i++){
            let option = document.createElement('option');
            option.value=rez[i].id;
        option.innerHTML=rez[i].naziv;
    select.appendChild(option);        
        }
        div.appendChild(select);
        body.appendChild(div);
    }
};
xhttp.open("GET","http://localhost:3000/v2/grupe",true);
xhttp.send();
} 

function FunkcijaGlavna() {
    let selektnovani = document.querySelector("grupe");
    let grupa = selektnovani.value;
let sviStudenti = document.getElementById("textarea").value.toString();
let studenti = sviStudenti.split('\n');
let objekti = [];
for (let i=0;i<studenti.length;i++){
    let atr = studenti[i].split(',');
    let objekt = {
        ime: atr[0],
        index:atr[1],
        grupa: grupa
    }
    objekti.push(objekt);
}
let sviJsonSutdenti = JSON.stringify(objekti);
dodajStudente(sviJsonSutdenti);
}


function dodajStudente (studenti) {
   let textarea = document.getElementById("textarea");
    let xhttp = new XMLHttpRequest();
   
    xhttp.open("GET", "http://localhost:3000/v2/student", false);
    xhttp.send(); 
    xhttp.onreadystatechange  = function() {
        if (this.status == 200) {
            let v=this.responseText.toString();
           textarea.value=v;
        }
      };
}
