
const { DB } = require("../config/db")
const format = require('pg-format')


const existeCorreo = async (email) => {
    try {
        const SQLQuery = format(`
            SELECT * FROM usuarios
            WHERE email = %L`,
            email
        );

        const { rowCount } = await DB.query(SQLQuery);

        return rowCount > 0;

    } catch (error) {
        throw error;
    }
}

const nuevoRegistro = async (email, passwordHashed, rol, lenguaje) => {
    try {

        // Verificar si el correo ya existe
        const correoExiste = await existeCorreo(email);

        if (correoExiste) {
            //console.log('El correo ya existe');
            return { error: 'El correo ya existe' };
        }

        const SQLQuery = format(`
            INSERT INTO usuarios
            VALUES (DEFAULT, %L, %L, %L, %L) RETURNING *`,
            email,
            passwordHashed,
            rol,
            lenguaje
        );

        const { rows: [user] } = await DB.query(SQLQuery);
        //console.log('Usuario creado en BD')

        return user;

    } catch (error) {
        throw error;
    }
}

const verificaCredenciales = async (email) => {
    try {

        // Verificar si el correo ya existe
        const correoExiste = await existeCorreo(email);

        if (!correoExiste) {
            //console.log('Correo no esta Registrado');
            return null;
        }

        const SQLQuery = format(`
            SELECT * FROM usuarios
            WHERE email = %L`,
            email
        );

        const {rows} = await DB.query(SQLQuery)

        //if (!rowCount) throw new Error('USER_NOT_FOUND')

        //console.log(rows[0]);
        
        return rows[0]

    } catch (error) {
        throw error
    }
}


module.exports = {
    nuevoRegistro, verificaCredenciales
}