 const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt2018245", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
}
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import modela u bazu 

db.aktivnost = require(__dirname + "/model/Aktivnost.js")(sequelize,Sequelize.DataTypes);
db.student = require(__dirname + "/model/Student.js")(sequelize,Sequelize.DataTypes);
db.grupa = require(__dirname + "/model/Grupa.js")(sequelize,Sequelize.DataTypes);
db.dan = require(__dirname + "/model/Dan.js")(sequelize,Sequelize.DataTypes);
db.tip =require(__dirname + "/model/Tip.js")(sequelize,Sequelize.DataTypes);
db.predmet = require(__dirname + "/model/Predmet.js")(sequelize,Sequelize.DataTypes);


//relacije
//Predmet - jedan na vise -Grupa
db.predmet.hasMany(db.grupa,{foreignKey: {allowNull:false}});
  db.grupa.belongsTo(db.predmet);

//Aktivnost - vise na jedan - Dan
db.dan.hasMany(db.aktivnost, {foreignKey: {allowNull:false}});
  db.aktivnost.belongsTo(db.dan);

//Aktivnost - vise na jedan - Tip
db.tip.hasMany(db.aktivnost, {foreignKey: {allowNull:false}});
  db.aktivnost.belongsTo(db.tip);

  //Aktivnost - vise na jedan - Predmet
db.predmet.hasMany(db.aktivnost, {foreignKey: {allowNull:false}});
  db.aktivnost.belongsTo(db.predmet);

  //Student -vise na vise - Grupa 
db.student.belongsToMany(db.grupa,{through:'studentGrupa'});
 db.grupa.belongsToMany(db.student,{through:'studentGrupa'});


//Aktivnost -vise na nula - Grupa
db.grupa.hasMany(db.aktivnost);
db.aktivnost.belongsTo(db.grupa);


module.exports = db; 
