import React from 'react';
import { CartConsumer } from './CartContext';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const PLACE_ORDER = gql`
  mutation PlaceOrder($items: [CartItemInput!]!, $totalAmount: Float!, $currencyCode: String!) {
    placeOrder(items: $items, totalAmount: $totalAmount, currencyCode: $currencyCode) {
      order_id
      total_amount
      currency_code
      status
      created_at
      updated_at
    }
  }
`;

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
                <PlaceOrderButton
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


function PlaceOrderButton({ cartItems, getTotalPrice, clearCart, disabled }) {
  const [placeOrder] = useMutation(PLACE_ORDER);

  const handlePlaceOrder = async () => {
    if (disabled || cartItems.length === 0) return;

    try {
      console.log('Cart items before processing:', cartItems);
      
      const orderItems = cartItems.map(item => {
        const formattedAttributes = Object.entries(item.selectedAttributes || {}).map(([name, value]) => ({
          name: name,
          value: value,
          displayValue: value // Using value as displayValue since we have the selected value
        }));

        return {
          productId: item.id,
          quantity: item.quantity,
          attributeValues: formattedAttributes
        };
      });

      console.log('Processed order items:', orderItems);

      const { data } = await placeOrder({
        variables: {
          items: orderItems,
          totalAmount: getTotalPrice(),
          currencyCode: 'USD'
        }
      });

      console.log('Order placed successfully:', data);
      clearCart();
      alert('Order placed successfully!');
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message}`);
    }
  };

  return (
    <button 
      className="checkout-btn" 
      onClick={handlePlaceOrder}
      disabled={disabled}
    >
      PLACE ORDER
    </button>
  );
}

export default CartOverlay;