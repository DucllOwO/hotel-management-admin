import React, { useContext, useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import HR from "./pages/Admin/HR/HR";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Account from "./pages/Admin/Account/Account";
import Importing from "./pages/Admin/Depot/Importing/Importing";
import Inventory from "./pages/Admin/Depot/Inventory/Inventory";
import Item from "./pages/Admin/Depot/Item/Item";
import Rooms from "./pages/Admin/Room/Rooms/Rooms";
import Booking from "./pages/Staff/Booking/Booking/Booking";
import RoomType from "./pages/Admin/Room/RoomType/RoomType";
import Utilities from "./pages/Admin/Room/Utilities/Utilities";
import Payment from "./pages/Admin/Turnover/Payment/Payment";
import Receipt from "./pages/Admin/Turnover/Reciept/Receipt";
import Login from "./pages/Login/Login";
import Customer from "./pages/Staff/Customer/Customer";
import BookingList from "./pages/Staff/Booking/BookingList/BookingList";
import { AppContext } from "./context/AppContext";
import LocalStorage from "./Utils/localStorage";
import Position from "./pages/Admin/Position/Position";

import _404ErrorBoundary from "./components/Error/ErrorBoundary/_404ErrorBoundary";
import AuthErrorBoundary from "./components/Error/ErrorBoundary/AuthErrorBoundary";
import Promotion from "./pages/Admin/Promotion/Promotion";
import Import from "./components/Admin/Import/Import";
import Home from "./pages/Customer/Home/Home";

import "./app.css";

const App = () => {
  const { user } = useContext(AppContext);
  const [listFeature, setList] = useState([]);
  useEffect(() => {
    setList(LocalStorage.getItem("user")?.permission);
  }, [user]);

  return (
    <HashRouter>
      <div className="App" style={{ height: "100vh" }}>
        <Routes>
          <Route key="login" index element={<Login />}></Route>
          <Route key="login1" path="/login" element={<Login />}></Route>
          <Route key="home" path="/home" element={<Home />}></Route>
          <Route key="admin" path="/admin" element={<Admin />}>
            {listFeature
              ? listRoute.map((item) => {
                  if (listFeature.includes(item.key)) return item.value;
                  return null;
                })
              : null}
          </Route>

          <Route
            key="error"
            exact
            path="*"
            element={user ? <_404ErrorBoundary /> : <AuthErrorBoundary />}
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

const listRoute = [
  {
    key: "Th???ng k??",
    value: (
      <Route key="Dashboard" index path="dashboard" element={<Dashboard />} />
    ),
  },
  {
    key: "T??i kho???n",
    value: <Route key="Account" index path="account" element={<Account />} />,
  },
  {
    key: "Nh???p s???n ph???m",
    value: (
      <Route key="Import" index path="importing" element={<Importing />} />
    ),
  },
  {
    key: "Nh??n s???",
    value: <Route key="Employee" index path="hr" element={<HR />} />,
  },
  {
    key: "Ki???m tra ph??ng",
    value: (
      <Route key="Inventory" index path="inventory" element={<Inventory />} />
    ),
  },
  {
    key: "Qu???n l?? s???n ph???m",
    value: <Route key="Item" index path="items" element={<Item />} />,
  },
  {
    key: "Danh m???c ph??ng",
    value: <Route key="Room" index path="rooms" element={<Rooms />} />,
  },
  {
    key: "Lo???i ph??ng",
    value: (
      <Route key="Room_type" index path="roomtype" element={<RoomType />} />
    ),
  },
  {
    key: "Ti???n ??ch",
    value: (
      <Route key="Utilities" index path="utilities" element={<Utilities />} />
    ),
  },
  {
    key: "Phi???u chi",
    value: <Route key="Payment" index path="payment" element={<Payment />} />,
  },
  {
    key: "H??a ????n",
    value: <Route key="Receipt" index path="receipt" element={<Receipt />} />,
  },
  {
    key: "Ch???c v???",
    value: (
      <Route key="Position" index path="position" element={<Position />} />
    ),
  },
  {
    key: "Kh??ch h??ng",
    value: (
      <Route key="Customer" index path="customer" element={<Customer />} />
    ),
  },
  {
    key: "?????t ph??ng",
    value: <Route index path="bookings" element={<Booking />} />,
  },
  {
    key: "Phi???u gi???m gi??",
    value: (
      <Route key="Promotion" index path="promotion" element={<Promotion />} />
    ),
  },
  {
    key: "?????t ph??ng",
    value: <Route index path="bookings/list" element={<BookingList />} />,
  },
  {
    key: "Nh???p h??ng",
    value: <Route index path="/importing" element={<Import />} />,
  },
];

export default App;
