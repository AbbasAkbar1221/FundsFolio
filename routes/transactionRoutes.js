const express = require('express');
const {getAllTransactions, addTransaction} = require('../controllers/transactionController');


//router object
const router = express.Router();

// GET all transactions
router.post('/get-transaction', getAllTransactions);

// add a transaction
router.post('/add-transaction', addTransaction);



module.exports = router;