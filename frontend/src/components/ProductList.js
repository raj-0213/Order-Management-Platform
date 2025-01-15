import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import ProductCard from './ProductCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/product/', {
                    params: { page: 1, limit: 12 }, // Pagination parameters
                });
                setProducts(response.data.products);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                                tags: product.tags || [], // Pass the tags array
                                image: product.images?.[0] || '', // Use the first image or fallback
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>

    );
};

export default ProductList;
