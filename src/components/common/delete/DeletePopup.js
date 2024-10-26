import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  SnackbarContent,
} from "@mui/material";

// DeletePopup component: displays a confirmation dialog for delete actions and a toast notification
function DeletePopup({
  visible, // Controls the visibility of the delete confirmation dialog
  setVisible, // Function to set the visibility of the dialog
  title, // Title of the confirmation dialog
  message, // Message in the dialog content, asking the user for confirmation
  handleDeleteData, // Function to execute when the "Yes" button is clicked
  visibleToast, // Controls the visibility of the toast notification
  msgToast, // Message displayed in the toast notification
  toastcolor, // Background color of the toast notification
}) {
  // Function to close the dialog
  const onClose = () => setVisible(false);

  return (
    <>
      {/* Dialog component: displays the delete confirmation popup */}
      <Dialog open={visible} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>{" "}
          {/* Dialog content message */}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            No
          </Button>
          <Button color="error" onClick={handleDeleteData}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar component: displays a toast notification for feedback */}
      <Snackbar
        open={visibleToast}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Toast position on screen
      >
        <SnackbarContent
          style={{
            backgroundColor: toastcolor,
            color: "#ffffff",
          }}
          message={msgToast}
        />
      </Snackbar>
    </>
  );
}

export default DeletePopup; // Exporting the DeletePopup component for use in other parts of the application
