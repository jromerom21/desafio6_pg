
const fs = require('fs');
const path = require('path');

// Middleware para registrar las consultas
const registrarConsulta = (req, res, next) => {

    const logDir = path.join(__dirname, '..', 'logs');
    const logFilePath = path.join(logDir, 'consultas.log');

    // Crear la carpeta 'logs' si no existe
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Verifica Autorizacion
    const token = req.headers['authorization'];

    // verifica los parametros pasados en el body
    const body = req.body;

    let log = "";

    if (!token) {
        log += `Ruta consultada: ${req.originalUrl} ; Método: ${req.method} ; Fecha: ${new Date().toISOString()} ; Ruta sin credenciales\n`;
    } else {
        log += `Ruta consultada: ${req.originalUrl} ; Método: ${req.method} ; Fecha: ${new Date().toISOString()} ; Ruta con credenciales: ${token}\n`;
    }

    if (Object.keys(body).length > 0) {
        log += `Ruta consultada: ${req.originalUrl} ; Método: ${req.method} ; Fecha: ${new Date().toISOString()} ; Parametros Body :  ${JSON.stringify(body)} \n`;
    }

    // imprime en consola la ruta y parametros
    console.log(log)

    // Guardar el log en el archivo
    fs.appendFile(logFilePath, log, (err) => {
        if (err) {
            console.error('Error al registrar la consulta:', err);
        }
    });

    next();
};

// Middleware para registrar las Respuestas
const registrarRespuesta = (req, res, next) => {

    const logDir = path.join(__dirname, '..', 'logs');
    const logFilePath = path.join(logDir, 'consultas.log');

    // Crear la carpeta 'logs' si no existe
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Guardar la referencia original de res.send
    const originalSend = res.send;

    // Reemplazar res.send para capturar la respuesta
    res.send = function (body) {

        // Convertir la respuesta a JSON si es un objeto o un array
        const responseBody = typeof body === 'object' ? JSON.stringify(body) : body;

        const log = `Ruta: ${req.originalUrl} ; Método: ${req.method} ; Fecha: ${new Date().toISOString()} ; Respuesta: ${responseBody}\n`;

        // imprime en consola la respuesta
        console.log(log)

        // Guardar el log en el archivo
        fs.appendFile(logFilePath, log, (err) => {
            if (err) {
                console.error('Error al registrar la respuesta:', err);
            }
        });

        // Llamar a la función original de res.send
        return originalSend.apply(this, arguments);
    };

    next();
};


module.exports = { registrarConsulta, registrarRespuesta }