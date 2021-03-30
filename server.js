const Db = require("./Utils/db");
const cron = require("node-cron");
const Sap = require("./Utils/sap");
const db = require("./Utils/db");
const { getSapOrders, getSapOrdersComp, getMaterial, getLotes} = Sap


cron.schedule("30 15 * * *", function () { //Schedule Task
  //Minutos, Horas, Mes, Dia del mes, Dia de la semana,
  
  const dat = new Date();
  let mesA = null
  let mes = null
  let dayA = null
  let day = null
  let last = null

  if ((dat.getMonth()+1)<10) {
    mes = `0${dat.getMonth()+1}`
  } else {
    mes = dat.getMonth()+1
  }

  if (dat.getDate() == '1') {
    last = new Date(dat.getFullYear(), dat.getMonth, 0)
    dayA = last.getDate()
    day = dat.getDate()
    if ((last.getMonth()+1)<10) {
      mesA = `0${last.getMonth()+1}`
    } else {
      mesA = last.getMonth()+1
    }

  } else {
    dayA = dat.getDate() - 1
    day = dat.getDate()
    if ((dat.getMonth()+1)<10) {
      mesA = `0${dat.getMonth()+1}`
    } else {
      mesA = dat.getMonth()+1
    }
  }

  let fechaA = `${dat.getFullYear()}${mesA}${dayA}`
  let fecha = `${dat.getFullYear()}${mes}${day}`;
  let hora = `${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`;
  let totalOrd = null
  let totalOrdComp = null
  console.log(`Corriendo en fecha ${fecha} y hora ${hora}`);
  getSapOrders(fechaA, fecha, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      totalOrd = data.length 
      data.forEach((ord) => {
        Db.addOrdersTemps(ord, function (e, data) {
          if (e) {
            Db.auditReg(
              { dat: `Orden ${ord.AUFNR} error: ${e.message}`, tipo: "error" },
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
            totalOrdComp = data.length
            data.forEach((comp) => {
              Db.addOrdersCompTemps(comp, function (e, data) {
                if (e) {
                  Db.auditReg(
                    { dat: `CompOrden ${comp.AUFNR} error: ${e.message}`, tipo: "error" },
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
      console.log(`${totalOrd} Ordenes y ${totalOrdComp} Componentes fueron registrados/actualizados`)
    })
  }, 180000);
});

cron.schedule("0 0 13 * * *", function () {

  const dat = new Date();
  let mesA = null
  let mes = null
  let dayA = null
  let day = null
  let last = null
  let countMaterial = null
  if ((dat.getMonth()+1)<10) {
    mes = `0${dat.getMonth()+1}`
  } else {
    mes = dat.getMonth()+1
  }

  if (dat.getDate() == '1') {
    last = new Date(dat.getFullYear(), dat.getMonth, 0)
    dayA = last.getDate()
    day = dat.getDate()
    if ((last.getMonth()+1)<10) {
      mesA = `0${last.getMonth()+1}`
    } else {
      mesA = last.getMonth()+1
    }

  } else {
    dayA = dat.getDate() - 1
    day = dat.getDate()
    if ((dat.getMonth()+1)<10) {
      mesA = `0${dat.getMonth()+1}`
    } else {
      mesA = dat.getMonth()+1
    }
  }

  let fechaA = `${dat.getFullYear()}${mesA}${dayA}`
  let fecha = `${dat.getFullYear()}${mes}${day}`;
  let hora = `${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`;

  console.log(`Iniciando carga de material a las ${hora}`)
  getMaterial(fechaA, fecha, function(err, data) {
    if(err) {
      console.log(err)
    } else {
      
      countMaterial = data.length
      
      data.forEach((mat) => {
        mat.MAKTX = String(mat.MAKTX).replace(/'/g,"")
        
        db.addMaterial(mat, (e, res) => {
          if(e) {
            db.auditReg({ dat: `Material ${mat.MATNR} error:${e.message}`, tipo: "error" }),
            function (err, data) {
              console.log(err);
              console.log("Error Register");
            }
          } else {
            Db.auditReg(
              { dat: `Material ${mat.MATNR}`, tipo: "Registro" },
              function (err, data) {
                if (err) {
                  console.log(err);
                }
                console.log(`Material ${mat.MATNR} registrado`);
              }
            )
          }
        })
      })
    }
  })
  setTimeout(function(){
    db.SapAddOrUpdMaterial(()=> {
      console.log(`${countMaterial} Materiales fueron registrados/actualizados`)
    })
  },300000)

})

cron.schedule("* 59 * * * *", function () {
  const dat = new Date();
  let mesA = null
  let mes = null
  let dayA = null
  let day = null
  let last = null
  let countLote = null

  if ((dat.getMonth()+1)<10) {
    mes = `0${dat.getMonth()+1}`
  } else {
    mes = dat.getMonth()+1
  }

  if (dat.getDate() == '1') {
    last = new Date(dat.getFullYear(), dat.getMonth, 0)
    dayA = last.getDate()
    day = dat.getDate()
    if ((last.getMonth()+1)<10) {
      mesA = `0${last.getMonth()+1}`
    } else {
      mesA = last.getMonth()+1
    }

  } else {
    dayA = dat.getDate() - 1
    day = dat.getDate()
    if ((dat.getMonth()+1)<10) {
      mesA = `0${dat.getMonth()+1}`
    } else {
      mesA = dat.getMonth()+1
    }
  }

  let fechaA = `${dat.getFullYear()}${mesA}${dayA}`
  let fecha = `${dat.getFullYear()}${mes}${day}`;
  let hora = `${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`;

  console.log(`Iniciando la carga de Lotes a la ${hora}`)
  getLotes(fechaA, fecha, (err, data) => {
    if(err) {
      console.log(err)
    } else {
      countLote = data.length
      console.log(countLote)
      data.forEach((lot) => {
        db.addLotes(lot,(e, res)=>{
          if(e) {
            db.auditReg({ dat: `Lote ${lot.CHARG} error: ${e.message}`, tipo: "error" },
            function (err, data) {
              console.log(err);
              console.log("Error Register");
            })
          } else {
            Db.auditReg(
              { dat: `Lote ${lot.CHARG}`, tipo: "Registro" },
              function (err, data) {
                if (err) {
                  console.log(err);
                }
                console.log(`Lote ${lot.CHARG} registrado`);
              }
            )
          }
        })
      })
    }
  })

  setTimeout(() => {
    db.SapAddOrUpdLote(()=> {
      console.log(`${countLote} Lotes fueron registrados/actualizados`)
    })
  }, 120000);

})