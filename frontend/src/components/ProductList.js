// import React, { useState, useEffect } from 'react';
// import { Box, Grid, CircularProgress, Typography } from '@mui/material';
// import { useLocation } from 'react-router-dom';
// import ProductCard from './ProductCard';
// import axios from 'axios';

// const ProductList = () => {
//   const location = useLocation();
//   const [products, setProducts] = useState(location.state?.searchResults || []);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // console.log('Location state:', location.state);  
//     if (location.state?.searchResults) {
//       setProducts(location.state.searchResults);
//     } else {
//       setLoading(true);
//       axios.get('http://localhost:5000/product/')
//         .then(response => {
//           setProducts(response.data.products);
//           setLoading(false);
//         })
//         .catch(err => {
//           setError(err.message);
//           setLoading(false);
//         });
//     }
//   }, [location.state?.searchResults]);  // Only run effect when searchResults changes

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
//         {error}
//       </Typography>
//     );
//   }

//   if (products.length === 0) {
//     return (
//       <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
//         No products found.
//       </Typography>
//     );
//   }

//   return (
//     // <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', px: 2, py: 4 }}>
//     //   <Grid container spacing={3}> {/* Adds proper spacing between cards */}
//     //     {products.map((product) => (
//     //       <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//     //         <ProductCard product={product} />
//     //       </Grid>
//     //     ))}
//     //   </Grid>
//     // </Box>

//     <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', px: 2, py: 4 }}>
//       <Grid container spacing={3}>
//         {products.map((product) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//             <ProductCard
//               product={{
//                 id: product.id,
//                 name: product.name,
//                 price: product.salesPrice,
//                 quantity: product.stockQuantity,
//                 tags: product.tags || [],
//                 image: product.images?.[0] || '',
//               }}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default ProductList;


// import React, { useState, useEffect } from 'react';
// import { Box, Grid, CircularProgress, Typography } from '@mui/material';
// import axios from 'axios';
// import ProductCard from './ProductCard';

// const ProductList = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');


//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/product/', {
//                     params: {
//                         page: 1,
//                         limit: 12,
//                         search: searchQuery
//                     }, 
//                 });
//                 setProducts(response.data.products);
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message);
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, [searchQuery]);

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
//                 {error}
//             </Typography>
//         );
//     }

//     return (
//         <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', px: 2, py: 4 }}>
//             <Grid container spacing={3}>
//                 {products.map((product) => (
//                     <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//                         <ProductCard
//                             product={{
//                                 id: product.id,
//                                 name: product.name,
//                                 price: product.salesPrice,
//                                 quantity: product.stockQuantity,
//                                 tags: product.tags || [], // Pass the tags array
//                                 image: product.images?.[0] || '', // Use the first image or fallback
//                             }}
//                         />
//                     </Grid>
//                 ))}
//             </Grid>
//         </Box>

//     );
// };

// export default ProductList;


import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from "@mui/material";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  Container,
  Pagination,
  Paper
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import axios from 'axios';
import { Description } from '@mui/icons-material';

const ProductList = () => {
  const location = useLocation();
  const [products, setProducts] = useState(location.state?.searchResults || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);

  const productsPerPage = 8;

  const handleShowNotification = (message, severity = 'success') => {
    setNotification({ message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/product/');
        const filteredProducts = response.data.products.filter(product => product.stockQuantity >= 1);
        // console.log("Filtered Products : ", filteredProducts);
        setProducts(filteredProducts);
        // setProducts(response.data.products);
        // console.log("Data : ", response.data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.searchResults) {
      setProducts(location.state.searchResults);
      setPage(1);
    } else {
      fetchProducts();
    }
  }, [location.state?.searchResults]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: '#FFF3F3',
            borderRadius: 2
          }}
        >
          <Typography
            variant="h6"
            color="error"
            sx={{
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: '#F5F5F5',
            borderRadius: 2
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            No products found.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Calculate pagination
  const startIndex = (page - 1) * productsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + productsPerPage);
  const pageCount = Math.ceil(products.length / productsPerPage);

  return (
    <Container maxWidth="xl">
      <Box sx={{
        maxWidth: '1400px',
        width: '100%',
        mx: 'auto',
        px: { xs: 2, md: 3 },
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}>
        <Grid container spacing={3}>
          {displayedProducts.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={product.id}
              sx={{
                display: 'flex',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <ProductCard
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.salesPrice,
                  quantity: product.stockQuantity,
                  mrp: product.mrp,
                  description: product.description,
                  tags: product.tags || [],
                  image: product.images || '',
                }}
                showNotification={handleShowNotification}
              />
            </Grid>
          ))}
        </Grid>

        {pageCount > 1 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            mb: 2
          }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  },
                  '&.Mui-selected': {
                    fontWeight: 'bold'
                  }
                }
              }}
            />
          </Box>
        )}
      </Box>

      {/* Single Snackbar for all notifications */}
      <Snackbar
        open={!!notification} 
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {notification && (
          <Alert
            onClose={handleCloseNotification}
            severity={notification?.severity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification?.message} 
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
};

export default ProductList;
