const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const routes = require('./routes/userRoute');
const transactionRoutes = require('./routes/transactionRoutes');

//rest objects
const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())

// user routes
app.use('/api/v1/users', routes);

// transaction routes
app.use('/api/v1/transactions', transactionRoutes);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
