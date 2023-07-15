import { Routes as RoutesSwitch, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import UpdateProfile from "../pages/auth/UpdateProfile";
import Profile from "../pages/auth/Profile";
import PrivateRoute from "./PrivateRoute";
import { Layout, LayoutLogin } from "../layout/Layout";

export default function Routes() {
  return (
    <RoutesSwitch>

      <Route path="/" Component={PrivateRoute}>
        <Route
          exact
          path="/"
          element={
            <Layout>
              {" "}
              <Home />{" "}
            </Layout>
          }
        />
      </Route>
      <Route path="/auth/profile" Component={PrivateRoute}>
        <Route
          path="/auth/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
      </Route>

      <Route path="/auth/update-profile" Component={PrivateRoute}>
        <Route
          path="/auth/update-profile"
          element={
            <Layout>
              <UpdateProfile />
            </Layout>
          }
        />
      </Route>

      <Route
        path="/auth/login"
        element={
          <LayoutLogin>
            <Login />
          </LayoutLogin>
        }
      />

      <Route
        path="/auth/signup"
        element={
          <LayoutLogin>
            <Signup />
          </LayoutLogin>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <LayoutLogin>
            <ForgotPassword />
          </LayoutLogin>
        }
      />
    </RoutesSwitch>
  );
}
