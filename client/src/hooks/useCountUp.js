import { useState, useEffect } from 'react';

/**
 * Animates a number from 0 to `target` over `duration` ms using ease-out cubic.
 *
 * @param {number} target   - The final value to count up to.
 * @param {number} duration - Animation duration in ms (default 1500).
 * @returns {number} Current animated value.
 */
export function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof target !== 'number' || target <= 0) return;

    let startTime = null;
    let frameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count;
}
