import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getItems } from "./api"; // Assuming getItems is used

const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const ShowDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const show = location.state?.show;
    const [seasons, setSeasons] = useState({});
    const [selectedSeason, setSelectedSeason] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (show) {
            fetchEpisodes(show.Name);
        }
    }, [show]);

    const fetchEpisodes = async (showName) => {
        const allItems = await getItems();
        
        // Filter items related to the given show name
        const filteredItems = allItems.filter(item => item.SeriesName === showName);

        // Group episodes by season
        const seasonMap = {};
        filteredItems.forEach(item => {
            if (item.Type === "Episode" && item.ParentIndexNumber) {
                if (!seasonMap[item.ParentIndexNumber]) {
                    seasonMap[item.ParentIndexNumber] = {
                        seasonName: `Season ${item.ParentIndexNumber}`,
                        episodes: []
                    };
                }
                seasonMap[item.ParentIndexNumber].episodes.push(item);
            }
        });

        // Sort episodes within each season
        Object.values(seasonMap).forEach(season => {
            season.episodes.sort((a, b) => a.IndexNumber - b.IndexNumber);
        });

        setSeasons(seasonMap);
        setSelectedSeason(Object.keys(seasonMap)[0]); // Set the first season as default
    };

    const seekToEpisode = (episodeId) => {
        if (videoRef.current) {
            const episode = seasons[selectedSeason].episodes.find(ep => ep.Id === episodeId);
            const videoElement = videoRef.current;
            const streamUrl = `${API_URL}/Videos/${episodeId}/stream?api_key=${ACCESS_TOKEN}&DirectPlay=true&Static=true`;
            
            videoElement.src = streamUrl;
            videoElement.load();
            videoElement.play();
        }
    };

    if (!show) return <h1>Loading...</h1>;

    return (
        <div style={styles.container}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>⬅ Go Back</button>
            
            <div style={styles.detailsContainer}>
                <img 
                    src={`${API_URL}/Items/${show.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`} 
                    alt={show.Name} 
                    style={styles.poster}
                />

                <div style={styles.info}>
                    <h1>{show.Name}</h1>
                    <p><strong>Year:</strong> {show.ProductionYear}</p>
                    <p><strong>Rating:</strong> {show.OfficialRating || "Not Rated"}</p>
                    <p><strong>Community Rating:</strong> {show.CommunityRating || "N/A"}</p>
                    <p><strong>Run Time:</strong> {Math.floor(show.RunTimeTicks / 600000000)} min</p>
                </div>
            </div>

            <h2>Seasons:</h2>

            {/* Buttons for each season */}
            <div style={styles.seasonButtonContainer}>
                {Object.keys(seasons).map((seasonNumber) => (
                    <button 
                        key={seasonNumber} 
                        style={styles.seasonButton} 
                        onClick={() => setSelectedSeason(seasonNumber)}
                    >
                        {seasons[seasonNumber].seasonName}
                    </button>
                ))}
            </div>

            {selectedSeason && (
                <div>
                    <h3>{seasons[selectedSeason].seasonName} - Episodes:</h3>
                    <div style={styles.episodeScrollContainer}>
                        {seasons[selectedSeason].episodes.map((episode) => (
                            <div 
                                key={episode.Id} 
                                className="episode-item" 
                                style={styles.episodeItem}
                                onClick={() => seekToEpisode(episode.Id)}
                            >
                                <img 
                                    src={`${API_URL}/Items/${episode.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`} 
                                    alt={episode.Name} 
                                    style={styles.episodeImage}
                                />
                                <h5>{episode.IndexNumber}. {episode.Name}</h5>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h2>Now Playing:</h2>

            {/* Video Player */}
            <video ref={videoRef} controls muted={false} style={styles.videoPlayer}>
                <source 
                    src={`${API_URL}/Videos/${show.Id}/stream?api_key=${ACCESS_TOKEN}&DirectPlay=true&Static=true`} 
                />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        color: "#fff",
        backgroundColor: "#121212",
        padding: "20px",
        minHeight: "100vh"
    },
    backButton: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#FF4500",
        border: "none",
        color: "#fff",
        borderRadius: "5px",
        marginBottom: "20px"
    },
    detailsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "20px"
    },
    poster: {
        width: "300px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)"
    },
    info: {
        maxWidth: "500px",
        textAlign: "left",
        padding: "10px"
    },
    seasonButtonContainer: {
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        marginTop: "20px"
    },
    seasonButton: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#008CBA",
        border: "none",
        color: "#fff",
        borderRadius: "5px",
    },
    episodeScrollContainer: {
        display: "flex",
        overflowX: "auto",
        gap: "10px",
        marginTop: "10px"
    },
    episodeItem: {
        flex: "0 0 auto",
        cursor: "pointer",
        textAlign: "center",
        width: "150px",
    },
    episodeImage: {
        width: "100%",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)"
    },
    videoPlayer: {
        width: "80%",
        maxWidth: "800px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
        marginBottom: "10px"
    },
};

export default ShowDetails;
