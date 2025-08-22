import React, { useEffect, useState } from "react";
import "../styles/SearchArea.css";
import { search } from "../api/Api";
import { BeatLoader } from "react-spinners";

function SearchArea({ searchRef, input }) {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [nextPageToken, setNextPageToken] = useState('');

  const fetchVideos = async (query, pageToken) => {
      if (!query.trim()){
        setNextPageToken('');
        setVideos([]);
        return ;
      }
      setIsLoading(true);
      console.log('hehehe  '+isLoading);
      const { videos, nextPageToken } = await search(query, pageToken);
      console.log("videos: ",videos);
      if (videos) setVideos(videos);
      if (nextPageToken) setNextPageToken(nextPageToken);
      setIsLoading(false);
  };

  const handleScroll = (e) => {
    if (
      !isLoading &&
      e.target.scrollTop + e.target.clientHeight + 50 >= e.target.scrollHeight
    ) {
      console.log("Hehe");
      fetchVideos(input, nextPageToken);
    }
  };

  useEffect(() => {
    setVideos([]);
    setNextPageToken(''); 
    fetchVideos(input, nextPageToken);
  }, [input]);

  useEffect(() => {
    const el = document.getElementById("search-cmp");
    el.addEventListener("scroll", handleScroll);
    // fetchVideos("tamil trending songs",'');
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="search-component">
      <div className="search-area" id="search-cmp" ref={searchRef} tabIndex={0}>
        {videos.length === 0 && !isLoading ? (
          <div className="nothing">Search something...</div>
        ) : (
          videos.map((video, index) => (
            <div key={index} className="video-card">
              <img
                className="thumbnail"
                src={video.thumbnail}
                alt="thumbnail"
              ></img>
              <div className="video-text">
                <div className="video-title">{video.title}</div>
                <div className="video-channel">{video.channelTitle}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="loading-container">
            <BeatLoader color="#f1f1f1" />
          </div>
        )}
      </div>
      <div className="search-bg"></div>
    </div>
  );
}

export default SearchArea;
