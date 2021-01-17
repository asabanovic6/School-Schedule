const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");
const fs = require("fs");
const db = require("./database/db.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
var util = require('util');
const { aktivnost } = require("./database/db.js");

db.sequelize.sync({
 force: true
});


app.use('/unosRasporeda.html', express.static(path.join(__dirname, 'public/unosRasporeda.html')));
app.use('/studenti.html', express.static(path.join(__dirname, 'public/studenti.html')));

//GET METODA ZA PREDMET
app.get("/v1/predmeti", (req, res) => {
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
app.get("/v1/aktivnosti", (req, res) => {
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
app.get("/v1/predmet/:naziv/aktivnost/", (req, res) => {
  
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
app.post('/v1/predmet',function(req,res){
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
app.post('/v1/aktivnost',function(req,res){
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
app.delete("/v1/predmet/:naziv", (req, res) => {
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
app.delete("/v1/aktivnost/:naziv", (req, res) => {
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
app.delete("/v1/all", (req, res) => {
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


//NOVE RUTE SPIRALA 4 (CRUD METODE)
//POST METODE
//Predmet post 
app.post("/v2/predmet",function(req,res){
  const tijelo = req.body;
  db.predmet.findOne({where: {naziv: tijelo['naziv']}}).then(function(predmet) { 
    if (predmet!=null) {
    if (predmet['naziv']==tijelo['naziv']) res.end("Predmet je već u bazi");
    }
    else {
      db.predmet.create({ naziv : tijelo['naziv']
    }).then(odgovor =>{res.end("Predmet je dodan")
    }).catch(function (err) {
          console.log( err);
          return 0;
      });
    }
  });
});

//Aktivnost post 
app.post("/v2/aktivnost",function(req,res){
  const tijelo = req.body;
  console.log(tijelo['pocetak']);
  console.log(tijelo['kraj']);

if (tijelo['kraj']<=tijelo['pocetak']) {
   res.end("Unijeli ste nevalidno vrijeme!");
return 0;
}
db.aktivnost.findAll({where: {DanId: tijelo['DanId']}}).then(function(aktivnosti) { 
  let validna = true; 
  if (aktivnosti!=null) {
  aktivnosti.forEach(aktivnost=> {
  if (aktivnost['naziv']==tijelo['naziv'] && aktivnost['TipId']==tijelo['TipId'])  validna = false;
 else if (tijelo['pocetak']<aktivnost['pocetak'] && (tijelo['kraj']<=aktivnost['kraj'] && tijelo['kraj']>aktivnost['pocetak']))  validna = false;
  else if (tijelo['pocetak']==aktivnost['pocetak'])   validna = false;
  else if (tijelo['pocetak']>aktivnost['pocetak'] && tijelo['pocetak']<aktivnost['kraj'])  validna = false;
});
if (validna ==false) res.end("Aktivnost neavlidna");
else if (validna == true) {
  db.aktivnost.create({ naziv : tijelo['naziv'],
  pocetak : tijelo['pocetak'],
  kraj: tijelo['kraj'],
  DanId: tijelo['DanId'],
  TipId: tijelo['TipId'],
  PredmetId: tijelo['PredmetId'],
  GrupaId: tijelo['GrupaId']
}).then(odgovor =>{res.end("Aktivnost je dodana")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
}
  }
  else {
  db.aktivnost.create({ naziv : tijelo['naziv'],
  pocetak : tijelo['pocetak'],
  kraj: tijelo['kraj'],
  DanId: tijelo['DanId'],
  TipId: tijelo['TipId'],
  PredmetId: tijelo['PredmetId'],
  GrupaId: tijelo['GrupaId']
}).then(odgovor =>{res.end("Aktivnost je dodana")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
}
});
}); 

//Dan post 
app.post("/v2/dan",function(req,res){
  const tijelo = req.body;
  
  db.dan.create({ naziv : tijelo['naziv']
}).then(odgovor =>{res.end("Dan je dodan")
}).catch(function (err) {
      console.log( err);
      return 0;
  });

 
});

//Grupa post 
app.post("/v2/grupa",function(req,res){
  const tijelo = req.body;
  db.grupa.findOne({where: {naziv: tijelo['naziv']}}).then(function(grupa) { 
    if (grupa!=null) {
    if (grupa['naziv']==tijelo['naziv']) res.end("Grupa je već u bazi");
    }
    else {
  db.grupa.create({ naziv : tijelo['naziv'],
  PredmetId: tijelo['PredmetId']
}).then(odgovor =>{res.end("Grupa je dodana")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
}
  });
});

//Student post
app.post("/v2/student",function(req,res){
 let tijelo = req.body;
  db.student.findOne({where: {index: tijelo['index']}}).then(function(student) { 
    if (student!=null) {
    if (student['index']==tijelo['index']) res.end("Student "+ tijelo['ime']+" nije kreiran jer već postoji studnet "+ student['ime']+" sa istim indexom "+student['index']);
    }
    else {
  db.student.create( { ime: tijelo['ime'],
  index: tijelo['index']
}).then(odgovor =>{res.end("Student je dodan")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
    }
  });
});

//Tip post 
app.post("/v2/tip",function(req,res){
  const tijelo = req.body;
  db.tip.findOne({where: {naziv: tijelo['naziv']}}).then(function(tip) { 
    if (tip!=null) {
    if (tip['naziv']==tijelo['naziv']) res.end("Tip je već u bazi");
    }
    else {
  db.tip.create({ naziv : tijelo['naziv']
}).then(odgovor =>{res.end("Tip je dodan")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
}
  });
});
//GET METODE 
//Predmet get 
app.get("/v2/predmeti",function(req,res){
  const tijelo = req.body;
  db.predmet.findAll().then(function(predmeti) {
    let vrijednosti = [];
    predmeti.forEach(predmet => {
      vrijednosti.push(predmet);
    });
    res.send(JSON.stringify(vrijednosti));
  });
  
}); 

//Aktivnost get 
app.get("/v2/aktivnosti",function(req,res){
  const tijelo = req.body;
  db.aktivnost.findAll().then(function(aktivnosti) {
    let vrijednosti = [];
    aktivnosti.forEach(aktivnost => {
      vrijednosti.push(aktivnost);
    });
    res.send(JSON.stringify(vrijednosti));
  });
});

  //Dan get 
  app.get("/v2/dani",function(req,res){
    const tijelo = req.body;
    db.dan.findAll().then(function(dani) {
      let vrijednosti = [];
      dani.forEach(dan => {
        vrijednosti.push(dan);
      });
      res.send(JSON.stringify(vrijednosti));
    });
  });

// Grupa get 
app.get("/v2/grupe",function(req,res){
  const tijelo = req.body;
  db.grupa.findAll().then(function(grupe) {
    let vrijednosti = [];
    grupe.forEach(grupa => {
      vrijednosti.push(grupa);
    });
    res.send(JSON.stringify(vrijednosti));
  });
});

//Tip get 
app.get("/v2/tipovi",function(req,res){
  const tijelo = req.body;
  db.tip.findAll().then(function(tipovi) {
    let vrijednosti = [];
    tipovi.forEach(tip => {
      vrijednosti.push(tip);
    });
    res.send(JSON.stringify(vrijednosti));
  });
});

//Student get
app.get("/v2/studenti",function(req,res){
  const tijelo = req.body;
  db.student.findAll().then(function(studenti) {
    let vrijednosti = [];
    studenti.forEach(student => {
      vrijednosti.push(student);
    });
    res.send(JSON.stringify(vrijednosti)); 
  });
});

//Predmet get by Id
app.get("/v2/predmet/:id",function(req,res){
  let id = req.params.id;
  db.predmet.findByPk(id).then(function(predmet) {
    res.send(JSON.stringify(predmet));
  });
});
//Predmet get by Naziv
app.get("/v2/predmetNaziv/:naziv",function(req,res){
  let n = req.params.naziv;
db.predmet.findOne({where: { naziv : n}}).then(function(predmet) {
  
  res.send(predmet.id.toString());
});
});
//Aktivnost get by Id
app.get("/v2/aktivnost/:id",function(req,res){
  let id = req.params.id;
  db.aktivnost.findByPk(id).then(function(aktivnost) {
    res.send(JSON.stringify(aktivnost));
  });
});

//Student get by Id 
app.get("/v2/student/:id",function(req,res){
  let id = req.params.id;
  db.student.findByPk(id).then(function(student) {
    res.send(JSON.stringify(student));
  });
});

//Dan get by Id
app.get("/v2/dan/:id",function(req,res){
  let id = req.params.id;
  db.dan.findByPk(id).then(function(dan) {
    res.send(JSON.stringify(dan));
  });
});
//Dan get by Naziv
app.get("/v2/danNaziv/:naziv",function(req,res){
  let n = req.params.naziv;
db.dan.findOne({where: { naziv : n}}).then(function(dan) {
  res.send(dan.id.toString());
});
});
//Grupa get by Id
app.get("/v2/grupa/:id",function(req,res){
  let id = req.params.id;
  db.grupa.findByPk(id).then(function(grupa) {
    res.send(JSON.stringify(grupa));
  });
});
//Grupa get by Naziv
app.get("/v2/grupaNaziv/:naziv",function(req,res){
  let n = req.params.naziv;
db.grupa.findOne({where: { naziv : n}}).then(function(grupa) {
  res.send(grupa.id.toString());
});
});
//Tip get by Id
app.get("/v2/tip/:id",function(req,res){
  let id = req.params.id;
  db.tip.findByPk(id).then(function(tip) {
    res.send(JSON.stringify(tip));
  });
});
//Tip get by Naziv
app.get("/v2/tipNaziv/:naziv",function(req,res){
  let n = req.params.naziv;
db.tip.findOne({where: { naziv : n}}).then(function(tip) {
  res.send(tip.id.toString());
});
});
//UPDATE METODE
//Predmet update 
app.put("/v2/predmet/:id",function(req,res){
  let ID = req.params.id;
  const tijelo = req.body;
  db.predmet.update({ naziv : tijelo['naziv']
},{where: {id: ID}}).then(odgovor =>{res.end("Predmet je promijenjen")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
});

//Aktivnost update 
app.put("/v2/aktivnost/:id",function(req,res){
  let ID = req.params.id;
  const tijelo = req.body;
  db.aktivnost.update({ naziv : tijelo['naziv'],
  pocetak : tijelo['pocetak'],
  kraj: tijelo['kraj'],
  DanId: tijelo['DanId'],
  TipId: tijelo['TipId'],
  PredmetId: tijelo['PredmetId'],
  GrupaId: tijelo['GrupaId']
},{where: {id: ID}}).then(odgovor =>{res.end("Aktivnost je promijenjena")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
});

//Dan update 
app.put("/v2/dan/:id",function(req,res){
  let ID = req.params.id;
  const tijelo = req.body;
  db.dan.update({ naziv : tijelo['naziv']
},{where: {id: ID}}).then(odgovor =>{res.end("Dan je promijenjen")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
});

//Grupa update 
app.put("/v2/grupa/:id",function(req,res){
  let ID = req.params.id;
  const tijelo = req.body;
  db.grupa.update({ naziv : tijelo['naziv'],
  PredmetId : tijelo['PredmetId']
},{where: {id: ID}}).then(odgovor =>{res.end("Grupa je promijenjena")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
});
//Tip update 
app.put("/v2/tip/:id",function(req,res){
  let ID = req.params.id;
  const tijelo = req.body;
  db.tip.update({ naziv : tijelo['naziv']
},{where: {id: ID}}).then(odgovor =>{res.end("Tip je promijenjen")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
});

//Student update 
app.put("/v2/student/:id",function(req,res){
  let ID = req.params.id;
  const tijelo = req.body;
  db.student.update({ ime : tijelo['ime'],
  index: tijelo['index']
},{where: {id: ID}}).then(odgovor =>{res.end("Student je promijenjen")
}).catch(function (err) {
      console.log( err);
      return 0;
  });
});
//DELETE METODE
//Predmet delete 
app.delete("/v2/predmet/:id",function(req,res){
  let id = req.params.id;
  db.predmet.destroy({
    where: { id: id }
   }).then(odgovor =>{res.end("Predmet je obrisan")
  }).catch(function (err) {
        console.log( err);
        return 0;
    });
});
//Predmet delete prema nazivu 
app.delete("/v2/predmetNaziv/:naziv",function(req,res){
  let naziv = req.params.naziv;
  db.predmet.destroy({
    where: { naziv: naziv }
   }).then(odgovor =>{res.end("Predmet je obrisan")
  }).catch(function (err) {
        console.log( err);
        return 0;
    });
});
//Aktivnost delete 
app.delete("/v2/aktivnost/:id",function(req,res){
  let id = req.params.id;
  db.aktivnost.destroy({
    where: { id: id }
   }).then(odgovor =>{res.end("Aktivnost je obrisana")
  }).catch(function (err) {
        console.log( err);
        return 0;
    });
});

//Grupa delete 
app.delete("/v2/grupa/:id",function(req,res){
  let id = req.params.id;
  db.grupa.destroy({
    where: { id: id }
   }).then(odgovor =>{res.end("Grupa je obrisana")
  }).catch(function (err) {
        console.log( err);
        return 0;
    });
});

//Dan delete 
app.delete("/v2/dan/:id",function(req,res){
  let id = req.params.id;
  db.dan.destroy({
    where: { id: id }
   }).then(odgovor =>{res.end("Dan je obrisan")
  }).catch(function (err) {
        console.log( err);
        return 0;
    });
});

//Tip delete 
app.delete("/v2/tip/:id",function(req,res){
  let id = req.params.id;
  db.tip.destroy({
    where: { id: id }
   }).then(odgovor =>{res.end("Tip je obrisan")
  }).catch(function (err) {
        console.log( err);
        return 0;
    });
});

//Student delete 
app.delete("/v2/student/:id",function(req,res){
  let id = req.params.id;
  db.student.destroy({
    where: { id: id }
   }).then(odgovor =>{res.end("Student je obrisan")
  }).catch(function (err) {
        console.log( err);
        return 0;
    });
});
  app.listen(3000);