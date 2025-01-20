import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
  Modal,
  Fade,
  Backdrop,
  CardActionArea,
  Stack,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageSlider from './ImageSlider';


const ProductCard = ({ product, showNotification }) => {
  const { name, price, quantity, description, tags, image, mrp } = product;
  // console.log("Product : ", product);
  const [userQuantity, setUserQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
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
      window.location.reload();
    } catch (error) {
      console.error('Error adding product to cart:', error.response?.data || error.message);
      showNotification('Failed to add product to cart', 'error');
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '560px',
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
              image={image[0] || 'https://via.placeholder.com/250'}
              alt={name}
              sx={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
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

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1,
              width: '100%',
              mt: -1
            }}
          >
            {/* Add to Cart Button */}
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              fullWidth
              onClick={handleAddToCart}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                width: '100%',
                bgcolor: 'primary.main',
                mt: 1,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.01)',
                }
              }}
            >
              Add to Cart
            </Button>

            {/* View Product Button */}
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              fullWidth
              onClick={() => setOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                width: '100%',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                  color: 'white',
                }
              }}
            >
              View Product
            </Button>

          </Box>
        </CardContent>
      </Card>

      {/* Modal for Product Details */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent="div"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1300 }}
      >
        <Fade in={open}>
          <Box sx={{
            bgcolor: "white",
            p: 3,
            borderRadius: 3,
            maxWidth: "900px",
            width: "95%",
            boxShadow: 10,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },  // Responsive design
            gap: 3,
            position: "relative",
          }}>
            <IconButton sx={{ position: "absolute", top: 10, right: 10 }} onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>

            {/* Left: Image Slider */}
            <ImageSlider images={image} name={name} />



            {/* Right: Product Details */}
            <Box sx={{ width: { xs: "100%", md: "60%" } }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{name}</Typography>
              <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>{description}</Typography>

              {/* MRP & Sales Price */}
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem',mt:2, color: 'green' }}>
                <span style={{ textDecoration: 'line-through', color: 'grey' }}>MRP: ₹{mrp}</span> | SalesRate: ₹{totalPrice}
              </Typography>
              {/* <Typography variant="body2" sx={{ textDecoration: "line-through", color: "grey", mt: 2 }}>
                MRP: ₹{mrp}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "green" }}>
                Sales Price: ₹{(totalPrice * userQuantity).toFixed(2)}
              </Typography> */}

              {/* Quantity Selector */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1, mt: 2 }}>
                <Typography variant="body1">Quantity:</Typography>
                <IconButton
                  onClick={handleDecrement}
                  disabled={userQuantity <= 1}
                  sx={{ bgcolor: "action.hover", "&:hover": { bgcolor: "action.selected" } }}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1" sx={{
                  px: 2, py: 0.5, border: "1px solid", borderColor: "divider", borderRadius: 1,
                  minWidth: "40px", textAlign: "center"
                }}>
                  {userQuantity}
                </Typography>
                <IconButton
                  onClick={handleIncrement}
                  sx={{ bgcolor: "action.hover", "&:hover": { bgcolor: "action.selected" } }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {/* Tags */}
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "flex-start", mt: 2 }}>
                {tags?.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" sx={{
                    bgcolor: "primary.light",
                    color: "white",
                    fontWeight: 400,
                    "&:hover": { bgcolor: "primary.main" }
                  }} />
                ))}
              </Box>

              {/* Buttons */}
              <Stack direction="row" mt={2} spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => alert("Added to cart")}
                  startIcon={<AddShoppingCartIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark", transform: "scale(1.02)" }
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setOpen(false)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "primary.main",
                    "&:hover": { borderColor: "primary.dark", backgroundColor: "primary.light", color: 'white' }
                  }}
                >
                  Close
                </Button>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>


    </>
  );
};

export default ProductCard;





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
//   Fade,
//   Modal,
//   Backdrop,
//   CardActionArea
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import CloseIcon from '@mui/icons-material/Close';
// import Stack from '@mui/material/Stack';
// // import Carousel from 'react-material-ui-carousel';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import Slider from "react-slick";


// const ProductCard = ({ product, showNotification }) => {
//   const { name, price, quantity, description, tags, image, mrp } = product;
//   console.log(product);
//   const [userQuantity, setUserQuantity] = useState(1);
//   const [isHovered, setIsHovered] = useState(false);
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const totalPrice = price * userQuantity;


//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };

//   const handleIncrement = () => {
//     if (userQuantity < quantity) {
//       setUserQuantity(userQuantity + 1);
//     } else {
//       showNotification('Maximum quantity reached!', 'warning');
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
//         showNotification('Please log in to add items to the cart', 'error');
//         navigate('/login');
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

//       showNotification('Product added to cart successfully!', 'success');
//     } catch (error) {
//       console.error('Error adding product to cart:', error.response?.data || error.message);
//       showNotification('Product added to cart successfully!', 'success');
//     }
//   };


