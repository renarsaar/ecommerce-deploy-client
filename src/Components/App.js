import React, { useEffect } from 'react';
import queryString from 'query-string';
import {
  Redirect, Route, Switch, useLocation,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../actions/authActions';
import { setWishListLS, setWishListDB } from '../actions/wishListActions';

import Header from './Header';
import SubHeader from './SubHeader';
import Catalog from './Catalog';
import ProductCreate from './products/ProductCreate';
import ProductDelete from './products/ProductDelete';
import ProductEdit from './products/ProductEdit';
import ProductShow from './products/ProductShow';
import LogIn from './account/LogIn';
import Register from './account/Register';
import ResetPassword from './account/ResetPassword';
import ResetPasswordConfirm from './account/ResetPasswordConfirm';
import Validation from './account/Validation';
import User from './account/User';
import Admin from './account/Admin';
import OrderCreate from './orders/OrderCreate';
import CartSuccess from './orders/OrderCreateForm/CartSuccess';
import OrderShow from './orders/OrderShow';
import Footer from './Footer';
import UserShow from './account/UserShow';

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { wishListProducts } = useSelector((state) => state.wishList);
  const url = queryString.parse(location.search);

  useEffect(() => {
    // Get the user & log in if jwt token in URL after OAuth login
    if (!isLoggedIn && url.token) {
      dispatch(getUser(url.token));
    }

    // Log in again on page refresh
    if (!isLoggedIn && sessionStorage.token) {
      dispatch(getUser(sessionStorage.token));
    }

    // Save user wishlist in LS if user logged in
    if (isLoggedIn && user.wishList.length !== 0) {
      dispatch(setWishListLS(user.wishList));
    }

    // Set user wishlist if it is empty and LS wishlist is not empty
    if (isLoggedIn && user.wishList.length === 0 && wishListProducts.length !== 0) {
      dispatch(setWishListDB(user.id, wishListProducts, sessionStorage.token));
    }
  }, [isLoggedIn, url.token]);

  return (
    <div className="app">
      <Header />
      <SubHeader />
      <Switch>
        <Route path="/" exact component={Catalog} />
        <Route path="/products/new" exact component={ProductCreate} />
        <Route path="/products/edit/:id" exact>
          {isLoggedIn && user.admin ? <ProductEdit /> : <Redirect to="/" />}
        </Route>
        <Route path="/products/delete/:id" exact>
          {isLoggedIn && user.admin ? <ProductDelete /> : <Redirect to="/" />}
        </Route>
        <Route path="/products/:id" exact component={ProductShow} />
        <Route path="/account/login" exact>
          {isLoggedIn ? <Redirect to="/" /> : <LogIn />}
        </Route>
        <Route path="/account/register" exact>
          {isLoggedIn ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/account/resetpassword" exact>
          {isLoggedIn ? <Redirect to="/" /> : <ResetPassword />}
        </Route>
        <Route
          path="/account/reset_password_confirm"
          exact
          render={(props) => (isLoggedIn
            ? <Redirect to="/" />
            : <ResetPasswordConfirm locationProps={props.location} />)}
        />
        <Route path="/account/dashboard/admin/:id" exact>
          {isLoggedIn && user.admin ? <Admin /> : <Redirect to="/" />}
        </Route>
        <Route path="/account/dashboard/user/:id" exact>
          {isLoggedIn && !user.admin ? <User /> : <Redirect to="/" />}
        </Route>
        <Route path="/account/user/:id" exact>
          {isLoggedIn && user.admin ? <UserShow /> : <Redirect to="/" />}
        </Route>
        <Route path="/account/dashboard/user/:id" exact component={User} />
        <Route
          path="/account/validation"
          exact
          render={
            (props) => <Validation locationProps={props.location} />
          }
        />
        <Route path="/cart/checkout" exact component={OrderCreate} />
        <Route path="/cart/success" exact component={CartSuccess} />
        <Route path="/order/:id" exact component={OrderShow} />
      </Switch>
      <Footer />
    </div>
  );
}
