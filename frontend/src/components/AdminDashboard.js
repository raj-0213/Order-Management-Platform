import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingCart, Layers, LogOut, Plus, ChevronDown,Edit, Trash } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import { Search, Delete, HourglassEmpty, CheckCircle, LocalShipping, CheckCircleOutline } from '@mui/icons-material';

import { Alert, AlertTitle } from '@mui/material';

import {
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,DialogContentText,InputAdornment,
    Box,
    Modal,
    Snackbar,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    Chip,
    Pagination
} from '@mui/material';

const drawerWidth = 240;

export const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [openModal, setOpenModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // Pagination states for products and orders
    const [productPage, setProductPage] = useState(1);
    const [orderPage, setOrderPage] = useState(1);
    const productsPerPage = 9;
    const ordersPerPage = 5;

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchCategories();
    }, []);

    const authToken = localStorage.getItem("authToken"); 

    const [searchQuery, setSearchQuery] = useState("");

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.id.toString().includes(searchQuery)
    );


  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/category/", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCategories(response.data.categories);
    } catch (error) {
      showSnackbar("Failed to fetch categories", "error");
    }
  };

  // Function to handle Add/Edit Category
  const handleAddOrEditCategory = async () => {
    if (!categoryName.trim()) {
      showSnackbar("Category name is required", "warning");
      return;
    }

    try {
      if (selectedCategoryId) {
        // Update category API call
        await axios.put(`http://localhost:5000/category/update/${selectedCategoryId}`, { name: categoryName }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        showSnackbar("Category updated successfully", "success");
      } else {
        // Create category API call
        await axios.post("http://localhost:5000/category/create/", { name: categoryName }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        showSnackbar("Category added successfully", "success");
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Something went wrong", "error");
    }
  };

  // Function to delete category
  const handleDeleteCategory = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/category/delete/${selectedCategoryId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        showSnackbar("Category deleted successfully", "success");
        fetchCategories();
        handleCloseDeleteDialog();
      } catch (error) {
        showSnackbar(error.response?.data?.message || "Failed to delete category", "error");
      }
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedCategoryId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedCategoryId(null);
    setOpenDeleteDialog(false);
  };

  // Function to open modal (for adding/editing)
  const handleOpenModal = (category = null) => {
    if (category) {
      setCategoryName(category.name);
      setSelectedCategoryId(category.id);
    } else {
      setCategoryName("");
      setSelectedCategoryId(null);
    }
    setOpenModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setCategoryName("");
    setSelectedCategoryId(null);
  };

  // Function to show Snackbar notifications
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  

    const handleEditClick = (product) => {
        setEditProduct(product);
        setOpenEditModal(true);
    };

    const handleDeleteClick = (productId) => {
        setDeleteProductId(productId);
        setOpenDeleteDialog(true);
    };

    const handleEditSubmit = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            // console.log(authToken);
            await axios.put(`http://localhost:5000/product/${editProduct.id}`, 
            editProduct, 
            {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            // console.log(editProduct);
            fetchProducts();
            setOpenEditModal(false);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    
    const handleDeleteConfirm = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:5000/product/${deleteProductId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            fetchProducts();
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/product/');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/order/allorders', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (response.ok && data.orders) {
                setOrders(data.orders);
            } else {
                console.error("Orders data missing:", data);
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const authToken = localStorage.getItem('authToken');

            const response = await axios.put(
                `http://localhost:5000/order/updatestatus`,
                { orderId, status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId
                            ? { ...order, status: newStatus }
                            : order
                    )
                );
                setSnackbarMessage(`Order ${orderId} status updated to ${newStatus}`);
                setSnackbarSeverity('success'); // You can also set to 'error' or 'info' based on the result
                setSnackbarOpen(true);
            } else {
                alert('Failed to update order status.');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status.');
        }
    };

    const filteredOrders = orders.filter(order =>
        orderStatusFilter === 'all' ? true : order.status === orderStatusFilter
    );

    const handleLogout = () => {
        console.log("Logging out...");
        
        localStorage.removeItem("authToken"); // Example: Clearing authentication token
    
        setSnackbar({
          open: true,
          message: "Logout successful!",
          severity: "success",
        });
    
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login page
        }, 2000);
      };    

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'shipped': return 'info';
            case 'processing': return 'warning';
            default: return 'default';
        }
    };

    // Product Pagination Logic
    const handleProductChangePage = (event, newPage) => {
        setProductPage(newPage);
    };

    // Order Pagination Logic
    const handleOrderChangePage = (event, newPage) => {
        setOrderPage(newPage);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Admin Panel
                    </Typography>
                </Toolbar>
                <Divider />

                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
                        <Box>
                            <Typography variant="subtitle1">Admin User</Typography>
                            <Typography variant="body2" color="text.secondary">
                                admin@example.com
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider />

                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={activeTab === 'products'}
                            onClick={() => setActiveTab('products')}
                        >
                            <ListItemIcon>
                                <Package />
                            </ListItemIcon>
                            <ListItemText primary="All Products" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            selected={activeTab === 'orders'}
                            onClick={() => setActiveTab('orders')}
                        >
                            <ListItemIcon>
                                <ShoppingCart />
                            </ListItemIcon>
                            <ListItemText primary="All Orders" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            selected={activeTab === 'categories'}
                            onClick={() => setActiveTab('categories')}
                        >
                            <ListItemIcon>
                                <Layers />
                            </ListItemIcon>
                            <ListItemText primary="Categories" />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Button
                        startIcon={<LogOut />}
                        onClick={handleLogout}
                        color="error"
                        fullWidth
                    >
                        Logout
                    </Button>
                    {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />

                {activeTab === 'products' && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h4" component="h1">
                                All Products
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Plus />}
                                color="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Add New Product
                            </Button>
                        </Box>

                        <Grid container spacing={3}>
                            {products.slice((productPage - 1) * productsPerPage, productPage * productsPerPage).map((product) => (
                                <Grid item xs={4} sm={6} md={4} lg={4} key={product.id}>
                                    <Card>
                                    <Box sx={{ 
                    width: '100%', 
                    height: 200, // Set a fixed height for the image container
                    overflow: 'hidden', 
                    borderRadius: 1 // Optional: adds rounded corners
                }}>
                                        <CardMedia
                                            component="img"
                                            // height="200"
                                            // width="100%"
                                            image={product.images || "/api/placeholder/300/200"}
                                            alt={product.name}
                                            sx={{
                                                p:2,
                            height: '100%', // Fill the container's height
                            width: '100%', // Fill the container's width
                            objectFit: 'cover', // Ensure the image maintains its aspect ratio
                        }}
                                        />
                                        </Box>
                                         <CardContent>
    <Typography variant="h6">{product.name}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'green', mt:2 }}>
        <span style={{ textDecoration: 'line-through', color: 'grey' }}>MRP: ₹{product.mrp}</span> | SalesRate: ₹{product.salesPrice}
    </Typography>
    <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={2}>
        <IconButton onClick={() => handleEditClick(product)} sx={{ alignSelf: 'flex-start' }}>
            <Edit />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(product.id)} sx={{ alignSelf: 'flex-end' }}>
            <Trash color="red" />
        </IconButton>
    </Box>
</CardContent>
                                
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Pagination
                            count={Math.ceil(products.length / productsPerPage)}
                            page={productPage}
                            onChange={handleProductChangePage}
                            sx={{ mt: 2 }}
                        />

                        <AddProductModal open={openModal} onClose={() => setOpenModal(false)} />
                    </Box>
                )}


                {/* Edit Product Modal */}
                {editProduct && (
  <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
    <DialogTitle>Edit Product</DialogTitle>
    <DialogContent>
      <TextField label="Name" fullWidth margin="dense" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
      <TextField label="WS Code" fullWidth margin="dense" value={editProduct.wsCode} onChange={(e) => setEditProduct({ ...editProduct, wsCode: e.target.value })} />
      <TextField label="Sales Price (₹)" fullWidth margin="dense" value={editProduct.salesPrice} onChange={(e) => setEditProduct({ ...editProduct, salesPrice: e.target.value })} />
      <TextField label="MRP (₹)" fullWidth margin="dense" value={editProduct.mrp} onChange={(e) => setEditProduct({ ...editProduct, mrp: e.target.value })} />
      <TextField label="Package Size" fullWidth margin="dense" value={editProduct.packageSize} onChange={(e) => setEditProduct({ ...editProduct, packageSize: e.target.value })} />
      <TextField label="Stock Quantity" fullWidth margin="dense" value={editProduct.stockQuantity} onChange={(e) => setEditProduct({ ...editProduct, stockQuantity: e.target.value })} />
      <TextField label="Tags" fullWidth margin="dense" value={editProduct.tags} onChange={(e) => setEditProduct({ ...editProduct, tags: e.target.value })} />

      {/* Changed Category Field to TextField */}
      <TextField label="Category" fullWidth margin="dense" value={editProduct.categoryId} onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })} />

      {/* Image Upload and Delete Section */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Images</Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {editProduct.images && editProduct.images.map((image, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
            <img src={image} alt="Product" style={{ width: 80, height: 80, borderRadius: 5 }} />
            <IconButton
              onClick={() => {
                const newImages = editProduct.images.filter((_, i) => i !== index);
                setEditProduct({ ...editProduct, images: newImages });
              }}
              sx={{
                position: 'absolute',
                top: 5,
                right: 5,
                background: 'rgba(255,255,255,0.7)',
                padding: '2px',
                fontSize: '14px',
              }}
            >
              ❌
            </IconButton>
          </div>
        ))}
      </div>

      {/* Upload New Image Button */}
      <Button
        variant="contained"
        component="label"
        sx={{ mt: 2 }}
      >
        Upload New Image
        <input
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              // Here you should upload the image to Cloudinary and then get the URL
              const formData = new FormData();
              formData.append('file', file);
              formData.append('upload_preset', 'Product_Images'); // Replace with your Cloudinary upload preset
              formData.append('cloud_name', 'dy8w5m785');

              fetch('https://api.cloudinary.com/v1_1/dy8w5m785/image/upload', {
                method: 'POST',
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  const newImageUrl = data.secure_url; // Cloudinary returns the image URL here
                  setEditProduct({
                    ...editProduct,
                    images: [...editProduct.images, newImageUrl],
                  });
                })
                .catch((error) => {
                  console.error('Error uploading image:', error);
                });
            }
          }}
        />
      </Button>

    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
      <Button onClick={handleEditSubmit} color="primary">Save</Button>
    </DialogActions>
  </Dialog>
)}


            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
            

            {activeTab === 'orders' && (
                <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
                    <CardHeader
                        title={<Typography variant="h6" className="font-bolder text-gray-800">Orders</Typography>}
                        action={
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Filter by Status</InputLabel>
                                <Select
                                    value={orderStatusFilter}
                                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                                    label="Filter by Status"
                                    sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "gray" } } }}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="confirmed">Confirmed</MenuItem>
                                    <MenuItem value="shipped">Shipped</MenuItem>
                                    <MenuItem value="delivered">Delivered</MenuItem>
                                </Select>
                            </FormControl>
                        }
                    />
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table className="w-full">
                                <TableHead>
                                    <TableRow>
                                        {['Order ID', 'Products', 'Total', 'Status'].map((header) => (
                                            <TableCell
                                                key={header}
                                                className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                                            >
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredOrders.slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage).map((order) => (
                                        <TableRow
                                            key={order.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-150 transform hover:scale-105"
                                        >
                                            <TableCell className="px-6 py-4">
                                                <Typography variant="body2" className="text-sm font-medium text-gray-900">
                                                    {order.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {order.OrderDetails?.map((item, index) => (
                                                        <Typography key={index} variant="body2" className="text-sm text-gray-800">
                                                            <span className="font-medium">{item.Product.name}</span>
                                                            <span className="text-gray-500"> × {item.quantity}</span>
                                                        </Typography>
                                                    )) || (
                                                        <Alert severity="info" className="max-w-xs">
                                                            <AlertTitle>No products available</AlertTitle>
                                                            No products available
                                                        </Alert>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Typography variant="body2" className="text-sm font-semibold text-gray-900">
                                                    ₹{order.totalAmount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <FormControl fullWidth>
                                                    <InputLabel>Status</InputLabel>
                                                    <Select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        label="Status"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': { borderColor: 'gray' },
                                                            },
                                                            '.MuiSelect-icon': { color: '#1f2937' },
                                                        }}
                                                    >
                                                        {['pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
                                                            <MenuItem sx={{m:1}}
                                                                key={status}
                                                                value={status}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                {status === 'pending' && <HourglassEmpty sx={{mr:0.5}} fontSize="small" />}
                                                                {status === 'confirmed' && <CheckCircle sx={{mr:0.5}} fontSize="small" />}
                                                                {status === 'shipped' && <LocalShipping sx={{mr:0.5}} fontSize="small" />}
                                                                {status === 'delivered' && <CheckCircleOutline sx={{mr:0.5}} fontSize="small" />}
                                                                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>

                    <Pagination
                        count={Math.ceil(filteredOrders.length / ordersPerPage)}
                        page={orderPage}
                        onChange={handleOrderChangePage}
                        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                    />
                </Card>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {activeTab === "categories" && (
                <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h4" component="h1">Categories</Typography>
      <Box display="flex" alignItems="center">
    <TextField
      variant="outlined"
      placeholder="Search by ID or Name"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      sx={{ width: 250, mr: 2,"& .MuiOutlinedInput-root": {
      borderRadius: 6, 
    },}}
    />
  </Box>
      <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
         Add New Category
      </Button>
    </Box>

    {/* Categories Table */}
    <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredCategories.length > 0 ? (
        filteredCategories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>
              <IconButton color="primary" onClick={() => handleOpenModal(category)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => handleOpenDeleteDialog(category.id)}>
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={3} align="center">No categories found</TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>


    {/* Delete Confirmation Dialog */}
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

    {/* Modal for Adding/Editing Category */}
    <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title">
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 24
      }}>
        <Typography id="modal-title" variant="h6" mb={2}>
          {selectedCategoryId ? "Edit Category" : "Add New Category"}
        </Typography>
        <TextField
          fullWidth
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={handleCloseModal} sx={{ mr: 2 }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddOrEditCategory}>
            {selectedCategoryId ? "Update" : "Add"}
          </Button>
        </Box>
      </Box>
    </Modal>

    {/* Snackbar Notifications */}
    <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
      <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box>
      )}
            </Box>
        </Box>
    );
};