
const { Router } = require('express');
const { nuevoRegistro, Login, datosUsuario } = require('../controllers/usuario.controller');
const router = Router()


router.post("/usuarios", nuevoRegistro)
router.post("/login", Login)
router.get("/usuarios", datosUsuario)


module.exports = router;