// import React, { useState } from 'react';
// import { Card, CardContent, CardMedia, Typography, Box, IconButton, Button, Snackbar, Alert, Chip, Grid } from '@mui/material';
// import axios from 'axios';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';

// const ProductCard = ({ product }) => {
//   const { name, price, quantity, tags, image } = product;
//   console.log(product);
//   const [userQuantity, setUserQuantity] = useState(1);
//   const [notification, setNotification] = useState(false);
//   const [quantityExceedNotification, setQuantityExceedNotification] = useState(false);


//   const totalPrice = price * userQuantity;

//   const handleIncrement = () => {
//     if (userQuantity < quantity) {
//       setUserQuantity(userQuantity + 1);
//     } else {
//       setQuantityExceedNotification(true);
//     }
//   };

//   const handleDecrement = () => {
//     if (userQuantity > 1) {
//       setUserQuantity(userQuantity - 1);
//     }
//   };

//   const handleAddToCart = async () => {
//     try {
//       const token = localStorage.getItem('authToken'); // Get the token from localStorage
//       if (!token) {
//         setNotification('Please log in to add items to the cart');
//         return;
//       }

//       const response = await axios.post(
//         'http://localhost:5000/cart/add/',
//         {
//           productId: product.id,
//           quantity: userQuantity,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
//           },
//         }
//       );

//       setNotification(true);
//       console.log('Product added to cart:', response.data);
//     } catch (error) {
//       console.error('Error adding product to cart:', error.response?.data || error.message);
//       setNotification('Failed to add product to cart');
//     }
//   };


//   const handleCloseNotification = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setNotification(false);
//   };

//   return (
//     <>
//       <Card sx={{ maxWidth: 340, height: 550, boxShadow: 3, borderRadius: 2, p: 2, justifyContent: 'space-between', display: 'flex', flexDirection: 'column', fontFamily: "'Lato', sans-serif" }}>
//         <CardMedia
//           component="img"
//           height="180"
//           image={image || 'https://via.placeholder.com/180'}
//           alt={name}
//         />
//         <CardContent>
//           <Typography
//             variant="h6"
//             component="div"
//             sx={{ justifyContent: 'center', fontWeight: 'bold', mb: 1, fontFamily: "'Lato', sans-serif" }}
//           >
//             {name}
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
//             {tags?.map((tag, index) => (
//               <Chip
//                 key={index}
//                 label={tag}
//                 sx={{
//                   fontSize: '12px',
//                   fontWeight: 'bold',
//                   backgroundColor: '#f0f0f0',
//                   color: '#1976d2',
//                 }}
//               />
//             )) || 'N/A'}
//           </Box>
//           <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
//             ₹{totalPrice.toFixed(2)}
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <IconButton onClick={handleDecrement} disabled={userQuantity <= 1}>
//               <RemoveIcon />
//             </IconButton>
//             <Typography
//               variant="body1"
//               sx={{
//                 mx: 1,
//                 px: 1,
//                 border: '1px solid #ccc',
//                 borderRadius: '4px',
//                 fontFamily: "'Lato', sans-serif",
//               }}
//             >
//               {userQuantity}
//             </Typography>
//             <IconButton onClick={handleIncrement} >
//               <AddIcon />
//             </IconButton>
//           </Box>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddShoppingCartIcon />}
//             fullWidth
//             sx={{
//               fontFamily: "'Lato', sans-serif",
//               '&:hover': {
//                 backgroundColor: '#1976d2',
//                 transform: 'scale(1.05)',
//                 transition: '0.3s',
//               },
//             }}
//             onClick={handleAddToCart}
//           >
//             Add to Cart
//           </Button>
//         </CardContent>
//       </Card>


