import React from 'react';

const CartContext = React.createContext();

export class CartProvider extends React.Component {
  state = {
    cartItems: []
  };

  componentDidMount() {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.setState({ cartItems: JSON.parse(savedCart) });
    }
  }

  saveCart = (cartItems) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  addToCart = (product, selectedAttributes) => {
    this.setState(prevState => {
      const existingItem = prevState.cartItems.find(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
      );

      let newCartItems;
      if (existingItem) {
        newCartItems = prevState.cartItems.map(item => 
          item === existingItem 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCartItems = [...prevState.cartItems, { ...product, quantity: 1, selectedAttributes }];
      }

      this.saveCart(newCartItems);
      return { cartItems: newCartItems };
    });
  };

  removeFromCart = (itemToRemove) => {
    this.setState(prevState => {
      const newCartItems = prevState.cartItems.filter(item => item !== itemToRemove);
      this.saveCart(newCartItems);
      return { cartItems: newCartItems };
    });
  };

  updateItemQuantity = (item, newQuantity) => {
    this.setState(prevState => {
      const newCartItems = prevState.cartItems.map(cartItem => 
        cartItem === item ? { ...cartItem, quantity: newQuantity } : cartItem
      );
      this.saveCart(newCartItems);
      return { cartItems: newCartItems };
    });
  };

  updateItemAttributes = (item, attributeName, attributeValue) => {
    this.setState(prevState => {
      const newCartItems = prevState.cartItems.map(cartItem => 
        cartItem === item
          ? {
              ...cartItem,
              selectedAttributes: {
                ...cartItem.selectedAttributes,
                [attributeName]: attributeValue
              }
            }
          : cartItem
      );
      this.saveCart(newCartItems);
      return { cartItems: newCartItems };
    });
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
      updateItemAttributes: this.updateItemAttributes,
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