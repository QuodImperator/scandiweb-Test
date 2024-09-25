import React from 'react';
import logo from './assets/a-logo.png'
import cart from './assets/EmptyCart.png'

class Header extends React.Component {
  render() {
    return (
      <ul>
        <li><a href="#">WOMEN</a></li>
        <li><a href="#">MEN</a></li>
        <li><a href="#">KIDS</a></li>
        <li><img src={logo} alt="Logo" className="logo"/></li>
        <li><a href="#"><img src={cart} alt="Cart" className="cart"/></a></li>
      </ul>
    );
  }
}

export default Header;