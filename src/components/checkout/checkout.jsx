import React, { useContext, useState } from "react";
import { CartContext } from "../../context/cart-context";
import Layout from "../shared/layout";
// import StripeCheckout from "./stripe-checkout/stripe-checkout";
import ShippingAddress from "./custom-checkout/shipping-adress";
import './checkout.styles.scss';
import CustomCheckout from "./custom-checkout/custom-checkout";

const Checkout=()=>{
    const { itemCount, total, cartItems }=useContext(CartContext);
    const [shipping, setShipping]=useState(null);
    const addresShown={
        display:(shipping ? 'none':'block')
    }
    const cardShown={
        display: (shipping ? 'block' : 'none')
    }
    return (
        <Layout>
            <div className="checkout">
                <h2>Checkout Summary</h2>
                <h3>{`Total items: ${itemCount}`}</h3>
                <h4>{`Amount to Pay: $${total}`}</h4>
                {/* <StripeCheckout/> */}
                <div style={addresShown}>
                    <ShippingAddress setShipping={setShipping}/>
                </div>
                <div style={cardShown}>
                    <CustomCheckout {...{shipping, cartItems}} />
                </div>
            </div>
        </Layout>
    )
};

export default Checkout;