
let recstart = document.getElementById('recstart'),
    // recstop  = document.getElementById('recstop'),
    mediaRecorder; 

started = false

function stopbutton(){
    mediaRecorder.stop();
    document.createElement('br')
    var tag = document.createElement("p");
    var text = document.createTextNode("Stopped Recording");
    tag.appendChild(text);
    var element = document.getElementById("console");
    element.appendChild(tag);
}

recstart.addEventListener('click', async function(){ // When the recording starts
    let stream = await recordScreen();
    let mimeType = 'video/webm';
    mediaRecorder = createRecorder(stream, mimeType);
    document.createElement('br')

    var tag = document.createElement("p");
    var text = document.createTextNode("Started Recording");
    tag.appendChild(text);
    var element = document.getElementById("console");
    element.appendChild(tag);
    if(started == false){
      started = true
      var stopb = document.createElement("button");
      var bcontent = document.createTextNode("Stop Recording");
      stopb.appendChild(bcontent);
      stopb.setAttribute("id", "recstop")
      stopb.setAttribute("onclick", "stopbutton()")
      recstop = document.getElementById("recstop")
      var element = document.getElementById("buttons");
      element.appendChild(stopb);
    }
})


// function getLocalStream() {
//   const audioCtx = new AudioContext();
//   if (navigator.mediaDevices) {
//     navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {
//     const microphone = audioCtx.createMediaStreamSource(stream);
//     console.log("Got microphone input")
//       // `microphone` can now act like any other AudioNode
//     }).catch((err) => {
//       console.warn("Unable to access Mic")
//     });
//   } else {
//     console.warn("Unable to access media")
//   }}

// getLocalStream()

async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true, 
        video: { mediaSource: "screen"}
    });
}

function createRecorder (stream, mimeType) {
  // the stream data is stored in this array
  let recordedChunks = []; 

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }  
  };
  mediaRecorder.onstop = function () {
     saveFile(recordedChunks);
     recordedChunks = [];
  };
  mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
  return mediaRecorder;
}

function saveFile(recordedChunks){

   const blob = new Blob(recordedChunks, {
      type: 'video/webm'
    });
    let filename = window.prompt('Enter file name'),
        downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(blob);
    var tag = document.createElement("p");

    if(filename == null | filename == ""){ // if no filename is provided
      filename = 'Recording'
      var text = document.createTextNode("Filename was unavailable; new filename is 'recording'");
    } else if(filename != null){
      var text = document.createTextNode("Saved recording as '" + filename + "'");
    }

    tag.setAttribute('href', downloadLink.href)
    tag.appendChild(text);
    var element = document.getElementById("console");
    element.appendChild(tag);
    


    downloadLink.download = `${filename}.webm`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory

    var video = document.createElement("video");
    video.setAttribute('src', downloadLink)
    video.setAttribute('width', '400')
    video.setAttribute('controls', '')
    video.setAttribute('muted', '')
    video.setAttribute('autoplay', '')
    var element = document.getElementById("console");
    element.appendChild(video);

    document.body.removeChild(downloadLink);
}