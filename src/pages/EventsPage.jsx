import React, { useState } from "react";
import { FiGrid, FiList, FiCalendar } from "react-icons/fi";
import "./EventsPage.css";

const FILTERS = [
  { label: "All Events", value: "all" },
  { label: "Hackathon", value: "hackathon" },
  { label: "Workshop", value: "workshop" },
  { label: "Seminar", value: "seminar" },
  { label: "Cultural", value: "cultural" }
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [view, setView] = useState("list");

  return (
    <div className="events-root">
      <div className="events-container">
        <div className="events-header-row">
          <div>
            <h1 className="events-title">Events</h1>
            <div className="events-count">0 events available</div>
          </div>
        </div>
        <div className="events-filter-row">
          <div className="events-filters">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`events-filter-btn${activeFilter === f.value ? " active" : ""}`}
              >{f.label}</button>
            ))}
          </div>
          <div className="events-view-toggle">
            <button
              className={`events-view-btn${view === "grid" ? " active" : ""}`}
              onClick={() => setView("grid")}
              aria-label="Grid view"
            ><FiGrid /></button>
            <button
              className={`events-view-btn${view === "list" ? " active" : ""}`}
              onClick={() => setView("list")}
              aria-label="List view"
            ><FiList /></button>
          </div>
        </div>
        <div className="events-empty-state">
          <div className="events-empty-icon">
            <FiCalendar size={32} color="#c8cdd9" />
          </div>
          <div className="events-empty-heading">Events coming soon</div>
          <div className="events-empty-desc">
            We're preparing exciting events for you. Check back soon for updates.
          </div>
        </div>
      </div>
    </div>
  );
}