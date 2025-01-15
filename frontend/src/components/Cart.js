import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const Cart = () => {
  const [cart, setCart] = useState([]);

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      {cart.length > 0 ? (
        cart.map((product, index) => (
          <Typography key={index}>{product.name} - ${product.price}</Typography>
        ))
      ) : (
        <Typography>No items in the cart.</Typography>
      )}
      <Button variant="contained" color="primary">Proceed to Checkout</Button>
    </Box>
  );
};

export default Cart;
