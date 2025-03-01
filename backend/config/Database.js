import {Sequelize} from "sequelize";

const db = new Sequelize('tcc_note','root','',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;