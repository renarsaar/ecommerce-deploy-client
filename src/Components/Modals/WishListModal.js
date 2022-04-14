import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeWishlistLS, changeWishListDB } from '../../actions/wishListActions';

export default function WishListModal({ showWishList, products }) {
  const dispatch = useDispatch();
  const { wishListProducts } = useSelector((state) => state.wishList);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const modalClassName = showWishList === true ? 'wishlist-modal visible' : 'wishlist-modal hidden';

  // Remove item from wishlist
  function handleRemoveWishList(id) {
    if (isLoggedIn) {
      dispatch(changeWishListDB(id, sessionStorage.token, user.id));
      return;
    }

    dispatch(removeWishlistLS(id));
  }

  // Return wishlist items
  function renderWishListItems() {
    return wishListProducts.map((id) => {
      let name;
      let image;

      // Find the name & image for Id's in the wishlist
      products.map((item) => {
        if (item._id === id) {
          name = item.name;
          image = item.image;
        }
      });

      if (image && name) {
        return (
          <li key={id}>
            <div className="wishlist-product">
              <img src={`http://localhost:8080/${image}`} alt={name} />
              <Link to={`/products/${id}`} className="info">
                <h3>{name}</h3>
              </Link>
            </div>

            <div>
              <i className="las la-trash" onClick={() => handleRemoveWishList(id)} />
            </div>
          </li>
        );
      }
    });
  }

  return ReactDOM.createPortal(
    <div className={modalClassName} onClick={(e) => e.stopPropagation()}>
      <div className="modal-main">
        <h2 className="mb-1 txt-bold">Wishlist</h2>

        <ul className="modal-items">
          {wishListProducts && renderWishListItems()}
        </ul>

      </div>
    </div>,
    document.getElementById('wishlist'),
  );
}
