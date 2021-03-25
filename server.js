const Db = require("./Utils/db");
const cron = require("node-cron");
const Sap = require("./Utils/sap");
const db = require("./Utils/db");
const getSapOrders = Sap.getSapOrders;
const getSapOrdersComp = Sap.getSapOrdersComp;

cron.schedule("30 15 * * *", function () { //Schedule Task
  //Minutos, Horas, Mes, Dia del mes, Dia de la semana,
  
  const dat = new Date();
  let fechaA = `${dat.getFullYear()}${dat.getMonth() + 1}${dat.getDate()-1}`
  let fecha = `${dat.getFullYear()}${dat.getMonth() + 1}${dat.getDate()}`;
  let hora = `${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`;
  console.log(`Corriendo en fecha ${fecha} y hora ${hora}`);
  getSapOrders(fechaA, fecha, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      data.forEach((ord) => {
        Db.addOrdersTemps(ord, function (e, data) {
          if (e) {
            Db.auditReg(
              { dat: e.message, tipo: "error" },
              function (err, data) {
                if (err) {
                  console.log(err);
                }
                console.log("Error Register");
              }
            );
          }
          Db.auditReg(
            { dat: `Orden ${ord.AUFNR}`, tipo: "Registro" },
            function (err, data) {
              if (err) {
                console.log(err);
              }
              console.log(`Orden ${ord.AUFNR} registrada`);
            }
          );
        });
      });
      setTimeout(() => {
        getSapOrdersComp(fechaA, fecha, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            data.forEach((comp) => {
              Db.addOrdersCompTemps(comp, function (e, data) {
                if (e) {
                  Db.auditReg(
                    { dat: e.message, tipo: "error" },
                    function (err, data) {
                      console.log(err);
                      console.log("Error Register");
                    }
                  );
                }
                Db.auditReg(
                  { dat: `CompOrden ${comp.AUFNR}`, tipo: "Registro" },
                  function (err, data) {
                    if (err) {
                      console.log(err);
                    }
                    console.log(`Componente de Orden ${comp.AUFNR} registrado`);
                  }
                );
              });
            });
          }
        });
      }, 40000);
    }
  });

  setTimeout(() => {
    db.SapAddOrUpdOrders(()=> {
      console.log('Ordenes Actualizadas')
    })
  }, 180000);
});
