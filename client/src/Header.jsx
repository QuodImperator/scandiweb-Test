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
            <div className="cart-icon" onClick={this.toggleCart}>
              <img src={cart_icon} alt="Cart" />
              {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
            </div>
          </div>
        </header>
        <div className="category-display">
          <h1>{activeTab}</h1>
        </div>
        <CartOverlay isOpen={isCartOpen} onClose={this.toggleCart} />
        {isCartOpen && <div className="cart-overlay-wrapper" onClick={this.toggleCart}></div>}
      </>
    );
  }
}

export default Header;