//       {/* <Grid container spacing={2} sx={{ p: 2 }}> 
//         {product.map((product, index) => (
//           <Grid item key={index} xs={12} sm={6} md={4}> 
//             <Card
//               sx={{
//                 width: 340,
//                 height: 450, // Fixed height
//                 boxShadow: 3,
//                 borderRadius: 2,
//                 p: 2,
//                 fontFamily: "'Lato', sans-serif",
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'space-between', // Ensures content stays inside
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 sx={{
//                   height: 180,
//                   objectFit: 'cover',
//                   borderRadius: 1,
//                 }}
//                 image={product.image || 'https://via.placeholder.com/180'}
//                 alt={product.name}
//               />
//               <CardContent sx={{ flexGrow: 1 }}>
//                 <Typography
//                   variant="h6"
//                   component="div"
//                   sx={{
//                     fontWeight: 'bold',
//                     mb: 1,
//                     fontFamily: "'Lato', sans-serif",
//                     textAlign: 'center',
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                   }}
//                 >
//                   {product.name}
//                 </Typography>
//                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
//                   {product.tags?.map((tag, index) => (
//                     <Chip
//                       key={index}
//                       label={tag}
//                       sx={{
//                         fontSize: '12px',
//                         fontWeight: 'bold',
//                         backgroundColor: '#f0f0f0',
//                         color: '#1976d2',
//                       }}
//                     />
//                   )) || 'N/A'}
//                 </Box>
//                 <Typography variant="h6" color="primary" sx={{ mb: 2, textAlign: 'center' }}>
//                   ₹{product.totalPrice.toFixed(2)}
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
//                   <IconButton onClick={() => handleDecrement(index)} disabled={product.userQuantity <= 1}>
//                     <RemoveIcon />
//                   </IconButton>
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       mx: 1,
//                       px: 2,
//                       border: '1px solid #ccc',
//                       borderRadius: '4px',
//                       textAlign: 'center',
//                       fontFamily: "'Lato', sans-serif",
//                     }}
//                   >
//                     {product.userQuantity}
//                   </Typography>
//                   <IconButton onClick={() => handleIncrement(index)}>
//                     <AddIcon />
//                   </IconButton>
//                 </Box>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<AddShoppingCartIcon />}
//                   fullWidth
//                   sx={{
//                     fontFamily: "'Lato', sans-serif",
//                     mt: 'auto', 
//                     '&:hover': {
//                       backgroundColor: '#1976d2',
//                       transform: 'scale(1.05)',
//                       transition: '0.3s',
//                     },
//                   }}
//                   onClick={() => handleAddToCart(index)}
//                 >
//                   Add to Cart
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid> */}

//       <Snackbar
//         open={notification}
//         autoHideDuration={3000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseNotification} severity="success" sx={{ fontWeight: 'bolder', width: '100%' }}>
//           Product added to cart successfully!
//         </Alert>
//       </Snackbar>
//       <Snackbar
//         open={quantityExceedNotification}
//         autoHideDuration={3000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseNotification} severity="warning" sx={{ fontWeight: 'bolder', width: '100%' }}>
//           No more available stock!
//         </Alert>
//       </Snackbar>

//       {/* <Grid item lg={4} xs={12} sm={6} md={4} sx={{ border:'5px solid black'}}> 
//         <Card
//           sx={{
//             width: 300,
//             height: 450,
//             boxShadow: 3,
//             borderRadius: 2,
//             border:'5px solid red',
//             p:2,
//             fontFamily: "'Lato', sans-serif",
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//           }}
//         >
//           <CardMedia
//             component="img"
//             sx={{
//               height: 180,
//               objectFit: 'cover',
//               borderRadius: 1,
//             }}
//             image={image || 'https://via.placeholder.com/180'}
//             alt={name}
//           />
//           <CardContent sx={{ flexGrow: 1 }}>
//             <Typography
//               variant="h6"
//               component="div"
//               sx={{
//                 fontWeight: 'bold',
//                 mb: 1,
//                 fontFamily: "'Lato', sans-serif",
//                 textAlign: 'center',
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//               }}
//             >
//               {name}
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
//               {tags?.map((tag, index) => (
//                 <Chip
//                   key={index}
//                   label={tag}
//                   sx={{
//                     fontSize: '12px',
//                     fontWeight: 'bold',
//                     backgroundColor: '#f0f0f0',
//                     color: '#1976d2',
//                   }}
//                 />
//               )) || 'N/A'}
//             </Box>
//             <Typography variant="h6" color="primary" sx={{ mb: 2, textAlign: 'center' }}>
//               ₹{price.toFixed(2)}
//             </Typography>
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
//               <IconButton onClick={handleDecrement} disabled={userQuantity <= 1}>
//                 <RemoveIcon />
//               </IconButton>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   mx: 1,
//                   px: 2,
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   textAlign: 'center',
//                   fontFamily: "'Lato', sans-serif",
//                 }}
//               >
//                 {userQuantity}
//               </Typography>
//               <IconButton onClick={handleIncrement}>
//                 <AddIcon />
//               </IconButton>
//             </Box>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<AddShoppingCartIcon />}
//               fullWidth
//               sx={{
//                 fontFamily: "'Lato', sans-serif",
//                 mt: 'auto',
//                 display: 'flex', justifyContent: 'center',
//                 border:'1px solid red',
//                 width:'80%',
//                 '&:hover': {
//                   backgroundColor: '#1976d2',
//                   transform: 'scale(1.05)',
//                   transition: '0.3s',
//                 },
//               }}
//               onClick={handleAddToCart}
//             >
//               Add to Cart
//             </Button>
//           </CardContent>
//         </Card>

