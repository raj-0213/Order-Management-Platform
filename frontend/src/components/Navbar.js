import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import { Card, CardMedia, CardContent, Chip, Snackbar, Modal, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const pages = ['Home', 'Cart', 'My Orders'];
const settings = ['Profile', 'Logout'];

function Navbar() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notification, setNotification] = useState(false);
    const [quantityExceedNotification, setQuantityExceedNotification] = useState(false);
    const [userQuantity, setUserQuantity] = useState(1);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [userData, setUserData] = useState(null);

    const [cartCount, setCartCount] = useState(0);


    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');

    const username = userData?.username || 'U';
    const avatarLetter = username.charAt(0).toUpperCase();

    useEffect(() => {
        if (token) {
            fetchCartCount();
        }
        if (openProfileModal) {
            fetchUserProfile();
        }
    }, [openProfileModal]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log(response.data.user);
            setUserData(response.data.user);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchCartCount = async () => {
        try {
            const response = await axios.get('http://localhost:5000/cart/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartCount(response.data.cartItems.length);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    const handleOpenProfileModal = () => {
        setOpenProfileModal(true);
        setAnchorElUser(null);
    };

    const handleCloseProfileModal = () => {
        setOpenProfileModal(false);
    };

    const handleNavigateToProductList = () => {
        // Redirect to the product list page and pass the search results
        navigate('/', { state: { searchResults } });
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleAddToCart = () => {
        setNotification(true);
    }

    const handleIncrement = () => {
        setUserQuantity(userQuantity + 1);
    };

    const handleDecrement = () => {
        if (userQuantity > 1) setUserQuantity(userQuantity - 1);
    };

    const handleCloseNotification = () => {
        setNotification(false);
        setQuantityExceedNotification(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleSearch = async (event) => {
        const query = event.target.value;
        // console.log(query);
        setSearchTerm(query);


        try {
            const response = await axios.get(`http://localhost:5000/product/?search=${query}`);
            // console.log("Name : ", response.data.products[0].name);
            if (response.data && response.data.products) {
                setSearchResults(response.data.products);
                navigate('/', { state: { searchResults: response.data.products } });

            }
        } catch (error) {
            console.error('Error fetching search results:', error.message);

        }
    };

    return (
        <AppBar position="static" sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 'bolder',
                            letterSpacing: '.3rem',
                            color: '#3f51b5',
                            textDecoration: 'none',
                        }}
                    >
                        OMS
                    </Typography>

                    {/* Desktop Navbar */}

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 3 }}>
                        {/* Home Icon */}
                        <IconButton component={Link} to="/" sx={{ color: '#3f51b5' }}>
                            <HomeIcon />
                        </IconButton>

                        {/* Cart Icon with Badge */}
                        <Badge badgeContent={cartCount} color="secondary">
                            <IconButton component={Link} to="/cart" sx={{color: '#3f51b5' }}>
                                <ShoppingCartIcon />
                            </IconButton>
                        </Badge>

                        {/* Orders Icon */}
                        <IconButton component={Link} to="/myorders" sx={{ color: '#3f51b5' }}>
                            <AssignmentIcon />
                        </IconButton>
                    </Box>


                    {/* <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <IconButton
                            component={Link}
                            to="/"
                            sx={{ my: 2, ml: -18, color: '#3f51b5', display: 'block' }}
                        >
                            <HomeIcon />
                        </IconButton>

                        <IconButton component={Link} to="/cart" sx={{ ml: 2, my: 2, color: '#3f51b5', display: 'block', position: 'relative' }}>
                            <Badge
                                badgeContent={cartCount}
                                color="secondary"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    transform: 'translate(50%, -50%)'
                                }}
                            >
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton> */}


                    {/* <IconButton
                            component={Link}
                            to="/cart"
                            sx={{ ml: 2, my: 2, color: '#3f51b5', display: 'block' }}
                        >
                            <ShoppingCartIcon />
                    //     </IconButton> */}
                    {/* //     <IconButton
                        //         component={Link}
                        //         to="/myorders"
                        //         sx={{ ml: 2, my: 2, color: '#3f51b5', display: 'block' }}
                        //     >
                        //         <AssignmentIcon />
                        //     </IconButton>
                        // </Box> */}

                        {/* Search Bar */}
                    <Box sx={{ flexGrow: 1, mx: 2, display: 'flex', alignItems: 'center' }}>
                        <TextField
                            placeholder="Search products by name and wsCode"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchTerm}
                            onChange={handleSearch}
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#3f51b5',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#3f51b5',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <IconButton sx={{ mr: 1 }} onClick={handleNavigateToProductList}>
                                        <SearchIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>


                    {/* Auth Pages - Login/SignUp */}
                    {!token && (
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                component={Link}
                                to="/login"
                                sx={{
                                    my: 2,
                                    color: '#3f51b5',
                                    fontWeight: 'bolder',
                                    letterSpacing: '0.1rem',
                                    textTransform: 'none',
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                to="/signup"
                                sx={{
                                    my: 2,
                                    color: '#3f51b5',
                                    fontWeight: 'bolder',
                                    letterSpacing: '0.1rem',
                                    textTransform: 'none',
                                }}
                            >
                                SignUp
                            </Button>
                        </Box>
                    )}

                    {/* User Profile Dropdown */}
                    {token && (
                        <Box sx={{ ml: 2, flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar>{userData ? userData.username.charAt(0) : 'U'}</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                sx={{ mt: '45px' }}
                            >
                                <MenuItem onClick={handleOpenProfileModal}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
            {/* Profile Modal */}
            <Modal open={openProfileModal} onClose={handleCloseProfileModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 420,
                    bgcolor: '#ffffff',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3,
                    textAlign: 'center',
                    fontFamily: 'Arial, sans-serif',
                }}>
                    {/* Close Button */}
                    <IconButton
                        sx={{ position: 'absolute', top: 10, right: 10, color: '#f44336' }}
                        onClick={handleCloseProfileModal}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* User Avatar */}
                    {userData && (
                        <Avatar
                            sx={{
                                bgcolor: '#3f51b5',
                                width: 70,
                                height: 70,
                                fontSize: 30,
                                margin: 'auto',
                                textTransform: 'uppercase'
                            }}
                        >
                            {userData ? userData.username.charAt(0) : 'U'}
                        </Avatar>
                    )}

                    {/* User Details */}
                    {userData && (
                        <>
                            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#3f51b5' }}>
                                Hey , {userData.username}
                            </Typography>

                            <Box sx={{ mt: 2, textAlign: 'left', px: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EmailIcon sx={{ color: '#3f51b5', mr: 1 }} />
                                    <Typography sx={{ fontSize: 16, color: '#333' }}>
                                        <strong>Email:</strong> {userData.email}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PhoneIcon sx={{ color: '#3f51b5', mr: 1 }} />
                                    <Typography sx={{ fontSize: 16, color: '#333' }}>
                                        <strong>Mobile:</strong> {userData.mobileNo}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CakeIcon sx={{ color: '#3f51b5', mr: 1 }} />
                                    <Typography sx={{ fontSize: 16, color: '#333' }}>
                                        <strong>DOB:</strong> {userData.dob}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <HomeIcon sx={{ color: '#3f51b5', mr: 1 }} />
                                    <Typography sx={{ fontSize: 16, color: '#333' }}>
                                        <strong>Address:</strong> {userData.address}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Edit Profile Button */}
                            {/* <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                sx={{ mt: 3, textTransform: 'none' }}
                            >
                                Edit Profile
                            </Button> */}
                        </>
                    )}
                </Box>
            </Modal>

        </AppBar>
    );
}

export default Navbar;


// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import MenuItem from '@mui/material/MenuItem';
// import HomeIcon from '@mui/icons-material/Home';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import { Link } from 'react-router-dom';

// const pages = ['Home', 'Cart', 'My Orders'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
// const authPages = ['Login', 'SignUp'];

// function Navbar() {
//     const [anchorElNav, setAnchorElNav] = React.useState(null);
//     const [anchorElUser, setAnchorElUser] = React.useState(null);

//     const handleOpenNavMenu = (event) => {
//         setAnchorElNav(event.currentTarget);
//     };
//     const handleOpenUserMenu = (event) => {
//         setAnchorElUser(event.currentTarget);
//     };

//     const handleCloseNavMenu = () => {
//         setAnchorElNav(null);
//     };

//     const handleCloseUserMenu = () => {
//         setAnchorElUser(null);
//     };

//     return (
//         <AppBar position="static" sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
//             <Container maxWidth="xl">
//                 <Toolbar disableGutters>
//                     {/* Logo */}
//                     <Typography
//                         variant="h6"
//                         noWrap
//                         component="a"
//                         href="/"
//                         sx={{
//                             mr: 2,
//                             display: { xs: 'none', md: 'flex' },
//                             fontFamily: 'Roboto, sans-serif',
//                             fontWeight: 'bolder',
//                             letterSpacing: '.3rem',
//                             color: '#3f51b5',
//                             textDecoration: 'none',
//                         }}
//                     >
//                         OMS
//                     </Typography>

//                     {/* Desktop Navbar */}
//                     <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
//                         <IconButton
//                             component={Link}
//                             to="/"
//                             onClick={handleCloseNavMenu}
//                             sx={{ my: 2, color: '#3f51b5', display: 'block' }}
//                         >
//                             <HomeIcon />
//                         </IconButton>
//                         <IconButton
//                             component={Link}
//                             to="/cart"
//                             onClick={handleCloseNavMenu}
//                             sx={{ ml: 2, my: 2, color: '#3f51b5', display: 'block' }}
//                         >
//                             <ShoppingCartIcon />
//                         </IconButton>
//                         <IconButton
//                             component={Link}
//                             to="/myorders"
//                             onClick={handleCloseNavMenu}
//                             sx={{ ml: 2, my: 2, color: '#3f51b5', display: 'block' }}
//                         >
//                             <AssignmentIcon />
//                         </IconButton>
//                     </Box>


//                     {/* Auth Pages - Login/SignUp (Text Only) */}
//                     <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//                         {authPages.map((authPage) => (
//                             <Button
//                                 key={authPage}
//                                 component={Link}
//                                 to={`/${authPage.toLowerCase()}`}
//                                 onClick={handleCloseNavMenu}
//                                 sx={{
//                                     my: 2,
//                                     color: '#3f51b5',
//                                     display: 'block',
//                                     fontWeight: 'bolder',
//                                     letterSpacing: '0.1rem',
//                                     textTransform: 'none',
//                                 }}
//                             >
//                                 {authPage}
//                             </Button>
//                         ))}
//                     </Box>

//                     {/* User Profile Dropdown */}
//                     <Box sx={{ ml: 2, flexGrow: 0 }}>
//                         <Tooltip title="Open settings">
//                             <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                                 <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
//                             </IconButton>
//                         </Tooltip>
//                         <Menu
//                             sx={{ mt: '45px' }}
//                             id="menu-appbar"
//                             anchorEl={anchorElUser}
//                             anchorOrigin={{
//                                 vertical: 'top',
//                                 horizontal: 'right',
//                             }}
//                             keepMounted
//                             transformOrigin={{
//                                 vertical: 'top',
//                                 horizontal: 'right',
//                             }}
//                             open={Boolean(anchorElUser)}
//                             onClose={handleCloseUserMenu}
//                         >
//                             {settings.map((setting) => (
//                                 <MenuItem key={setting} onClick={handleCloseUserMenu}>
//                                     <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
//                                 </MenuItem>
//                             ))}
//                         </Menu>
//                     </Box>
//                 </Toolbar>
//             </Container>
//         </AppBar>
//     );
// }

// export default Navbar;
