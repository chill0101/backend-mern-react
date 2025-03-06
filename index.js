const path = require('path');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// console.log(process.env);

//* Crear el servidor de express
const app = express();

//* Habilitar CORS
app.use(cors());

//* Base de datos
dbConnection();

//* Directorio Público
app.use(express.static('public'));

//* Lectura y parseo del body
app.use(express.json());

//* Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


//* Escuchar peticiones
const startServer = (retryCount = 0) => {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });

    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            console.log(`Puerto ${PORT} en uso. Intentando con puerto ${Number(PORT)+1}...`);
            
            if (retryCount < 10) {  // Limitar reintentos para evitar bucles infinitos
                // Intentar con el siguiente número de puerto
                process.env.PORT = Number(PORT) + 1;
                startServer(retryCount + 1);
            } else {
                console.error('No se pudo encontrar un puerto disponible después de múltiples intentos.');
            }
        } else {
            console.error('Error al iniciar el servidor:', e);
        }
    });
};

startServer();