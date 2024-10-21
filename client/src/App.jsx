import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import ProductGrid from './ProductGrid';
import ProductDetails from './ProductDetails';
import { CartProvider } from './CartContext';

class App extends React.Component {
  state = {
    selectedCategory: 'all'
  };

  handleCategoryChange = (categoryId) => {
    this.setState({ selectedCategory: categoryId });
  };

  render() {
    return (
      <CartProvider>
        <Router>
          <div className="App">
            <Header onCategoryChange={this.handleCategoryChange} />
            <div className="main-content">
              <Routes>
                <Route 
                  path="/" 
                  element={<ProductGrid categoryId={this.state.selectedCategory} />} 
                />
                <Route 
                  path="/product/:id" 
                  element={<ProductDetails />} 
                />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    );
  }
}

export default App;