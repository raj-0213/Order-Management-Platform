import React, { useState, useEffect } from 'react';
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
  IconButton,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 420,
  width: '100%',
  padding: theme.spacing(4),
  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
  borderRadius: theme.shape.borderRadius * 2
}));

const SignInPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  // Load saved credentials
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('savedCredentials'));
    if (savedData) {
      setFormData(savedData);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/user/login', formData);
        // console.log('Login successful:', response.data);

        localStorage.setItem('authToken', response.data.token);

        const authToken = localStorage.getItem('authToken');
        const decodedToken = JSON.parse(atob(response.data.token.split('.')[1])); 

        const userProfileResponse = await axios.get('http://localhost:5000/user/profile', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        const userRole = userProfileResponse.data.user.role; 
        // console.log('User profile:', userProfileResponse.data.user.role);

        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'customer') {
          navigate('/');
        }

        if (rememberMe) {
          localStorage.setItem('savedCredentials', JSON.stringify(formData));
        } else {
          localStorage.removeItem('savedCredentials');
        }

      } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        setSnackbar({ open: true, message: 'Invalid email or password', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSnackbar({ open: true, message: 'Please fill all fields correctly', severity: 'warning' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (errors[name]) {
      setErrors((prevState) => ({ ...prevState, [name]: '' }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
      }}
    >
      <StyledCard>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight={600} color="primary">
              Welcome Back 👋
            </Typography>
            <Typography sx={{ mt: 1 }} variant="body1" color="text.secondary">
              Sign in to continue
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                  />
                }
                label="Remember me"
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mb: 2,
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #1976D2, #0D47A1)',
                '&:hover': {
                  background: 'linear-gradient(to right, #1565C0, #0D47A1)',
                  transform: 'scale(1.02)',
                }
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <Typography variant="body2" align="center" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/signup" underline="hover" color="primary">
                Sign up now
              </Link>
            </Typography>
          </form>
        </CardContent>
      </StyledCard>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignInPage;


