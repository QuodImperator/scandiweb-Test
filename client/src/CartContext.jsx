import React from 'react';

const CartContext = React.createContext();

export class CartProvider extends React.Component {
  state = {
    cartItems: [],
    isLoading: true,
    isCartOpen: false
  };

  componentDidMount() {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.setState({ 
          cartItems: JSON.parse(savedCart),
          isLoading: false 
        });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      this.setState({ isLoading: false });
    }
  }

  saveCart = (cartItems) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
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
        newCartItems = [...prevState.cartItems, {
          ...product,
          quantity: 1,
          selectedAttributes,
          cartId: `${product.id}-${Date.now()}`
        }];
      }

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

  removeFromCart = (itemToRemove) => {
    this.setState(prevState => {
      const newCartItems = prevState.cartItems.filter(item => item !== itemToRemove);
      this.saveCart(newCartItems);
      return { cartItems: newCartItems };
    });
  };

  updateItemQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;

    this.setState(prevState => {
      const newCartItems = prevState.cartItems.map(cartItem => 
        cartItem === item ? { ...cartItem, quantity: newQuantity } : cartItem
      );
      this.saveCart(newCartItems);
      return { cartItems: newCartItems };
    });
  };

  clearCart = () => {
    this.setState({ cartItems: [] });
    localStorage.removeItem('cart');
  };

  getTotalPrice = () => {
    return this.state.cartItems.reduce((total, item) => {
      const price = item.prices[0].amount;
      return total + (price * item.quantity);
    }, 0);
  };

  getTotalItems = () => {
    return this.state.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  toggleCart = () => {
    this.setState(prevState => ({
      isCartOpen: !prevState.isCartOpen
    }));
  };

  render() {
    if (this.state.isLoading) {
      return null;
    }

    const value = {
      cartItems: this.state.cartItems,
      isCartOpen: this.state.isCartOpen,
      toggleCart: this.toggleCart,         
      addToCart: this.addToCart,
      removeFromCart: this.removeFromCart,
      updateItemQuantity: this.updateItemQuantity,
      updateItemAttributes: this.updateItemAttributes,
      clearCart: this.clearCart,
      getTotalPrice: this.getTotalPrice,
      getTotalItems: this.getTotalItems
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