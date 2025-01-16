import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import axios from 'axios';

const ProductList = () => {
  const location = useLocation();
  const [products, setProducts] = useState(location.state?.searchResults || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Location state:', location.state);  // Logging to check if search results are received
    if (location.state?.searchResults) {
      // If search results are available, use them
      setProducts(location.state.searchResults);
    } else {
      // Otherwise, fetch all products
      setLoading(true);
      axios.get('http://localhost:5000/product/')
        .then(response => {
          setProducts(response.data.products);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [location.state?.searchResults]);  // Only run effect when searchResults changes

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (products.length === 0) {
    return (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            No products found.
        </Typography>
    );
}

  return (
    <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', px: 2, py: 4 }}>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard
              product={{
                id: product.id,
                name: product.name,
                price: product.salesPrice,
                quantity: product.stockQuantity,
                tags: product.tags || [],
                image: product.images?.[0] || '',
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;


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
