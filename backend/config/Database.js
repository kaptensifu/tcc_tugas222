import {Sequelize} from "sequelize";

const db = new Sequelize('tcc_note','admin','kanang107',{
    host: '34.30.171.1',
    dialect: 'mysql'
});

export default db;