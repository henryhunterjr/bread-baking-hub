export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    console.log('🎵 Adding audio to queue, length:', audioData.length);
    this.queue.push(audioData);
    if (!this.isPlaying) {
      console.log('🎵 Starting audio playback');
      await this.playNext();
    } else {
      console.log('🎵 Audio already playing, queued for later');
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      console.log('🎵 Audio queue empty, stopping playback');
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;
    console.log('🎵 Processing next audio chunk, size:', audioData.length);

    try {
      console.log('🎵 Creating WAV from PCM data...');
      const wavData = this.createWavFromPCM(audioData);
      console.log('🎵 WAV created, size:', wavData.length);
      
      console.log('🎵 Decoding audio data...');
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      console.log('🎵 Audio decoded successfully, duration:', audioBuffer.duration);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      console.log('🎵 Playing audio chunk...');
      source.onended = () => {
        console.log('🎵 Audio chunk finished playing');
        this.playNext();
      };
      source.start(0);
    } catch (error) {
      console.error('❌ Error playing audio chunk:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }

  private createWavFromPCM(pcmData: Uint8Array): Uint8Array {
    console.log('Creating WAV from PCM data, length:', pcmData.length);
    
    // Convert bytes to 16-bit samples (little endian)
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = pcmData[i] | (pcmData[i + 1] << 8);
    }
    
    // Create WAV header
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    // WAV header parameters
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    // Write WAV header (RIFF)
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + int16Data.byteLength, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    
    // Write fmt chunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // PCM format size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    
    // Write data chunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, int16Data.byteLength, true);

    // Combine header and data
    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    console.log('WAV created, total length:', wavArray.length);
    return wavArray;
  }
}

let audioQueueInstance: AudioQueue | null = null;

export const playAudioData = async (audioContext: AudioContext, audioData: Uint8Array) => {
  if (!audioQueueInstance) {
    audioQueueInstance = new AudioQueue(audioContext);
  }
  await audioQueueInstance.addToQueue(audioData);
};

export class RealtimeChat {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private recorder: AudioRecorder | null = null;

  constructor(
    private onMessage: (message: any) => void,
    private onSpeakingChange: (speaking: boolean) => void
  ) {}

  async init() {
    try {
      // Ensure audio context is resumed (required for autoplay policy)
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Connect to our Supabase edge function WebSocket
      const projectRef = 'ojyckskucneljvuqzrsw';
      this.ws = new WebSocket(`wss://${projectRef}.functions.supabase.co/functions/v1/realtime-chat`);

      this.ws.onopen = () => {
        console.log('✅ Connected to realtime chat WebSocket');
      };

      this.ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 Received message type:', data.type, data);
        
        if (data.type === 'response.audio.delta') {
          console.log('🎵 Audio delta received, length:', data.delta.length);
          try {
            // Convert base64 to Uint8Array
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            console.log('🎵 Playing audio chunk, bytes:', bytes.length);
            if (this.audioContext) {
              await playAudioData(this.audioContext, bytes);
              console.log('🎵 Audio playback initiated successfully');
            }
            this.onSpeakingChange(true);
          } catch (error) {
            console.error('❌ Error processing audio delta:', error);
          }
        } else if (data.type === 'response.audio.done') {
          console.log('🔇 Audio response done');
          this.onSpeakingChange(false);
        } else if (data.type === 'response.audio_transcript.delta') {
          console.log('📝 Transcript delta:', data.delta);
          this.onMessage({
            type: 'transcript_delta',
            text: data.delta
          });
        } else if (data.type === 'input_audio_buffer.speech_started') {
          console.log('🎤 Speech started detected');
        } else if (data.type === 'input_audio_buffer.speech_stopped') {
          console.log('🔇 Speech stopped detected');
        } else if (data.type === 'session.created') {
          console.log('✅ Session created successfully');
        } else if (data.type === 'session.updated') {
          console.log('✅ Session updated successfully');  
        } else {
          console.log('📨 Other message type:', data.type, data);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.onSpeakingChange(false);
      };

      // Start recording
      this.recorder = new AudioRecorder((audioData) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodeAudioForAPI(audioData)
          }));
        }
      });

      await this.recorder.start();
      console.log('Realtime chat initialized');

    } catch (error) {
      console.error('Error initializing chat:', error);
      throw error;
    }
  }

  async sendMessage(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.ws.send(JSON.stringify(event));
    this.ws.send(JSON.stringify({type: 'response.create'}));
  }

  disconnect() {
    this.recorder?.stop();
    this.ws?.close();
    this.audioContext?.close();
  }
}