function iscrtajRaspored(div,dani,satPocetak,satKraj) {
   /*
   Funkcija iscrtajRaspored(div,dani,satPocetak,satKraj) dodaje u element čija referenca je prvi parametar funkcije tabelu koja ima nazive
    dana iz niza dani - drugi parametar i čije kolone počinju od satPocetak do satKraj. 
   Funkcija u div ispisuje tekst “Greška”, ako je satPocekat>=satKraj i ako satPocetak i satKraj nisu cijeli brojevi od 0 do 24. 
   */
  
  if (!Number.isInteger(satPocetak) || !Number.isInteger(satKraj) || satPocetak>=satKraj || (satPocetak>24 || satPocetak<0) || (satKraj>24 || satKraj<0)) {
 
  var output = "Greška";
  div.innerHTML = output;
 
  } 
  else {
      var sat=satPocetak;
  // kreiramo tabelu
  var tabela = document.createElement("table");
  tabela.classList.add("tabelaRaspored");
  var tijeloTabele = document.createElement("tbody");
 
  for (var i=0;i<dani.length+1;i++){
    var red=document.createElement("tr");
    if (dani.length==0) {
        tabela.classList.add("JediniRedUTabeli");
    }
 for (var j=0;j<2*(satKraj-satPocetak+1)+2;j++){
    var polje = document.createElement("th");
    if (i==0) {
    if (j==0){
        polje.classList.add("prvoPolje");
           polje.colSpan=9;
        var poljeSadrzaj = document.createTextNode("");
        polje.appendChild(poljeSadrzaj);
    }

  else  if (j==1){
            polje.classList.add("prviRedPocetak");
           
        if (sat== 0 || sat==2 || sat==4 || sat==6 || sat==8 || sat==10 || sat==12 || sat==15 || sat==17 || sat==19 || sat==21 || sat==23) {
            var poljeSadrzaj=document.createTextNode(sat+":00");
            polje.appendChild(poljeSadrzaj);
            sat=sat+0.5;
        }
        else {  var poljeSadrzaj = document.createTextNode("");
        polje.appendChild(poljeSadrzaj);
        sat=sat+0.5;
    }
        }
 else if (j==2*(satKraj-satPocetak+1)+1) {
    polje.classList.add("prviRed");
    var poljeSadrzaj = document.createTextNode("");
    polje.appendChild(poljeSadrzaj);
 }
    else   { 
        if (sat==satKraj){
            polje.classList.add("prviRed");
    var poljeSadrzaj = document.createTextNode("");
    polje.appendChild(poljeSadrzaj);
        }
  else  if(Number.isInteger(sat)) {
       polje.classList.add("prviRed");
       if (sat== 0 || sat==2 || sat==4 || sat==6 || sat==8 || sat==10 || sat==12 || sat==15 || sat==17 || sat==19 || sat==21 || sat==23) {
        var poljeSadrzaj=document.createTextNode(sat+":00");
        polje.appendChild(poljeSadrzaj);
        sat=sat+0.5;
    }
    else {
         var poljeSadrzaj = document.createTextNode("");
    polje.appendChild(poljeSadrzaj);
    sat=sat+0.5;
}
    
   }
   else {
    polje.classList.add("prviRed");
    var poljeSadrzaj = document.createTextNode("");
    polje.appendChild(poljeSadrzaj);
    sat=sat+0.5;
   }

    }  
   
    
 }
 
    
 else {
     polje = document.createElement("td");
         if (j==0){
            polje.classList.add("daniUSedmici");
            polje.colSpan = 10
            var poljeSadrzaj = document.createTextNode(dani[i-1]);
            polje.appendChild(poljeSadrzaj);
         }
         else if (j==2*(satKraj-satPocetak+1)+1) break;
         else if (j%2!=0){
            polje.classList.add("isprekidane");
            var poljeSadrzaj = document.createTextNode("");
            polje.appendChild(poljeSadrzaj);
            }
            else if ( j%2==0) {
                polje.classList.add("pune");
                var poljeSadrzaj = document.createTextNode("");
                polje.appendChild(poljeSadrzaj);
            }
         
     
        
         
     }
     red.appendChild(polje); 
    }
  // dodajemo red tabeli
  tijeloTabele.appendChild(red);
  }


// stavljamo tijelo tabele u tabelu 
tabela.appendChild(tijeloTabele);
//stavljamo tabelu u tijelo diva
// stavljamo body u div 
div.appendChild(tabela); 
  }
  } 

  

 

/*
Funkcija dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj,dan) dodaje aktivnost u kreirani raspored čija referenca je prvi parametar funkcije.
 Ukoliko je raspored null ili nije kreiran trebate ispisati tekst “Greška - raspored nije kreiran” u vidu alert-a.
 Parametar naziv predstavlja naziv predmeta, tip je tip aktivnosti, vrijemePocetak je broj od 0 do 24 koji 
 ili je cijeli broj ili ima decimalni dio 5 npr za pola 1 vrijemePocetak=12.5. 
 Parametar vrijemeKraj ima isti oblik kao vrijemePocetak stim da treba biti veći od vrijemePocetak. 
 Ako vremena nisu validna ili ako već postoji termin koji se djelimično ili
  u potpunosti preklapa sa terminom kojeg pokušavamo dodati ispišite “Greška - već postoji termin u rasporedu u zadanom vremenu” 
  ili “Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin“ u vidu alert-a. */


