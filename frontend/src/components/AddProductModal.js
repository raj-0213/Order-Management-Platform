import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const AddProductModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    wsCode: "",
    salesPrice: "",
    mrp: "",
    packageSize: "",
    stockQuantity: "",
    tags: [],
    categoryId: "",
    description:"",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]); // Image previews
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData({ ...formData, tags });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setFormData({ ...formData, images: [...formData.images, ...files] });

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (parseFloat(formData.salesPrice) > parseFloat(formData.mrp)) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Sales Price cannot be greater than MRP");
      setOpenSnackbar(true);
      return;
    }
  
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("wsCode", formData.wsCode);
    formDataObj.append("salesPrice", formData.salesPrice);
    formDataObj.append("mrp", formData.mrp);
    formDataObj.append("packageSize", formData.packageSize);
    formDataObj.append("stockQuantity", formData.stockQuantity);
    formDataObj.append("tags", JSON.stringify(formData.tags)); 
    formDataObj.append("categoryId", formData.categoryId);
    formDataObj.append("description", formData.description);
  
    formData.images.forEach((image) => {
      formDataObj.append("images", image);
    });
  
    const authToken = localStorage.getItem("authToken");
  
    try {
      const response = await axios.post(
        "http://localhost:5000/product/create/",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Product added successfully");
        setOpenSnackbar(true);
        onClose();
        window.location.reload();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to add product");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error adding product");
      setOpenSnackbar(true);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="WS Code"
            name="wsCode"
            value={formData.wsCode}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Sales Price (₹)"
            name="salesPrice"
            type="number"
            value={formData.salesPrice}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="MRP (₹)"
            name="mrp"
            type="number"
            value={formData.mrp}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Package Size"
            name="packageSize"
            type="number"
            value={formData.packageSize}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Tags (comma separated)"
            name="tags"
            value={formData.tags.join(", ")}
            onChange={handleTagChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category ID"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth required margin="normal" multiline rows={3} />


          {/* Upload Images Button */}
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ marginTop: 2 }}
          >
            Upload Images
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>

          {/* Image Previews with Remove Icon */}
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={preview}
                  alt={`preview-${index}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                  }}
                  onClick={() => removeImage(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>

          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddProductModal;



// import React, { useState } from 'react';
// import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, Alert } from '@mui/material';
// import axios from 'axios';

// const AddProductModal = ({ open, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     wsCode: '',
//     salesPrice: '',
//     mrp: '',
//     packageSize: '',
//     stockQuantity: '',
//     tags: [],
//     categoryId: '',
//     images: []
//   });

//   const [imagePreviews, setImagePreviews] = useState([]); // State to store image previews
//   const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility
//   const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity (success or error)

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleTagChange = (e) => {
//     const { value } = e.target;
//     const tags = value.split(',').map(tag => tag.trim()); // Split by commas and trim
//     setFormData({
//       ...formData,
//       tags
//     });
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files); 
//     setFormData({
//       ...formData,
//       images: files 
//     });

//     const previews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(previews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formDataObj = new FormData();
//     formDataObj.append('name', formData.name);
//     formDataObj.append('wsCode', formData.wsCode);
//     formDataObj.append('salesPrice', formData.salesPrice);
//     formDataObj.append('mrp', formData.mrp);
//     formDataObj.append('packageSize', formData.packageSize);
//     formDataObj.append('stockQuantity', formData.stockQuantity);
//     formDataObj.append('tags', JSON.stringify(formData.tags)); 
//     formDataObj.append('categoryId', formData.categoryId);
  
//     formData.images.forEach((image, index) => {
//         formDataObj.append('images', image, image.name); // Appending with the file's name
//       });

//     // Log the contents of formDataObj for debugging
//     for (let pair of formDataObj.entries()) {
//       console.log(pair[0] + ": " + pair[1]);
//     }

//     const authToken = localStorage.getItem('authToken');
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/product/create/', 
//         formDataObj,
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
  
//       if (response.status === 200 || response.status === 201) {
//         setSnackbarSeverity('success');
//         setSnackbarMessage('Product added successfully');
//         setOpenSnackbar(true);
//         onClose();  
//         window.location.reload();
//       } else {
//         setSnackbarSeverity('error');
//         setSnackbarMessage('Failed to add product');
//         setOpenSnackbar(true);
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//       setSnackbarSeverity('error');
//       setSnackbarMessage('Error adding product');
//       setOpenSnackbar(true);
//     }
//   };

//   // Handle Snackbar close
//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Add New Product</DialogTitle>
//       <DialogContent>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Product Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             fullWidth
//             required
//             margin="normal"
//           />
//           <TextField
//             label="WS Code"
//             name="wsCode"
//             value={formData.wsCode}
//             onChange={handleChange}
//             fullWidth
//             required
//             margin="normal"
//           />
//           <TextField
//             label="Sales Price"
//             name="salesPrice"
//             value={formData.salesPrice}
//             onChange={handleChange}
//             fullWidth
//             required
//             margin="normal"
//           />
//           <TextField
//             label="MRP"
//             name="mrp"
//             value={formData.mrp}
//             onChange={handleChange}
//             fullWidth
//             required
//             margin="normal"
//           />
//           <TextField
//             label="Package Size"
//             name="packageSize"
//             value={formData.packageSize}
//             onChange={handleChange}
//             fullWidth
//             required
//             margin="normal"
//           />
//           <TextField
//             label="Stock Quantity"
//             name="stockQuantity"
//             value={formData.stockQuantity}
//             onChange={handleChange}
//             fullWidth
//             required
//             margin="normal"
//           />
//           <TextField
//             label="Tags (comma separated)"
//             name="tags"
//             value={formData.tags.join(', ')}
//             onChange={handleTagChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Category ID"
//             name="categoryId"
//             value={formData.categoryId}
//             onChange={handleChange}
//             fullWidth
//             required
//             margin="normal"
//           />
//           <input
//             type="file"
//             name="images"
//             onChange={handleFileChange}
//             multiple
//           />
//           <div>
//             {imagePreviews.map((preview, index) => (
//               <img key={index} src={preview} alt={`preview-${index}`} style={{ width: '100px', margin: '10px' }} />
//             ))}
//           </div>

//           <DialogActions>
//             <Button onClick={onClose} color="primary">Cancel</Button>
//             <Button type="submit" color="primary">Submit</Button>
//           </DialogActions>
//         </form>
//       </DialogContent>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Dialog>
//   );
// };

// export default AddProductModal;



// // import React, { useState } from 'react';
// // import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
// // import axios from 'axios';

// // const AddProductModal = ({ open, onClose }) => {
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     wsCode: '',
// //     salesPrice: '',
// //     mrp: '',
// //     packageSize: '',
// //     stockQuantity: '',
// //     tags: '',
// //     categoryId: '',
// //     images: ''
// //   });

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     const formData = new FormData();
// //     formData.append('name', formData.name);
// //     formData.append('wsCode', formData.wsCode);
// //     formData.append('salesPrice', formData.salesPrice);
// //     formData.append('mrp', formData.mrp);
// //     formData.append('packageSize', formData.packageSize);
// //     formData.append('stockQuantity', formData.stockQuantity);
// //     formData.append('tags', formData.tags);
// //     formData.append('categoryId', formData.categoryId);

// //     formData.append('images', formData.images);

// //     const authToken = localStorage.getItem('authToken');

// //     try {
// //         const response = await axios.post(
// //             'http://localhost:5000/product/create', 
// //             formData,
// //             {
// //                 headers: {
// //                     Authorization: `Bearer ${authToken}`,
// //                     'Content-Type': 'multipart/form-data',  
// //                 },
// //             }
// //         );

// //         if (response.status === 200) {
// //             onClose();  
// //             alert('Product added successfully');
// //         } else {
// //             alert('Failed to add product');
// //         }
// //     } catch (error) {
// //         console.error('Error adding product:', error);
// //         alert('Error adding product');
// //     }
// // };

// //   return (
// //     <Dialog open={open} onClose={onClose}>
// //       <DialogTitle>Add New Product</DialogTitle>
// //       <DialogContent>
// //         <form onSubmit={handleSubmit}>
// //           <TextField
// //             label="Product Name"
// //             name="name"
// //             value={formData.name}
// //             onChange={handleChange}
// //             fullWidth
// //             required
// //             margin="normal"
// //           />
// //           <TextField
// //             label="WS Code"
// //             name="wsCode"
// //             value={formData.wsCode}
// //             onChange={handleChange}
// //             fullWidth
// //             required
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Sales Price"
// //             name="salesPrice"
// //             value={formData.salesPrice}
// //             onChange={handleChange}
// //             fullWidth
// //             required
// //             margin="normal"
// //           />
// //           <TextField
// //             label="MRP"
// //             name="mrp"
// //             value={formData.mrp}
// //             onChange={handleChange}
// //             fullWidth
// //             required
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Package Size"
// //             name="packageSize"
// //             value={formData.packageSize}
// //             onChange={handleChange}
// //             fullWidth
// //             required
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Stock Quantity"
// //             name="stockQuantity"
// //             value={formData.stockQuantity}
// //             onChange={handleChange}
// //             fullWidth
// //             required
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Tags"
// //             name="tags"
// //             value={formData.tags}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Category ID"
// //             name="categoryId"
// //             value={formData.categoryId}
// //             onChange={handleChange}
// //             fullWidth
// //             required
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Images"
// //             name="images"
// //             value={formData.images}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <DialogActions>
// //             <Button onClick={onClose} color="primary">Cancel</Button>
// //             <Button type="submit" color="primary">Submit</Button>
// //           </DialogActions>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// // export default AddProductModal;















// const Products = () => {
//   const [openModal, setOpenModal] = useState(false);
//   const [categoryOptions, setCategoryOptions] = useState([]); // This should be fetched from your API
//   const [products, setProducts] = useState([]); // Assuming you have this state for products

//   const handleOpenModal = () => setOpenModal(true);
//   const handleCloseModal = () => setOpenModal(false);

//   // Fetch category options from your API (once the component mounts)
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/categories'); // Your API endpoint
//       setCategoryOptions(response.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//         <Typography variant="h4" component="h1">
//           Products
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<Plus />}
//           color="primary"
//           onClick={handleOpenModal}
//         >
//           Add New Product
//         </Button>
//       </Box>

//       <Grid container spacing={3}>
//         {products.map((product) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
//             <Card>
//               <CardMedia
//                 component="img"
//                 height="140"
//                 image={product.images || "/api/placeholder/300/200"}
//                 alt={product.name}
//               />
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   {product.name}
//                 </Typography>
//                 <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                   <Typography variant="h6" color="primary">
//                     ₹{product.salesPrice}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
//                     ₹{product.mrp}
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <AddProductModal open={openModal} onClose={handleCloseModal} categoryOptions={categoryOptions} />
//     </Box>
//   );
// };

// export default Products;
