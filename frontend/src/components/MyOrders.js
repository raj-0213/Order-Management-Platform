import React from 'react';
import { Box, Typography } from '@mui/material';

const MyOrders = () => {
  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      <Typography>No orders yet.</Typography>
    </Box>
  );
};

export default MyOrders;
