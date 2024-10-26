import React from 'react';
import { CartConsumer } from './CartContext';
import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from './queries';

const MutationWrapper = ({ children }) => {
  const [placeOrder] = useMutation(PLACE_ORDER);
  return children(placeOrder);
};

class CartOverlay extends React.Component {
  handleAttributeChange = (item, attr, option, updateItemAttributes) => {
    updateItemAttributes(item, attr.name, option.value);
  };

  render() {
    const { isOpen, onClose } = this.props;

    if (!isOpen) return null;

    return (
      <CartConsumer>
        {({ cartItems, removeFromCart, updateItemQuantity, updateItemAttributes, getTotalPrice, clearCart }) => (
          <div className="cart-overlay active">
            <div className="cart-content">
              <h2>My Bag, {cartItems.length === 1 ? '1 item' : `${cartItems.length} items`}</h2>
              {cartItems.map((item) => (
                <div key={item.cartId} className="cart-item">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">{item.prices[0].currency.symbol}{item.prices[0].amount.toFixed(2)}</p>
                    
                    {/* Attributes Section */}
                    {item.attributes && item.attributes.map(attr => (
                      <div
                        key={attr.name}
                        className="item-attribute"
                        data-testid={`cart-item-attribute-${attr.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <p>{attr.name}:</p>
                        <div className="attribute-options">
                          {attr.items.map(option => (
                            <button
                              key={option.id}
                              className={`attribute-option ${
                                item.selectedAttributes[attr.name] === option.value ? 'selected' : ''
                              }`}
                              style={attr.type === 'swatch' ? { backgroundColor: option.value } : {}}
                              onClick={() => this.handleAttributeChange(
                                item, 
                                attr, 
                                option,
                                updateItemAttributes
                              )}
                              data-testid={`cart-item-attribute-${
                                attr.name.toLowerCase().replace(/\s+/g, '-')
                              }-${
                                option.value.toLowerCase().replace(/\s+/g, '-')
                              }${
                                item.selectedAttributes[attr.name] === option.value ? '-selected' : ''
                              }`}
                            >
                              {attr.type !== 'swatch' && option.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="item-actions">
                    <button
                      onClick={() => updateItemQuantity(item, item.quantity + 1)}
                      data-testid="cart-item-amount-increase"
                    >
                      +
                    </button>
                    <span data-testid="cart-item-amount">{item.quantity}</span>
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item);
                        } else {
                          updateItemQuantity(item, item.quantity - 1);
                        }
                      }}
                      data-testid="cart-item-amount-decrease"
                    >
                      -
                    </button>
                  </div>
                  
                  {/* Product Image */}
                  <img src={item.gallery[0]} alt={item.name} className="item-image" />
                </div>
              ))}

              {/* Cart Total */}
              <div className="cart-total" data-testid="cart-total">
                <h3>Total</h3>
                <p>${getTotalPrice().toFixed(2)}</p>
              </div>

              {/* Cart Buttons */}
              <div className="cart-buttons">
                <PlaceOrderButtonWithMutation
                  cartItems={cartItems}
                  getTotalPrice={getTotalPrice}
                  clearCart={clearCart}
                  disabled={cartItems.length === 0}
                />
              </div>
            </div>
          </div>
        )}
      </CartConsumer>
    );
  }
}

// PlaceOrderButton components remain the same
class PlaceOrderButtonWithMutation extends React.Component {
  render() {
    const { cartItems, getTotalPrice, clearCart, disabled } = this.props;

    return (
      <MutationWrapper>
        {(placeOrder) => (
          <PlaceOrderButton
            cartItems={cartItems}
            getTotalPrice={getTotalPrice}
            clearCart={clearCart}
            disabled={disabled}
            placeOrder={placeOrder}
          />
        )}
      </MutationWrapper>
    );
  }
}

class PlaceOrderButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlacingOrder: false
    };
  }

  handlePlaceOrder = async () => {
    const { cartItems, getTotalPrice, clearCart, disabled, placeOrder } = this.props;

    if (disabled || cartItems.length === 0) return;

    this.setState({ isPlacingOrder: true });

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        attributeValues: Object.entries(item.selectedAttributes || {}).map(([name, value]) => ({
          name,
          value,
          displayValue: value
        }))
      }));

      await placeOrder({
        variables: {
          items: orderItems,
          totalAmount: getTotalPrice(),
          currencyCode: 'USD'
        }
      });

      clearCart();
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      this.setState({ isPlacingOrder: false });
    }
  };

  render() {
    const { disabled } = this.props;
    const { isPlacingOrder } = this.state;

    return (
      <button
        className="checkout-btn"
        onClick={this.handlePlaceOrder}
        disabled={disabled || isPlacingOrder}
        data-testid="place-order-button"
      >
        {isPlacingOrder ? 'PLACING ORDER...' : 'PLACE ORDER'}
      </button>
    );
  }
}

export default CartOverlay;