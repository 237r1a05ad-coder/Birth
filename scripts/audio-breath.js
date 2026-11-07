/**
 * audio-breath.js - Forgiving, privacy-focused Web Audio breath detection
 * 
 * Analyzes live microphone input locally to detect breath airflow.
 * Zero recording or transmission. Stops immediately upon completion.
 */

export class AudioBreathDetector {
  constructor(options = {}) {
    this.onBreathProgress = options.onBreathProgress || (() => {});
    this.onExtinguish = options.onExtinguish || (() => {});
    this.onError = options.onError || (() => {});
    this.onListeningStart = options.onListeningStart || (() => {});

    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.animationFrameId = null;
    this.isListening = false;
    this.hasExtinguished = false;

    // Detection tuning (forgiving, natural breath physics)
    this.breathAccumulator = 0;
    this.breathThreshold = 35; // Total cumulative energy required to extinguish
    this.volumeFloor = 0.045;   // Ambient room noise gate
  }

  async start() {
    if (this.isListening) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.onError(new Error('Microphone API not supported in this environment'));
      return;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true
        },
        video: false
      });

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      
      // Ensure context is running (can be suspended by autoplay policies)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.25;

      sourceNode.connect(this.analyser);
      this.isListening = true;
      this.onListeningStart();

      this.processAudio();
    } catch (err) {
      this.isListening = false;
      this.onError(err);
    }
  }

  processAudio() {
    if (!this.isListening || this.hasExtinguished) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(timeData);

    // Calculate RMS volume
    let sumSquares = 0;
    for (let i = 0; i < bufferLength; i++) {
      const normalized = (timeData[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / bufferLength);

    // Filter out ambient quiet room noise
    if (rms > this.volumeFloor) {
      const breathIntensity = Math.min((rms - this.volumeFloor) * 4.5, 1.0);
      this.breathAccumulator += breathIntensity * 1.8;
      
      const progress = Math.min(this.breathAccumulator / this.breathThreshold, 1.0);
      this.onBreathProgress(progress, breathIntensity);

      if (progress >= 1.0 && !this.hasExtinguished) {
        this.hasExtinguished = true;
        this.onExtinguish();
        this.stop();
        return;
      }
    } else {
      // Natural decay when user stops blowing
      this.breathAccumulator = Math.max(0, this.breathAccumulator - 0.4);
      const progress = Math.min(this.breathAccumulator / this.breathThreshold, 1.0);
      this.onBreathProgress(progress, 0);
    }

    this.animationFrameId = requestAnimationFrame(() => this.processAudio());
  }

  stop() {
    this.isListening = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        track.stop();
      });
      this.mediaStream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {
        // Safe close
      }
      this.audioContext = null;
    }
  }
}