//         <Snackbar
//           open={notification}
//           autoHideDuration={3000}
//           onClose={handleCloseNotification}
//           anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         >
//           <Alert onClose={handleCloseNotification} severity="success" sx={{ fontWeight: 'bolder', width: '100%' }}>
//             Product added to cart successfully!
//           </Alert>
//         </Snackbar>
//         <Snackbar
//           open={quantityExceedNotification}
//           autoHideDuration={3000}
//           onClose={handleCloseNotification}
//           anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         >
//           <Alert onClose={handleCloseNotification} severity="warning" sx={{ fontWeight: 'bolder', width: '100%' }}>
//             No more available stock!
//           </Alert>
//         </Snackbar>
//       </Grid> */}
//     </>
//   );
// };

// export default ProductCard;




// // ProductCard.js
// import React, { useState } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardMedia, 
//   Typography, 
//   Box, 
//   IconButton, 
//   Button, 
//   Snackbar, 
//   Alert, 
//   Chip,
//   CardActionArea
// } from '@mui/material';
// import axios from 'axios';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';

// const ProductCard = ({ product }) => {
//   const { name, price, quantity, tags, image } = product;
//   const [userQuantity, setUserQuantity] = useState(1);
//   const [notification, setNotification] = useState(false);
//   const [quantityExceedNotification, setQuantityExceedNotification] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   const totalPrice = price * userQuantity;

//   const handleIncrement = () => {
//     if (userQuantity < quantity) {
//       setUserQuantity(userQuantity + 1);
//     } else {
//       setQuantityExceedNotification(true);
//     }
//   };

//   const handleDecrement = () => {
//     if (userQuantity > 1) {
//       setUserQuantity(userQuantity - 1);
//     }
//   };

//   const handleAddToCart = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setNotification('Please log in to add items to the cart');
//         return;
//       }

//       const response = await axios.post(
//         'http://localhost:5000/cart/add/',
//         {
//           productId: product.id,
//           quantity: userQuantity,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setNotification(true);
//     } catch (error) {
//       console.error('Error adding product to cart:', error.response?.data || error.message);
//       setNotification('Failed to add product to cart');
//     }
//   };

//   const handleCloseNotification = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setNotification(false);
//     setQuantityExceedNotification(false);
//   };

//   return (
//     <>
//       <Card 
//         sx={{ 
//           height: '500px',
//           display: 'flex',
//           flexDirection: 'column',
//           transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//           '&:hover': {
//             transform: 'translateY(-8px)',
//             boxShadow: 8,
//           },
//           bgcolor: 'background.paper',
//           borderRadius: 2,
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <CardActionArea>
//           <Box sx={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
//             <CardMedia
//               component="img"
//               height="100%"
//               image={image || 'https://via.placeholder.com/250'}
//               alt={name}
//               sx={{
//                 objectFit: 'cover',
//                 transition: 'transform 0.3s ease-in-out',
//                 transform: isHovered ? 'scale(1.1)' : 'scale(1)',
//               }}
//             />
//           </Box>
//         </CardActionArea>

//         <CardContent sx={{ 
//           flexGrow: 1, 
//           display: 'flex', 
//           flexDirection: 'column',
//           gap: 1.5,
//           p: 2 
//         }}>
//           <Typography
//             variant="h6"
//             sx={{ 
//               fontWeight: 600,
//               color: 'text.primary',
//               lineHeight: 1.2,
//               mb: 1
//             }}
//           >
//             {name}
//           </Typography>

//           <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
//             {tags?.map((tag, index) => (
//               <Chip
//                 key={index}
//                 label={tag}
//                 size="small"
//                 sx={{
//                   bgcolor: 'primary.light',
//                   color: 'white',
//                   fontWeight: 500,
//                   '&:hover': {
//                     bgcolor: 'primary.main',
//                   }
//                 }}
//               />
//             ))}
//           </Box>

//           <Typography 
//             variant="h5" 
//             sx={{ 
//               color: 'primary.main',
//               fontWeight: 700,
//               mt: 'auto'
//             }}
//           >
//             ₹{totalPrice.toFixed(2)}
//           </Typography>

//           <Box sx={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             gap: 1,
//             mb: 1
//           }}>
//             <IconButton 
//               onClick={handleDecrement} 
//               disabled={userQuantity <= 1}
//               sx={{ 
//                 bgcolor: 'action.hover',
//                 '&:hover': { bgcolor: 'action.selected' }
//               }}
//             >
//               <RemoveIcon />
//             </IconButton>
//             <Typography
//               variant="body1"
//               sx={{
//                 px: 2,
//                 py: 0.5,
//                 border: '1px solid',
//                 borderColor: 'divider',
//                 borderRadius: 1,
//                 minWidth: '40px',
//                 textAlign: 'center'
//               }}
//             >
//               {userQuantity}
//             </Typography>
//             <IconButton 
//               onClick={handleIncrement}
//               sx={{ 
//                 bgcolor: 'action.hover',
//                 '&:hover': { bgcolor: 'action.selected' }
//               }}
//             >
//               <AddIcon />
//             </IconButton>
//           </Box>

