import React from 'react';
import { Query } from '@apollo/client/react/components';
import { GET_PRODUCT } from './queries';
import { CartConsumer } from './CartContext';
import { WithRouter } from './WithRouter';
import HTMLParser from './HTMLParser';
import ImageCarousel from './ImageCarousel';

class ProductDetailsContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: this.getInitialSelectedAttributes()
    };
  }

  getInitialSelectedAttributes() {
    const { product, cartItems } = this.props;
    const cartItem = cartItems.find(item => item.id === product.id);
    if (cartItem && cartItem.selectedAttributes) {
      return Object.keys(cartItem.selectedAttributes).reduce((acc, key) => {
        const attribute = product.attributes.find(attr => attr.name === key);
        if (attribute) {
          const item = attribute.items.find(item => item.value === cartItem.selectedAttributes[key]);
          if (item) {
            acc[attribute.id] = item.id;
          }
        }
        return acc;
      }, {});
    }
    return {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cartItems !== this.props.cartItems || prevProps.product !== this.props.product) {
      this.setState({
        selectedAttributes: this.getInitialSelectedAttributes()
      });
    }
  }

  handleAttributeChange = (attributeId, itemId) => {
    this.setState(prevState => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeId]: itemId
      }
    }));
  };

  areAllAttributesSelected = () => {
    const { product } = this.props;
    const { selectedAttributes } = this.state;
    return product.attributes.every(attribute => selectedAttributes.hasOwnProperty(attribute.id));
  }

  handleAddToCart = () => {
    const { product, addToCart, toggleCart } = this.props;
    const { selectedAttributes } = this.state;

    const cartAttributes = Object.keys(selectedAttributes).reduce((acc, attributeId) => {
      const attribute = product.attributes.find(attr => attr.id === attributeId);
      if (attribute) {
        const item = attribute.items.find(item => item.id === selectedAttributes[attributeId]);
        if (item) {
          acc[attribute.name] = item.value;
        }
      }
      return acc;
    }, {});

    addToCart(product, cartAttributes);
    if (toggleCart) {
      toggleCart();
    }
  }

  generateAttributeTestId = (attribute, item) => {
    const attributeName = attribute.name.toLowerCase();
    let itemValue = item.value;
    
    // Handle specific formats for color values
    if (attributeName === 'color') {
      // If it starts with #, it's a hex color
      if (itemValue.startsWith('#')) {
        itemValue = itemValue.toUpperCase();
      }
    }

    return `product-attribute-${attributeName}-${itemValue}`;
  }

  render() {
    const { product } = this.props;
    const { selectedAttributes } = this.state;
    const isAddToCartDisabled = !product.inStock || !this.areAllAttributesSelected();

    return (
      <div className="product-details">
        <div className="product-gallery-container">
          <ImageCarousel
            images={product.gallery}
            productName={product.name}
          />
        </div>
        
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <h2 className="product-brand">{product.brand}</h2>

          {product.attributes.map(attribute => (
            <div
              key={attribute.id}
              className="product-attribute"
              data-testid={`product-attribute-${attribute.name.toLowerCase()}`}
            >
              <h3>{attribute.name}:</h3>
              <div className="attribute-options">
                {attribute.items.map(item => (
                  <button
                    key={item.id}
                    className={`attribute-option ${selectedAttributes[attribute.id] === item.id ? 'selected' : ''}`}
                    onClick={() => this.handleAttributeChange(attribute.id, item.id)}
                    style={attribute.type === 'swatch' ? { backgroundColor: item.value } : {}}
                    data-testid={this.generateAttributeTestId(attribute, item)}
                  >
                    {attribute.type === 'swatch' ? '' : item.displayValue}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="product-price">
            <h3>PRICE:</h3>
            {product.prices.map((price, index) => (
              <p key={index}>{price.currency.symbol}{price.amount.toFixed(2)}</p>
            ))}
          </div>

          <button
            className="add-to-cart"
            disabled={isAddToCartDisabled}
            onClick={this.handleAddToCart}
            data-testid="add-to-cart"
          >
            {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>

          <div
            className="product-description"
            data-testid="product-description"
          >
            <HTMLParser html={product.description} />
          </div>
        </div>
      </div>
    );
  }
}

class ProductDetails extends React.Component {
  componentDidMount() {
    document.body.classList.add('product-details-active');
  }

  componentWillUnmount() {
    document.body.classList.remove('product-details-active');
  }

  render() {
    const { id } = this.props.router.params;

    return (
      <Query query={GET_PRODUCT} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return <div className="loading">Loading...</div>;
          if (error) return <div className="error">Error: {error.message}</div>;

          const product = data.product;
          if (!product) return <div className="error">Product not found</div>;

          return (
            <CartConsumer>
              {({ addToCart, cartItems, toggleCart }) => (
                <ProductDetailsContent 
                  product={product} 
                  addToCart={addToCart} 
                  cartItems={cartItems}
                  toggleCart={toggleCart}
                />
              )}
            </CartConsumer>
          );
        }}
      </Query>
    );
  }
}

export default WithRouter(ProductDetails);