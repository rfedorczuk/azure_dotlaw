// models/Transaction.js
const sql = require("../../config/db");

const Transaction = function(transaction) {
    this.user_id = transaction.user_id;
    this.vimeo_course_id = transaction.vimeo_course_id;
    this.amount = transaction.amount / 100;
};

Transaction.create = (newTransaction, result) => {
    console.log('newtrans ',JSON.stringify(newTransaction))
    sql.query("INSERT INTO transactions SET ?", newTransaction, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created transaction: ", { id: res.insertId, ...newTransaction });
        result(null, { id: res.insertId, ...newTransaction });
    });
};

module.exports = Transaction;
