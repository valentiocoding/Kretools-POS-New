import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/Context/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import ItemMasterData from "@/pages/ItemMaster";
import Dashboard from "@/pages/Dashboard";
import POSLayout from "@/components/POSLayout";
import SalesOrder from "./pages/SalesOrder";
import QrScanner from "./pages/QrScanner";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          
          {/* POS parent route */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <POSLayout />
              </PrivateRoute>
            }
          >
            <Route
              path="dashboard"
              element={<Dashboard />}
            />
            <Route
              path="salesorder"
              element={<SalesOrder />}
            />
            <Route
              path="item"
              element={<ItemMasterData />}
            />
          </Route>
          <Route
          path="/scanner"
          element={
            <PrivateRoute>

              <QrScanner />
            </PrivateRoute>}
          >
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
