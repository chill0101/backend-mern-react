/*
    Rutas de usuarios /auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT} = require('../middlewares/validate-jwt');

// router.get('/', (req, res) => {
//     console.log('Se requiere el /')
//     res.json({
//         ok: true,
//         msg: 'Hola Mundo'
//     })
// });

router.post(
    '/new', 
    [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe contener 6 caracteres').isLength({min: 6}),
        validateFields
    ], 
    createUser
);

router.post('/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe contener 6 caracteres').isLength({min: 6}),
        validateFields
    ],
    loginUser 
);

router.get('/renew', validateJWT, revalidateToken);



module.exports = router;