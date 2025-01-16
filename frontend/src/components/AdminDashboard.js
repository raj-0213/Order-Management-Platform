import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingCart, Layers, LogOut, Plus, ChevronDown } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

import { Alert, AlertTitle } from '@mui/material';

import {
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Box,
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

    // Pagination states for products and orders
    const [productPage, setProductPage] = useState(1);
    const [orderPage, setOrderPage] = useState(1);
    const productsPerPage = 9;
    const ordersPerPage = 5;

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

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
                alert(`Order ID: ${orderId} status changed to ${newStatus}`);
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
        console.log('Logging out...');
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
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={product.images || "/api/placeholder/300/200"}
                                            alt={product.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {product.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Typography variant="h6" color="primary">
                                                    ₹{product.salesPrice}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                                    ₹{product.mrp}
                                                </Typography>
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

                {activeTab === 'orders' && (
                    <Card className="w-full">
                        <CardHeader
                            title={<Typography variant="h6" className="font-bold text-gray-800">Orders</Typography>}
                            action={
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel>Filter by Status</InputLabel>
                                    <Select
                                        value={orderStatusFilter}
                                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                                        label="Filter by Status"
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
                                                <TableCell key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredOrders.slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage).map((order) => (
                                            <TableRow key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
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
                                                        >
                                                            {['pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
                                                                <MenuItem key={status} value={status}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
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
                            sx={{ mt: 2 }}
                        />
                    </Card>
                )}

                {activeTab === 'categories' && (
                    <Box>
                        <Typography variant="h4" component="h1">
                            Categories
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

// export default AdminDashboard;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Package, ShoppingCart, Layers, LogOut, Plus, ChevronDown } from 'lucide-react';
// import AddProductModal from '../components/AddProductModal';

// import { Alert, AlertTitle } from '@mui/material';

// import {
//     Dialog, DialogActions, DialogContent, DialogTitle, TextField,
//     Box,
//     Drawer,
//     AppBar,
//     Toolbar,
//     List,
//     Typography,
//     Divider,
//     IconButton,
//     ListItem,
//     ListItemButton,
//     ListItemIcon,
//     ListItemText,
//     Avatar,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Card,
//     CardContent,
//     CardHeader,
//     CardMedia,
//     Grid,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Select,
//     Chip,
//     Pagination 
// } from '@mui/material';


// const drawerWidth = 240;

// const AdminDashboard = () => {
//     const [products, setProducts] = useState([]);
//     const [orders, setOrders] = useState([]);
//     const [activeTab, setActiveTab] = useState('products');
//     const [orderStatusFilter, setOrderStatusFilter] = useState('all');
//     const [openModal, setOpenModal] = useState(false);
   

//     useEffect(() => {
//         fetchProducts();
//         fetchOrders();
//     }, []);

//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/product/');
//             setProducts(response.data.products);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         }
//     };

//     // Handler to open the modal
//     const handleOpenModal = () => setOpenModal(true);

//     // Handler to close the modal
//     const handleCloseModal = () => setOpenModal(false);

//     const updateOrderStatus = async (orderId, newStatus) => {
//         try {
//             const authToken = localStorage.getItem('authToken');

//             // Send the status update request to the backend
//             const response = await axios.put(
//                 `http://localhost:5000/order/updatestatus`,
//                 { orderId, status: newStatus },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${authToken}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             if (response.status === 200) {
//                 // Successfully updated the order status in the database
//                 setOrders((prevOrders) =>
//                     prevOrders.map((order) =>
//                         order.id === orderId
//                             ? { ...order, status: newStatus }
//                             : order
//                     )
//                 );

//                 // Optional: Show a success notification
//                 alert(`Order ID: ${orderId} status changed to ${newStatus}`);
//             } else {
//                 // Handle any error if status update fails
//                 alert('Failed to update order status.');
//             }
//         } catch (error) {
//             console.error('Error updating order status:', error);
//             alert('Failed to update order status.');
//         }
//     };

//     const fetchOrders = async () => {
//         try {
//             const authToken = localStorage.getItem('authToken');
//             const response = await fetch('http://localhost:5000/order/allorders', {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${authToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             const data = await response.json();
//             console.log("API Response:", data); // Debugging

//             if (response.ok && data.orders) {
//                 setOrders(data.orders);
//             } else {
//                 console.error("Orders data missing:", data);
//                 setOrders([]); // Ensure it's always an array
//             }
//         } catch (error) {
//             console.error("Error fetching orders:", error);
//             setOrders([]); // Prevent errors if API call fails
//         }
//     };

//     const filteredOrders = orders.filter(order =>
//         orderStatusFilter === 'all' ? true : order.status === orderStatusFilter
//     );

//     const handleLogout = () => {
//         console.log('Logging out...');
//     };

    
//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'delivered': return 'success';
//             case 'shipped': return 'info';
//             case 'processing': return 'warning';
//             default: return 'default';
//         }
//     };

//     return (
//         <Box sx={{ display: 'flex' }}>
//             <Drawer
//                 variant="permanent"
//                 sx={{
//                     width: drawerWidth,
//                     flexShrink: 0,
//                     '& .MuiDrawer-paper': {
//                         width: drawerWidth,
//                         boxSizing: 'border-box',
//                     },
//                 }}
//             >
//                 <Toolbar>
//                     <Typography variant="h6" noWrap component="div">
//                         Admin Panel
//                     </Typography>
//                 </Toolbar>
//                 <Divider />

//                 <Box sx={{ p: 2 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
//                         <Box>
//                             <Typography variant="subtitle1">Admin User</Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 admin@example.com
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </Box>

//                 <Divider />

//                 <List>
//                     <ListItem disablePadding>
//                         <ListItemButton
//                             selected={activeTab === 'products'}
//                             onClick={() => setActiveTab('products')}
//                         >
//                             <ListItemIcon>
//                                 <Package />
//                             </ListItemIcon>
//                             <ListItemText primary="All Products" />
//                         </ListItemButton>
//                     </ListItem>

//                     <ListItem disablePadding>
//                         <ListItemButton
//                             selected={activeTab === 'orders'}
//                             onClick={() => setActiveTab('orders')}
//                         >
//                             <ListItemIcon>
//                                 <ShoppingCart />
//                             </ListItemIcon>
//                             <ListItemText primary="All Orders" />
//                         </ListItemButton>
//                     </ListItem>

//                     <ListItem disablePadding>
//                         <ListItemButton
//                             selected={activeTab === 'categories'}
//                             onClick={() => setActiveTab('categories')}
//                         >
//                             <ListItemIcon>
//                                 <Layers />
//                             </ListItemIcon>
//                             <ListItemText primary="Categories" />
//                         </ListItemButton>
//                     </ListItem>
//                 </List>

//                 <Box sx={{ mt: 'auto', p: 2 }}>
//                     <Button
//                         startIcon={<LogOut />}
//                         onClick={handleLogout}
//                         color="error"
//                         fullWidth
//                     >
//                         Logout
//                     </Button>
//                 </Box>
//             </Drawer>

//             <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//                 <Toolbar />

//                 {activeTab === 'products' && (
//                     <Box>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//                             <Typography variant="h4" component="h1">
//                                 All Products
//                             </Typography>
//                             <Button
//                                 variant="contained"
//                                 startIcon={<Plus />}
//                                 color="primary"
//                                 onClick={handleOpenModal}
//                             >
//                                 Add New Product
//                             </Button>
//                         </Box>

//                      <Grid container spacing={3}>
//                             {products.map((product) => (
//                                 <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//                                     <Card>
//                                         <CardMedia
//                                             component="img"
//                                             height="140"
//                                             image={product.images || "/api/placeholder/300/200"}
//                                             alt={product.name}
//                                         />
//                                         <CardContent>
//                                             <Typography gutterBottom variant="h6" component="div">
//                                                 {product.name}
//                                             </Typography>
//                                             <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                                                 <Typography variant="h6" color="primary">
//                                                     ₹{product.salesPrice}
//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
//                                                     ₹{product.mrp}
//                                                 </Typography>
//                                             </Box>
//                                         </CardContent>
//                                     </Card>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                         <AddProductModal open={openModal} onClose={handleCloseModal} />
//                     </Box>
//                 )}

//                 {activeTab === 'orders' && (
//                     <Card className="w-full">
//                         <CardHeader
//                             title={<Typography variant="h6" className="font-bold text-gray-800">Orders</Typography>}
//                             action={
//                                 <FormControl sx={{ minWidth: 200 }}>
//                                     <InputLabel>Filter by Status</InputLabel>
//                                     <Select
//                                         value={orderStatusFilter}
//                                         onChange={(e) => setOrderStatusFilter(e.target.value)}
//                                         label="Filter by Status"
//                                     >
//                                         <MenuItem value="all">All Status</MenuItem>
//                                         <MenuItem value="pending">Pending</MenuItem>
//                                         <MenuItem value="confirmed">Confirmed</MenuItem>
//                                         <MenuItem value="shipped">Shipped</MenuItem>
//                                         <MenuItem value="delivered">Delivered</MenuItem>
//                                     </Select>
//                                 </FormControl>
//                             }
//                         />
//                         <CardContent>
//                             <div className="overflow-x-auto">
//                                 <Table className="w-full">
//                                     <TableHead>
//                                         <TableRow>
//                                             {['Order ID', 'Products', 'Total', 'Status'].map((header) => (
//                                                 <TableCell key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
//                                                     {header}
//                                                 </TableCell>
//                                             ))}
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {filteredOrders.map((order) => (
//                                             <TableRow key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
//                                                 <TableCell className="px-6 py-4">
//                                                     <Typography variant="body2" className="text-sm font-medium text-gray-900">
//                                                         {order.id}
//                                                     </Typography>
//                                                 </TableCell>
//                                                 <TableCell className="px-6 py-4">
//                                                     <div className="space-y-1">
//                                                         {order.OrderDetails?.map((item, index) => (
//                                                             <Typography key={index} variant="body2" className="text-sm text-gray-800">
//                                                                 <span className="font-medium">{item.Product.name}</span>
//                                                                 <span className="text-gray-500"> × {item.quantity}</span>
//                                                             </Typography>
//                                                         )) || (
//                                                                 <Alert severity="info" className="max-w-xs">
//                                                                     <AlertTitle>No products available</AlertTitle>
//                                                                     No products available
//                                                                 </Alert>
//                                                             )}
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell className="px-6 py-4">
//                                                     <Typography variant="body2" className="text-sm font-semibold text-gray-900">
//                                                         ₹{order.totalAmount}
//                                                     </Typography>
//                                                 </TableCell>
//                                                 <TableCell className="px-6 py-4">
//                                                     <FormControl fullWidth>
//                                                         <InputLabel>Status</InputLabel>
//                                                         <Select
//                                                             value={order.status}
//                                                             onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                                                             label="Status"
//                                                         >
//                                                             {['pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
//                                                                 <MenuItem key={status} value={status}>
//                                                                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                                                                 </MenuItem>
//                                                             ))}
//                                                         </Select>
//                                                     </FormControl>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}


//                 {activeTab === 'categories' && (
//                     <Box>
//                         <Typography variant="h4" component="h1">
//                             Categories
//                         </Typography>
//                     </Box>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default AdminDashboard;
