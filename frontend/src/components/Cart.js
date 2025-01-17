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
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        setNotification('Please log in to view the cart.');
        navigate('/login');
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

  const handleContinueShoppingClick = () => {
    navigate('/'); 
  };

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
      await axios.post(
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

  const calculateSavings = () =>
    cart.reduce(
      (savings, item) =>
        savings +
        (item.Product.mrp - item.Product.salesPrice) * item.quantity,
      0
    );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 3,
        fontFamily: 'Poppins, sans-serif',
        color: '#333',
        padding: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
      }}
    >
      {/* Cart Items Section */}
      <Box sx={{ flex: 2, marginRight: 3 }}>
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
              <Box
                component="img"
                src={item.Product.images}
                alt={item.Product.name}
                sx={{
                  width: 80,
                  height: 80,
                  marginRight: 2,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
              <Box sx={{ flex: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    marginBottom: 1,
                  }}
                >
                  {item.Product.name}
                </Typography>
                <Typography>
                  MRP:{' '}
                  <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                    ₹{item.Product.mrp}
                  </span>{' '}
                  | Sales Price:{' '}
                  <span style={{ fontWeight: 'bolder', color: '#3f51b5' }}>
                    ₹{item.Product.salesPrice}
                  </span>
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                }}
              >
                <IconButton
                  onClick={() =>
                    handleQuantityChange(item.productId, 'decrement')
                  }
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
                <Typography
                  sx={{
                    padding: '0 10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    textAlign: 'center',
                  }}
                >
                  {item.quantity}
                </Typography>
                <IconButton
                  onClick={() =>
                    handleQuantityChange(item.productId, 'increment')
                  }
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>

              <IconButton
                onClick={() => handleRemoveItem(item.productId)}
                sx={{
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
      </Box>

      {/* Order Summary Section */}

      <Box sx={{ flex: 1 }}>
        <Card
          sx={{
            padding: 2,
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', marginBottom: 4 }}
            >
              Order Summary
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Total Items: <b>{cart.length}</b>
            </Typography>
            <Typography sx={{ color: 'green', mb: 2 }}>
              Total Savings: ₹<b>{calculateSavings()}</b>
            </Typography>
            <Typography>
              Total Payable Amount: ₹<b>{calculateTotal()}</b>
            </Typography>
          </CardContent>
          <CardActions>
            {cart.length === 0 ? (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleContinueShoppingClick}
              >
                Continue Shopping
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePlaceOrder}
                disabled={orderLoading}
              >
                {orderLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Place Order'
                )}
              </Button>
            )}
          </CardActions>
        </Card>
      </Box>

      {/* <Box sx={{ flex: 1 }}>
        <Card
          sx={{
            padding: 2,
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', marginBottom: 4 }}
            >
              Order Summary
            </Typography>
            <Typography sx={{ mb:2}}>
              Total Items: <b>{cart.length}</b>
            </Typography>
            <Typography sx={{color: 'green', mb:2}}>
              Total Savings: ₹<b>{calculateSavings()}</b>
            </Typography>
            <Typography>
              Total Payble Amount: ₹<b>{calculateTotal()}</b>
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handlePlaceOrder}
              disabled={orderLoading}
            >
              {orderLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Place Order'
              )}
            </Button>
          </CardActions>
        </Card>
      </Box> */}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification !== ''}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          sx={{ width: '100%' }}
        >
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Cart;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   CircularProgress,
//   Snackbar,
//   Alert,
// } from '@mui/material';
// import RemoveIcon from '@mui/icons-material/Remove';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// const Cart = () => {
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [orderLoading, setOrderLoading] = useState(false);
//   const [notification, setNotification] = useState('');

//   useEffect(() => {
//     const fetchCart = async () => {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');

//       if (!token) {
//         setNotification('Please log in to view the cart.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get('http://localhost:5000/cart', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(response.data.cartItems);
//         setCart(response.data.cartItems);
//       } catch (error) {
//         console.error('Error fetching cart:', error.message);
//         setNotification('Failed to load cart items.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, []);

//   const handleRemoveItem = async (productId) => {
//     const token = localStorage.getItem('authToken');

//     if (!token) {
//       setNotification('Please log in to remove items from your cart.');
//       return;
//     }

//     try {
//       await axios.delete(`http://localhost:5000/cart/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setCart(cart.filter((item) => item.productId !== productId));
//       setNotification('Item removed from cart');
//     } catch (error) {
//       console.error('Error removing item:', error.message);
//       setNotification('Failed to remove item.');
//     }
//   };

//   const handleQuantityChange = (productId, action) => {
//     setCart(
//       cart.map((item) =>
//         item.productId === productId
//           ? {
//               ...item,
//               quantity:
//                 action === 'increment'
//                   ? item.quantity + 1
//                   : Math.max(item.quantity - 1, 1),
//             }
//           : item
//       )
//     );
//   };

