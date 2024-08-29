const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const createPayment = async(amount,token) =>{
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            confirm: true,
            payment_method_types: ['card'],
            payment_method_data : {
                    type : 'card',
                    card : {
                        token : token.id
                    }
            }
        });
        return {payment : paymentIntent};
    }
    catch(err){
        return {error : err};
    }
}
const getPayments = async ()=>{
    try{
        const transactions = await stripe.paymentIntents.list({
            limit: 100,
        });
        return {payments : transactions};
    }
    catch(err){
        return {error:err};
    }
}
const refundPayment = async (charge) => {
    try{
        const refund = await stripe.refunds.create({charge:charge});
        return {refund :refund};
    }
    catch(err){
        return {error:err};
    }
}
const refundList = async (charge) => {
    try{
        const refunded = await stripe.refunds.list();
        return {result :refunded};
    }
    catch(err){
        return {error:err};
    }
}
module.exports = {createPayment,getPayments,refundPayment,refundList}