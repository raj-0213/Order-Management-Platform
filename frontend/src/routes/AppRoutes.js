import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import MyOrders from '../components/MyOrders';
import {AdminDashboard} from '../components/AdminDashboard';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Box sx={{ mt: isAdminRoute ? 0 : 4 }}>
        <Container>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Container>
      </Box>
    </>
  );
};

const AppRoutes = () => (
  <Router>
    <AppContent />
  </Router>
);

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
