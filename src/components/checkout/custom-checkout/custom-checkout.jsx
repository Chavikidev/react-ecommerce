import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import {
    CardNumberElement,
    CardExpiryElement,
    useStripe,
    useElements,
    CardCvcElement
} from '@stripe/react-stripe-js';
import {UserContext} from '../../../context/user-context';
import {fetchFromAPI} from '../../../helpers'

const CustomCheckout=({shipping, cartItems, history:{push}})=>{
    const {user}=useContext(UserContext);
    const [processing, setProcessing]=useState(false);
    const [error, setError]=useState(null);
    const [clientSecret, setClientSecret]=useState(null);
    const [cards,setCards]=useState(null);
    const [payment, setPaymentCard]=useState('');
    const [saveCard, setSaveCard]=useState(false);
    const [paymentIntentId, setPaymentIntentId]=useState(null);
    const stripe=useStripe();
    const elements=useElements();

    useEffect(()=>{
        const items=cartItems.map(item =>({price:item.price, quantity: item.quantity}));
        if(user){
            const savedCards=async ()=>{
                try {
                    const cardsList=await fetchFromAPI('get-payment-methods',{
                        method:'GET',
                    });
                    setCards(cardsList);
                } catch (error) {
                    console.log(error);
                }
            }
            savedCards();
        }
        if(shipping){
            const body={
                cartItems:items,
                shipping:{
                    name:shipping.name,
                    address:{
                        line1:shipping.address
                    }
                },
                description: 'Payment intent for nomad shop',
                receipt_email: shipping.mail
            }

            const customCheckout=async()=>{
                const {clientSecret, id}=await fetchFromAPI('create-payment-intent',{
                    body
                });
                setClientSecret(clientSecret);
                console.log(id);
                setPaymentIntentId(id);
            }
            customCheckout();
        }
    },[shipping, cartItems, user]);

    const handleCheckout= async ()=>{
        setProcessing(true);
        let si;
        // check if user has selected to save card
        if(saveCard){
            // make to create a setup intent
            si=await fetchFromAPI('save-payment-method');
        }
        const payload=await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card:elements.getElement(CardNumberElement)
            }
        });
        if(payload.error){
            setError(`Payment failed: ${payload.error.message}`)
        }else{
            if(saveCard && si){
                // send the customers card setup intent to be saved to stripe
                await stripe.confirmCardSetup(si.client_secret,{
                    payment_method:{
                        card: elements.getElement(CardNumberElement)
                    }
                })

            }else{
                push('/success');
            }
            push('/success');
        }
    }

    const savedCardCheckout=async ()=>{
        setProcessing(true);
        //Update the payment intent to include the customer parameter
        console.log(paymentIntentId);
        const {clientSecret}=await fetchFromAPI('update-payment-intent',{
            body: {paymentIntentId}, method:'PUT'
        })
        const payload= await stripe.confirmCardPayment(clientSecret,{
            payment_method:payment,
        });
        if(payload.error){
            setError(`Payment Failed: ${payload.error.message}`);
            setProcessing(false);
        }else{
            push('/success');
        }
    }

    const cardHandleChange=event=>{
        const {error}=event;
        setError(error ? error.message : '');
    }

    const cardStyle = {
        style: {
          base: {
            color: "#000",
            fontFamily: 'Roboto, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#606060",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        }
      };

      let cardOption;
      if(cards){
        cardOption=cards.map(card=>{
            const {card:{brand,last4, exp_month,exp_year}}=card;
            return (
                <option key={card.id} value={card.id}>
                    {`${brand}/**** **** **** ${last4} ${exp_month}/${exp_year}`}
                </option>
            );
        });
        cardOption.unshift(
            <option key='Select a card' value=''>Select a card</option>
        )
      }
    return (
        <div>
            {
                user && (cards && cards.length>0) &&
                <div>
                    <h4>Pay with saved card</h4>
                    <select value={payment} onChange={e=>setPaymentCard(e.target.value)}>
                    {cardOption}
                    </select>
                    <button
                    type="submit"
                    disabled={processing || !payment}
                    className="button is-black nomad-btn submit saved-card-btn"
                    onClick={()=>savedCardCheckout()}
                    >
                    {
                        processing ? 'PROCESSING' : 'PAY WITH SAVED CARD'
                    } 
                    </button>
                </div>
            }
            <h4>Enter Payment Details</h4>
            <div className="stripe-card">
                <CardNumberElement
                    className="card-element"
                    options={cardStyle}
                    onChange={cardHandleChange}
                />
            </div>
            <div className="stripe-card">
                <CardExpiryElement
                    className="card-element"
                    options={cardStyle}
                    onChange={cardHandleChange}
                />
            </div>
            <div className="stripe-card">
                <CardCvcElement
                    className="card-element"
                    options={cardStyle}
                    onChange={cardHandleChange}
                />
            </div>
            {
                user &&
                <div className="save-card">
                    <label>Save Card</label>
                    <input 
                    type="checkbox" 
                    checked={saveCard} 
                    onChange={e=>setSaveCard(e.target.checked)} />

                </div>
            }
            <div className="submit-btn">
                <button
                    disabled={processing}
                    className="button id-black nomad-btn submit"
                    onClick={()=>handleCheckout()}
                >
                    {
                        processing ? 'PROCESSING' : 'PAY'
                    }
                </button>
            </div>
            {
                error && (<p className="error-message">{error}</p>)
            }
        </div>
    );
}

export default withRouter(CustomCheckout);