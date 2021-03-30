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

  async SapAddOrUpdMaterial(callback) {
    try {
      const request = new sql.Request();
      await sql.connect(this.setting);
      request.execute("sp_SapInserUpdateMaterial", (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      });
    } catch (error) {}
	}
  async SapAddOrUpdLote(callback) {
    try {
      const request = new sql.Request();
      await sql.connect(this.setting);
      request.execute("sp_SapInserUpdateLote", (err, result) => {
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
      callback(null, query);
    } catch (e) {
      callback(e, null)
    }
	}

  async addMaterial(Matr, callback) {
    try {
      await sql.connect(this.setting)
      const query = await sql.query`insert into tbMateriales_temp (Material, Descripcion, Descripcion2 ,CreadoEl, ModificadoEl, IndBorrado, TipoMat, 
                                          GrupoMat, UndBase, UndPedido, UndPack, Longuitud, Ancho, 
                                          Alto, Numerador, Denominador,JerarquiaProd, CodBarra, Perfil)
                                          values(${Matr.MATNR},${Matr.MAKTX},${Matr.MAKTX} ,${Matr.ERSDA},${Matr.LAEDA},${Matr.LVORM},${Matr.MTART},
                                            ${Matr.MATKL},${Matr.MEINS},${Matr.BSTME},${Matr.GROES},${Matr.LAENG},${Matr.BREIT},
                                            ${Matr.HOEHE},${Matr.UMREZ},${Matr.UMREN},${Matr.PRODH},${Matr.EAN11},${Matr.VRKME})`
      callback(null, query)
    } catch (e) {
      callback(e, null)
    }
  }

  async addLotes(stLotes, callback) {
    try {
      await sql.connect(this.setting)
      const query = await sql.query`insert into tbLotes_temp (Material, Centro, Almacen, Lote, Stock, PeticionBorrado, FechaCreacion)
                                      values(${stLotes.MATNR},${stLotes.WERKS},${stLotes.LGORT},${stLotes.CHARG},
                                        ${stLotes.CLABS},${stLotes.LVORM},${stLotes.LAEDA})`
      callback(null, query)

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
      const query = await sql.query`insert into tbSapAudit (Data, Type, RegDate ) values(${data.dat}, ${data.tipo}, getdate())`
      callback(null, query)
    } catch (e) {
      callback(e, null)
    }
  }
}

module.exports = new Db();
