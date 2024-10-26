/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  CardMedia,
  CardContent,
  CardActions,
  Card,
  TextField,
  Slider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { getData, selectDataByParam } from "../../../helper/index";
import "./Main.css";
import Vegetables from "../../../assets/vegetables.jpg";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [productsForFiltering, setProductsForFiltering] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([-1]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [nameFilter, setNameFilter] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let resProduct = await getData("product");
        setProductsForFiltering(resProduct.data);
        setProducts(resProduct.data.filter((x) => x.is_available == true));

        let resCategory = await getData("category");
        setCategory([
          ...resCategory.data,
          {
            id: -1,
            category_name_ar: "جميع الفئات",
            category_name_en: "ALL",
          },
        ]);
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, []);

  useEffect(() => {
    let filteredProducts = productsForFiltering;

    // Filter by selected category
    if (!(selectedCategory.length === 1 && selectedCategory.includes(-1))) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategory.includes(product.category_id)
      );
    }

    // Filter by name
    if (nameFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Filter by availability
    filteredProducts = filteredProducts.filter(
      (product) => product.is_available == isAvailable
    );

    // Filter by price range
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setProducts(filteredProducts);
  }, [selectedCategory, nameFilter, priceRange, isAvailable]);

  return (
    <div className="store-container">
      <div className="filter-controls">
        <div className="category-buttons">
          {category.map((category, index) => (
            <button
              key={index}
              className={`category-button ${
                selectedCategory.includes(category.id) ? "active" : ""
              }`}
              onClick={() => {
                if (category.id === -1) {
                  setSelectedCategory([category.id]);
                } else {
                  if (selectedCategory.includes(category.id)) {
                    setSelectedCategory(
                      selectedCategory.filter((x) => x !== category.id)
                    );
                  } else {
                    setSelectedCategory([
                      ...selectedCategory.filter((x) => x !== -1),
                      category.id,
                    ]);
                  }
                }
              }}
            >
              {category.category_name_en}
            </button>
          ))}
        </div>

        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ margin: "10px" }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              color="primary"
            />
          }
          label="Available Only"
        />

        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => {
            setPriceRange(newValue), console.log("newValue> > >", newValue);
          }}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          style={{ width: "200px", margin: "10px" }}
        />
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <Card key={product.id} sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image={Vegetables}
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {product.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">{product.price} $</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Main;
