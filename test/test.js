const app = require("../rute");
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require('fs');
let should = chai.should();

const { expect } = chai;
chai.use(chaiHttp);





//POKRETANJE TESTOVA : TESTOVE SAM POKRETALA TAKO STO SAM SVAKI PUT POZIVALA node rute.js pa zatim npm test U KONZOLI


describe("Testovi ruta: ", () => {
    var tests =  fs.readFileSync(__dirname+"/testniPodaci.txt", 'utf8');
    tests= tests.split('\n');
    
    tests.forEach(function(test) {
    var  tijeloTesta=test;
      var test=test.split("\r").join("");
      var test2=test;
      test= test.split(",");
      var tipTesta = test[0]; //tip testa koji se poziva
      var rutaTesta = test[1]; //ruta to odgovarajuceg testa
      var ulazTesta=  test[2].split("\\").join("");   // ulazni podaci 
     // ulaz = JSON.parse(ulazTesta);   OVO CE SE DESITI U POST METODAMA
      var izlazTesta  = test[3].split("\\").join("");  //izlazni podaci 
if (tipTesta=="GET"){
  test2=test2.split("[");
  let izlaz2="["+test2[1];
  izlaz2=izlaz2.split("\\").join("");
  describe("Get test : ", () => {
  it( tijeloTesta, function(done) {
    chai
      .request("http://localhost:3000")
      .get(rutaTesta)
      .end((err, res) => {
   
        expect(res.text).to.equals(izlaz2);
        done();
      })
    });
  });
}


if (tipTesta=="POST"){ 
  if (rutaTesta=="/aktivnost"){
    test2=test2.split("{");
    let ulaz2=test2[1].split("\\").join("");
    ulaz2="{"+ulaz2.slice(0, -1);
    ulazTesta=JSON.parse(ulaz2);
  izlazTesta=test2[2];
  izlazTesta=izlazTesta.split(":");
  izlazTesta=izlazTesta[1].split("}").join("");
  izlazTesta=izlazTesta.split("\"").join("");
  izlazTesta=izlazTesta.split("\\").join("");
  }
  if (rutaTesta=="/predmet") {
  izlazTesta=izlazTesta.split(":");
      izlazTesta=izlazTesta[1].split("}").join("");
      izlazTesta=izlazTesta.split("\"").join("");
      ulazTesta=JSON.parse(ulazTesta);
  }
  describe("Post test : ", () => {
        it(tijeloTesta, function(done) {
        chai
          .request("http://localhost:3000")
          .post(rutaTesta)
          .send(ulazTesta)
          .end((err, res) => {
            expect(res.body.message).to.equals(izlazTesta);
            done();
          })
        });
      });
}

    if (tipTesta=="DELETE") { 
      izlazTesta=izlazTesta.split(":");
      izlazTesta=izlazTesta[1].split("}").join("");
      izlazTesta=izlazTesta.split("\"").join("");
      if (ulazTesta!="null") {
        ulazTesta= ulazTesta.split("{").join("");
        ulazTesta=ulazTesta.split("}").join("");
        ulazTesta=ulazTesta.split("\"").join("");
        ulazTesta=ulazTesta.split(":");
        ulazTesta=ulazTesta[1];
        rutaTesta+="/"+ulazTesta;
      } 
      describe("Delete test : ", () => {
        it(tijeloTesta, function(done) {
        chai
          .request("http://localhost:3000")
          .delete(rutaTesta)
          .end((err, res) => {
            expect(res.body.message).to.equals(izlazTesta);
            done();
          })
        });
      });
      
    } 

    
    })
});

