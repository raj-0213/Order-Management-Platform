import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import MyOrders from '../components/MyOrders';

const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <Box sx={{ mt: 4 }}>
                <Container>
                    <Routes>
                        {/* Home Page with Product List */}
                        <Route path="/" element={<ProductList />} />

                        {/* <Route path="/pl" element={<ProductList />} /> */}
                        {/* Authentication Pages */}
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/login" element={<SignInPage />} />
                        
                        {/* Cart Page */}
                        <Route path="/cart" element={<Cart />} />
                        
                        {/* My Orders Page */}
                        <Route path="/myorders" element={<MyOrders />} />
                    </Routes>
                </Container>
            </Box>
        </Router>
    );
};

export default AppRoutes;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Container, Box } from '@mui/material';
// import SignInPage from '../pages/SignIn';
// import SignUpPage from '../pages/SignUp';
// import Navbar from '../components/Navbar';
// import ProductCard from '../components/ProductCard';
// import Cart from '../components/Cart';
// import MyOrders from '../components/MyOrders';


// const AppRoutes = () => {
//     return (
//         <Router>
//             <Navbar />
//             <Container>
//                 <Routes>
//                     <Route path="/" element={<ProductCard
//                         product={{
//                             name: "Wireless Headphones",
//                             price: 2999,
//                             quantity: 5,
//                             category: "Electronics",
//                             image: "https://ibb.co/K9Dpxdw"
//                         }}
//                     />} />
//                     <Route path="/signup" element={<SignUpPage />} />
//                     <Route path="/login" element={<SignInPage />} />
//                     <Route path="/cart" element={<Cart />} />
//                     <Route path="/myorders" element={<MyOrders />} />
//                 </Routes>
//             </Container>
//         </Router>
//         // <Router>
//         //     <Routes>

//         //         <Route path="/login" element={<SignInPage />} />
//         //         <Route path="/register" element={<SignUpPage />} />

//         //     </Routes>
//         // </Router>
//     );
// };

// export default AppRoutes;