//           <Button
//             variant="contained"
//             startIcon={<AddShoppingCartIcon />}
//             fullWidth
//             onClick={handleAddToCart}
//             sx={{
//               textTransform: 'none',
//               fontWeight: 600,
//               py: 1.5,
//               pb: -1.25,
//               bgcolor: 'primary.main',
//               '&:hover': {
//                 bgcolor: 'primary.dark',
//                 transform: 'scale(1.02)',
//               }
//             }}
//           >
//             Add to Cart
//           </Button>
//         </CardContent>
//       </Card>

//       <Snackbar
//         open={notification}
//         autoHideDuration={3000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={handleCloseNotification} 
//           severity="success" 
//           variant="filled"
//           sx={{ width: '100%' }}
//         >
//           Product added to cart successfully!
//         </Alert>
//       </Snackbar>

//       <Snackbar
//         open={quantityExceedNotification}
//         autoHideDuration={3000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={handleCloseNotification} 
//           severity="warning"
//           variant="filled"
//           sx={{ width: '100%' }}
//         >
//           Maximum quantity reached!
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default ProductCard;



import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Chip,
  CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Stack from '@mui/material/Stack';

const ProductCard = ({ product,showNotification }) => {
  const { name, price, quantity, tags, image, mrp } = product;
  const [userQuantity, setUserQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const totalPrice = price * userQuantity;

  const handleIncrement = () => {
    if (userQuantity < quantity) {
      setUserQuantity(userQuantity + 1);
    } else {
      showNotification('Maximum quantity reached!', 'warning');
    }
  };

  const handleDecrement = () => {
    if (userQuantity > 1) {
      setUserQuantity(userQuantity - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showNotification('Please log in to add items to the cart', 'error');
        navigate('/login');
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification('Product added to cart successfully!', 'success');
    } catch (error) {
      console.error('Error adding product to cart:', error.response?.data || error.message);
      showNotification('Product added to cart successfully!', 'success');
    }
  };

  // const handleCloseNotification = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setNotification(false);
  //   setQuantityExceedNotification(false);
  // };

  return (
    <>
      <Card
        sx={{
          height: '505px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 8,
          },
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardActionArea sx={{ height: '250px' }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '250px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              bgcolor: '#f5f5f5'
            }}
          >
            <CardMedia
              component="img"
              image={image || 'https://via.placeholder.com/250'}
              alt={name}
              sx={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
                // border:'2px solid red',
                transition: 'transform 0.3s ease-in-out',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          </Box>
        </CardActionArea>

        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
            p: 2,
            pt: 3
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.2,
              maxWidth: '90%'
            }}
          >
            {name}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '100%'
            }}
          >
            {tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: 'primary.light',
                  color: 'white',
                  fontWeight: 400,
                  '&:hover': {
                    bgcolor: 'primary.main',
                  }
                }}
              />
            ))}
          </Box>
          <Stack direction="column" spacing={0.5}>
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'grey' }}>
              MRP: ₹{mrp}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'green' }}>
              Sales Price: ₹{totalPrice}
            </Typography>
          </Stack>
          {/* <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'green' }}>
            <span style={{ textDecoration: 'line-through', color: 'grey' }}>MRP: ₹{mrp}</span> | SalesRate: ₹{totalPrice}
          </Typography> */}
          {/* <Typography 
            variant="h5" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 700,
              mt: 'auto'
            }}
          >
            ₹{totalPrice.toFixed(2)}
          </Typography> */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              width: '80%',
              mt: -1
            }}
          >
            <IconButton
              onClick={handleDecrement}
              disabled={userQuantity <= 1}
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography
              variant="body1"
              sx={{
                px: 2,
                py: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                minWidth: '40px',
                textAlign: 'center'
              }}
            >
              {userQuantity}
            </Typography>
            <IconButton
              onClick={handleIncrement}
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            fullWidth
            onClick={handleAddToCart}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              // border:'2px solid red',
              mt: -1,
              width:'100%',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.01)',
              }
            }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      {/* <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Product added to cart successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={quantityExceedNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Maximum quantity reached!
        </Alert>
      </Snackbar> */}
    </>
  );
};

export default ProductCard;