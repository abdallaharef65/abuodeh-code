/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  ButtonGroup,
  CardMedia,
  CardContent,
  CardActions,
  Card,
  Paper,
  Box,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import IReactTable from "../../../components/common/table/IReactTable";
import { deleteData, getData, selectDataByParam } from "../../../helper/index";
import CategoryForm from "./CategoryForm";
import DeletePopup from "../../../components/common/delete/DeletePopup";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [rowData, setRowData] = useState();
  const [flagReRender, setFlagReRender] = useState(false);
  const [visibleFormModal, setVisibleFormModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [showToastDelete, setShowToastDelete] = useState(false);
  const [deleteToastColor, setDeleteToastColor] = useState("#2e7d32");
  const [deleteToastMsg, setDeleteToastMsg] = useState("");

  // Fetches category data on initial render or when flagReRender changes
  useEffect(() => {
    (async () => {
      try {
        const rescategory = await getData("category");
        setCategory([...rescategory.data]);
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, [flagReRender]);

  // Table columns configuration
  const columnsTable = React.useMemo(
    () => [
      {
        Header: "Category name ar",
        accessor: "category_name_ar",
      },
      {
        Header: "Category name en",
        accessor: "category_name_en",
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
    ],
    []
  );

  // Handles deletion of a category
  const handleDeleteData = async () => {
    try {
      const res = await deleteData("category", rowData.id);
      if (res.success) {
        setCategory(category.filter((x) => x.id !== rowData.id)); // Update state after deletion
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
        setShowToastDelete(true);
        setDeleteToastMsg(res.message);
        setDeleteToastColor("#d32f2f");
        setTimeout(() => {
          setShowToastDelete(false);
          setVisibleDeleteModal(false);
          setDeleteToastMsg("");
          setRowData();
        }, 3000);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="store-container">
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
          Add Category
        </Button>
      </div>
      <IReactTable columns={columnsTable} data={category} />{" "}
      {/* Table component */}
      {visibleFormModal && (
        <CategoryForm
          setFlagReRender={setFlagReRender}
          flagReRender={flagReRender}
          visible={visibleFormModal}
          setVisibleModal={setVisibleFormModal}
          rowData={rowData} // Pass row data to form modal for editing
        />
      )}
      <DeletePopup
        visible={visibleDeleteModal}
        setVisible={setVisibleDeleteModal}
        message={`Do you want to delete ${
          rowData ? rowData.category_name_en : ""
        } ?`}
        handleDeleteData={handleDeleteData}
        visibleToast={showToastDelete}
        msgToast={deleteToastMsg}
        toastcolor={deleteToastColor}
      />
    </div>
  );
};

export default Category;