function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan) {
    if (raspored == null || raspored.innerHTML.trim().length == 0) {
    alert("Greška - raspored nije kreiran");
    return;
    } 
    else if (vrijemeKraj<=vrijemePocetak ) {
        alert("Greška - vremena nisu validna");
    return;
    }
  else if ( !Number.isInteger(vrijemePocetak) || !Number.isInteger(vrijemeKraj)  ) {
      if (vrijemePocetak%0.5!=0 || vrijemeKraj%0.5!=0) {
    alert("Greška - vremena nisu validna");
   return;
      }
   }
   var dani = raspored.getElementsByClassName("daniUSedmici");
   if (!danJeURasporedu(dani,dan)) {
    alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
    return;
   }
   var sati = raspored.getElementsByTagName("th");
   if (!satJeURasporedu(sati,vrijemePocetak) || !satJeURasporedu(sati,vrijemeKraj)) {
    alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
    return;
   } 
   var prvobitnaPozicija = 2*(vrijemePocetak-pocetni(sati))+1;
   var pozicija =2*(vrijemePocetak-pocetni(sati))+1;
   var redovi = raspored.getElementsByTagName("tr");
   for (var i=0;i<redovi.length;i++){
       if (i==0) continue;
       else {
           var polja = redovi[i].getElementsByTagName("td");
           
           if (polja[0].textContent==dan) {
               for (var j=1;j<polja.length;j++){
                   if (polja[j].textContent!="" && j<pozicija) {
                       pozicija=pozicija-polja[j].colSpan+1;
                   }
               }
           }
       }
   } 

   var trajanjeTermina = (vrijemeKraj-vrijemePocetak)*2;
   var brojac=0;
   //provjeravamo da li su polja zauzeta
   for ( var i=0;i<redovi.length;i++){
       if (i==0) continue;
       var polja = redovi[i].getElementsByTagName("td");
       if (polja[0].textContent==dan) {
       for (var j=pozicija;j<pozicija+trajanjeTermina;j++){
           if (polja[j].textContent!="") {
               alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
               return;
           }
           else brojac++;
       }
    }
   }
   if (brojac!=trajanjeTermina) {
    alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
    return;
   }
  //brisemo polja da bismo dodali novo 
  for (var i=0;i<redovi.length;i++){
    if (i==0) continue;
  var polja = redovi[i].getElementsByTagName("td");
  if (polja[0].textContent==dan) {
  for (var j=0;j<trajanjeTermina;j++) {
          redovi[i].deleteCell(pozicija);
      } 
     var novoPolje = redovi[i].insertCell(pozicija);
     var poljeNaziv = document.createTextNode(naziv);
     novoPolje.appendChild(poljeNaziv);
     var poljeNoviRed = document.createTextNode('\n');
     novoPolje.appendChild(poljeNoviRed);
     var poljeTip = document.createTextNode(tip);
     novoPolje.appendChild(poljeTip);
      novoPolje.colSpan=trajanjeTermina;
      if ((prvobitnaPozicija+trajanjeTermina)%2!=0) novoPolje.classList.add("poljePuna");
      else novoPolje.classList.add("poljeIsprekidana");
  } 
    
}

}
 function zadnji (sati){
    var pocetniSat=pocetni(sati);
  
   //racunamo posljednji sat rasporeda
   var posljednjiSat = ((sati.length-2)/2)+pocetniSat-1;
   
   return posljednjiSat;
 }
 function pocetni (sati) {
    var pocetniSat="";
    var i;
    //odredjujemo sat od kojeg raspored pocinje
   for ( i=0;i<sati.length;i++) {
       var pomocni = sati[i].textContent;
      
       if (pomocni!="") {
           if (pocetniSat==""){
               pocetniSat=parseInt(pomocni);
             
               if (pocetniSat==15 && i!=1) {
                   if (i>3) {
                   pocetniSat=pocetniSat-2;
                   return pocetniSat;
                   }
                   else {
                       pocetniSat=pocetniSat-1;
                       return pocetniSat;
                   }
                  
               }
               else if ((pocetniSat==2 || pocetniSat==4 || pocetniSat==6 || pocetniSat==8 || pocetniSat==10 || pocetniSat==12 || pocetniSat==17 || pocetniSat==19 || pocetniSat==21 || pocetniSat==23) && i!=1) {
                   pocetniSat=pocetniSat-1; 
                   return pocetniSat;
               }
           }
           
       }
   }
  
   return pocetniSat;
 }
function satJeURasporedu (sati,sat) {
    var pocetniSat = pocetni(sati);
    var posljednjiSat = zadnji(sati);
  if (sat>=pocetniSat && sat<=posljednjiSat) return true;
  return false;

}
function danJeURasporedu (dani,dan) {
    for(var i = 0; i < dani.length; i++){
        var td = dani[i];
        if (td.textContent==dan) return true;
    }
    return false;
}

    