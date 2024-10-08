const userModel = require('../models/user.model');
const stripe = require('../utils/stripe.utils');
const helpers = require('../helpers/helper.js');
const orderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');
const stripeStatus = require('../helpers/stripeStatus.helper.js');
const paymentStatus = require('../helpers/paymentStatus.helper.js');
const userModels = require('../models/user.model.js');
const conversationModel = require('../models/conversation.model.js');
const MessageModel = require('../models/message.model.js');
const StorageModel = require('../models/storages.model.js');
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

//chat app api
const getAllConversation = async(req,resp)=>{
    try{
        const AdminId = helpers.getAdmin();
        if(req.user.id == AdminId){
            const userConversations = await userModel.findOne({
                where:{id:AdminId},
                include : {
                    model:conversationModel,
                    require:false,
                    as: 'others_conversation',
                    include : {
                        model : userModel,
                        as : 'conversation_user'
                    }
                }
            });
            console.log(userConversations);
            resp.status(200).send({data:userConversations});
        }
    }   
    catch(err){
        resp.status(400).send({error:err});
    }
}
const getConversation = async (req,res) => {
    try{
        const conversationId = req.params.id;
        const conversation = await conversationModel.findOne({
            where:{id:conversationId},
            include:[{
                model:MessageModel,
                require:false,
                include : {
                    model:StorageModel,
                    require:false
                }
            },
            {
                model:userModel,
                as:'conversation_user',
                required:false
            }
        ]
        });
        res.status(200).send({conversation:conversation});
    }
    catch(err){
        res.status(400).send({error:err});
    }
}
const addMessage = async (req,res) => {
    try{
        const file = req.file;
        const conversationId = req.body.conversationId;
        const conversation = await conversationModel.findByPk(conversationId);
        if(conversation)
        {
            const message = req.body.reply;
            //store message
            const addMessage = await MessageModel.create({
                userId : req.user.id , reply:message,conversationId:conversationId
            });
            if(file){
                //store file name if any
                const storage = await StorageModel.create({originalname: file.originalname,
                                    mimetype : file.mimetype,destination:file.destination,
                                    destination : file.destination,storageableId:addMessage.dataValues.id,
                                    storageableType:'Message',filename:file.filename,path:file.path
                                });
            }
            req.io.emit('UserNewMessage');
            return res.status(200).send({message:'success'});
        }
    }catch(err)
    {
        console.log(err);
    }
}
const updateMessage = async(req,res) => {
    try{
        const {messageId} = req.body;
        const {reply} = req.body;
        //find msg and update
        const message = await MessageModel.findByPk(messageId);
        const updated = await message.update({reply:reply});
        req.io.emit('UserNewMessage');
        return res.status(200).send({message:'success'});
    }
    catch(err)
    {
        res.status(400).send({error:err});
    }
}
const deleteMessage = async(req,res) => {
    try{
        const id = req.params.id;
        await MessageModel.destroy({where:{id:id}});
        req.io.emit('UserNewMessage');
        res.status(200).send({message:'success'});
    }
    catch(err){
        res.status(400).send({error:err});
    }
}


module.exports = {
    allUsers,getAllPayments,getOrderProducts,
    refundPayment,refundedPayments,getAllConversation,
    getConversation,addMessage,updateMessage,deleteMessage
};