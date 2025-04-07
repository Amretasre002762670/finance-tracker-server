const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const transactionsRoutes = require('./routes/transactions');
const sequelize = require('./models');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config();

// if the secret key is persistant 
const generateSecretKey = () => {
    if (!process.env.JWT_SECRETKEY) {
        const secretKey = crypto.randomBytes(64).toString('hex');
        
        const envPath = path.resolve(__dirname, '.env');

        // Check if .env file exists, create it if it doesn't
        if (!fs.existsSync(envPath)) {
            fs.writeFileSync(envPath, '');
            console.log('.env file created');
        }
        
        const newEnvContent = `JWT_SECRETKEY=${secretKey}\n${fs.readFileSync(envPath, 'utf-8')}`;
        fs.writeFileSync(envPath, newEnvContent);
        
        console.log(`Generated and saved secret key: ${secretKey}`);
        process.env.JWT_SECRETKEY = secretKey;  
    }
    console.log(process.env.JWT_SECRETKEY, "secret key");
    return process.env.JWT_SECRETKEY;
};

const secretKey = generateSecretKey();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/transactions', transactionsRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

sequelize.sync().then(() => {console.log("Database synced")});

app.listen(5001, () => console.log('Server is running on port 5000'));