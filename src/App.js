import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginChoice from "./component/Login";
import "./App.css";
import HomePage from "./component/HomePage";
import SignUp from "./component/SignUp";
import AdminAuthPage from "./component/AdminAuthPage";
import AfterLoginPage from "./component/AfterLoginPage";
import HotelList from "./component/HotelList";
import RoomDetails from "./component/RoomDetails";
import HotelDetails from "./component/HotelDetails";
import BookedHotelsPage from "./component/BookedHotelsPage";
import PaymentPage from "./component/PaymentPage";
import AdminDashboard from "./component/AdminDashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-choice" element={<LoginChoice />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/after-login-signup" element={<AfterLoginPage />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotel/:hotelId" element={<HotelDetails />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/room/:roomId" element={<RoomDetails />} />
          <Route path="/booked-hotels" element={<BookedHotelsPage />} />
          <Route path="/adminlogin" element={<AdminAuthPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
