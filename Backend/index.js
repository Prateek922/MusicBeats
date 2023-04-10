const SpotifyWebApi = require("spotify-web-api-node");
const YouTube = require("ytsr");
const fs = require("fs");
const ytdl = require("ytdl-core");
const zip = require("express-zip");
const express = require("express");
const ytpl = require("ytpl");
const app = express();

var spotifyApi = new SpotifyWebApi({
  clientId: "d6700a2357ff44459a0a2b46284f42ea",
  clientSecret: "553a6fa88a11457698c7e3b4e748466d",
  redirectUri: "http://localhost:5000/callback",
});
const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

var newtoken = "";
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/login", (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get("/callback", (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];
      const expires_in = data.body["expires_in"];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      newtoken = access_token; ////////
      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.redirect("http://localhost:3000/download_from_spotify");
      // res.redirect("/");
      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body["access_token"];
        newtoken = access_token; /////////////////////////////////////////////////////////
        console.log("The access token has been refreshed!");
        console.log("access_token:", access_token);
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.get("/", (req, res) => {
  return res.render("index");
});

app.post("/download", async (req, res) => {
  //https://www.youtube.com/playlist?list=PLZtDBnR6jfHInakZO9Z0t_0VFrEZzL1qi
  const playlist_me = req.body.url.split("playlist/")[1];
  const playlist_id = playlist_me.split("?")[0];
  console.log(playlist_id);
  const token = newtoken;
  console.log(token);
  // console.log("haaaaaaa");
  spotifyApi.setAccessToken(token);
  console.log(`Starting Download, This may take a while...`);
  let x = 0,
    y = 0;
  await spotifyApi.getPlaylistTracks(playlist_id).then(async (data) => {
    y = data.body.items.length;
    console.log(y);
    data.body.items.map((item, index) =>
      YouTube(item.track.name, {
        limit: 1,
      }).then(async (responce) => {
        console.log(responce.items[0].url);
        const stream = ytdl(responce.items[0].url, {
          filter: (format) =>
            format.hasAudio == true && format.hasVideo == false,
        });
        //   console.log(stream.pipe);
        //   getme(res.items[0].url);
        //   console.log(__dirname);
        stream.pipe(fs.createWriteStream(`./music/${index}.mp4`));
        await stream.on("end", () => {
          fs.rename(
            `./music/${index}.mp4`,
            `./music/${item.track.name.replace(
              ":",
              "-"
            )}.mp4` /* since ":" is not considered valid */,
            () => {
              x++;
              if (x == y) {
                y = 0;
                console.log(x, y);
                console.log("hi");
                var files = fs.readdirSync("./music/");
                files = files.map((file) => {
                  return {
                    path: `${__dirname}/music/${file}`,
                    name: `${file}`,
                  };
                });
                res.zip(files);
              }
              console.log(
                `Successfully downloaded ${item.track.name}[${index}]`
              );
            }
          );
          // console.log("done");
          stream.on("error", (err) =>
            console.error(`Encountered error: ${err}`)
          );
        });
      })
    );
  });
});

///////////////////////////

app.post("/download_yt", async (req, res) => {
  //https://www.youtube.com/playlist?list=PLZtDBnR6jfHInakZO9Z0t_0VFrEZzL1qi
  const playlist_id = req.body.url.split("list=")[1];
  await ytpl(playlist_id).then((playlist) => {
    let x = 0,
      y = playlist.items.length;
    playlist.items.map(async (data, index) => {
      console.log(data.shortUrl);
      const stream = ytdl(data.shortUrl, {
        filter: (format) => format.hasAudio == true && format.hasVideo == true,
      });
      //   console.log(stream.pipe);
      //   getme(res.items[0].url);
      //   console.log(__dirname);
      stream.pipe(fs.createWriteStream(`./music/${index}.mp4`));
      await stream.on("end", () => {
        fs.rename(
          `./music/${index}.mp4`,
          `./music/${data.title.replace(
            ":",
            "-"
          )}.mp4` /* since ":" is not considered valid */,
          () => {
            x++;
            if (x == y) {
              y = 0;
              console.log(x, y);
              console.log("hi");
              var files = fs.readdirSync("./music/");
              files = files.map((file) => {
                return {
                  path: `${__dirname}/music/${file}`,
                  name: `${file}`,
                };
              });
              res.zip(files);
              //   res.send("done");
            }
            console.log(`Successfully downloaded ${data.title}[${index}]`);
          }
        );
        // console.log("done");
        stream.on("error", (err) => console.error(`Encountered error: ${err}`));
      });
    });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
var spotifyApi2 = new SpotifyWebApi({
  clientId: "d6700a2357ff44459a0a2b46284f42ea",
  clientSecret: "553a6fa88a11457698c7e3b4e748466d",
  redirectUri: "http://localhost:5000/callback2",
});
app.get("/login2", (req, res) => {
  console.log(spotifyApi2.createAuthorizeURL(scopes));
  res.redirect(spotifyApi2.createAuthorizeURL(scopes));
});
app.get("/callback2", (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi2
    .authorizationCodeGrant(code)
    .then((data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];
      const expires_in = data.body["expires_in"];

      spotifyApi2.setAccessToken(access_token);
      spotifyApi2.setRefreshToken(refresh_token);
      newtoken = access_token; ////////
      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.redirect("http://localhost:3000/youtube_to_spotify");

      setInterval(async () => {
        const data = await spotifyApi2.refreshAccessToken();
        const access_token = data.body["access_token"];
        newtoken = access_token; /////////////////////////////////////////////////////////
        console.log("The access token has been refreshed!");
        console.log("access_token:", access_token);
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.send(`Error getting Tokens: ${error}`);
    });
});
app.post("/getPlaylist", (req, res) => {
  console.log(req.body);
  const { url } = req.body;
  const playlist_id = url.split("list=")[1];
  ytpl(playlist_id)
    .then((playlist) => {
      var arr = [];
      playlist.items.map(async (data, index) => {
        console.log(data.shortUrl);
        arr.push(data.shortUrl);
      });
      res.json({ videos: arr }); ////////////////////////////////
    })
    .catch((err) => {
      console.log("hi");
      res.json({ error: "Playlist is either private or does not exist" });
    });
});

app.post("/download2", async (req, res) => {
  //https://www.youtube.com/playlist?list=PLZtDBnR6jfHInakZO9Z0t_0VFrEZzL1qi
  //   const playlist_id = req.query.url.split("playlist/")[1];
  const { urls,playlistName } = req.body;
  console.log(req.body);
  const token = newtoken;
  console.log(token);
  ////////////////////////////////////////////////////////////////////
  spotifyApi2.setAccessToken(token);
  console.log(`Starting Download, This may take a while...`);
  let x = 0,
    y = 0;

  spotifyApi2
    .createPlaylist(playlistName, {
      description: "My description",
      public: true,
    })
    .then(
      function (data) {
        console.log("Created playlist!");
        /////////////////////////////////
        spotifyApi2.addTracksToPlaylist(data.body.id, urls).then(
          function (data) {
            console.log("Added tracks to playlist!");
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
        res.json(data.body.id);
        ////////////////////////////
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
 
});
///////////////////////////////////////////////////////////
app.listen(5000, () => {
  console.log(
    "Server is running on http://localhost:5000/login && http://localhost:5000/login2"
  );
});
