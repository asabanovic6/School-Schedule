let okvir=document.getElementById("okvir");
iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");
dodajAktivnost(okvir,"WT","vježbe",12,13.5,"Ponedjeljak");
dodajAktivnost(okvir,"RMA","predavanje",14,17,"Ponedjeljak");
dodajAktivnost(okvir,"RMA","vježbe",12.5,14,"Utorak");
dodajAktivnost(okvir,"DM","tutorijal",14,16,"Utorak");
dodajAktivnost(okvir,"OOI","predavanje",16,19,"Srijeda"); 
dodajAktivnost(okvir,"OOI","vježbe",19,20.5,"Srijeda"); 
dodajAktivnost(okvir,"RG","predavanje",12,15,"Petak"); 
dodajAktivnost(okvir,"RG","vježbe",15,17,"Petak"); 
dodajAktivnost(okvir,"RMA","tutorijal",16,19,"Četvrtak"); 

let okvir2=document.getElementById("okvir2");
iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],7,20);
dodajAktivnost(okvir2,"OOI","predavanje",8,11,"Ponedjeljak");
dodajAktivnost(okvir2,"WT","predavanje",11,14,"Ponedjeljak");
dodajAktivnost(okvir2,"OIS","predavanje",15,18,"Ponedjeljak");
dodajAktivnost(okvir2,"OIS","vježbe",11,13,"Utorak");
dodajAktivnost(okvir2,"DM","predavanje",14,16.5,"Utorak");
dodajAktivnost(okvir2,"OOI","tutorijal",16,18.5,"Srijeda"); 
dodajAktivnost(okvir2,"OOI","vježbe",19,20.5,"Srijeda"); // aktivirat ce se alert
dodajAktivnost(okvir2,"WT","predavanje",8,10.5,"Petak"); 
dodajAktivnost(okvir2,"RG","nadoknada",15,17,"Subota"); //aktivirat ce se alert
dodajAktivnost(okvir2,"DM","tutorijal",12,14,"Četvrtak"); 

