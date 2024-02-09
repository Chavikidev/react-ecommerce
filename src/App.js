import { Switch, Route } from 'react-router-dom';
import HomePage from './components/home-page';
import Shop from './components/pages/shop/shop';
import './App.scss';
import NotFound from './components/not-found';
import singleProduct from './components/single-product/single-product';
import CartPage from './components/pages/cart-page/cart-page';
import Checkout from './components/checkout/checkout';
import Success from './components/checkout/stripe-checkout/success';
import Canceled from './components/checkout/stripe-checkout/canceled';
import SignUp from './components/sign-up/sign-up';
import SignIn from './components/sign-in/sign-in';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/shop' component={Shop} />
        <Route path='/product/:id' component={singleProduct}/>
        <Route path='/cart' component={CartPage}/>
        <Route path='/checkout' component={Checkout}/> 
        <Route path='/success' component={Success}/>
        <Route path='/canceled' component={Canceled}/>
        <Route path='/sign-up' component={SignUp}/>
        <Route path='/sign-in' component={SignIn}/>
        <Route path='*' component={NotFound}/>
      </Switch>
    </div>
  );
}

export default App;
