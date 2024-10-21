import React from 'react';
import { Link } from 'react-router-dom';
import CartOverlay from './CartOverlay';
import CartContext from './CartContext';
import cart_icon from './assets/EmptyCart.png';

class Header extends React.Component {
  static contextType = CartContext;

  state = {
    activeTab: 'All',
    isCartOpen: false
  };

  handleClick = (tab, categoryId) => {
    this.setState({ activeTab: tab });
    this.props.onCategoryChange(categoryId);
  };

  toggleCart = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ isCartOpen: !prevState.isCartOpen }));
  };

  render() {
    const { activeTab, isCartOpen } = this.state;
    const { cartItems } = this.context;
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
      <>
        <header className="main-header">
          <nav>
            <ul>
              <li>
                <Link
                  to="/"
                  className={`nav-link ${activeTab === 'All' ? 'active' : ''}`}
                  onClick={() => this.handleClick('All', 'all')}
                >
                  ALL
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className={`nav-link ${activeTab === 'Clothes' ? 'active' : ''}`}
                  onClick={() => this.handleClick('Clothes', '2')}
                >
                  CLOTHES
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className={`nav-link ${activeTab === 'Tech' ? 'active' : ''}`}
                  onClick={() => this.handleClick('Tech', '3')}
                >
                  TECH
                </Link>
              </li>
            </ul>
          </nav>
          <div className="cart-wrapper">
            <div className="cart-icon" onClick={this.toggleCart} data-testid="cart-btn">
              <img src={cart_icon} alt="Cart" />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </div>
          </div>
        </header>
        <CartOverlay isOpen={isCartOpen} onClose={this.toggleCart} />
        {isCartOpen && <div className="cart-overlay-wrapper" onClick={this.toggleCart}></div>}
      </>
    );
  }
}

export default Header;