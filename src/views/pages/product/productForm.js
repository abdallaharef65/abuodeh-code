// Importing necessary React and MUI components
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { addData, getData, updateData } from "../../../helper";

function ProductForm({
  visible, // Boolean prop to control Modal visibility
  setVisibleModal, // Function to toggle Modal visibility
  rowData, // Data for the selected row (if editing an existing product)
  flagReRender, // Boolean flag to trigger re-rendering of the parent component
  setFlagReRender, // Function to update the re-render flag
}) {
  const [formData, setFormData] = useState({
    id: null,
    is_available: false,
    price: 0,
    name: "",
    description: "",
    category_id: "",
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msgSnackbar, setMsgSnackbar] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("success");
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect to fetch categories and update loading state
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const rescategory = await getData("category");
        setCategory(rescategory.data);
        setIsLoading(false);
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, []);

  // useEffect to populate form data when rowData changes (editing an existing product)
  useEffect(() => {
    if (rowData) {
      setFormData({
        id: rowData.id,
        is_available: rowData.is_available,
        price: rowData.price,
        name: rowData.name,
        description: rowData.description,
        category_id: rowData.category_id,
      });
    } else {
      setFormData({
        id: null,
        is_available: false,
        price: 0,
        name: "",
        description: "",
        category_id: "",
      });
    }
  }, [rowData]);

  // Handler for form input changes
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData({
      ...formData,
      [name]: name === "is_available" ? checked : value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validation and submission handler
  const handleSave = async () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.category_id)
      newErrors.category_id = "Category selection is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const bodyData = {
        category_id: formData.category_id,
        is_available: formData.is_available,
        price: formData.price,
        description: formData.description,
        name: formData.name,
      };
      try {
        let res;
        if (formData.id) {
          res = await updateData("product", formData.id, bodyData);
        } else {
          res = await addData("product", bodyData);
        }
        if (res.data.success) {
          setFlagReRender(!flagReRender);
          setOpenSnackbar(true);
          setSnackbarColor("success");
          setMsgSnackbar("Product saved successfully!");
          setTimeout(() => {
            setVisibleModal(false);
          }, 3000);
        } else {
          setOpenSnackbar(true);
          setSnackbarColor("#d32f2f");
          setMsgSnackbar(res.data.message);
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  };

  // Component rendering logic
  return (
    <Modal
      open={visible}
      onClose={() => setVisibleModal(false)}
      aria-labelledby="modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          minWidth: 300,
        }}
      >
        {!isLoading && (
          <>
            <Typography id="modal-title" variant="h6" component="h2" mb={2}>
              Product
            </Typography>

            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />

            <FormControl
              fullWidth
              margin="normal"
              error={Boolean(errors.category_id)}
            >
              <InputLabel id="select-label">Select category</InputLabel>
              <Select
                labelId="select-label"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Select Option"
              >
                {category.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.category_name_ar}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && (
                <Typography color="error" variant="body2">
                  {errors.category_id}
                </Typography>
              )}
            </FormControl>
            <TextField
              label="Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.price)}
              helperText={errors.price}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_available}
                  onChange={handleChange}
                  name="is_available"
                />
              }
              label="Available"
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setVisibleModal(false)}
              >
                Close
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
              >
                <Alert
                  onClose={() => setOpenSnackbar(false)}
                  severity={snackbarColor}
                >
                  {msgSnackbar}
                </Alert>
              </Snackbar>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default ProductForm;
