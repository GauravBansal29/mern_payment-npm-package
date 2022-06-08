
const axios= require('axios');

async function processPayment(
    server, 
    getamount, 
    customer_name, 
    payment_details , 
    customer_email,
    customer_contacts, 
    color_theme, 
    onSuccess, 
    onFailure)
{   
     const  script=  document.createElement('script');
     document.body.appendChild(script);
     
     
     script.onload= async()=>{
        try{
            // button press pr ye API CALL hogi jisme hume bs amount aur currency batani hai
            const {data}= await axios.get(`${server}/get-key`);
            const razorpayKey= data.key;
            console.log(razorpayKey);
            const res = await axios.post(`${server}/get-order`,{
                amount: getamount +'00',
                currency: "INR"
            });
            console.log(res.data);
            // ye hume ek order id dega (order ke andar hamari access key h isliye paise humare paas aaenge in production)
            const {amount, id:order_id, currency } = res.data;
            // handler is the function which is executed on successful payment
            const options={
                key: razorpayKey,
                amount: amount.toString(),
                currency: currency,
                name: customer_name, 
                description: payment_details,
                order_id: order_id,
                handler: function(response)
                {
                    const result=  axios.post(`${server}/payment-order`,{
                        amount: amount,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    })

                    //success
                    //setPaymentdetail(response.data);  //get order id 
                    onSuccess(amount/100, response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature );
                },
                prefill:{
                    name: customer_name,
                    email: customer_email,
                    contact: customer_contacts,
                },
                theme:{
                    color: color_theme
                }

            };
            const paymentObject= new window.Razorpay(options);
            paymentObject.open();

        }
        catch(err)
        {
            console.log(err);
            onFailure();
        }
        
     }
     script.onerror= ()=>{
        alert("Failed to Load Razorpay , check your connection");
    };
    script.src="https://checkout.razorpay.com/v1/checkout.js";

}
const getKey= (req, res)=>{
    res.send({key: process.env.RAZORPAY_KEY_ID});
 }

const getOrder = async(req, res)=>{
    
    console.log(req.body.amount, req.body.currency);
    try{ 
   const key_id= process.env.RAZORPAY_KEY_ID;
    const key_secret= process.env.RAZORPAY_KEY_SECRET;
    const encodedBase64Token = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    const authorization = `Basic ${encodedBase64Token}`;
    const response = await axios({
        url: 'https://api.razorpay.com/v1/orders',
        method: 'post',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
        },
        data: {
                "amount": req.body.amount,
                "currency": req.body.currency
            }
    
    });
    console.log(response.data);
    return res.status(200).json(response.data);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }

}

// this will be called on successful payment only , we are just storing the payment in the database
//pay signature appears on successful payment

//checking the paysignature is left-> needs to be done to verify actually a order has been done or some forgery has taken place by pushing a request

const paymentOrder=  (req, res)=>{
    try{
        const {amount,razorpayPaymentId , razorpayOrderId , razorpaySignature} = req.body;

        return res.status(200).json({amount, razorpayOrderId, razorpayPaymentId, razorpaySignature});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
}
module.exports= {getKey, getOrder, paymentOrder, processPayment};
