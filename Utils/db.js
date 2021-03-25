const sql = require("mssql");

class Db {
  constructor() {
    this.config = {
      user: process.env.SQLUSER || "AceroGmUser",
      password: process.env.SQLPAS || "AceroGmUser",
      server: process.env.SQLSRV || "10.82.33.71",
      port: 1433,
      options: {
        instanceName: process.env.SQLINT || "MSSQLSERVER",
        database: process.env.SQLDB || "DB_AceroGm",
        enableArithAbort: true,
      },
    };
    this.setting = `mssql://${this.config.user}:${this.config.password}@${this.config.server}/${this.config.options.database}`;
  }
//Database class
  async SapAddOrUpdOrders(callback) {
    try {
      const request = new sql.Request();
      await sql.connect(this.setting);
      request.execute("sp_SapInserUpdateOrdenes", (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      });
    } catch (error) {}
	}
	
	async addOrdersTemps(orderm, callback) {
		try {
      await sql.connect(this.setting);
      const query = await sql.query`insert into tbOrdenProduccion_temp 
                                    (Orden, Material, Prog, UndMedida, FechaInicio, FechaFin, EPH, HojaRuta, NumOperacion,
                                      CantBase, ValorPrefijado, VerFab, PuestoTrabajo, Centro)
                                      values(${orderm.AUFNR}, ${orderm.MATNR},${orderm.GAMNG}, ${orderm.GMEIN}, 
                                              ${orderm.GSTRS}, ${orderm.GLTRS}, ${orderm.BMSCH/orderm.VGW01}, ${orderm.PLNNR}, 
                                              ${orderm.VORNR}, ${orderm.BMSCH},${orderm.VGW01}, ${orderm.VERID}, 
                                              ${orderm.ARBPL}, ${orderm.WERKS})`;
                                              // values(${orderm.aufnrField}, ${orderm.plnbezField},${orderm.gamngField}, ${orderm.gmeinField}, 
                                              //   ${orderm.gstrpField}, ${orderm.gltrsField}, ${orderm.ephField}, ${orderm.plnnrField}, 
                                              //   ${orderm.vornrField}, ${orderm.bmschField},${orderm.vgw01Field}, ${orderm.veridField}, 
                                              //   ${orderm.arbplField}, ${orderm.werksField})
      callback(null, query);
    } catch (e) {
      callback(e, null)
    }
	}

	async addOrdersCompTemps(comp, callback) {
		try {
			await sql.connect(this.setting);
			const query = await sql.query`insert into tbOrdenProduccionComp_temp
                                      (Orden, Componente, Un_Medida)
                                      values(${comp.AUFNR}, ${comp.IDNRK},${comp.MEINS})`

			callback(null, query)
		}
		catch(e) {
			callback(e, null)
		}
  }
  
  async auditReg(data, callback) {
    try {
      const query = await sql.query`insert into tbOrdenAudit (Data, Type, RegDate ) values(${data.dat}, ${data.tipo}, getdate())`
      callback(null, query)
    } catch (e) {
      callback(e, null)
    }
  }
}

module.exports = new Db();
