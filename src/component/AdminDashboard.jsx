import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    address: "",
    rating: "",
    contact: "",
    image: null,
  });

  const [editHotel, setEditHotel] = useState(null);
  const [specialOffer, setSpecialOffer] = useState({
    discountAmount: "",
    startDate: "",
    endDate: "",
    couponCode: "",
    minimumAmount: "",
  });

  const [showForm, setShowForm] = useState("hotel"); // "hotel" or "offer"

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const res = await fetch("http://localhost:8083/hotels/all");
    const data = await res.json();
    setHotels(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editHotel) {
      setEditHotel((prev) => ({ ...prev, [name]: value }));
    } else if (showForm === "hotel") {
      setNewHotel((prev) => ({ ...prev, [name]: value }));
    } else {
      setSpecialOffer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (editHotel) {
      setEditHotel((prev) => ({ ...prev, image }));
    } else {
      setNewHotel((prev) => ({ ...prev, image }));
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newHotel).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await fetch("http://localhost:8083/hotels/add", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Hotel added successfully!");
      setNewHotel({
        name: "",
        location: "",
        address: "",
        rating: "",
        contact: "",
        image: null,
      });
      fetchHotels();
    } else {
      alert("Failed to add hotel.");
    }
  };

  const handleAddSpecialOffer = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8083/specialoffers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(specialOffer),
    });

    if (res.ok) {
      alert("Special offer added successfully!");
      setSpecialOffer({
        discountAmount: "",
        startDate: "",
        endDate: "",
        couponCode: "",
        minimumAmount: "",
      });
    } else {
      alert("Failed to add special offer.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      const res = await fetch(`http://localhost:8083/hotels/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchHotels();
      } else {
        alert("Failed to delete hotel.");
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editHotel.name);
    formData.append("location", editHotel.location);
    formData.append("address", editHotel.address);
    formData.append("rating", editHotel.rating);
    formData.append("contact", editHotel.contact);
    if (editHotel.image instanceof File) {
      formData.append("image", editHotel.image);
    }

    const res = await fetch(
      `http://localhost:8083/hotels/update/${editHotel.hotelId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (res.ok) {
      alert("Hotel updated!");
      setEditHotel(null);
      fetchHotels();
    } else {
      alert("Update failed.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">Admin Dashboard</h2>

      {/* Navbar */}
      <div className="admin-navbar">
        <button onClick={() => setShowForm("hotel")}>Add Hotel</button>
        <button onClick={() => setShowForm("offer")}>Add Special Offer</button>
      </div>

      {/* Conditional Forms */}
      {showForm === "hotel" && (
        <form
          className="admin-form"
          onSubmit={handleAddHotel}
          encType="multipart/form-data"
        >
          <h3>Add Hotel</h3>
          <input
            name="name"
            placeholder="Hotel Name"
            onChange={handleInputChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            onChange={handleInputChange}
            required
          />
          <input
            name="address"
            placeholder="Address"
            onChange={handleInputChange}
            required
          />
          <input
            name="rating"
            placeholder="Rating"
            onChange={handleInputChange}
            required
          />
          <input
            name="contact"
            placeholder="Contact"
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            required
          />
          <button type="submit" className="admin-add-btn">
            Add Hotel
          </button>
        </form>
      )}

      {showForm === "offer" && (
        <form className="admin-form" onSubmit={handleAddSpecialOffer}>
          <h3>Add Special Offer</h3>
          <input
            type="number"
            name="discountAmount"
            placeholder="Discount Amount"
            value={specialOffer.discountAmount}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={specialOffer.startDate}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={specialOffer.endDate}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="couponCode"
            placeholder="Coupon Code"
            value={specialOffer.couponCode}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="minimumAmount"
            placeholder="Minimum Booking Amount"
            value={specialOffer.minimumAmount}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="admin-add-btn">
            Add Offer
          </button>
        </form>
      )}

      {/* Hotel List */}
      <h3 className="admin-subheading">All Hotels</h3>
      <div className="admin-hotel-list">
        {hotels.map((hotel) => (
          <div key={hotel.hotelId} className="admin-hotel-card">
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="admin-hotel-img"
            />
            <h4>{hotel.name}</h4>
            <p>{hotel.location}</p>
            <p>{hotel.address}</p>
            <p>Rating: {hotel.rating}</p>
            <p>Contact: {hotel.contact}</p>
            <button
              className="admin-edit-btn"
              onClick={() => setEditHotel(hotel)}
            >
              Edit
            </button>
            <button
              className="admin-delete-btn"
              onClick={() => handleDelete(hotel.hotelId)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Edit Hotel Modal */}
      {editHotel && (
        <div className="admin-edit-modal">
          <form
            className="admin-form"
            onSubmit={handleEditSubmit}
            encType="multipart/form-data"
          >
            <h3>Edit Hotel</h3>
            <input
              name="name"
              value={editHotel.name}
              onChange={handleInputChange}
              required
            />
            <input
              name="location"
              value={editHotel.location}
              onChange={handleInputChange}
              required
            />
            <input
              name="address"
              value={editHotel.address}
              onChange={handleInputChange}
              required
            />
            <input
              name="rating"
              value={editHotel.rating}
              onChange={handleInputChange}
              required
            />
            <input
              name="contact"
              value={editHotel.contact}
              onChange={handleInputChange}
              required
            />
            <input type="file" name="image" onChange={handleImageChange} />
            <button type="submit" className="admin-add-btn">
              Update Hotel
            </button>
            <button
              type="button"
              onClick={() => setEditHotel(null)}
              className="admin-delete-btn"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
