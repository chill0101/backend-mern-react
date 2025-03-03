/* 
    Event Routes
    /api/events
*/   

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = Router();

// Todas tienen que pasar por la validación del JWT
router.use( validateJWT );

// Obtener eventos


router.get(
    '/',
    getEvents,
    
);

// Crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de fin es obligatoria').custom(isDate),
        validateFields
    ],
    createEvent );

// Actualizar evento

router.put('/:id', updateEvent );

// Borrar evento

router.delete('/:id', deleteEvent );


module.exports = router;