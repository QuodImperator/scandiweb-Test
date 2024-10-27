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

    const categories = [
      { id: 'all', path: '/all', name: 'ALL' },
      { id: 'clothes', path: '/clothes', name: 'CLOTHES' },
      { id: 'tech', path: '/tech', name: 'TECH' }
    ];

    return (
      <>
        <header className="main-header">
          <nav>
            <ul>
              {categories.map(category => (
                <li key={category.id}>
                  <a
                    href={category.path}
                    className={`nav-link ${activeTab === category.name.charAt(0) + category.name.slice(1).toLowerCase() ? 'active' : ''}`}
                    onClick={(e) => this.handleClick(e, category.id, category.path)}
                    data-testid={activeTab === category.name.charAt(0) + category.name.slice(1).toLowerCase() 
                      ? 'active-category-link' 
                      : 'category-link'}
                  >
                    {category.name}
                  </a>
                </li>
              ))}
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