import React, {useContext} from "react";
import { Link } from "react-router-dom";
import CartIcon from '../cart-icon/cart-icon';
// import { auth,getAuth } from "firebase/auth";
import {UserContext} from '../../context/user-context';
import './headers.styles.scss';
import { auth } from "../../firebase";

const Header=()=>{
    const {user}=useContext(UserContext);
    return (
        <nav className='nav-menu container'>
            <div className="logo">
                <Link to='/'>NOMAD</Link>
            </div>
            <ul>
                <li>
                    <Link to='/'>
                    Home
                    </Link>
                </li>
                <li>
                    <Link to='/shop'>
                    Shop
                    </Link>
                </li>
                {
                    !user &&
                    <li>
                        <Link to='/sign-in'>
                            Sign In
                        </Link>
                    </li>
                }
                {
                    user &&
                    <li onClick={()=>auth.signOut()}>
                            Sign Out
                    </li>
                }
                                {
                    !user &&
                    <li>
                        <Link to='/sign-up'>
                            Sign Up
                        </Link>
                    </li>
                }
            </ul>
            <CartIcon/>
        </nav>
    )
};

export default Header;