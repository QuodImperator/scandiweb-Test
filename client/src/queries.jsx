import { gql } from '@apollo/client';

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems {
      id
      productId
      name
      brand
      gallery
      quantity
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      selectedAttributes {
        name
        value
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!, $selectedAttributes: [AttributeInput!]!) {
    addToCart(productId: $productId, quantity: $quantity, selectedAttributes: $selectedAttributes) {
      id
      quantity
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartItemId: ID!) {
    removeFromCart(cartItemId: $cartItemId) {
      id
    }
  }
`;

export const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItemQuantity($cartItemId: ID!, $quantity: Int!) {
    updateCartItemQuantity(cartItemId: $cartItemId, quantity: $quantity) {
      id
      quantity
    }
  }
`;

export const PLACE_ORDER = gql`
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

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category {
        name
      }
      prices {
        amount
        currency {
          symbol
        }
      }
      brand
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($categoryId: String) {
    products(categoryId: $categoryId) {
      id
      name
      inStock
      gallery
      prices {
        amount
        currency {
          symbol
        }
      }
      brand
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      category_id
      name
    }
  }
`;