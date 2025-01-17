// import React, { useState, useEffect } from 'react';
// import { Box,Button, Typography, CircularProgress, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import axios from 'axios';

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [user, setUser] = useState({});

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');

//       if (!token) {
//         setNotification('Please log in to view your orders.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get('http://localhost:5000/order/myorder', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const userResponse = await axios.get('http://localhost:5000/user/profile/', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(userResponse.data.user); // Set user details

//         if (statusFilter) {
//           // Filter orders based on status
//           setOrders(response.data.orders.filter(order => order.status === statusFilter));
//         } else {
//           setOrders(response.data.orders);
//         }

//       } catch (error) {
//         console.error('Error fetching orders:', error.message);
//         setNotification('Failed to load orders.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [statusFilter]);

//   const handleCloseNotification = () => {
//     setNotification('');
//   };

//   const handleStatusFilterChange = (e) => {
//     setStatusFilter(e.target.value);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'confirmed':
//         return 'green';
//       case 'shipped':
//         return 'blue';
//       case 'delivered':
//         return 'gray';
//       case 'pending':
//         return 'orange';
//       case 'cancelled':
//         return 'red';
//       default:
//         return 'black';
//     }
//   };

//   return (
//     <Box sx={{ marginTop: 3, padding: 2, borderRadius: 2 }}>
//       <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
//         My Orders
//       </Typography>

//       <FormControl fullWidth sx={{ marginBottom: 2 }}>
//         <InputLabel>Filter by Status</InputLabel>
//         <Select value={statusFilter} onChange={handleStatusFilterChange} label="Filter by Status">
//           <MenuItem value="">All</MenuItem>
//           <MenuItem value="pending">Pending</MenuItem>
//           <MenuItem value="confirmed">Confirmed</MenuItem>
//           <MenuItem value="shipped">Shipped</MenuItem>
//           <MenuItem value="delivered">Delivered</MenuItem>
//           <MenuItem value="cancelled">Cancelled</MenuItem>
//         </Select>
//       </FormControl>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
//           <CircularProgress />
//         </Box>
//       ) : orders.length > 0 ? (
//         orders.map((order) => (
//           <Box
//             key={order.id}
//             sx={{
//               marginBottom: 2,
//               padding: 2,
//               border: '1px solid #ddd',
//               borderRadius: 2,
//               backgroundColor: '#fff',
//               transition: 'box-shadow 0.3s',
//               '&:hover': {
//                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//               },
//             }}
//           >
//             <Typography variant="h6" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', fontSize: '1.4rem', marginBottom: 1 }}>
//               Order No. {order.id}
//             </Typography>

//             {/* User Name and Address */}
//             <Typography>
//               <strong>Customer Name:</strong> {user.username}
//             </Typography>
//             <Typography>
//               <strong>Shipping Address:</strong> {user.address}
//             </Typography>

//             {/* Order Status */}
//             {/* <Typography sx={{ textAlign: 'right', color: getStatusColor(order.status), bgcolor:`order.status`,fontWeight: 'bold' }}>
//               <strong>Status:</strong> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//             </Typography> */}
//             <Button
//               sx={{
//                 color: 'white',
//                 textAlign: 'center',
//                 backgroundColor: getStatusColor(order.status),
//                 padding: '6px 16px',
//                 borderRadius: '20px',
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 fontFamily: 'Arial, sans-serif',
//                 marginTop: 1,
//                 ml:120,
//                 width: 'auto',
//               }}
              
//             >
//               <strong>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</strong>
//             </Button>

//             <Typography>
//               <strong>Total Amount:</strong> ₹{order.totalAmount}
//             </Typography>

//             <Box sx={{ marginTop: 2 }}>
//               {order.OrderDetails.map((item) => (
//                 <Box
//                   key={item.productId}
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     padding: '8px 16px',
//                     backgroundColor: '#f9f9f9',
//                     marginBottom: 1,
//                     borderRadius: 2,
//                   }}
//                 >
//                   <Typography sx={{ fontFamily: 'Roboto', fontSize: '1.2rem' }}>
//                     <strong>Product Name:</strong> {item.Product.name}
//                   </Typography>
//                   <Typography>
//                     <strong>Quantity:</strong> {item.quantity}
//                   </Typography>
//                   <Typography>
//                     <strong>Total:</strong> ₹{item.price * item.quantity}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         ))
//       ) : (
//         <Typography>No orders yet.</Typography>
//       )}

//       <Snackbar open={notification !== ''} autoHideDuration={3000} onClose={handleCloseNotification}>
//         <Alert onClose={handleCloseNotification} severity="info" sx={{ width: '100%' }}>
//           {notification}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default MyOrders;


import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, Pagination } from '@mui/material';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [user, setUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const ordersPerPage = 5; // Number of orders per page

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

        const userResponse = await axios.get('http://localhost:5000/user/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data.user); // Set user details

        if (statusFilter) {
          // Filter orders based on status
          setOrders(response.data.orders.filter(order => order.status === statusFilter));
        } else {
          setOrders(response.data.orders);
        }

      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setNotification('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  const handleCloseNotification = () => {
    setNotification('');
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update current page
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'shipped':
        return 'blue';
      case 'delivered':
        return 'gray';
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'black';
    }
  };

  // Calculate orders to display based on current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <Box sx={{ marginTop: 3, padding: 2, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
        My Orders
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Filter by Status</InputLabel>
        <Select value={statusFilter} onChange={handleStatusFilterChange} label="Filter by Status">
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      ) : currentOrders.length > 0 ? (
        currentOrders.map((order) => (
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
            <Typography variant="h6" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', fontSize: '1.4rem', marginBottom: 1 }}>
              Order No. {order.id}
            </Typography>

            {/* User Name and Address */}
            <Typography>
              <strong>Customer Name:</strong> {user.username}
            </Typography>
            <Typography>
              <strong>Shipping Address:</strong> {user.address}
            </Typography>

            <Button
              sx={{
                color: 'white',
                textAlign: 'center',
                backgroundColor: getStatusColor(order.status),
                padding: '6px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                textTransform: 'none',
                fontFamily: 'Arial, sans-serif',
                marginTop: 1,
                ml: 120,
                width: 'auto',
              }}
            >
              <strong>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</strong>
            </Button>

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
                  <Typography sx={{ fontFamily: 'Roboto', fontSize: '1.2rem' }}>
                    <strong>Product Name:</strong> {item.Product.name}
                  </Typography>
                  <Typography>
                    <strong>Quantity:</strong> {item.quantity}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No orders yet.</Typography>
      )}

      <Pagination
        count={Math.ceil(orders.length / ordersPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
      />

      <Snackbar open={notification !== ''} autoHideDuration={3000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity="info" sx={{ width: '100%' }}>
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyOrders;
