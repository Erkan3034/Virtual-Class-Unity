import wave
import struct

def generate_silent_wav(filename="sample_audio.wav", duration_sec=2):
    """Generates a simple silent WAV file for testing connectivity."""
    sample_rate = 44100
    num_samples = duration_sec * sample_rate
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # Mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(sample_rate)
        
        for _ in range(num_samples):
            value = 0 # Silence
            data = struct.pack('<h', value)
            wav_file.writeframesraw(data)
            
    print(f"Success: {filename} created ({duration_sec} seconds).")

if __name__ == "__main__":
    generate_silent_wav()
