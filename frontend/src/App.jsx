import { Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import MenuDetail from "./pages/MenuDetail";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// User Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageMenus from "./pages/admin/ManageMenus";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageRestaurants from "./pages/admin/ManageRestaurants";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageUsers from "./pages/admin/ManageUsers";

// Common Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <div className="min-h-screen bg-[#fff8f6] font-sans text-[#281712] flex flex-col">
      <ErrorBoundary resetKey={window.location.pathname}>
        <Routes>
          {/* Admin Routes (no Header/Footer) */}
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="menus" element={<ManageMenus />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="restaurants" element={<ManageRestaurants />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <div className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/menu/:id" element={<MenuDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                    <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                    <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
