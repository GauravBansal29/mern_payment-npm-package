# What is this ?

Get payment gateway in your MERN app by using this package.

# Installation and Setup

1. Using `npm i mern_pay` ,add package in both your server and client side of app
2. Go to https://razorpay.com/ , Login and make a Razorpay account.
3. Go to Setting -> API keys -> Generate API keys
4. Store the _KEY_ID_ and _KEY_SECRET_ in the .env file by name **RAZORPAY_KEY_ID** and **RAZORPAY_KEY_SECRET** in your backend.

# Usage

## Client Side

`import {processPayment} from 'mern-pay'`

call `processPayment` function with following parameters:

    processPayment(
    server,
    amount,
    customer_name,
    description ,
    customer_email,
    customer_contact,
    color_theme,
    onSuccess,
    onFailure)

- server - Add url of location where your server for the project is running
- amount - Add amount you want to get from the customer
- customer_name - Add name of the customer
- description - Purpose of payment
- customer_email - Email id of customer
- customer_contacts - Contact number of customer
- color_theme - color of the gateway (give a hexadecimal string denoting the color)

onSuccess is a function which will execute on successful payment
It has 4 default parameters :

1. Amount
2. Razorpay Payment Id
3. Razorpay Order Id
4. Razorpay Payment Signature

onFailure is a function which will execute on payment failure

## Demo

```js
import {processPayment} from "mern_pay" `
 const getPayment= ()=>{ `

    const onSuccess=(a,b,c,d)=>{
        //a,b,c,d are amount, payment id, order id and razorpay signature
        // add something you want to execute
        console.log("Got the payment");
    }
    const onFailure=()=>{
        //add something you want to execute
        console.log("Sorry its a decline");
    }

return
(<div className='btn btn-primary' onClick={()=>{processPayment(
'http://localhost:8000/api',
200,
'charles',
'payment for coffee' ,
'gaurav.rdps@gmail.com',
'9654004473',
'#0000FF',
onSuccess,
onFailure)}}>hello</div>);

}
export default getPayment;
```

NOTE: The ordering of the parameters is important and all the paramters are needed for the gateway to work properly.

## Server Side

`import {getKey, getOrder, paymentOrder} from "mern_pay"`

1. Make a get request to `/get-key` and pass getKey function to it
2. Make a post request to `/get-order` and pass getOrder function to it
3. Make a post request to `payment-order` and pass paymentOrder function to it

## Demo

```js
import { getKey, getOrder, paymentOrder } from "mern_payment";

const router = require("express").Router();

router.get("/get-key", getKey);
router.post("/get-order", getOrder);
router.post("/payment-order", paymentOrder);

module.exports = router;
```

# Payment Gateway

<img width="691" alt="add payment pic" src="https://user-images.githubusercontent.com/77917141/172527183-c48e9c42-cb13-4018-b4cf-066070ad015f.png">
<img width="656" alt="pay2" src="https://user-images.githubusercontent.com/77917141/172527801-20f52216-0dc5-459b-a579-a8e357577c01.png">
<img width="680" alt="pay3" src="https://user-images.githubusercontent.com/77917141/172527813-27f253d7-fc3f-4612-91c4-168b4c46b886.png">
