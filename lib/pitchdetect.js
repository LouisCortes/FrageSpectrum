window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = null;
var analyser = null;
var audioCtx = null;
var mediaStreamSource = null;
let spectroOffset = 0;
window.onload = function() {
	audioContext = new AudioContext();
	audioCtx = document.getElementById( "waveform" );
	canvasCtx = audioCtx.getContext("2d");

	 getUserMedia({
					 "audio": {
							 "mandatory": {

							 },
							 "optional": []
					 },}, gotStream);
};
function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia =
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
  //  analyser.fftSize = 1024;
    mediaStreamSource.connect( analyser );
    updatePitch();
}

function updatePitch()
{
	//analyser.fftSize = 1024;
/*	buf = new Float32Array( analyser.frequencyBinCount );
	requestAnimationFrame( updatePitch );
	analyser.getFloatTimeDomainData(buf);
drawOscilloscope();*/
 spectrum = new Uint8Array(analyser.frequencyBinCount)
  requestAnimationFrame(updatePitch)
  analyser.getByteFrequencyData(spectrum)
	const slice = canvasCtx.getImageData(0, spectroOffset, audioCtx.width, 1)
  for (let i = 0; i < spectrum.length; i++) {
    slice.data[4 * i + 0] = spectrum[i] // R
    slice.data[4 * i + 1] = spectrum[i] // G
    slice.data[4 * i + 2] = spectrum[i] // B
    slice.data[4 * i + 3] = 255         // A
  }
  canvasCtx.putImageData(slice, 0, spectroOffset)
  spectroOffset += 1
  spectroOffset %= audioCtx.height
}





//drawSpectrogram();
function drawSpectrogram() {
  requestAnimationFrame(drawSpectrogram)
  const slice = canvasCtx.getImageData(0, spectroOffset, audioCtx.width, 1)
  for (let i = 0; i < spectrum.length; i++) {
    slice.data[4 * i + 0] = spectrum[i] // R
    slice.data[4 * i + 1] = spectrum[i] // G
    slice.data[4 * i + 2] = spectrum[i] // B
    slice.data[4 * i + 3] = 255         // A
  }
  canvasCtx.putImageData(slice, 0, spectroOffset)
  spectroOffset += 1
  spectroOffset %= audioCtx.height
}
function drawOscilloscope() {
  requestAnimationFrame(drawOscilloscope)
  canvasCtx.clearRect(0, 0, audioCtx.width, audioCtx.height)
  canvasCtx.beginPath()
  for (let i = 0; i < buf.length; i++) {
    const x = i
    const y = (0.5 + buf[i] / 2) * audioCtx.height;
    if (i == 0) {
      canvasCtx.moveTo(x, y)
    } else {
      canvasCtx.lineTo(x, y)
    }
  }
  canvasCtx.stroke()
}
function error() {
    alert('Stream generation failed.');
}
