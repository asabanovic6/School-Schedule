
let iscrtajModul = ( function () {
    //funkcija1
   var iscrtajRaspored = function (div,dani,satPocetak,satKraj) {
   if (!Number.isInteger(satPocetak) || !Number.isInteger(satKraj) || satPocetak>=satKraj || (satPocetak>24 || satPocetak<0) || (satKraj>24 || satKraj<0)) {
  
   let output = "Greška";
   div.innerHTML = output;
  
   } 
   else {
       let sat=satPocetak;
  
   let tabela = document.createElement("table");
   tabela.classList.add("tabelaRaspored");
   let tijeloTabele = document.createElement("tbody");
  
   for (let i=0;i<dani.length+1;i++){
     let red=document.createElement("tr");
     if (dani.length==0) {
         tabela.classList.add("JediniRedUTabeli");
     }
  for (let j=0;j<2*(satKraj-satPocetak+1)+2;j++){
     var polje = document.createElement("th");
     if (i==0) { 
         
     if (j==0){
         polje.classList.add("prvoPolje");
            polje.colSpan=9;
         let poljeSadrzaj = document.createTextNode("");
         polje.appendChild(poljeSadrzaj);
     }
 
   else  if (j==1){
           polje.classList.add("prviRedPocetak");
            
         if (sat== 0 || sat==2 || sat==4 || sat==6 || sat==8 || sat==10 || sat==12 || sat==15 || sat==17 || sat==19 || sat==21 || sat==23) {
             let poljeSadrzaj=document.createTextNode(sat+":00");
             polje.appendChild(poljeSadrzaj);
             sat=sat+0.5;
         }
         else {  let poljeSadrzaj = document.createTextNode("");
         polje.appendChild(poljeSadrzaj);
         sat=sat+0.5;
     }
         }
  else if (j==2*(satKraj-satPocetak+1)+1) {
     polje.classList.add("prviRed");
     let poljeSadrzaj = document.createTextNode("");
     polje.appendChild(poljeSadrzaj);
  }
     else   { 
         if (sat==satKraj){
             polje.classList.add("prviRed");
     let poljeSadrzaj = document.createTextNode("");
     polje.appendChild(poljeSadrzaj);
         }
   else  if(Number.isInteger(sat)) {
        polje.classList.add("prviRed");
        if (sat== 0 || sat==2 || sat==4 || sat==6 || sat==8 || sat==10 || sat==12 || sat==15 || sat==17 || sat==19 || sat==21 || sat==23) {
         let poljeSadrzaj=document.createTextNode(sat+":00");
         polje.appendChild(poljeSadrzaj);
         sat=sat+0.5;
     }
     else {
          let poljeSadrzaj = document.createTextNode("");
     polje.appendChild(poljeSadrzaj);
     sat=sat+0.5;
 }
     
    }
    else {
     polje.classList.add("prviRed");
     let poljeSadrzaj = document.createTextNode("");
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
             let poljeSadrzaj = document.createTextNode(dani[i-1]);
             polje.appendChild(poljeSadrzaj);
          }
          else if (j==2*(satKraj-satPocetak+1)+1) break;
          else if (j%2!=0){
             polje.classList.add("isprekidane");
             let poljeSadrzaj = document.createTextNode("");
             polje.appendChild(poljeSadrzaj);
             }
         else  if ( j%2==0) {
                 polje.classList.add("pune");
                 let poljeSadrzaj = document.createTextNode("");
                 polje.appendChild(poljeSadrzaj);
             }
          
      
         
          
      }
      red.appendChild(polje); 
     }
  
   tijeloTabele.appendChild(red);
   }
 
 
 tabela.appendChild(tijeloTabele);
 
 div.appendChild(tabela); 
   }
   } 
 
   
 
  //funkcija2
 
 var dodajAktivnost = function (raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan) {
     if (raspored == null || raspored.innerHTML.trim().length == 0) {
        return "Greška - raspored nije kreiran";
     
     } 
     else if (vrijemeKraj<=vrijemePocetak ) {
        return "Greška - vremena nisu validna";
     
     }
   else if ( !Number.isInteger(vrijemePocetak) || !Number.isInteger(vrijemeKraj)  ) {
       if (vrijemePocetak%0.5!=0 || vrijemeKraj%0.5!=0) {
    return "Greška - vremena nisu validna";
  
       }
    }
    var dani = raspored.getElementsByClassName("daniUSedmici");
    if (!danJeURasporedu(dani,dan)) {
     return "Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin";
  
    }
    var sati = raspored.getElementsByTagName("th");
    if (!satJeURasporedu(sati,vrijemePocetak) || !satJeURasporedu(sati,vrijemeKraj)) {
     return "Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin";
     
    } 
    var prvobitnaPozicija = 2*(vrijemePocetak-pocetni(sati))+1;
    var pozicija =2*(vrijemePocetak-pocetni(sati))+1;
    var redovi = raspored.getElementsByTagName("tr");
    for (let i=0;i<redovi.length;i++){
        if (i==0) continue;
        else {
            let polja = redovi[i].getElementsByTagName("td");
            
            if (polja[0].textContent==dan) {
                for (let j=1;j<polja.length;j++){
                    if (polja[j].textContent!="" && j<pozicija) {
                        pozicija=pozicija-polja[j].colSpan+1;
                    }
                }
            }
        }
    } 
 
    var trajanjeTermina = (vrijemeKraj-vrijemePocetak)*2;
    var brojac=0;
   
    for (let i=0;i<redovi.length;i++){
        if (i==0) continue;
        let polja = redovi[i].getElementsByTagName("td");
        if (polja[0].textContent==dan) {
        for (let j=pozicija;j<pozicija+trajanjeTermina;j++){
            if (polja[j].textContent!="") {
                return "Greška - već postoji termin u rasporedu u zadanom vremenu";
                
            }
            else brojac++;
        }
     }
    }
    if (brojac!=trajanjeTermina) {
     return "Greška - već postoji termin u rasporedu u zadanom vremenu";
     
    }
   
   for (let i=0;i<redovi.length;i++){
     if (i==0) continue;
   let polja = redovi[i].getElementsByTagName("td");
   if (polja[0].textContent==dan) {
   for (let j=0;j<trajanjeTermina;j++) {
           redovi[i].deleteCell(pozicija);
       } 
      let novoPolje = redovi[i].insertCell(pozicija);
      let poljeNaziv = document.createTextNode(naziv);
      novoPolje.appendChild(poljeNaziv);
      let poljeNoviRed = document.createTextNode('\n');
      novoPolje.appendChild(poljeNoviRed);
      let poljeTip = document.createTextNode(tip);
      novoPolje.appendChild(poljeTip);
       novoPolje.colSpan=trajanjeTermina;
       if ((prvobitnaPozicija+trajanjeTermina)%2!=0) novoPolje.classList.add("poljePuna");
       else novoPolje.classList.add("poljeIsprekidana");
   } 
     
 }
 
 } 
 

 //funkcija3
  var zadnji= function  (sati){
     let pocetniSat=pocetni(sati);
 
    let posljednjiSat = ((sati.length-2)/2)+pocetniSat-1;
    
    return posljednjiSat;
  } 

  //funkcija4
  var pocetni = function  (sati) {
     let pocetniSat="";
     let i;
    
    for ( i=0;i<sati.length;i++) {
        let pomocni = sati[i].textContent;
       
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

  //funkcija5
 var satJeURasporedu = function  (sati,sat) {
     let pocetniSat = pocetni(sati);
     let posljednjiSat = zadnji(sati);
   if (sat>=pocetniSat && sat<=posljednjiSat) return true;
   return false;
 
 } 

 //funkcija6
 var danJeURasporedu = function  (dani,dan) {
     for(let i = 0; i < dani.length; i++){
         let td = dani[i];
         if (td.textContent==dan) return true;
     }
     return false;
 }
 
  return {
    iscrtajRaspored: iscrtajRaspored,
    dodajAktivnost: dodajAktivnost
  }   
} () ); 
