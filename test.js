let assert = chai.assert;
describe("Raspored", function() {
  describe("iscrtajRaspored () ", function() {
    //Pozivanje obojiZauzeca kada podaci nisu učitani: očekivana vrijednost da se ne oboji niti jedan dan
    it("PrviTest - metoda iscrtajRaspored() - prosljeđujemo satKraj koji nije cijeli broj ", function() {
        let okvir = document.getElementById("okvir")
 iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21.5);
    
    assert.equal (okvir.innerText,"Greška","Treba ispisati grešku");
    }); 
    
  
  it("Drugi Test - metoda iscrtajRaspored() - prodljeđujemo satPočetak koji nije cijeli broj ", function() {
    let okvir1 = document.getElementById("okvir")
            iscrtajModul.iscrtajRaspored(okvir1,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],15.1,14);
               
               assert.equal (okvir1.innerText,"Greška","Treba ispisati grešku");
               }); 
  it("Treći Test - metoda iscrtajRaspored() - prodljeđujemo satKraj koji je veći od sat Početak ", function() {
    let okvir2 = document.getElementById("okvir")
                iscrtajModul.iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],15,14);
                   
                   assert.equal (okvir2.innerText,"Greška","Treba ispisati grešku");
                   });
it("Četvrti Test - metoda iscrtajRaspored() - prosljeđujemo satKraj koji nije u rangu od 0 do 24h ", function() {
    let okvir3 = document.getElementById("okvir")   
    iscrtajModul.iscrtajRaspored(okvir3,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],15,25);
       
       assert.equal (okvir3.innerText,"Greška","Treba ispisati grešku");
       });  
  it("Peti Test - metoda iscrtajRaspored() - prosljeđujemo satPočetak koji nije u rangu od 0 do 24h ", function() {
    let okvir4 = document.getElementById("okvir")
        iscrtajModul.iscrtajRaspored(okvir4,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],-1,22);
           
           assert.equal (okvir4.innerText,"Greška","Treba ispisati grešku");
           });
 it("Šesti Test - metoda iscrtajRaspored() - provjeravamo da li se ispiuje greška kada kao parametar proslijedimo isti satPočetak i satKraj ", function() {
    let okvir5 = document.getElementById("okvir")                
    iscrtajModul.iscrtajRaspored(okvir5,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,8);
                         assert.equal (okvir5.innerText,"Greška","Treba ispisati grešku");
                                                              });

it("Sedmi Test - metoda iscrtajRaspored() - provjeravamo da li je ispisano svih 5 dana rasporeda ", function() {
    let okvir6 = document.getElementById("okvir")
        iscrtajModul.iscrtajRaspored(okvir6,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
           let redovi = okvir6.getElementsByTagName("tr");
           assert.equal (redovi.length-1,5,"Broj dana rasporeda je 5");
           }); 

    
 it("Osmi Test - metoda iscrtajRaspored() - provjeravamo da li je ispisano svih 3 dana rasporeda ", function() {
        let okvir7 = document.getElementById("okvir2")
           iscrtajModul.iscrtajRaspored(okvir7,["Ponedjeljak","Utorak","Srijeda"],8,19);
               let redovi = okvir7.getElementsByTagName("tr");
               assert.equal (redovi.length-1,3,"Broj dana rasporeda je 3");
               }); 
 it("Deveti Test - metoda iscrtajRaspored() - provjeravamo da li se ispisuju svi redovi rasporeda koji traje od 8h do 21h ", function() {
    let okvir8 = document.getElementById("okvir")
                iscrtajModul.iscrtajRaspored(okvir8,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
                    let redovi = okvir8.getElementsByTagName("tr");
                    let polja = redovi[1].getElementsByTagName("td");
                    assert.equal (polja.length,29,"Broj kolona je (10) za termine i (1) za dan u sedmici");
                    }); 
 it("Deseti Test - metoda iscrtajRaspored() - provjeravamo da li se ispiuje raspored koji nema niti jedan dan proslijedjen kao parametar ", function() {
    let okvir9 = document.getElementById("okvir3")
          iscrtajModul.iscrtajRaspored(okvir9,[],8,21);
                   let redovi = okvir9.getElementsByTagName("tr");
              assert.equal (redovi.length,1,"Broj redova je 1");
                            }); 
                           
it("Prvi Test - metoda dodajAktivnost() - provjeravamo da li će se iz funckije vratiti porka izuzetka ako proslijedimo div u kojem nije kreiran raspored", function() {
         let okvir=document.getElementById("okvir4");
        let ispisIzuzetka= iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",9,12,"Subotu");
           assert.equal (ispisIzuzetka,"Greška - raspored nije kreiran","Ispisuje se izuzetak");      
                                }); 
 it("Drugi Test - metoda dodajAktivnost() - provjeravamo da li će se iz funckije vratiti porka izuzetka ako proslijedimo div u kojem je raspored null", function() {
    let okvir=document.getElementById("okvir4");
       let ispisIzuzetka= iscrtajModul.dodajAktivnost(null,"WT","predavanje",9,12,"Subotu");
       okvir.innerHTML=ispisIzuzetka;
     assert.equal (okvir.innerText,"Greška - raspored nije kreiran","Ispisuje se izuzetak");      
                                                           }); 
it("Treći Test - metoda dodajAktivnost() - provjeravamo da li će se iz funckije vratiti porka izuzetka ako proslijedimo  vremena koja nisu validna ", function() {
         let okvir=document.getElementById("okvir4");
         iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21); 
        let ispisIzuzetka= iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",9,12.3,"Petak");
        okvir.innerHTML = ispisIzuzetka;
           assert.equal (okvir.innerText,"Greška - vremena nisu validna","Ispisuje se izuzetak");      
                                }); 
  it("Četvrti Test - metoda dodajAktivnost() - provjeravamo da li će se iz funckije vratiti porka izuzetka ako proslijedimo  dan koji ne postoji u rasporedu ", function() {
      let okvir=document.getElementById("okvir4");
       iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21); 
       let ispisIzuzetka= iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",9,12,"Subotu");
       okvir.innerHTML = ispisIzuzetka;
       assert.equal (okvir.innerText,"Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin","Ispisuje se izuzetak");      
                                                           }); 
  it("Peti Test - metoda dodajAktivnost() - provjeravamo da li će se iz funckije vratiti porka izuzetka ako proslijedimo  dan koji ne postoji u rasporedu ", function() {
      let okvir=document.getElementById("okvir4");
       iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21); 
       let ispisIzuzetka= iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",9,12,"Subotu");
       okvir.innerHTML = ispisIzuzetka;
       assert.equal (okvir.innerText,"Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin","Ispisuje se izuzetak");      
                                                           }); 
   
