const express = require('express');
const Transaction = require('../models/Transaction');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const { amount, type, description } = req.body;
    const transaction = await Transaction.create({
        userId: req.user.userId,
        amount,
        type,
        description
    });
    res.status(201).json({
        transaction,
        message: 'Transaction created successfully'
    })
});

router.get('/:userId', authenticateToken, async (req, res) => { 
    const { userId } = req.params;
    const transactions = await Transaction.findAll({
        where: {
            userId
        }
    });
    
    if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found'});
    }

    res.status(200).json({
        Transactions: transactions,
        message: 'Transactions retrieved successfully'
    })
});

module.exports = router;

