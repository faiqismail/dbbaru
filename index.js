const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import routes
const kendaraanRouter = require('./routes/kendaraan');
app.use( kendaraanRouter);
const transmisiRouter = require('./routes/transmisi');
app.use( transmisiRouter);


app.listen(port, () => {
    console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
