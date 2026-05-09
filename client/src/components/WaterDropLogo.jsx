import PropTypes from 'prop-types';

/**
 * NWC circular sphere logo — matches the official brand mark.
 * @param {{ size?: number, className?: string }} props
 */
export default function WaterDropLogo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="wl-sphereGrad" cx="38%" cy="32%" r="60%">
          <stop offset="0%" stopColor="#e8f8fd" />
          <stop offset="40%" stopColor="#7dd6f0" />
          <stop offset="100%" stopColor="#005f8e" />
        </radialGradient>
        <radialGradient id="wl-bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#004a7c" />
          <stop offset="100%" stopColor="#001e3c" />
        </radialGradient>
        <clipPath id="wl-clip">
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>
      {/* Background */}
      <circle cx="50" cy="50" r="49" fill="url(#wl-bgGrad)" />
      {/* Teal crescent shapes */}
      <ellipse cx="26" cy="38" rx="18" ry="28" fill="#00B4D8" opacity="0.85" clipPath="url(#wl-clip)" />
      <ellipse cx="32" cy="50" rx="14" ry="24" fill="#003d6b" clipPath="url(#wl-clip)" />
      <ellipse cx="20" cy="62" rx="16" ry="22" fill="#00c8e8" opacity="0.6" clipPath="url(#wl-clip)" />
      {/* Main sphere */}
      <circle cx="58" cy="50" r="34" fill="url(#wl-sphereGrad)" clipPath="url(#wl-clip)" />
      {/* Sphere sheen */}
      <ellipse cx="50" cy="40" rx="14" ry="8" fill="white" opacity="0.25" clipPath="url(#wl-clip)" />
      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#00B4D8" strokeWidth="1.5" />
    </svg>
  );
}

WaterDropLogo.propTypes = {
  size:      PropTypes.number,
  className: PropTypes.string,
};
