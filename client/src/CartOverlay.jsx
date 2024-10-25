import React from 'react';
import { CartConsumer } from './CartContext';
import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from './queries';

const MutationWrapper = ({ children }) => {
  const [placeOrder] = useMutation(PLACE_ORDER);
  return children(placeOrder);
};

class CartOverlay extends React.Component {
  render() {
    const { isOpen, onClose } = this.props;

    if (!isOpen) return null;

    return (
      <CartConsumer>
        {({ cartItems, removeFromCart, updateItemQuantity, updateItemAttributes, getTotalPrice, clearCart }) => (
          <div className="cart-overlay active">
            <div className="cart-content">
              <h2>My Bag, {cartItems.length === 1 ? '1 item' : `${cartItems.length} items`}</h2>
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">{item.prices[0].currency.symbol}{item.prices[0].amount.toFixed(2)}</p>
                    {item.attributes && item.attributes.map(attr => (
                      <div key={attr.name} className="item-attribute">
                        <p>{attr.name}:</p>
                        <div className="attribute-options">
                          {attr.items.map(option => (
                            <button
                              key={option.id}
                              className={`attribute-option ${item.selectedAttributes[attr.name] === option.value ? 'selected' : ''}`}
                              style={attr.type === 'swatch' ? { backgroundColor: option.value } : {}}
                              onClick={() => updateItemAttributes(item, attr.name, option.value)}
                            >
                              {attr.type !== 'swatch' && option.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="item-actions">
                    <button onClick={() => updateItemQuantity(item, item.quantity + 1)}>+</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => {
                      if (item.quantity === 1) {
                        removeFromCart(item);
                      } else {
                        updateItemQuantity(item, item.quantity - 1);
                      }
                    }}>-</button>
                  </div>
                  <img src={item.gallery[0]} alt={item.name} className="item-image" />
                </div>
              ))}

              <div className="cart-total">
                <h3>Total</h3>
                <p>${getTotalPrice().toFixed(2)}</p>
              </div>

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