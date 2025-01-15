import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Button, Snackbar, Alert, Chip } from '@mui/material';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ProductCard = ({ product }) => {
  const { name, price, quantity, tags, image } = product;
  const [userQuantity, setUserQuantity] = useState(1);
  const [notification, setNotification] = useState(false);
  const [quantityExceedNotification, setQuantityExceedNotification] = useState(false); 


  const totalPrice = price * userQuantity;

  const handleIncrement = () => {
    if (userQuantity < quantity) {
      setUserQuantity(userQuantity + 1);
    }else {
      setQuantityExceedNotification(true);
    }
  };

  const handleDecrement = () => {
    if (userQuantity > 1) {
      setUserQuantity(userQuantity - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Get the token from localStorage
      if (!token) {
        setNotification('Please log in to add items to the cart');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:5000/cart/add/',
        {
          productId: product.id,
          quantity: userQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
  
      setNotification(true);
      console.log('Product added to cart:', response.data);
    } catch (error) {
      console.error('Error adding product to cart:', error.response?.data || error.message);
      setNotification('Failed to add product to cart');
    }
  };
  

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(false);
  };

  return (
    <>
      <Card sx={{ maxWidth: 340, boxShadow: 3, borderRadius: 2, p: 2, fontFamily: "'Lato', sans-serif" }}>
        <CardMedia
          component="img"
          height="180"
          image={image || 'https://via.placeholder.com/180'}
          alt={name}
        />
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{ justifyContent: 'center', fontWeight: 'bold', mb: 1, fontFamily: "'Lato', sans-serif" }}
          >
            {name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: '#f0f0f0',
                  color: '#1976d2',
                }}
              />
            )) || 'N/A'}
          </Box>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            ₹{totalPrice.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={handleDecrement} disabled={userQuantity <= 1}>
              <RemoveIcon />
            </IconButton>
            <Typography
              variant="body1"
              sx={{
                mx: 1,
                px: 1,
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {userQuantity}
            </Typography>
            <IconButton onClick={handleIncrement} >
              <AddIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
            fullWidth
            sx={{
              fontFamily: "'Lato', sans-serif",
              '&:hover': {
                backgroundColor: '#1976d2',
                transform: 'scale(1.05)',
                transition: '0.3s',
              },
            }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ fontWeight:'bolder',width: '100%' }}>
          Product added to cart successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={quantityExceedNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity="warning" sx={{ fontWeight:'bolder',width: '100%' }}>
          No more available stock!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;
