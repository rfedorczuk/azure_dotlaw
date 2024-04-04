const Transaction = require("../../models/website/transaction");
const Course = require("../../models/website/course")
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Oo539BHXkVoVGsNn7p4tuGX0b4DmnJK6K30WlDVD8swKQxI4ypibgwd9Ue7FWFtTGpJ6lrvq8OSgAqYvMuEmUBL00lBM8dcWX'); // Podmień na swój sekretny klucz API Stripe

exports.createPaymentSession = async (req, res) => {
console.log(JSON.stringify(req.body))
  try {
    const lineItems = req.body.items.map(item => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.name,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity,
    }));

    const courseIds = req.body.items.map(item => item.courseId).join(',');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success-page?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/failure-page`,
      metadata: { courseIds: courseIds } // Usunięto userId
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment session", error);
    res.status(500).send("Internal Server Error");
  }
};


exports.verifyPaymentAndEnroll = async (req, res) => {
    console.log(JSON.stringify(req.body));
    const { paymentSessionId, userId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(paymentSessionId);
        console.log('session ', session);

        if (session.payment_status === 'paid') {
            console.log('paid');
            const courseIds = session.metadata.courseIds.split(',');
            console.log('courseIds ', courseIds);
            let errors = [];
            let enrollments = [];

            for (const courseId of courseIds) {
                try {
                    // Zakładamy, że Transaction.create jest asynchroniczne
                    const transaction = new Transaction({
                        user_id: userId,
                        vimeo_course_id: courseId,
                        amount: session.amount_total / courseIds.length
                    });
                    const data = await Transaction.create(transaction);
                    enrollments.push(data);

                    try {
                        // Zapisz użytkownika na kurs
                        const enrollment = await Course.enrollUser(userId, courseId);
                        console.log(`User ${userId} enrolled in course ${courseId}`, enrollment);
                    } catch (err) {
                        console.error('Error enrolling user:', err);
                        errors.push(err);
                    }
                } catch (error) {
                    console.error('Error creating transaction:', error);
                    errors.push(error);
                }
            }

            if (errors.length > 0) {
                return res.status(500).send({
                    success: false,
                    message: "Some errors occurred while creating the Transactions or enrolling the user.",
                    errors: errors
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Payment verified and user enrolled in courses",
                    enrollments: enrollments
                });
            }
        } else {
            res.status(400).send({ success: false, message: "Payment not verified" });
        }
    } catch (error) {
        console.error("Error verifying payment session", error);
        res.status(500).send("Internal Server Error");
    }
};


