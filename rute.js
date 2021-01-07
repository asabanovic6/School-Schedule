const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");
const fs = require("fs");
const { parse } = require("path");
const { json } = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/unosRasporeda.html', express.static(path.join(__dirname, 'public/unosRasporeda.html')));



//GET METODA ZA PREDMET
app.get("/predmeti", (req, res) => {
  fs.readFile(__dirname+"/predmeti.txt", function(err, data) {
    
      if(err) throw err;
      let niz = [];

      let linija = data.toString().split("\n");
     for (let j=0;j<linija.length;j++){
       
        if (linija[j]!="") {
        let obj = {};
          obj['naziv'] = linija[j];
          niz.push(obj);
        }
     
    }
    res.send(niz);
  });
});

//GET METODA ZA AKTIVNOST 
app.get("/aktivnosti", (req, res) => {
  fs.readFile(__dirname+"/aktivnosti.txt", function(err, data) {
    
      if(err) throw err;
      let niz = [];
      let linija = data.toString().split("\n");
     for (let j=0;j<linija.length;j++){
        let oneLine=linija[j].toString().split(',');
        let obj = {};
          obj['naziv']=oneLine[0];
         obj['tip']=oneLine[1];
         obj['pocetak']=Number(oneLine[2]);
         obj['kraj'] =Number(oneLine[3]);
         obj['dan']=oneLine[4];
        niz.push(obj);
    }
    res.send(niz);
  });
});

//GET METODA ZA PREDEMT I AKTIVNOSTI 
app.get("/predmet/:naziv/aktivnost/", (req, res) => {
  
  fs.readFile(__dirname+"/aktivnosti.txt", function(err, data) {
    
      if(err) throw err;
      let niz = [];
      let linija = data.toString().split("\n");
     for (let j=0;j<linija.length;j++){
        let oneLine=linija[j].toString().split(',');
        if (req.params.naziv==oneLine[0]) {
        let obj = {};
          obj['naziv']=oneLine[0];
         obj['tip']=oneLine[1];
         obj['pocetak']=Number(oneLine[2]);
         obj['kraj'] =Number(oneLine[3]);
         obj['dan']=oneLine[4];
        niz.push(obj);
        }
    }
    res.send(niz);
  }); 
});



// POST METODA ZA PREDMET
app.post('/predmet',function(req,res){
  let tijelo = req.body; 
  let novaLinija = tijelo['naziv'];
  //citamo datoteku
  fs.readFile(__dirname+"/predmeti.txt", function(err, data) {
    if (err) {
      fs.appendFile('predmeti.txt',novaLinija,function(err){
        if(err) throw err;
        res.json({message:"Uspješno dodan predmet!"});
    });
    }
   else {
    let podaci="";
    podaci= data.toString();
    if (podaci!="")
    novaLinija="\n"+novaLinija;
    //ako naziv ne postoji u datoteci dodajemo naziv 
    if (moguceDodatiNaziv(tijelo['naziv'],podaci)) {
     
      fs.appendFile('predmeti.txt',novaLinija,function(err){
        if(err) throw err;
        res.json({message:"Uspješno dodan predmet!"});
    });
    } 
    //ako vec postoji naziv u datoteci ispisuje se greska 
    else {
      
    res.json({message:"Naziv predmeta postoji!" });
    } }
  }); 
});


  

  //funkcija koja provjerava da li se naziv predmeta nalazi u datoteci 
 function moguceDodatiNaziv (novaLinija,podaci) {
   
  let linija="";
  for (let i = 0; i < podaci.length; i++) { 
    if (podaci[i]=='\n'){
      if (linija==novaLinija) {
       return false; }
    }
    else {
      linija+=podaci[i];
    }
 }
 return true; 
}


//POST METODA ZA AKTIVNOST
app.post('/aktivnost',function(req,res){
  let tijelo = req.body; 
  let novaLinija =tijelo['naziv']+","+tijelo['tip']+","+tijelo['pocetak']+","+tijelo['kraj']+","+tijelo['dan'];
  let validacija=validacijaVremena(tijelo['pocetak'],tijelo['kraj']);
    if (!validacija) {
      res.json({message:"Aktivnost nije validna!" });
    }
    else {
      fs.readFile(__dirname+"/aktivnosti.txt", function(err, data) { 
        if (err) {
          fs.appendFile('aktivnosti.txt',novaLinija,function(err){
            if(err) throw err;
            res.json({message:"Uspješno dodana aktivnost!"});
        });
       }
       else { 
         let podaci = data.toString();
         if (podaci!="")
         novaLinija="\n"+novaLinija;
         if (validacijaTipova(tijelo['naziv'],tijelo['tip'],podaci) && validacijaTermina(tijelo['dan'],tijelo['pocetak'],tijelo['kraj'],podaci)) {
          fs.appendFile('aktivnosti.txt',novaLinija,function(err){
            if(err) throw err;
            res.json({message:"Uspješno dodana aktivnost!"});
        });
         }
         else {
          res.json({message:"Aktivnost nije validna!" });
         }
       }
      });
    }
});

