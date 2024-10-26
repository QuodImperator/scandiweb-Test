import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import CartOverlay from './CartOverlay';
import CartContext from './CartContext';
import { GET_CATEGORIES } from './queries';
import cart_icon from './assets/EmptyCart.png';

class Header extends React.Component {
  static contextType = CartContext;

  state = {
    isCartOpen: false,
    categories: []
  };

  componentDidMount() {
    // Fetch categories from GraphQL
    this.props.client.query({
      query: GET_CATEGORIES
    })
    .then(result => {
      this.setState({ categories: result.data.categories });
    })
    .catch(error => console.error("Error fetching categories:", error));
  }

  getActiveTab = () => {
    const path = this.props.location.pathname.slice(1); // Remove leading slash
    return path || 'all';
  };

  handleClick = (e, categoryName) => {
    e.preventDefault();
    this.props.onCategoryChange(categoryName);
    this.props.navigate(`/${categoryName}`);
  };

  toggleCart = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ isCartOpen: !prevState.isCartOpen }));
  };

  render() {
    const { isCartOpen, categories } = this.state;
    const { cartItems } = this.context;
    const activeTab = this.getActiveTab();
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
      <>
        <header className="main-header">
          <nav>
            <ul>
              {categories.map(category => (
                <li key={category.name}>
                  <Link
                    to={`/${category.name}`}
                    className={`nav-link ${activeTab === category.name ? 'active' : ''}`}
                    onClick={(e) => this.handleClick(e, category.name)}
                    data-testid={activeTab === category.name ? 'active-category-link' : 'category-link'}
                  >
                    {category.name.toUpperCase()}
                  </Link>
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

function HeaderWithRouterAndApollo(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, data, client } = useQuery(GET_CATEGORIES);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return <Header {...props} location={location} navigate={navigate} client={client} />;
}

export default HeaderWithRouterAndApollo;