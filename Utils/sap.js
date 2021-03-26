const axios = require("axios");
//Sap Call functions
function getSapOrders(FechaI, FechaF, callback) { 
  try {
    axios
      .get(
        `http://extgmp01:8065/?name=http_tb_iep_AceroGM_tbOrdenes_rd_full&where=CRTX~SPRAS%20=%20'S'%20%20AND%20CRHD~ENDDA%20=%20'99991231'%20AND%20MAPL~ZAEHL%20=%20'00000001'%20AND%20MAPL~PLNTY%20%3C%3E%20'Q'%20AND%20MAPL~LOEKZ%20%3C%3E%20'X'%20AND%20MAPL~PLNAL%20=%20'01'%20%20AND%20TJ02T~SPRAS%20=%20'S'%20AND%20TJ02T~TXT04%20IN%20('LIB.')%20AND%20AUFK~LOEKZ%20%3C%3E%20'X'%20AND%20((AUFK~AEDAT%20%3E=%20'${FechaI}'%20AND%20AUFK~AEDAT%20%3E=%20'${FechaF}')%20OR%20(AUFK~ERDAT%20%3E=%20'${FechaI}'%20AND%20AUFK~ERDAT%20%3E=%20'${FechaF}'))`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (res) {
        callback(null, res.data)
      })
      .catch(function (err) {
        callback(err, null)
      });
  } catch (e) {
    callback(e, null);
  }
}

function getSapOrdersComp(FechaI, FechaF, callback) {
  try {
    axios
      .get(
        `http://extgmp01:8065/?name=http_tb_iep_AceroGM_tbOrdenesComponentes_rd_full&where=CRTX~SPRAS%20=%20%27S%27%20%20AND%20CRHD~ENDDA%20=%20%2799991231%27%20AND%20MAPL~ZAEHL%20=%20%2700000001%27%20AND%20MAPL~PLNTY%20%3C%3E%20%27Q%27%20AND%20MAPL~LOEKZ%20%3C%3E%20%27X%27%20AND%20MAPL~PLNAL%20=%20%2701%27%20%20AND%20TJ02T~SPRAS%20=%20%27S%27%20AND%20TJ02T~TXT04%20IN%20(%27LIB.%27)%20AND%20AUFK~LOEKZ%20%3C%3E%20%27X%27%20AND%20((AUFK~ERDAT%20%3E=%20%27${FechaI}%27%20AND%20AUFK~ERDAT%20%3C=%20%27${FechaF}%27)%20OR%20(AUFK~AEDAT%20%3E=%20%27${FechaI}%27%20AND%20AUFK~AEDAT%20%3C=%20%27${FechaF}%27))`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (res) {
        callback(null, res.data);
      })
      .catch(function (err) {
        callback(err, null)
      });
  } catch (e) {
    callback(e, null);
  }
}

module.exports = { getSapOrders, getSapOrdersComp };