//   const handlePlaceOrder = async () => {
//     const token = localStorage.getItem('authToken');

//     if (!token) {
//       setNotification('Please log in to place an order.');
//       return;
//     }

//     setOrderLoading(true);
//     try {
//       await axios.post(
//         'http://localhost:5000/order/complete',
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setNotification('Order placed successfully!');
//       setCart([]);
//     } catch (error) {
//       console.error('Error placing order:', error.message);
//       setNotification('Failed to place order.');
//     } finally {
//       setOrderLoading(false);
//     }
//   };

//   const handleCloseNotification = () => {
//     setNotification('');
//   };

//   const calculateTotal = () =>
//     cart.reduce(
//       (total, item) => total + item.Product.salesPrice * item.quantity,
//       0
//     );

//   const calculateTotalItems = () =>
//     cart.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <Box
//       sx={{
//         marginTop: 3,
//         fontFamily: 'Poppins, sans-serif',
//         color: '#333',
//         padding: 2,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 2,
//       }}
//     >
//       <Typography
//         variant="h4"
//         gutterBottom
//         sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
//       >
//         Your Cart
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
//           <CircularProgress />
//         </Box>
//       ) : cart.length > 0 ? (
//         <>
//           {cart.map((item) => (
//             <Box
//               key={item.id}
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: 2,
//                 padding: 2,
//                 border: '1px solid #ddd',
//                 borderRadius: 2,
//                 backgroundColor: '#fff',
//                 transition: 'box-shadow 0.3s',
//                 '&:hover': {
//                   boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//                 },
//               }}
//             >
//               <img
//                 src={item.Product.images[0]}
//                 alt={item.Product.name}
//                 style={{
//                   width: '100px',
//                   height: '100px',
//                   objectFit: 'cover',
//                   borderRadius: '8px',
//                 }}
//               />
//               <Box sx={{ flex: 3, ml: 2 }}>
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontFamily: 'Roboto, sans-serif',
//                     fontWeight: 'bold',
//                     fontSize: '1.7rem',
//                     marginBottom: 1,
//                   }}
//                 >
//                   {item.Product.name}
//                 </Typography>
//                 <Typography sx={{ fontSize: '1.3rem' }}>
//                   MRP:{' '}
//                   <span
//                     style={{
//                       fontSize: '1.4rem',
//                       textDecoration: 'line-through',
//                       color: 'gray',
//                     }}
//                   >
//                     ₹{item.Product.mrp}
//                   </span>{' '}
//                   | Sales Price:{' '}
//                   <span
//                     style={{
//                       fontSize: '1.4rem',
//                       fontWeight: 'bolder',
//                       color: '#3f51b5',
//                     }}
//                   >
//                     ₹{item.Product.salesPrice}
//                   </span>
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{
//                   flex: 2,
//                   mr: 4,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-evenly',
//                 }}
//               >
//                 <IconButton
//                   onClick={() =>
//                     handleQuantityChange(item.productId, 'decrement')
//                   }
//                 >
//                   <RemoveCircleOutlineIcon />
//                 </IconButton>
//                 <Typography
//                   sx={{
//                     padding: '0 10px',
//                     border: '1px solid #ccc',
//                     borderRadius: '4px',
//                     textAlign: 'center',
//                   }}
//                 >
//                   {item.quantity}
//                 </Typography>
//                 <IconButton
//                   onClick={() =>
//                     handleQuantityChange(item.productId, 'increment')
//                   }
//                 >
//                   <AddCircleOutlineIcon />
//                 </IconButton>
//               </Box>

//               <IconButton
//                 onClick={() => handleRemoveItem(item.productId)}
//                 sx={{
//                   flex: 1,
//                   border: '1px solid red',
//                   borderRadius: '4px',
//                   padding: '5px 15px',
//                   backgroundColor: '#ffebee',
//                   '&:hover': {
//                     backgroundColor: '#ffcdd2',
//                   },
//                 }}
//               >
//                 <RemoveIcon color="error" />
//               </IconButton>
//             </Box>
//           ))}

//           {/* Order Summary Section */}
//           <Box
//             sx={{
//               marginTop: 3,
//               padding: 2,
//               border: '1px solid #ddd',
//               borderRadius: 2,
//               backgroundColor: '#fff',
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
//               Order Summary
//             </Typography>
//             <Typography>Total Items: {calculateTotalItems()}</Typography>
//             <Typography>Total Price: ₹{calculateTotal()}</Typography>
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handlePlaceOrder}
//                 disabled={orderLoading}
//               >
//                 {orderLoading ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   'Place Order'
//                 )}
//               </Button>
//             </Box>
//           </Box>
//         </>
//       ) : (
//         <Typography>No items in the cart.</Typography>
//       )}

//       <Snackbar
//         open={notification !== ''}
//         autoHideDuration={3000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={handleCloseNotification}
//           severity="success"
//           sx={{ width: '100%' }}
//         >
//           {notification}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Cart;

