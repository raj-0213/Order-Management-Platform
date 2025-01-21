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
    const { name, value } = e.target;
    if (["salesPrice", "mrp", "packageSize", "stockQuantity"].includes(name)) {
      if (parseFloat(value) < 0 || isNaN(value)) return; 
    }

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
