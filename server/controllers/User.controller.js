const productModel = require('../models/product.model.js');
const sequelize = require('../db.js');
const UserModel = require('../models/user.model.js');
const userproductModel = require('../models/userProduct.model.js');
const CategoryModel = require('../models/category.model.js');
const stripe = require('../utils/stripe.utils.js');
const userProduct = require('../models/userProduct.model.js');
const orderModel = require('../models/order.model.js');
const OrderProducts = require('../models/orderProducts.model.js');
const stripeStatus = require('../helpers/stripeStatus.helper.js');
const paymentStatus = require('../helpers/paymentStatus.helper.js');
const ConversationModel = require('../models/conversation.model.js');
const MessageModel = require('../models/message.model.js');
const helpers = require('../helpers/helper.js');

const paypal  = require('@paypal/checkout-server-sdk');
const clientId = 'AXzXikAFC3jt6oOOE6VqajfrUF3wX-gVcd7DA4wan26noU8uG2cVeElNa60kcWR-PJUgIIZ__LG0W3Y7';
const clientSecret = 'EAH9ZEbR-tbqYrnSm4sGEEzN67TUC_rHWL47Aj6eXCvBgm-4H-W3BbWS4V-n2Pz_71meUzMr2qTkOu7_';
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const getAllProducts = async(req,res) => {
    try{
        const products = await productModel.findAll();

        //get user cart items
        const userAllProducts = await UserModel.findOne(
            {
            where:{id:req.user.id},
            include : {
                model:productModel,
                through : {attributes:['quantity']}
            }
            }
        );
        let quantity = 0;
        userAllProducts.products.forEach(item=>{
            quantity+= item.users_products.dataValues.quantity;
        });
        res.status(200).send({products:products,quantity:quantity});
    }
    catch(err){
        console.log(err);
        res.status(400).send({error:err});
    }
}
const addToCart = async(req,res)=>{
    try{
        const product_id = req.params.product_id;
        const product = await productModel.findByPk(product_id);
        const user = req.user;
        //get product quantity
        const productQuantity = product.quantity;
        if(productQuantity>0){
            const userProductData = {userId:user.id,productId:product.id};
            //check if already exist
            const checkUserProduct = await userproductModel.findOne({where:userProductData});
            if(!checkUserProduct){
                userProductData.quantity = 1;
                const createCart = await userproductModel.create(userProductData); 
            }
            else{
                // console.log('createCart');
                if(checkUserProduct.quantity<productQuantity)
                {
                    const updatedUserProductQuantity = checkUserProduct.quantity + 1;
                    const updateCart = await checkUserProduct.update({quantity:updatedUserProductQuantity}); 
                }
                else{
                    return res.send({message : 'Out of stock',outStock:true});
                }
            }
            return res.send({message:'Successfully added to cart',success:true});
        }
        return res.send({message:'Out of stock'});
    }catch(err){
        console.log(err);
        res.status(400).send({error:err});
    }
}
const getUserProducts = async(req,res) => {
    try{
        const products = await UserModel.findOne(
            {where:{id:req.user.id},
            include : {
                model : productModel,
                through : {attributes:['quantity']}
            }
            }
        );

        //get total amount
        let totalAmt = 0;
        products.products.forEach(item=>
            totalAmt += item?.price * item?.users_products?.dataValues?.quantity
        );
        let quantity = 0;
        products.products.forEach(item=>{
            quantity+= item.users_products.dataValues.quantity;
        });
        res.status(200).send({products:products,totalAmt:totalAmt,quantity:quantity});
    }
    catch(err){
        res.status(400).send({error:err});
    }
}
const generateOtp = async (req,res) =>{
    try{
        
    }
    catch(err){
        console.log(err);
        res.send({error:err});
    }
}
const makePayment = async (req,res) => {
    try {
        const { amount, cardToken } = req.body;
        const result = await stripe.createPayment(amount,cardToken);
        //if successfully received
        if(result.payment.status == stripeStatus.success){
            const payment_received = result.payment.amount_received/100;
            const total_amount = result.payment.amount_received/100;
            //if successfully received
            const order =  {
                            userId : req.user.id,
                            paymentId : result.payment.id,
                            payment_status : result.payment.status,
                            status : paymentStatus.RECEIVED,
                            total_amount : total_amount,
                            payment_received :payment_received,
                            latest_charge : result.payment.latest_charge
                            };
                //create order
                const create_order = await orderModel.create(order);
                
                //get user products from cart
                const userProducts = await userProduct.findAll({where:{userId:req.user.id}});

                const userProductsArray = [];
                userProducts.forEach(item=>{
                    userProductsArray.push({productId:item.dataValues.productId,quantity:item.quantity});
                });

                //store order products
                for (let item of userProductsArray) {
                    await OrderProducts.create({orderId:create_order.dataValues.id,productId:item.productId,quantity:item.quantity});
                }
                //remove items from cart
                const RemoveuserCart = await userProduct.destroy({where:{userId:req.user.id}});
                return res.json({message : 'Payment Successfull',success:true});
        }
        else{
            if(result?.payment?.object?.status == stripeStatus.CARD_ERROR)
            {
                return res.status(400).json({error : 'Your card was declined.'});
            }
        res.status(400).json({error : 'Something went wrong , please try again later.'});
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
const createPaypalPayment = async (req,res) => {
    try{
        const products = await UserModel.findOne(
            {where:{id:req.user.id},
            include : {
                model : productModel,
                through : {attributes:['quantity']}
            }
            }
        );

        //get total amount
        let totalAmt = 0;
        products.products.forEach(item=>
            totalAmt += item?.price * item?.users_products?.dataValues?.quantity
        );
   
        let request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": totalAmt
                    }
                }
             ]
        });
        const response = await client.execute(request);
        const orderID = response.result.id;
        const resJson = {
            orderID
        };
        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        // console.log(`Order: ${JSON.stringify(response.result)}`);
        res.status(200).send(resJson);
    }
    catch(err){
        console.log('err');
        res.status(500).send({err:err});
    }
}
const capturePaypalPayment = async (req,res) => {
    const data = req.body;
    const orderId = data.orderId;
    const orderID = req.body.orderID;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    try {
        const capture = await client.execute(request);
        const result = capture.result;
        // console.log(result);
        // return;
        if(result.status == 'COMPLETED')
        {
            const resJson = {
                result
            };
            const products = await UserModel.findOne(
                {where:{id:req.user.id},
                include : {
                    model : productModel,
                    through : {attributes:['quantity']}
                }
                }
            );
    
            //get total amount
            let totalAmt = 0;
            products.products.forEach(item=>
                totalAmt += item?.price * item?.users_products?.dataValues?.quantity
            );
           const payment_received = result.purchase_units[0].payments.captures[0].amount.value;
            //if successfully received
            const order =  {
                userId : req.user.id,
                paymentId : result.id,
                payment_status : result.status,
                status : paymentStatus.RECEIVED,
                total_amount : totalAmt,
                payment_received :payment_received,
                latest_charge : 'null'
            };
            //create order
            const create_order = await orderModel.create(order);

            //get user products from cart
            const userProducts = await userProduct.findAll({where:{userId:req.user.id}});

            const userProductsArray = [];
            userProducts.forEach(item=>{
                userProductsArray.push({productId:item.dataValues.productId,quantity:item.quantity});
            });

            //store order products
            for (let item of userProductsArray) {
                await OrderProducts.create({orderId:create_order.dataValues.id,productId:item.productId,quantity:item.quantity});
            }
            //remove items from cart
            const RemoveuserCart = await userProduct.destroy({where:{userId:req.user.id}});
            
            return res.json(resJson);
        }
    
        // return capture.result;
    } catch (err) {
        // Handle any errors from the call
        console.error(err);
        return res.send(500);
    }
}
//for conversation with admin
const createUserMessages = async (req,res) => {
    try{
        const data = req.body;
        const message = data.message;
        const user_two = data.user_two;
        let userTwoId;
        if(user_two === helpers.getAdminName()){
            userTwoId = helpers.getAdmin(); // By default 1
        }
        else{
            userTwoId = user_two;
        }
        const verifyConversationExistance = await ConversationModel.findOne({where:{user_one:req.user.id,user_two:userTwoId}});
        if(!verifyConversationExistance)
        {
            //create conversation
            //user 1 must be user / user 2 admin,saler and so on
            await ConversationModel.create({user_one:req.user.id,user_two:userTwoId,title:message});
        }
        else{
            //If conversation then create reply    
            const getConversation = await ConversationModel.findOne({where:{user_one:req.user.id,user_two:userTwoId}});
            //create new message
            await MessageModel.create({userId:req.user.id,reply:message,conversationId:getConversation.dataValues.id});
        }
        req.io.emit('UserNewMessage');
        res.status(200).send({message:'success'});
    }   
    catch(err)
    {
        res.status(400).send({error:err});
    }
}
const UserConversations = async (req,res) => {
    try{
        const id = req.params.id;
        let user_two;
        if(id === helpers.getAdminName()) {
            user_two = helpers.getAdmin();
        }
        else{
            user_two = id;
        }
        const UserConversations = await UserModel.findOne({
            where:{id:req.user.id},
            include : {
                model: ConversationModel,
                where: { user_two: user_two },
                required:false,
                as:'user_conversation',
                include : {
                    model : MessageModel,
                    required:false,
                }
            }
        });
        res.status(200).send({data:UserConversations});
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({error:err});
    }
}

module.exports = {
    getAllProducts,addToCart,getUserProducts,
    generateOtp,makePayment,createPaypalPayment,
    capturePaypalPayment,createUserMessages,UserConversations
};