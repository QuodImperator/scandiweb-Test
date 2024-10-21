import React from 'react';
import { CartConsumer } from './CartContext';

class CartOverlay extends React.Component {
  render() {
    const { isOpen, onClose } = this.props;

    if (!isOpen) return null;

    return (
      <CartConsumer>
        {({ cartItems, removeFromCart, updateItemQuantity, getTotalPrice }) => (
          <div className="cart-overlay active">
            <div className="cart-content">
              <h2>My Bag, {cartItems.length} items</h2>
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
                    <button onClick={() => updateItemQuantity(item, Math.max(0, item.quantity - 1))}>-</button>
                  </div>
                  <img src={item.gallery[0]} alt={item.name} className="item-image" />
                </div>
              ))}
              <div className="cart-total">
                <h3>Total</h3>
                <p>${getTotalPrice().toFixed(2)}</p>
              </div>
              <div className="cart-buttons">
                <button className="checkout-btn">CHECK OUT</button>
              </div>
            </div>
          </div>
        )}
      </CartConsumer>
    );
  }
}

export default CartOverlay;