
const { hashPassword, verifyPasswords } = require('../helpers/bcrypt')
const { signToken, verifyToken, decodeToken, getHeadersToken } = require('../helpers/jwt')
const usuarios = require('../models/usuarios')
const { validaEmail } = require('../helpers/verificaEmail')

const nuevoRegistro = async (req, res, next) => {

    try {

        const { email, password, rol, lenguage } = req.body;

        // Verificar formato del correo
        if (!validaEmail(email)) {
            //console.log('Formato de correo inválido')
            return res.status(400).json({ error: 'Formato de correo inválido' });
        }

        // Verificar que el campo password no este vacíos
        if (!password) {
            //console.log('password inválido')
            return res.status(400).json({ error: 'password inválido' });
        }

        // Verificar que el campo rol no este vacíos y no contengan los textos específicos
        if (!rol || rol === 'Seleccione un rol') {
            //console.log('Rol inválido')
            return res.status(400).json({ error: 'Rol inválido' });
        }

        // Verificar que el campos lenguage no estén vacíos y no contengan los textos específicos
        if (!lenguage || lenguage === 'Seleccione un Lenguage') {
            //console.log('Lenguage inválido')
            return res.status(400).json({ error: 'Lenguage inválido' });
        }

        const passwordHashed = hashPassword(password)
        const nuevoUsuario = await usuarios.nuevoRegistro(email, passwordHashed, rol, lenguage)

        res.send(nuevoUsuario)

    } catch (error) {
        next(error)
    }
}


const Login = async (req, res, next) => {

    try {
        const { email, password } = req.body

        //console.log(email) ; console.log(password)

        // Verificar formato del correo
        if (!validaEmail(email)) {
            return res.status(400).json({ error: 'Formato de correo inválido' });
        }

        // Verificar que el campo password no este vacíos
        if (!password) {
            //console.log('password inválido')
            return res.status(400).json({ error: 'password inválido' });
        }

        //verifica previamente si existe correo y retorna credenciales en caso de ser correcto
        const registroUsuario = await usuarios.verificaCredenciales(email)

        if (!registroUsuario) {
            //console.log('Correo NO Registrado')
            return res.status(400).json({ error: 'Correo NO Registrado' });
        }

        //console.log('Correo Valido'); console.log('Validando PAssword Encrypted')
        const match = verifyPasswords(password, registroUsuario.password)

        //console.log('Generando Token')

        if (match) {
            const data = {
                email
            }

            const token = signToken(data)
            
            res.status(200).json({
                token,
                email: registroUsuario.email,
                rol: registroUsuario.rol,
                lenguage: registroUsuario.lenguage
            });

        } else {
            res.send('Password incorrecto')
        }
    } catch (error) {
        next(error)
    }
}

const datosUsuario = async (req, res, next) => {

    try {

        //console.log('--> iniciando busqueda token >--')

        const token = getHeadersToken(req)
        //console.log('recibe el token')

        //verifyToken(token)
        //console.log('Verificando el Token')
        
        // Verificar el token y manejar errores
        const result = verifyToken(token);
        if (!result.valid) {
            return res.status(401).json({ error: result.message });
        }

        const { email } = decodeToken(token)
        //console.log('extrae el email valido desde el token')

        //console.log('buscando mas datos del usuario')

        const registroUsuario = await usuarios.verificaCredenciales(email)

        res.status(200).json([{
            email: registroUsuario.email,
            rol: registroUsuario.rol,
            lenguage: registroUsuario.lenguage
        }]);

    } catch (error) {
                if (error.name === 'TokenExpiredError') {
            console.error('TokenExpiredError: jwt expired');
            return res.status(401).json({ error: 'TokenExpiredError: jwt expired' });
        }
        next(error);
    }
}


module.exports = {
    nuevoRegistro, Login, datosUsuario
}
