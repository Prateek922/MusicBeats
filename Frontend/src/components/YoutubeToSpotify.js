import React, { useState } from "react";
import { gapi } from "gapi-script";
import M from "materialize-css";

export default function YoutubeToSpotify() {
  const [url, setUrl] = useState("");
  const [PlaylistName, setPlaylistName] = useState("");
  const [playlist, setPlaylist] = useState(undefined);

  ////////////////////////////////////////
  function authenticate() {
    return gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(
        function () {
          console.log("Sign-in successful");
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyCMCOZCu77WQUVYTnYWDFVVl-nyHTU7XTQ");
    return gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(
        function () {
          console.log("GAPI client loaded for API");
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.youtube.playlists
      .list({
        part: ["snippet,contentDetails"],
        maxResults: 25,
        mine: true,
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response.result.items);
          setPlaylist(response.result.items);
        },
        function (err) {
          console.error("Execute error", err);
        }
      );
  }
  gapi.load("client:auth2", function () {
    gapi.auth2.init({
      client_id:
        "111526753068-k8ksblj9o2vnvm60n91415ebmktvqtur.apps.googleusercontent.com",
      plugin_name: "anything",
    });
  });

  ///////////////////////////////////////////////////////////////////////
  const postDetails = async () => {
    if (url) {
      fetch("/getPlaylist", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.error) {
            console.log(data.error);
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {

            var arr = [];
            let x = 0,
              y = data.videos.length;

            data.videos.map(async (vid) => {
              const songapi = `https://api.song.link/v1-alpha.1/links?url=${vid}&userCountry=US&songIfSingle=true`;
              console.log(songapi);
              await fetch(songapi)
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  if (data.linksByPlatform.spotify) {
                    arr.push(data.linksByPlatform.spotify.nativeAppUriDesktop);
                    console.log(
                      data.linksByPlatform.spotify.nativeAppUriDesktop
                    );
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
              ///////////////////////
              x++;
              if (x === y) {
                fetch("/download2", {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    urls: arr,
                    playlistName:PlaylistName,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    M.toast({
                      html: "Created Playlist Successfully",
                      classes: "#43a047 green darken-1",
                    });
                  });

                // const data = await result.json();
              }
            });
            console.log(arr);
            /////////////////////////
          }
        })
        .catch((err) => {
          console.log(err);
        });
      ////////////////////////////////////////////////////
    }
  };
  return (
    <div>
      <h1>hello</h1>
      <input
        type="text"
        placeholder="title"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />
      <button
        onClick={() => {
          postDetails();
        }}
      >
        Submit Post
      </button>
      

      <input
        type="text"
        placeholder="Enter Playlist name"
        value={PlaylistName}
        onChange={(e) => {
          setPlaylistName(e.target.value);
        }}
      />
    
      <button
        onClick={() => {
          authenticate().then(loadClient).then(execute);
        }}
      >
        authorize and load
      </button>

      <div>
        {playlist ? (
          <div>
            {playlist.map((item) => (
              <button
                key={item.id}
                onClick={
                  (e) =>
                    setUrl(
                      `https://www.youtube.com/playlist?list=${e.target.id}`
                    ) //note this displays both public and private playlists but
                }
                className="list-group-item list-group-item-action list-group-item-light"
                id={item.id}
              >
                {item.snippet.localized.title}
              </button>
            ))}
          </div>
        ) : (
          <h1>hi</h1>
        )}
      </div>
    </div>
  );
}
