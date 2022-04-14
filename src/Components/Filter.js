import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilterTerm, resetFilters } from '../actions/filterActions';

export default function Filter() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { apparelTerm, brandTerm, searchTerm } = useSelector((state) => state.filter);
  const [showApparelsMenu, setShowApparelsMenu] = useState(true);
  const [showBrandsMenu, setShowBrandsMenu] = useState(false);
  const [apparelsList, setApparelsList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);

  // Set Filter menu items
  useEffect(() => {
    const apparels = [];
    const brands = [];

    if (products) {
      products.forEach((product) => {
        if (product.category === 'Apparels') {
          // Do not add duplicates
          if (!apparels.includes(product.subCategory)) {
            apparels.push(product.subCategory);
          }
        }

        return false;
      });

      products.forEach((product) => {
        // Do not add duplicates
        if (!brands.includes(product.brand)) {
          brands.push(product.brand);
        }
      });

      setApparelsList(apparels);
      setBrandsList(brands);
    }
  }, [products]);

  // Reset filter terms
  function handleResetFilters() {
    dispatch(resetFilters());
  }

  // Handle click on appareal
  function handleClickApparel(category) {
    let newApparelTerm;

    if (category === apparelTerm) newApparelTerm = '';
    else newApparelTerm = category;

    dispatch(setFilterTerm(newApparelTerm, brandTerm, searchTerm, products));
  }

  // Handle click on brand
  function handleCLickBrand(brand) {
    let newBrandTerm;

    if (brand === brandTerm) newBrandTerm = '';
    else newBrandTerm = brand;

    dispatch(setFilterTerm(apparelTerm, newBrandTerm, searchTerm, products));
  }

  // Render apparels list
  function renderApparels(apparels) {
    return apparels.map((category) => (
      <li
        className="txt-uppercase"
        style={{
          color: apparelTerm === category
            ? '#ff600a'
            : '#0a0a0a',
        }}
        key={category}
        value={category}
        onClick={() => handleClickApparel(category, products)}
      >
        {category}
      </li>
    ));
  }

  // Render brands list
  function renderBrands(brands) {
    return brands.map((brand) => (
      <li
        className="txt-uppercase"
        style={{
          color: brandTerm === brand
            ? '#ff600a'
            : '#0a0a0a',
        }}
        key={brand}
        value={brand}
        onClick={() => handleCLickBrand(brand, products)}
      >
        {brand}
      </li>
    ));
  }

  return (
    <div className="filter">
      <div className="filter-trigger">
        <button type="button">X</button>
      </div>

      <div className="heading">
        <h4 className="txt-uppercase">Filters</h4>
        <h4 className="txt-uppercase link-orange" onClick={handleResetFilters}>
          Reset
        </h4>
      </div>

      <div className="apparels">
        <h2
          className="mb-1"
          onClick={() => setShowApparelsMenu(!showApparelsMenu)}
        >
          Apparels

          <i className={
            showApparelsMenu
              ? 'las la-angle-down rotate'
              : 'las la-angle-down'
          }
          />
        </h2>

        <ul className={
          showApparelsMenu
            ? 'show ml-1 mb-2'
            : 'hide ml-1 mb-2'
        }
        >
          {products && renderApparels(apparelsList)}
        </ul>
      </div>

      <div className="brands">
        <h2
          className="mb-1"
          onClick={() => setShowBrandsMenu(!showBrandsMenu)}
        >
          Brands

          <i className={
            showBrandsMenu
              ? 'las la-angle-down rotate'
              : 'las la-angle-down'
          }
          />
        </h2>

        <ul className={
          showBrandsMenu
            ? 'ml-1 mb-2 show'
            : 'ml-1 mb-2 hide'
        }
        >
          {products && renderBrands(brandsList)}
        </ul>
      </div>
    </div>
  );
}