it("Šesti Test - metoda dodajAktivnost() - provjeravamo da li će se iz funckije vratiti porka izuzetka ako proslijedimo  sat koji ne postoji u rasporedu ", function() {
    let okvir=document.getElementById("okvir4");
     iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21); 
     let ispisIzuzetka= iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",7,12,"Petak");
     okvir.innerHTML = ispisIzuzetka;
     assert.equal (okvir.innerText,"Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin","Ispisuje se izuzetak"); 
   
                                                         });       
it("Sedmi Test - metoda dodajAktivnost() - provjeravamo da li se doda prosljeđena aktivnost na termn od 9h do 11h", function() {
    let okvir=document.getElementById("okvir4");
     iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21); 
      iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");
     let redovi = okvir.getElementsByTagName("tr");
     let polja = redovi[1].getElementsByTagName("td");
     assert.equal (polja[3].colSpan,6,"Dodaje se aktivnost u termin zadan parametrima");      
                                                         });                                                   
it("Osmi Test - metoda dodajAktivnost() - provjeravamo da li će se iz funkcije vratiti poruka izuzetka ako pokušamo dodati aktivnost na zauzeti termin", function() {
    let okvir=document.getElementById("okvir5"); 
    iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21); 
    iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");
     let ispisIzuzetka= iscrtajModul.dodajAktivnost(okvir,"OOI","tutorijal",9,12,"Ponedjeljak");
     okvir.innerHTML = ispisIzuzetka;
     assert.equal (okvir.innerText,"Greška - već postoji termin u rasporedu u zadanom vremenu","Ispisuje se izuzetak");      
                                                         });  
it("Deveti Test - metoda dodajAktivnost() - provjeravamo da li će se iz funkcije vratiti poruka izuzetka ako pokušamo dodati aktivnost na polovini zauzetog termina", function() {
    let okvir=document.getElementById("okvir6"); 
    iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21); 
    iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");
     let ispisIzuzetka= iscrtajModul.dodajAktivnost(okvir,"OOI","tutorijal",10,11,"Ponedjeljak");
     okvir.innerHTML = ispisIzuzetka;
     assert.equal (okvir.innerText,"Greška - već postoji termin u rasporedu u zadanom vremenu","Ispisuje se izuzetak");      
                                                         });  
it("Deseti Test - metoda dodajAktivnost() - provjeravamo da li će se ispravno dodati više od jedne aktivnosti u raspored", function() {
    let okvir=document.getElementById("okvir7"); 
    iscrtajModul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21); 
    iscrtajModul.dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");
    iscrtajModul.dodajAktivnost(okvir,"OOI","tutorijal",8,11,"Utorak");
    iscrtajModul.dodajAktivnost(okvir,"WT","vježbe",9,12,"Srijeda");
    iscrtajModul.dodajAktivnost(okvir,"OOI","predavanje",18,20.5,"Četvrtak");
    iscrtajModul.dodajAktivnost(okvir,"RG","predavanje",12,15.5,"Srijeda");
    iscrtajModul.dodajAktivnost(okvir,"RG","tutorijal",10,13,"Petak");
     let redovi = okvir.getElementsByTagName("tr");
     let brojacAktivnosti =0;
     for (let i =1;i<redovi.length;i++){
         let polja = redovi[i].getElementsByTagName("td");
         for (let j=1;j<polja.length;j++) {
            if (polja[j].colSpan>1) brojacAktivnosti++;
         }
     }
     assert.equal (brojacAktivnosti,6,"Ispisuje se raspored sa dodanim aktivnostima");      
                                                         });  
     }); 
});