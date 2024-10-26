/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";

// Importing custom table, helper functions, form, and delete popup components
import IReactTable from "../../../components/common/table/IReactTable";
import { deleteData, getData, selectDataByParam } from "../../../helper/index";
import ProductForm from "./productForm";
import DeletePopup from "../../../components/common/delete/DeletePopup";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [rowData, setRowData] = useState();
  const [flagReRender, setFlagReRender] = useState(false);
  const [visibleFormModal, setVisibleFormModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [showToastDelete, setShowToastDelete] = useState(false);
  const [deleteToastColor, setDeleteToastColor] = useState("#2e7d32");
  const [deleteToastMsg, setDeleteToastMsg] = useState("");

  // Fetch product data when component mounts or when flagReRender changes
  useEffect(() => {
    (async () => {
      try {
        var resProduct = await getData("product");
        setProducts(
          resProduct.data.map((item) => ({
            ...item,
          }))
        );
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, [flagReRender]);

  // Define columns for the product table with edit and delete options
  const columnsTable = [
    {
      Header: "Product name",
      accessor: "name",
    },
    {
      Header: "Category name",
      accessor: "category_name_ar",
    },
    {
      Header: "Price",
      accessor: "price",
    },
    {
      Header: "Available",
      accessor: "is_available",
      Cell: ({ row }) => (
        <span>{row.original.is_available ? "true" : "false"}</span>
      ),
    },
    {
      Header: "Option",
      accessor: " ",
      Cell: ({ row }) => (
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button
            onClick={() => {
              setVisibleFormModal(true);
              setRowData(row.original);
            }}
          >
            Edit
          </Button>
          <Button
            color="error"
            onClick={() => {
              setVisibleDeleteModal(true);
              setRowData(row.original);
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  // Function to handle deletion of a product
  const handleDeleteData = async () => {
    const productDeleted = await deleteData("product", rowData.id);
    if (productDeleted.success) {
      setProducts(products.filter((x) => x.id != rowData.id)); // Remove deleted product from the list
      setShowToastDelete(true);
      setDeleteToastMsg("Deleted successfully");
      setDeleteToastColor("#2e7d32");
      setTimeout(() => {
        setShowToastDelete(false);
        setVisibleDeleteModal(false);
        setDeleteToastMsg("");
        setRowData();
      }, 3000);
    } else {
      setShowToastDelete(true); // Show failure toast
      setDeleteToastMsg(res.message);
      setDeleteToastColor("#d32f2f"); // Error color
      setTimeout(() => {
        setShowToastDelete(false);
        setVisibleDeleteModal(false);
        setDeleteToastMsg("");
        setRowData();
      }, 3000);
    }
  };

  return (
    <div className="store-container">
      {/* Button to open the product form for adding a new product */}
      <div
        style={{
          marginBottom: 50,
          marginTop: 20,
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          onClick={() => {
            setVisibleFormModal(true);
            setRowData();
          }}
          variant="contained"
          color="success"
        >
          Add Product
        </Button>
      </div>

      {/* Table displaying the list of products */}
      <IReactTable columns={columnsTable} data={products} />

      {/* Conditional rendering of ProductForm for adding/editing products */}
      {visibleFormModal && (
        <ProductForm
          setFlagReRender={setFlagReRender}
          flagReRender={flagReRender}
          visible={visibleFormModal}
          setVisibleModal={setVisibleFormModal}
          rowData={rowData}
        />
      )}

      {/* Delete confirmation popup */}
      <DeletePopup
        visible={visibleDeleteModal}
        setVisible={setVisibleDeleteModal}
        message={`Do you want to delete ${rowData ? rowData.name : ""} ?`}
        handleDeleteData={handleDeleteData}
        visibleToast={showToastDelete}
        msgToast={deleteToastMsg}
        toastcolor={deleteToastColor}
      />
    </div>
  );
};

export default Product;
