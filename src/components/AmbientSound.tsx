import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Ambient audio synthesizer using Web Audio API.
 * Synthesizes a quiet, melancholic low drone with subtle soft wind/rain noise.
 * Muted by default, strictly opt-in.
 */
export const AmbientSound: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleSound = async () => {
    if (!isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          await audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 3);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Low drone oscillators: D2 (73.4Hz) and A2 (110.0Hz) - melancholic fifth
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(73.42, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110.0, ctx.currentTime);

        const oscGain1 = ctx.createGain();
        oscGain1.gain.value = 0.5;
        const oscGain2 = ctx.createGain();
        oscGain2.gain.value = 0.25;

        // Filter for warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        // Soft filtered pink noise for gentle rain/wind atmosphere
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(260, ctx.currentTime);
        noiseFilter.Q.setValueAtTime(1.2, ctx.currentTime);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(masterGain);

        osc1.connect(oscGain1);
        osc2.connect(oscGain2);
        oscGain1.connect(filter);
        oscGain2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        whiteNoise.start();

        setIsPlaying(true);
      } catch (err) {
        console.error('Audio initialization error:', err);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            audioCtxRef.current.suspend().catch(() => {});
          }
          setIsPlaying(false);
        }, 1300);
      } else {
        setIsPlaying(false);
      }
    }
  };

  return (
    <button
      onClick={toggleSound}
      type="button"
      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#77777A] hover:text-[#F0EFEB] transition-colors py-1.5 px-2.5 rounded border border-[#333336]/60 hover:border-[#77777A]"
      title={isPlaying ? "Mute ambient atmosphere" : "Play subtle ambient atmosphere"}
      aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#BDBDBB] animate-pulse" />
          <span className="hidden sm:inline">Ambience [On]</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#77777A]" />
          <span className="hidden sm:inline">Ambience [Muted]</span>
        </>
      )}
    </button>
  );
};
