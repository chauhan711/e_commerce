const userModel = require('../models/user.model');
const stripe = require('../utils/stripe.utils');
const orderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');
const stripeStatus = require('../helpers/stripeStatus.helper.js');
const paymentStatus = require('../helpers/paymentStatus.helper.js');
const userModels = require('../models/user.model.js');

//get all users
const allUsers = async(req,resp)=>{
    try{
        const users = await userModels.findAll();
        resp.status(200).send({users:users});
    }
    catch(err){
        resp.send({error:err});
    }   
}

// Payments Api's start
//get all payments
const getAllPayments = async(req,resp) => {
    try{
        const orders = await orderModel.findAll({
            include : [{
                model : userModel,
                require: false
            },{
                model : ProductModel,
                through : {attributes:['quantity']},
                require: false
            }]
        });
        resp.status(200).send({orders:orders});
    }catch(err){
        console.log(err);
        resp.status(400).send({error:err});
    }
}

//get all products of order
const getOrderProducts = async(req,resp) => {
    try{
        const orderId = req.params.orderId;
        const order = await orderModel.findOne({
            where:{id:orderId},
            include : {
                model : ProductModel,
                through : {attributes:['quantity']}
            }
        });
        resp.status(200).send({order:order});
    }
    catch(err){
        resp.status(400).send({error:err});
    }
} 

const refundPayment = async(req,resp) =>{
    try{
        const orderCharge = req.params.orderCharge;
        const order = orderCharge.split(',');
        const orderId = order[0];
        const charge = order[1];
        const refunded = await stripe.refundPayment(charge);
        //if successfully refunded
        if(refunded.refund.status == stripeStatus.success)
        {
            const orderData = await orderModel.findByPk(orderId);
            await orderData.update({status:paymentStatus.REFUNDED,payment_status:stripeStatus.success});
            return resp.send({message:'success',success:true});
        }else{
            if(result?.payment?.object?.status == stripeStatus.CARD_ERROR)
            {
                return resp.status(400).json({error : 'User card was declined.'});
            }
        }
    }
    catch(err){
        resp.status(400).send({error:err});
    }
}
//list of all refunded payments
const refundedPayments = async(req,resp) =>{
    try{
        const refunded = await stripe.refundList();
        resp.send({refunded:refunded.result.data});
    }
    catch(err){
        resp.status(400).send({error:err});
    }
}
// Payments Api's End

module.exports = {allUsers,getAllPayments,getOrderProducts,refundPayment,refundedPayments};