import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CartOverlay from './CartOverlay';
import CartContext from './CartContext';
import cart_icon from './assets/EmptyCart.png';

class Header extends React.Component {
  static contextType = CartContext;

  state = {
    isCartOpen: false
  };

  getActiveTab = () => {
    const path = this.props.location.pathname;
    if (path.includes('tech')) return 'Tech';
    if (path.includes('clothes')) return 'Clothes';
    return 'All';
  };

  handleCategoryClick = (categoryId) => {
    this.props.onCategoryChange(categoryId);
  };

  toggleCart = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ isCartOpen: !prevState.isCartOpen }));
  };

  render() {
    const { isCartOpen } = this.state;
    const { cartItems } = this.context;
    const activeTab = this.getActiveTab();
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
      <>
        <header className="main-header">
          <nav>
            <ul>
              <li>
                <Link
                  to="/all"
                  className={`nav-link ${activeTab === 'All' ? 'active' : ''}`}
                  onClick={() => this.handleCategoryClick('all')}
                  data-testid={activeTab === 'All' ? 'active-category-link' : 'category-link'}
                >
                  ALL
                </Link>
              </li>
              <li>
                <Link
                  to="/clothes"
                  className={`nav-link ${activeTab === 'Clothes' ? 'active' : ''}`}
                  onClick={() => this.handleCategoryClick('2')}
                  data-testid={activeTab === 'Clothes' ? 'active-category-link' : 'category-link'}
                >
                  CLOTHES
                </Link>
              </li>
              <li>
                <Link
                  to="/tech"
                  className={`nav-link ${activeTab === 'Tech' ? 'active' : ''}`}
                  onClick={() => this.handleCategoryClick('3')}
                  data-testid={activeTab === 'Tech' ? 'active-category-link' : 'category-link'}
                >
                  TECH
                </Link>
              </li>
            </ul>
          </nav>
          <div className="cart-wrapper">
            <button 
              onClick={this.toggleCart}
              data-testid="cart-btn"
              className="cart-icon-button"
            >
              <img src={cart_icon} alt="Cart" className="cart-icon" />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </button>
          </div>
        </header>
        {isCartOpen && (
          <>
            <CartOverlay isOpen={isCartOpen} onClose={this.toggleCart} />
            <div className="cart-overlay-wrapper" onClick={this.toggleCart}></div>
          </>
        )}
      </>
    );
  }
}

function HeaderWithRouter(props) {
  const location = useLocation();
  return <Header {...props} location={location} />;
}

export default HeaderWithRouter;