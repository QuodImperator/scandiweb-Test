import React from 'react';

const CartContext = React.createContext();

export class CartProvider extends React.Component {
  state = {
    cartItems: []
  };

  addToCart = (product, selectedAttributes) => {
    this.setState(prevState => {
      const existingItem = prevState.cartItems.find(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
      );

      if (existingItem) {
        return {
          cartItems: prevState.cartItems.map(item => 
            item === existingItem 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          cartItems: [...prevState.cartItems, { ...product, quantity: 1, selectedAttributes }]
        };
      }
    });
  };

  removeFromCart = (itemToRemove) => {
    this.setState(prevState => ({
      cartItems: prevState.cartItems.filter(item => item !== itemToRemove)
    }));
  };

  updateItemQuantity = (item, newQuantity) => {
    this.setState(prevState => ({
      cartItems: prevState.cartItems.map(cartItem => 
        cartItem === item ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    }));
  };

  getTotalPrice = () => {
    return this.state.cartItems.reduce((total, item) => total + item.prices[0].amount * item.quantity, 0);
  };

  render() {
    const value = {
      cartItems: this.state.cartItems,
      addToCart: this.addToCart,
      removeFromCart: this.removeFromCart,
      updateItemQuantity: this.updateItemQuantity,
      getTotalPrice: this.getTotalPrice
    };

    return (
      <CartContext.Provider value={value}>
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

export const CartConsumer = CartContext.Consumer;

export default CartContext;