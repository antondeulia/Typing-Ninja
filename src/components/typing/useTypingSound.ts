"use client";

import { useCallback, useEffect, useRef } from "react";

type TypingSoundKind = "default" | "space" | "backspace";

export function useTypingSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const getAudioContext = () => {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextCtor =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    return audioContextRef.current;
  };

  const playTypingSound = useCallback(
    (kind: TypingSoundKind = "default") => {
      const context = getAudioContext();
      if (!context) {
        return;
      }

      if (context.state === "suspended") {
        void context.resume();
      }

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const harmonic = context.createOscillator();
      const filter = context.createBiquadFilter();
      const gainNode = context.createGain();

      const preset =
        kind === "backspace"
          ? { base: 145, volume: 0.072, decay: 0.06, harmonics: 0.35 }
          : kind === "space"
            ? { base: 165, volume: 0.058, decay: 0.052, harmonics: 0.26 }
            : { base: 182, volume: 0.062, decay: 0.048, harmonics: 0.3 };

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(preset.base + Math.random() * 12, now);

      harmonic.type = "square";
      harmonic.frequency.setValueAtTime(preset.base * (1.85 + Math.random() * 0.08), now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(0.8, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(preset.volume, now + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + preset.decay);

      oscillator.connect(filter);
      harmonic.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(context.destination);

      harmonic.detune.setValueAtTime(-30, now);
      harmonic.frequency.setValueAtTime(
        preset.base * (preset.harmonics + 1.45),
        now + 0.002,
      );

      oscillator.start(now);
      harmonic.start(now + 0.001);
      oscillator.stop(now + preset.decay + 0.01);
      harmonic.stop(now + preset.decay + 0.008);
    },
    [],
  );

  return { playTypingSound };
}
