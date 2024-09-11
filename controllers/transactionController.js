const transactionModel = require('../models/transactionModel');
const moment = require('moment');

const getAllTransactions = async (req, res) => {
    try {
        const { frequency , selectedDate, type } = req.body;
        const transactions = await transactionModel.find({
            ...(frequency !== 'custom' ?{
                date: {
                    $gt: moment().subtract(Number(frequency),'d').toDate(),
                }
            } : {
                date: {
                    $gte: selectedDate[0],
                    $lte: selectedDate[1],
                }

            }),
            userid: req.body.userid,
            ...(type !== 'all' && {type})
        });
        res.status(200).json({
            success: true,
            transactions
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// const addTransaction = async (req, res) => {
//     try {
//         const newTransaction = new transactionModel(req.body);
//         await newTransaction.save();
//         res.status(201).json({
//             success: true,
//             message: "Transaction added successfully",
//             newTransaction
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// }


const addTransaction = async (req, res) => {
    try {
        // const newTransaction = new transactionModel(req.body, {userid: req.body.userid});
        // console.log('req.body:', req.body);
        const newTransaction = new transactionModel({
            amount: req.body.amount,
            type: req.body.type,
            category: req.body.category,
            reference: req.body.reference,
            description: req.body.description,
            date: req.body.date,
            userid: req.body.userid  // Ensure that userid is being passed
        });
        await newTransaction.save();
        res.status(201).json({
            success: true,
            message: "Transaction added successfully",
            newTransaction
        });
    } catch (err) {
        console.log('Error:', err); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


module.exports = { getAllTransactions, addTransaction };