import React, { useState, useEffect, use } from "react";
import { getItems, getMovies, getShows } from "./api";

// Use the REACT_APP_ prefix for environment variables
const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const App = () => {
  const [items, setItems] = useState([]);
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      const mediaItems = await getItems();
      const showItems = await getShows();
      const moviesItems = await getMovies();
      setItems(mediaItems);
      setShows(showItems);
      setMovies(moviesItems);
      console.log(mediaItems);
      console.log(showItems);
      console.log(moviesItems);
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>Media Library</h1>

      <h2>All Items</h2>
      <div className="media-list" style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
        {items.map((item) => (
          <div key={item.Id} className="media-item" onClick={() => setSelectedItem(item)} style={{ display: "inline-block", marginRight: "10px" }}>
            <img
              src={`${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`}
              alt={item.Name}
              width={150}
            />
            <h5>{item.Name}</h5>
          </div>
        ))}
      </div>


      <h2>Movies</h2>
      <div className="media-list" style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
        {movies.map((item) => (
          <div className = "media-item" key={item.Id} onClick={() => setSelectedItem(item)} style={{ display: "inline-block", marginRight: "10px" }}>
            <img
              src={`${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`}
              alt={item.Name}
              width={150}
            />
            <h5>{item.Name}</h5>
          </div>
        ))}
      </div>

      <h2>Shows</h2>
      <div className="media-list" style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
        {shows.map((item) => (
          <div className = "media-item" key={item.Id} onClick={() => setSelectedItem(item)} style={{ display: "inline-block", marginRight: "10px" }}>
            <img
              src={`${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`}
              alt={item.Name}
              width={150}
            />
            <h5>{item.Name}</h5>
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