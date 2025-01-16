import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        setNotification('Please log in to view your orders.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/order/myorder', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setNotification('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCloseNotification = () => {
    setNotification('');
  };

  return (
    <Box sx={{ marginTop: 3, padding: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
      >
        My Orders
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <Box
            key={order.id}
            sx={{
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
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 'bold',
                fontSize:'1.4rem',
                marginBottom: 1,
              }}
            >
              Order No. {order.id}
            </Typography>
            <Typography>  
              <strong>Status:</strong> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Typography>
            <Typography>
              <strong>Total Amount:</strong> ₹{order.totalAmount}
            </Typography>

            <Box sx={{ marginTop: 2 }}>
              {order.OrderDetails.map((item) => (
                <Box
                  key={item.productId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    backgroundColor: '#f9f9f9',
                    marginBottom: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{fontFamily:'Roboto',fontSize:'1.2rem'}}>{item.Product.name}</Typography>
                  <Typography>
                    ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No orders yet.</Typography>
      )}

      <Snackbar open={notification !== ''} autoHideDuration={3000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity="info" sx={{ width: '100%' }}>
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyOrders;
