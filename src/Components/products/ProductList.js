import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchProducts } from '../../actions/productsActions';

import ProductGridPlaceholder from './ProductGridPlaceholder';
import Product from './Product';

export default function Catalog() {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    loading, next, previous, paginatedProducts, error,
  } = useSelector((state) => state.products);
  const { sortValue } = useSelector((state) => state.sort);
  const { filteredProducts } = useSelector((state) => state.filter);

  useEffect(() => {
    dispatch(fetchProducts(1, sortValue));
  }, [dispatch, sortValue]);

  // Handle products rendering
  function renderProducts() {
    if (filteredProducts) {
      return filteredProducts.map((product) => <Product product={product} key={product._id} />);
    }

    return paginatedProducts.map((product) => <Product product={product} key={product._id} />);
  }

  // Fetch previous page products
  const handleClickPreviousPage = (previousPage) => dispatch(fetchProducts(previousPage, sortValue));

  // Fetch next page products
  const handleClickNextPage = (nextPage) => dispatch(fetchProducts(nextPage, sortValue));

  // Render previous, next page buttons
  function handlePreviousNextPage() {
    let currentPage;

    if (next) currentPage = next.page - 1;
    if (previous) currentPage = previous.page + 1;

    return (
      <div className={
        filteredProducts
          ? 'hide'
          : 'product-prev-next mb-2'
      }
      >
        {previous && (
          <div className="btn" onClick={() => handleClickPreviousPage(previous.page)}>{previous.page}</div>
        )}

        {currentPage && (
          <div className="btn highlight">{currentPage}</div>
        )}

        {next && (
          <div className="btn" onClick={() => handleClickNextPage(next.page)}>{next.page}</div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      {location.state && location.state.addProduct && (
        <div className="success-container">
          New product added.
        </div>
      )}

      {location.state && location.state.deleteProduct && (
        <div className="success-container">
          Product deleted successfully.
        </div>
      )}

      <div className="product-list">
        {loading && <ProductGridPlaceholder />}
        {paginatedProducts && renderProducts()}
        {error && <div>error</div>}
      </div>

      {paginatedProducts && handlePreviousNextPage()}
    </div>
  );
}
