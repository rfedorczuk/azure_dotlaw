// controllers/TransactionController.js
const Transaction = require("../models/website/transaction");
const axios = require('axios');

exports.purchaseCourse = async (req, res) => {
    console.log('purchase ',JSON.stringify(req.body))
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const transaction = new Transaction({
        user_id: req.body.user_id,
        vimeo_course_id: req.body.vimeo_course_id,
        amount: req.body.amount
    });
    console.log('transaction ',transaction)

    
      //  const accessToken = '2438a355d87d1b7df09ac8bf75a48adf';
        // Verify the course exists on Vimeo
     
        // await axios.get(`https://api.vimeo.com/users/210802805/videos/${transaction.vimeo_course_id}`, {
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`
        //     }
        // });

        try {
            const data = await Transaction.create(transaction);
            res.status(200).send({ success: true, transaction: data });
        } catch (err) {
            console.error('Error creating transaction:', err);
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Transaction."
            });
        }        
    };