//   return (
//     <>
//       <Card
//         sx={{
//           height: '505px',
//           width: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//           transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//           '&:hover': {
//             transform: 'translateY(-8px)',
//             boxShadow: 8,
//           },
//           bgcolor: 'background.paper',
//           borderRadius: 2,
//           overflow: 'hidden'
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <CardActionArea sx={{ height: '250px' }}>
//           <Box
//             sx={{
//               position: 'relative',
//               width: '100%',
//               height: '250px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               overflow: 'hidden',
//               bgcolor: '#f5f5f5'
//             }}
//           >
//             <CardMedia
//               component="img"
//               image={image || 'https://via.placeholder.com/250'}
//               alt={name}
//               sx={{
//                 width: '100%',
//                 height: '250px',
//                 objectFit: 'cover',
//                 // border:'2px solid red',
//                 transition: 'transform 0.3s ease-in-out',
//                 transform: isHovered ? 'scale(1.1)' : 'scale(1)',
//               }}
//             />
//           </Box>
//         </CardActionArea>

//         <CardContent
//           sx={{
//             flexGrow: 1,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             textAlign: 'center',
//             gap: 2,
//             p: 2,
//             pt: 3
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 600,
//               color: 'text.primary',
//               lineHeight: 1.2,
//               maxWidth: '90%'
//             }}
//           >
//             {name}
//           </Typography>

//           <Box
//             sx={{
//               display: 'flex',
//               gap: 0.5,
//               flexWrap: 'wrap',
//               justifyContent: 'center',
//               maxWidth: '100%'
//             }}
//           >
//             {tags?.map((tag, index) => (
//               <Chip
//                 key={index}
//                 label={tag}
//                 size="small"
//                 sx={{
//                   bgcolor: 'primary.light',
//                   color: 'white',
//                   fontWeight: 400,
//                   '&:hover': {
//                     bgcolor: 'primary.main',
//                   }
//                 }}
//               />
//             ))}
//           </Box>
//           <Stack direction="column" spacing={0.5}>
//             <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'grey' }}>
//               MRP: ₹{mrp}
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'green' }}>
//               Sales Price: ₹{totalPrice}
//             </Typography>
//           </Stack>
//           {/* <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'green' }}>
//             <span style={{ textDecoration: 'line-through', color: 'grey' }}>MRP: ₹{mrp}</span> | SalesRate: ₹{totalPrice}
//           </Typography> */}
//           {/* <Typography 
//             variant="h5" 
//             sx={{ 
//               color: 'primary.main',
//               fontWeight: 700,
//               mt: 'auto'
//             }}
//           >
//             ₹{totalPrice.toFixed(2)}
//           </Typography> */}

//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 1,
//               width: '80%',
//               mt: -1
//             }}
//           >
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
//               // border:'2px solid red',
//               mt: -1,
//               width: '100%',
//               bgcolor: 'primary.main',
//               '&:hover': {
//                 bgcolor: 'primary.dark',
//                 transform: 'scale(1.01)',
//               }
//             }}
//           >
//             Add to Cart
//           </Button>
//           <Button variant="outlined" fullWidth onClick={() => setOpen(true)}>View Product</Button>
//         </CardContent>
//       </Card>


//       {/* Modal for Product Details */}
//       <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition BackdropComponent={Backdrop}>
//         <Fade in={open}>
//           <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, maxWidth: '600px', mx: 'auto', my: 5, boxShadow: 5 }}>
//             <IconButton sx={{ position: 'absolute', top: 10, right: 10 }} onClick={() => setOpen(false)}>
//               <CloseIcon />
//             </IconButton>
//             {/* {image?.length > 1 ? (
//               <Carousel>
//                 {image.map((img, index) => (
//                   <CardMedia key={index} component="img" height="300" image={img} alt={name} />
//                 ))}
//               </Carousel>
//             ) : (
//               <CardMedia component="img" height="300" image={image?.[0] || 'https://via.placeholder.com/300'} alt={name} />
//             )} */}
//             {Array.isArray(image) && image.length > 1 ? (
//               <Slider {...settings}>
//                 {image.map((img, index) => (
//                   <CardMedia key={index} component="img" height="300" image={img} alt={name} />
//                 ))}
//               </Slider>
//             ) : (
//               <CardMedia component="img" height="300" image={image || 'https://via.placeholder.com/300'} alt={name} />
//             )}


//             <Typography variant="h5" sx={{ mt: 2 }}>{name}</Typography>
//             <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>{description}</Typography>
//             <Stack direction="row" mt={2} spacing={1}>
//               <Button variant="contained" fullWidth onClick={handleAddToCart} startIcon={<AddShoppingCartIcon />}>Add to Cart</Button>
//               <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>Close</Button>
//             </Stack>
//           </Box>
//         </Fade>
//       </Modal>

//       {/* <Snackbar
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
//       </Snackbar> */}
//     </>
//   );
// };

// export default ProductCard;