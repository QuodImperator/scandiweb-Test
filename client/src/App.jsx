import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Header from './Header.jsx';
import ProductGrid from './ProductGrid.jsx';
import ProductDetails from './ProductDetails.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 'all'
    };
  }

  handleCategoryChange = (categoryId) => {
    this.setState({ selectedCategory: categoryId });
  }

  render() {
    return (
      <Router>
        <div>
          <Header onCategoryChange={this.handleCategoryChange} />
          <Routes>
            <Route path="/" element={<ProductGrid categoryId={this.state.selectedCategory} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;