window.addEventListener('load', function() {
    ucitajPredmete();
    ucitajAktivnosti();
});


var pom=false;
var pom2=false;

function dodajAktivnost(p, callback){
    var ajax = new XMLHttpRequest();
    var naziv=document.getElementById('naziv').value;
    var tip=document.getElementById('tip').value;
    var pocetak=document.getElementById('pocetak').value;
    var kraj=document.getElementById('kraj').value;
    var dan=document.getElementById('dan').value;
    var grupa =document.getElementById('grupa').value;
    var TipId;
    var GrupaId;
    var DanId;
    var PredmetId;
    let xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
      if (this.readyState==4 && this.status == 200) {
          let v=this.responseText.toString();
         TipId= v;
      }
    };
    xhttp2.open("GET", "http://localhost:3000/v2/tipNaziv/"+tip, false);
    xhttp2.send();  
    let xhttp3 = new XMLHttpRequest();
    xhttp3.onreadystatechange  = function() {
      if (this.readyState==4 && this.status == 200) {
          let v=this.responseText.toString();   
         GrupaId= v;
      }
    };
    xhttp3.open("GET", "http://localhost:3000/v2/grupaNaziv/"+grupa, false);
    xhttp3.send();  
    let xhttp4 = new XMLHttpRequest();
    xhttp4.onreadystatechange  = function() {
      if (this.readyState==4 && this.status == 200) {
          let v=this.responseText.toString();
         DanId= v;
      }
    };
    xhttp4.open("GET", "http://localhost:3000/v2/danNaziv/"+dan, false);
    xhttp4.send();
    let xhttp5 = new XMLHttpRequest();
    xhttp5.onreadystatechange  = function() {
      if (this.readyState==4 && this.status == 200) {
          let v=this.responseText.toString();
         PredmetId= v;
      }
    };
    xhttp5.open("GET", "http://localhost:3000/v2/predmetNaziv/"+naziv, false);
    xhttp5.send();
    let aktivnost={
        naziv:naziv,
        TipId: TipId ,
        pocetak:Number(pocetak),
        kraj:Number(kraj),
        DanId: DanId,
        GrupaId: GrupaId,
        PredmetId: PredmetId
    }
    ajax.open("POST", "http://localhost:3000/v2/aktivnost", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(JSON.stringify(aktivnost));
    var odg1="Aktivnost je dodana";
   
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
            if(ajax.responseText.toString()==odg1 ){
                callback(pom, true, naziv);
            }
            else{
                callback(pom, false,naziv);
            }
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            document.getElementById("neki").innerHTML = "Greska: nepoznat URL";
    }
}

function dodajPredmet(callback){
    var pred=document.getElementById('naziv').value;
    let object = {
        naziv: pred
    };
    var xhr = new XMLHttpRequest();
    
    var odg1="Predmet je dodan";
   var odg2 ="Predmet je već u bazi"
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200){
            if(xhr.responseText.toString()==odg1 || xhr.responseText.toString()==odg2){
               callback(true);
                
            }
            else callback(false);
        }
    }
    xhr.open("POST", "http://localhost:3000/v2/predmet", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(object));
}


function FunkcijaGlavna(){
    dodajPredmet(provjeriPredmet);
}


function provjeriPredmet(ispravno){
    pom=ispravno;
    dodajAktivnost(pom, provjeriAktivnost);
}
function provjeriAktivnost(pom, ispravno,name){
    pom2=ispravno;
    funkcija(pom,pom2,name);
}

function funkcija(predmet,aktivnost,name){
    if(predmet==true && aktivnost==true){
        document.getElementById("neki").innerHTML = "Uspješno dodana aktivnost!";
    }
    else if(aktivnost==true && predmet==false){
        document.getElementById("neki").innerHTML= "Uspješno dodana aktivnost";
    }
    else if(aktivnost==false && predmet==true){
        document.getElementById("neki").innerHTML= "Aktivnost nije ispravna!";
        brisi(name);
    }
    ucitajPredmete();
    ucitajAktivnosti();
}

function brisi(name){
    var xhr1 = new XMLHttpRequest();
    xhr1.open("DELETE", "http://localhost:3000/v2/predmetNaziv/" + name, false);
    xhr1.setRequestHeader("Content-Type", "application/json");
    xhr1.send();
}

function ucitajPredmete(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() { 
        if (this.readyState==4 && this.status == 200) {
            let v=this.responseText.toString();
           
          let arr = JSON.parse(v);
          document.getElementById("sadrzaj").innerHTML="";
          let cont = document.getElementById('sadrzaj');
  
  
          let ul = document.createElement('ul');
  
          ul.setAttribute('id', 'theList');
      
          for (i = 0; i <= arr.length - 1; i++) {
              let li = document.createElement('li');    
                  li.innerHTML = arr[i].naziv;      
      
              ul.appendChild(li);    
          }
      
          cont.appendChild(ul); 
        }
    };
    xhttp.open("GET", "http://localhost:3000/v2/predmeti", true);
    xhttp.send(); 
}

function ucitajAktivnosti(){
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState==4 && this.status == 200) {
          let v=this.responseText.toString();
        let arr = JSON.parse(v);
        document.getElementById("sadrzaj1").innerHTML="";
        let cont = document.getElementById('sadrzaj1');

        let ul = document.createElement('ul');
        ul.setAttribute('id', 'theList');
    
        for (i = 0; i <= arr.length - 1; i++) {
            let li = document.createElement('li');     
            li.innerHTML = arr[i].naziv + ' ' ;
             dodajTip(li,arr[i].TipId);
             dodajDan(li,arr[i].DanId);
             li.innerHTML+= ', ' +  arr[i].pocetak + ' - ' + arr[i].kraj + ' h';     
    
            ul.appendChild(li);   
        }
    
        cont.appendChild(ul); 
      }
    };
    xhttp.open("GET", "http://localhost:3000/v2/aktivnosti", true);
    xhttp.send();    
}

function dodajTip (li,tipId) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState==4 && this.status == 200) {
          let v=this.responseText.toString();
        let arr = JSON.parse(v);
         
            li.innerHTML += ' '+ arr.naziv + ', ' ;
      }
    
    };
    xhttp.open("GET", "http://localhost:3000/v2/tip/"+tipId, false);
    xhttp.send();  
}

function dodajDan (li,danId) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState==4 && this.status == 200) {
          let v=this.responseText.toString();
        let arr = JSON.parse(v);
         
            li.innerHTML += ' '+ arr.naziv + ' ' ;
      }
    
    };
    xhttp.open("GET", "http://localhost:3000/v2/dan/"+danId, false);
    xhttp.send();  
}


