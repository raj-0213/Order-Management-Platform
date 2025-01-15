import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Link,
    Box,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Email, Lock, Person, Phone, Home, DateRange, Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 450,
    width: '100%',
    padding: theme.spacing(3),
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)',
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius
}));

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        mobileNo: '',
        dob: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for showing password
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.mobileNo) newErrors.mobileNo = 'Mobile number is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.role) newErrors.role = 'Role is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/user/register', formData);
                console.log('Registration successful:', response.data);
                navigate('/login');
            } catch (error) {
                console.error('Registration failed:', error.response?.data || error.message);
                setErrors({ form: 'Registration failed. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(e.target.value);
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prevState) => ({
                ...prevState,
                [name]: ''
            }));
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                background: 'linear-gradient(135deg, #f5f7ff 0%, #c3e8ff 100%)'
            }}
        >
            <StyledCard>
                <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom color="primary">
                            Create Your Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Fill in the details to sign up
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                name="username"
                                label="Username"
                                variant="outlined"
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Box>

                        {/* Email */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                type="email"
                                name="email"
                                label="Email"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Box>

                        {/* Password */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                label="Password"
                                variant="outlined"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>

                        {/* Role */}
                        <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name='role'
                                    value={formData.role}
                                    label="Role"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="customer">Customer</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Mobile No */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                name="mobileNo"
                                label="Mobile Number"
                                variant="outlined"
                                value={formData.mobileNo}
                                onChange={handleChange}
                                error={!!errors.mobileNo}
                                helperText={errors.mobileNo}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Box>

                        {/* Date of Birth */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                type="date"
                                name="dob"
                                label="Date of Birth"
                                variant="outlined"
                                value={formData.dob}
                                onChange={handleChange}
                                error={!!errors.dob}
                                helperText={errors.dob}
                                disabled={isLoading}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Box>

                        {/* Address */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                name="address"
                                label="Address"
                                variant="outlined"
                                value={formData.address}
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                                disabled={isLoading}
                                multiline
                                rows={4}
                                InputProps={{
                                    startAdornment: <Home sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <FormControlLabel
                                control={<Checkbox disabled={isLoading} />}
                                label="I agree to the terms and conditions"
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{ mb: 2 }}
                        >
                            {isLoading ? (
                                <>
                                    <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                                    Signing up...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>

                        {errors.form && (
                            <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                                {errors.form}
                            </Typography>
                        )}

                        <Typography variant="body2" align="center" color="text.secondary">
                            Already have an account?{' '}
                            <Link href="/login" underline="hover" color="primary">
                                Log in
                            </Link>
                        </Typography>
                    </form>
                </CardContent>
            </StyledCard>
        </Box>
    );
};

export default SignUpPage;