function validacijaVremena(pocetak,kraj) {
  let  vrijemeKraj= (Math.round(parseFloat(kraj)*10)/10);
 let vrijemePocetak= (Math.round(parseFloat(pocetak)*10)/10);

   if (vrijemeKraj<=vrijemePocetak ) {
   return false;
}
else if (vrijemePocetak<8 || vrijemePocetak>20) return false;
else if (vrijemeKraj<8 || vrijemeKraj>20) return false;
else if ( !Number.isInteger(vrijemePocetak) ||  !Number.isInteger(vrijemeKraj) )  return false;
else return true;
}

//ne mozemo dodati aktivnost istog naziva i istog tipa vise puta (npr web tehnologije predavanje mozemo imati u samo jednom terminu u toku sedmice)
function validacijaTipova (naziv,tip,podaci){
 let nazivPredmeta="";
 let pomVar1="";
 let tipAktivnosti="";
 let pomVar2="";
  let brojacZareza=0;
  for (let i = 0; i < podaci.length; i++) { 
    if (podaci[i]!=',' && brojacZareza==0)
    pomVar1+=podaci[i];
  else if (podaci[i]==',' && brojacZareza==0)  {
nazivPredmeta=pomVar1;
brojacZareza++;
    }
else if (podaci[i]!=',' && brojacZareza==1) {
      pomVar2+=podaci[i];
    }
 else if (podaci[i]==',' && brojacZareza==1){
      brojacZareza++;
      tipAktivnosti=pomVar2;
    }
else if (podaci[i]=='\n'){
      if (nazivPredmeta==naziv && tipAktivnosti==tip)  return false;
      pomVar1="";
      pomVar2="";
      brojacZareza=0;
    }
  else continue;
 } 
 return true;
} 

function validacijaTermina (dan,vrijemePocetak,vrijemeKraj,podaci){ 
  let vp = Number(vrijemePocetak.toString());
    let vk=Number(vrijemeKraj.toString());
 if (!Number.isInteger(vp) && vp%0.5!=0) return false;
    let sviPodaci=podaci.split("\n");
    for (let i=0;i<sviPodaci.length;i++){
      let red= sviPodaci[i].split(",");
      let p=red[2];
      let k=red[3];
      let d=red[4];
      if (d==dan.toString()){
        if ((vp<p && (vk<=k && vk>p))) return false;
        else if (vp==p) return false;
        else if (vp>p && vp<k) return false;
      }
    }
return true;
}

//DELETE METODA ZA PREDMET
app.delete("/predmet/:naziv", (req, res) => {
  fs.readFile(__dirname+"/predmeti.txt", function(err, data) {
    if(err) throw err;
    let noviPodaci="";
    let linija = [];
    linija= data.toString().split("\n");
   for (let j=0;j<linija.length;j++){
     linija[j]=linija[j].split("\r").join("");
        if (req.params.naziv!=linija[j]) {
          if (noviPodaci!="") noviPodaci+="\n"+linija[j];
          else 
        noviPodaci +=linija[j];
        }
  } 
 
  fs.writeFile('predmeti.txt', noviPodaci, (err) => {
    if (err ) res.json({message:"Greška - predmet nije obrisan!"});
    res.json({message:"Uspješno obrisan predmet" });
});
});
});

//DELETE METODA ZA AKTIVNOST
app.delete("/aktivnost/:naziv", (req, res) => {
  fs.readFile(__dirname+"/aktivnosti.txt", function(err, data) {
    if(err) throw err;
    let noviPodaci="";
    let linija = data.toString().split("\n");
   for (let j=0;j<linija.length;j++){
    linija[j]=linija[j].split("\r").join("");
      let oneLine=linija[j].toString().split(',');
        if (req.params.naziv!=oneLine[0]) {
          if (noviPodaci!="") noviPodaci+="\n"+linija[j];
          else 
        noviPodaci +=linija[j];
        }
  }
  fs.writeFile('aktivnosti.txt', noviPodaci, (err) => {
    if (err ) res.json({message:"Greška - aktivnost nije obrisana!"});
    res.json({message:"Uspješno obrisana aktivnost!" });
});
});
});

//METODA BRISE SADRZAJ AKTIVNOSTI.TXT I PREDMETI.TXT
app.delete("/all", (req, res) => {
  let noviPodaci="";
  fs.writeFile('aktivnosti.txt', noviPodaci, (err) => {
    if (err) throw err;
    
});
fs.writeFile('predmeti.txt', noviPodaci, (err) => {
  if (err) res.json({message:"Greška - sadržaj datoteka nije moguće obrisati!"});
  res.json({message:"Uspješno obrisan sadržaj datoteka!" });
});
}); 

function postoji(svi,naziv){
  for (let i=0;i<svi.length;i++){
svi[i]=svi[i].split("\r").join("");
    if (svi[i]==naziv) return true;
  }
  return false;
}
function postojiAktivnost(svi,naziv){
  for (let i=0;i<svi.length;i++){
svi[i]=svi[i].split("\r").join("");
let nazivAktivnosti=svi[i].split(",");
    if (nazivAktivnosti[0]==naziv) return true;
  }
  return false;
}
  app.listen(3000);