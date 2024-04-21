const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index')

const app = express();

(async () => {
    try {
        await mongoose.connect("");

        console.log('Database connected!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }

})();

app.use(cors({
    credentials: true,
    origin: true
}));


app.use(cookieParser());
app.use(express.json());
app.use('/api',routes)

app.listen(5000, () => {
    console.log('App running at http://localhost:5000');
});