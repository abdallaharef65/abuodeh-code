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

function CategoryForm({
  visible, // Boolean prop to control Modal visibility
  setVisibleModal, // Function to toggle Modal visibility
  rowData, // Data for the selected row (if editing an existing product)
  flagReRender, // Boolean flag to trigger re-rendering of the parent component
  setFlagReRender, // Function to update the re-render flag
}) {
  const [formData, setFormData] = useState({
    id: null,
    category_name_ar: null,
    category_name_en: null,
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msgSnackbar, setMsgSnackbar] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("success");
  const [isLodaing, setIsLodaing] = useState(false);

  // useEffect to populate form data when rowData changes (editing an existing product)
  useEffect(() => {
    if (rowData) {
      setFormData({
        id: rowData.id,
        category_name_en: rowData.category_name_en,
        category_name_ar: rowData.category_name_ar,
      });
    } else {
      setFormData({
        id: null,
        category_name_en: null,
        category_name_ar: null,
      });
    }
  }, [rowData]);

  // Handler for form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validation and submission handler
  const handleSave = async () => {
    let newErrors = {};

    if (!formData.category_name_ar)
      newErrors.category_name_ar = "Arabic category name is required";

    if (!formData.category_name_en)
      newErrors.category_name_en = "English category name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var bodyData = {
        category_name_en: formData.category_name_en,
        category_name_ar: formData.category_name_ar,
      };
      try {
        var res;
        if (formData.id) {
          res = await updateData("category", formData.id, bodyData);
        } else {
          res = await addData("category", bodyData);
        }
        if (res.data.success) {
          setFlagReRender(!flagReRender);
          setOpenSnackbar(true);
          setSnackbarColor("success");
          setMsgSnackbar("Category saved successfully!");
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
        {!isLodaing && (
          <>
            <Typography id="modal-title" variant="h6" component="h2" mb={2}>
              Category
            </Typography>

            <TextField
              label="Arabic category name"
              name="category_name_ar"
              value={formData.category_name_ar}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.category_name_ar)}
              helperText={errors.category_name_ar}
            />

            <TextField
              label="English category name"
              name="category_name_en"
              value={formData.category_name_en}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.category_name_en)}
              helperText={errors.category_name_en}
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

export default CategoryForm;
