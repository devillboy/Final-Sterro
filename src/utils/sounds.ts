/**
 * Global sound utility for UI interactions
 */

const playSound = (type: 'click' | 'hover' | 'success' | 'error') => {
  try {
    // We use standard web audio or predefined short data URLs for low-latency
    const clickUrl = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'; // Modern short click
    const audio = new Audio(clickUrl);
    audio.volume = 0.2;
    audio.play().catch(() => {
      // Ignore autoplay blocks
    });
  } catch (e) {
    // Sound failed
  }
};

export const useSounds = () => {
  return {
    playClick: () => playSound('click'),
    playHover: () => playSound('hover'),
    playSuccess: () => playSound('success'),
    playError: () => playSound('error'),
  };
};
