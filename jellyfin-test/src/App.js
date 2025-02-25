import React, { useState, useEffect } from "react";
import { getItems } from "./api";

// Use the REACT_APP_ prefix for environment variables
const API_URL = process.env.REACT_APP_API_URL; 
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const App = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      const mediaItems = await getItems();
      setItems(mediaItems);
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>Media Library</h1>
      <div className="media-list">
        {items.map((item) => (
          <div key={item.Id} className="media-item" onClick={() => setSelectedItem(item)}>
            <img
              src={`${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`}
              alt={item.Name}
              width={150}
            />
            <h3>{item.Name}</h3>
          </div>
        ))}
      </div>

      {/* Video Player Section */}
      {selectedItem && (
        <div className="video-player">
          <h2 style={{ color: "white", fontSize: "16px" }}>Now Playing: {selectedItem.Name}</h2>
          <video
            controls
            src={`${API_URL}/Videos/${selectedItem.Id}/stream?api_key=${ACCESS_TOKEN}`}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
          >
            Your browser does not support the video tag.
          </video>
          <button onClick={() => setSelectedItem(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
