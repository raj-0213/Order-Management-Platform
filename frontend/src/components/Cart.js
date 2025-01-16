import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        setNotification('Please log in to view the cart.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.cartItems);
      } catch (error) {
        console.error('Error fetching cart:', error.message);
        setNotification('Failed to load cart items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setNotification('Please log in to remove items from your cart.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(cart.filter((item) => item.productId !== productId));
      setNotification('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error.message);
      setNotification('Failed to remove item.');
    }
  };

  const handleQuantityChange = (productId, action) => {
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? {
            ...item,
            quantity:
              action === 'increment'
                ? item.quantity + 1
                : Math.max(item.quantity - 1, 1),
          }
          : item
      )
    );
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setNotification('Please log in to place an order.');
      return;
    }

    setOrderLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/order/complete',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotification('Order placed successfully!');
      setCart([]);
    } catch (error) {
      if (error.response?.status === 400) {
        const errorData = error.response.data;

        if (errorData.insufficientStockProducts) {
          const productList = errorData.insufficientStockProducts
            .map(
              (product) =>
                `${product.productName} (Available: ${product.availableStock})`
            )
            .join(', ');
          setNotification(`Insufficient stock for: ${productList}`);
        } else {
          setNotification(errorData.error || 'Failed to place order.');
        }
      } else {
        console.error('Error placing order:', error.message);
        setNotification('An unexpected error occurred while placing the order.');
      }
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification('');
  };

  const calculateTotal = () =>
    cart.reduce(
      (total, item) => total + item.Product.salesPrice * item.quantity,
      0
    );

  return (
    <Box
      sx={{
        marginTop: 3,
        fontFamily: 'Poppins, sans-serif',
        color: '#333',
        padding: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
      >
        Your Cart
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      ) : cart.length > 0 ? (
        cart.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
              padding: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
              backgroundColor: '#fff',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Box sx={{ flex: 3}}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 'bold',
                  fontSize:'1.7rem',
                  marginBottom: 1,
                }}
              >
                {item.Product.name}
              </Typography>
              <Typography sx={{fontSize:'1.3rem'}}>
                MRP:{' '}
                <span style={{ fontSize:'1.4rem',textDecoration: 'line-through', color: 'gray' }}>
                  ₹{item.Product.mrp}
                </span>{' '}
                | Sales Price:{' '}
                <span style={{ fontSize:'1.4rem', fontWeight: 'bolder', color: '#3f51b5' }}>
                  ₹{item.Product.salesPrice}
                </span>
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 2,
                mr: 4 ,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}
            >
              <IconButton
                onClick={() => handleQuantityChange(item.productId, 'decrement')}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
              <Typography
                sx={{
                  padding: '0 10px',
                  mr:-8,
                  ml:-8,
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  textAlign: 'center',
                }}
              >
                {item.quantity}
              </Typography>
              <IconButton
                onClick={() => handleQuantityChange(item.productId, 'increment')}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>

            <IconButton
              onClick={() => handleRemoveItem(item.productId)}
              sx={{
                flex: 1,
                border: '1px solid red',
                borderRadius: '4px', 
                padding: '5px 15px', 
                backgroundColor: '#ffebee',
                '&:hover': {
                  backgroundColor: '#ffcdd2',
                },
              }}
            >
              <RemoveIcon color="error" />
            </IconButton>
          </Box>
        ))
      ) : (
        <Typography>No items in the cart.</Typography>
      )}

      {cart.length > 0 && (
        <>
          <Box
            sx={{
              marginTop: 3,
              textAlign: 'right',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            Total Order Value: ₹{calculateTotal()}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
              disabled={orderLoading}
              sx={{
                fontWeight: 'bold',
                padding: '10px 20px',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
              }}
            >
              {orderLoading ? (
                <CircularProgress size={24} color="inherit" sx={{ marginRight: 1 }} />
              ) : (
                'Place Order'
              )}
            </Button>
          </Box>
        </>
      )}

      <Snackbar 
        open={notification !== ''} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Cart;



