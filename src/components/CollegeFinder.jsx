import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "./CollegeFinder.css";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

const CollegeFinder = () => {
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 });
  const [colleges, setColleges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minRating: 0,
    sortBy: "distance",
  });

  const apiKey = "YOUR_API_KEY";

  const handleLocate = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCenter({ lat, lng });
        fetchNearbyColleges(lat, lng);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLoading(false);
      }
    );
  };

  const fetchNearbyColleges = (lat, lng) => {
    fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=university&key=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setColleges(data.results);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredColleges = colleges
    .filter(
      (college) =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (college.rating || 0) >= filters.minRating
    )
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="college-finder">
      {/* Header Section */}
      <div className="cf-header">
        <div className="cf-header-content">
          <h1 className="cf-title">
            <span className="cf-icon">🎓</span>
            Find Nearby Colleges
          </h1>
          <p className="cf-subtitle">
            Discover colleges and universities in your area with detailed
            information and ratings
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="cf-controls">
        <div className="cf-search-box">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search colleges by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cf-search-input"
            />
          </div>
        </div>

        <div className="cf-filter-controls">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="cf-filter-select"
          >
            <option value="distance">Sort by Distance</option>
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
          </select>

          <select
            value={filters.minRating}
            onChange={(e) =>
              setFilters({ ...filters, minRating: parseInt(e.target.value) })
            }
            className="cf-filter-select"
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
          </select>

          <button
            className="cf-locate-btn"
            onClick={handleLocate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Locating...
              </>
            ) : (
              <>
                <span className="locate-icon">📍</span>
                Locate Me & Find Colleges
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Section - Centered */}
      <div className="cf-map-section">
        <div className="cf-map-container">
          <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              options={{
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "on" }],
                  },
                ],
              }}
            >
              {filteredColleges.map((college, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: college.geometry.location.lat,
                    lng: college.geometry.location.lng,
                  }}
                  onClick={() => setSelected(college)}
                  icon={{
                    url:
                      "data:image/svg+xml;base64," +
                      btoa(`
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="2"/>
                        <path d="M20 12L26 18V28H14V18L20 12Z" fill="white"/>
                        <path d="M16 18H24V26H16V18Z" fill="#3B82F6"/>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              ))}

              {selected && (
                <InfoWindow
                  position={{
                    lat: selected.geometry.location.lat,
                    lng: selected.geometry.location.lng,
                  }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div className="info-window">
                    <h3>{selected.name}</h3>
                    <p>{selected.vicinity}</p>
                    <div className="rating-info">
                      <span className="stars">⭐</span>
                      <span>{selected.rating || "N/A"}</span>
                      {selected.user_ratings_total && (
                        <span className="rating-count">
                          ({selected.user_ratings_total})
                        </span>
                      )}
                    </div>
                    {selected.opening_hours && (
                      <p className="open-status">
                        {selected.opening_hours.open_now
                          ? "🟢 Open"
                          : "🔴 Closed"}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {/* Colleges List */}
      <div className="cf-results-section">
        <h2 className="cf-results-title">
          Nearby Colleges ({filteredColleges.length})
        </h2>

        {filteredColleges.length === 0 ? (
          <div className="cf-empty-state">
            <div className="empty-icon">🏫</div>
            <h3>No colleges found</h3>
            <p>
              Try adjusting your search criteria or use the locate button to
              find colleges near you.
            </p>
          </div>
        ) : (
          <div className="cf-grid">
            {filteredColleges.map((college, idx) => (
              <div
                key={idx}
                className="cf-card"
                onClick={() => setSelected(college)}
              >
                <div className="cf-card-header">
                  <h3 className="cf-card-title">{college.name}</h3>
                  {college.rating && (
                    <div className="cf-rating">
                      <span className="rating-stars">⭐</span>
                      <span className="rating-value">{college.rating}</span>
                    </div>
                  )}
                </div>
                <p className="cf-address">{college.vicinity}</p>
                <div className="cf-card-footer">
                  {college.opening_hours && (
                    <span
                      className={`cf-status ${
                        college.opening_hours.open_now ? "open" : "closed"
                      }`}
                    >
                      {college.opening_hours.open_now ? "🟢 Open" : "🔴 Closed"}
                    </span>
                  )}
                  <button className="cf-view-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeFinder;
