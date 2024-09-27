import React from 'react';
import logo from './assets/a-logo.png'
import cart from './assets/EmptyCart.png'

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'women',
    };
  }

  handleClick = (tab) => {
    this.setState({ activeTab: tab });
    if (this.props.onCategoryChange) {
      this.props.onCategoryChange(tab);
    }
  };

  render() {
    const { activeTab } = this.state;

    return (
      <div>
        <ul>
          <li>
            <a
              href="#"
              className={activeTab === 'women' ? 'active' : ''}
              onClick={() => this.handleClick('women')}
            >
              WOMEN
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === 'men' ? 'active' : ''}
              onClick={() => this.handleClick('men')}
            >
              MEN
            </a>
          </li>
          <li>
            <a 
              href="#"
              className={activeTab === 'kids' ? 'active' : ''}
              onClick={() => this.handleClick('kids')}
            >
              KIDS
            </a>
          </li>
          <li>
            <img src={logo} alt="Logo" className="logo" />
          </li>
          <li>
            <a href="#">
              <img src={cart} alt="Cart" className="cart" />
            </a>
          </li>
        </ul>

        {/* Display the name of the selected category below the navigation */}
        <div className="category-display">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </div>
      </div>
    );
  }
}

export default Header;