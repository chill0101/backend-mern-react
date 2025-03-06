const { response } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {
    console.log('Se requiere el /new') 

    const {email, password} = req.body;
    try {

        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ingresado ya existe'
            });
        }
        user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generar JWT
        const token = await generateJWT(user.id, user.name);
    
        res.status(201).json({ 
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        })
    }

}

const loginUser = async(req, res = response) => {
    console.log('Se requiere el /')

    const {email, password} = req.body;

    try {

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y contraseña no coinciden [user]'
            });
        }

        // Confirmar password
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y contraseña no coinciden [password]'
            });
        }

        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        })
    }


}

const revalidateToken = async(req, res = response) => {
    // TODO: validar y generar un nuevo JWT

    const uid = req.uid;
    const name = req.name;

    const token = await generateJWT(uid, name);

    
    console.log('Se requiere el /renew')
    res.json({
        ok: true,
        uid,
        name,
        token
    })
}


module.exports = {
    createUser,
    loginUser,
    revalidateToken
};