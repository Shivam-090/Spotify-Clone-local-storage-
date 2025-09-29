let currentsong = new Audio();
let songs;
let currFolder;
let cardContainer = document.querySelector(".cardContainer");
let repeatsong = 0;
let shufflesong = 0;

async function main() {
  //Get all songs
  await getSongs("songs/vibe");
  playmusic(songs[0], true);

  //Display all the albums from the storage
  displayAlbum();

  //attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "/Assets/svg/pause circle.svg";
    } else {
      currentsong.pause();
      play.src = "/Assets/svg/play circle.svg";
    }
  });

  //listen for time update event
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".song_time").innerHTML = `${secondtominutes(
      currentsong.currentTime
    )} / ${secondtominutes(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  //adding an event for seeking on seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "px";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  //add event listener on the menu
  document.querySelector(".menu").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //add event listener on the cancel_div
  document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //add an event listener to the next and previous buttons
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  //adding event on the volume button
  let isMuted = false;

  document.querySelector(".volumebar .volume").addEventListener("click", () => {
    const volumeIcon = document.querySelector(".volumebar .volume");

    isMuted = !isMuted; // Toggle state
    currentsong.muted = isMuted;

    if (isMuted) {
      volumeIcon.src = "/Assets/svg/volume mute.svg";
    } else {
      const volume = currentsong.volume * 100;
      if (volume <= 30) {
        volumeIcon.src = "/Assets/svg/volume low.svg";
      } else if (volume <= 60) {
        volumeIcon.src = "/Assets/svg/volume mid.svg";
      } else {
        volumeIcon.src = "/Assets/svg/volume.svg";
      }
    }
  });

  //add event to the range
  document.querySelector(".v_range input").addEventListener("change", (e) => {
    const volume = parseInt(e.target.value);
    currentsong.volume = volume / 100;

    // If muted, unmute on slider interaction
    currentsong.muted = false;
    isMuted = false;

    const volumeIcon = document.querySelector(".volumebar .volume");

    if (volume === 0) {
      volumeIcon.src = "/Assets/svg/volume mute.svg";
    } else if (volume <= 30) {
      volumeIcon.src = "/Assets/svg/volume low.svg";
    } else if (volume <= 60) {
      volumeIcon.src = "/Assets/svg/volume mid.svg";
    } else {
      volumeIcon.src = "/Assets/svg/volume.svg";
    }
  });

  
  //add event for repeat song
  let repeatmode = document.querySelector(".controls .cRepeat")
  repeatmode.addEventListener("click", ()=>{
      repeatsong = (repeatsong + 1) % 3;
      
      if(repeatsong === 0){
          repeatmode.src = "/Assets/svg/no repeat.svg";
        }
        else if(repeatsong === 1){
            repeatmode.src = "/Assets/svg/repeat.svg";
        }
        else if(repeatsong === 2){
            repeatmode.src = "/Assets/svg/repeat one.svg";
        }
        
    })

          //add event for repeat song But no working
  let shufflemode = document.querySelector(".controls .cShuffle");
  shufflemode.addEventListener("click", ()=>{
     shufflesong = (shufflesong + 1) % 2;
     
     if(shufflesong === 1){
        shufflemode.src="/Assets/svg/shuffle.svg"
        
     }
     else{
        shufflemode.src="/Assets/svg/no shuffle.svg"
        
     }
        
    })
    
    
    //adding event when song ends
currentsong.addEventListener("ended", () => {
    const currentSongFile = currentsong.src.split("/").slice(-1)[0];
    const index = songs.indexOf(currentSongFile);

    if (repeatsong === 2) {
        playmusic(currentSongFile);
    } else if (repeatsong === 1) {
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1]);
        } else {
            playmusic(songs[0]);
        }
    } else {
        if (index + 1 < songs.length) {
    playmusic(songs[index + 1]);
} else {
    play.src = "/Assets/svg/play circle.svg";
    currentsong.currentTime = 0;
}
    }
});



  document.querySelector(".log").addEventListener("click",()=>{
    console.log("clicked")
    document.querySelector(".container_log_sign").style.display = "block";
    document.querySelector(".log1").style.display = "block"
    document.querySelector(".blur").style.display = "block"
    document.querySelector(".sign1").style.display = "none"
    

  })


  document.querySelector(".sign").addEventListener("click",()=>{
    console.log("clicked")
    document.querySelector(".container_log_sign").style.display = "block";
    document.querySelector(".sign1").style.display = "block";
    document.querySelector(".blur").style.display = "block"
    document.querySelector(".log1").style.display = "none";

  })


  document.querySelector(".cross1").addEventListener("click",()=>{
    
    document.querySelector(".container_log_sign").style.display = "none";
    document.querySelector(".blur").style.display = "none";
  })



}

async function displayAlbum() {
  let a = await fetch(`http://127.0.0.1:5500/assets/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];

      // get the metadata of the folder
      let a = await fetch(
        `http://127.0.0.1:5500/assets/songs/${folder}/info.json`
      );
      let response = await a.json();


      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <img  src="/Assets/svg/play.svg" alt="">
                        </div>
                        <img class="w1" src="/Assets/songs/${folder}/cover.jpg" alt="image">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
    }
  }
  //load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playmusic(songs[0]);
    });
  });
}

async function getSongs(folder) {
  currFolder = folder;
  //fetching the songs from the local storage
  let a = await fetch(`http://127.0.0.1:5500/assets/${folder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //Show all the songs in playlist
  let songUl = document
    .querySelector(".song_list")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    let name = song.replaceAll("%20", " ");
    let name2 = name.replace(".mp3", "");
    songUl.innerHTML =
      songUl.innerHTML +
      `<li><img class="invert" src="/Assets/svg/music.svg" alt="">
        <div class="SongInfo">
        <div style="display:none;">${song.replaceAll("%20", " ")}</div>
        <div>${name2.split("- ")[1]}</div>
        <div>${name2.split("- ")[0]}</div>
        </div>
        <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="/Assets/svg/play circle.svg" alt="">
        </div> </li>`;
  }
  //attatch An eventListener to each songs
  Array.from(
    document.querySelector(".song_list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playmusic(
        e.querySelector(".SongInfo").firstElementChild.innerHTML.trim()
      );
    });
  });

  return songs;
  
}

const playmusic = (track, paused = false) => {
  // let audio = new Audio("/assets/songs/" + track)
  currentsong.src = `Assets/${currFolder}/` + track;
  if (!paused) {
    currentsong.play();
    play.src = "/Assets/svg/pause circle.svg";
  }

  document.querySelector(".song_info").innerHTML = decodeURI(
    track.replace(".mp3", "")
  );
  document.querySelector(".song_time").innerHTML = "00:00 / 00:00";

  
};

//for converting the minutes and seconds
function secondtominutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
main();
