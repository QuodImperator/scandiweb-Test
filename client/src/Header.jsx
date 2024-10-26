import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  handleClick = (e, categoryId, path) => {
    e.preventDefault();
    this.props.onCategoryChange(categoryId);
    this.props.navigate(path);
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
                <a
                  href="/all"
                  className={`nav-link ${activeTab === 'All' ? 'active' : ''}`}
                  onClick={(e) => this.handleClick(e, 'all', '/all')}
                >
                  ALL
                </a>
              </li>
              <li>
                <a
                  href="/clothes"
                  className={`nav-link ${activeTab === 'Clothes' ? 'active' : ''}`}
                  onClick={(e) => this.handleClick(e, '2', '/clothes')}
                >
                  CLOTHES
                </a>
              </li>
              <li>
                <a
                  href="/tech"
                  className={`nav-link ${activeTab === 'Tech' ? 'active' : ''}`}
                  onClick={(e) => this.handleClick(e, '3', '/tech')}
                >
                  TECH
                </a>
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
  const navigate = useNavigate();
  return <Header {...props} location={location} navigate={navigate} />;
}

export default HeaderWithRouter;