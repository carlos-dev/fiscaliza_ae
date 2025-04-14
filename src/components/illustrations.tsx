import { FC, JSX } from "react";

interface IllustrationProps {
  className?: string;
}

export const VotingIllustration: FC<IllustrationProps> = ({
  className,
}): JSX.Element => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="30" width="120" height="140" rx="8" fill="#E5DEFF" />
    <rect x="55" y="55" width="90" height="12" rx="6" fill="#9b87f5" />
    <rect
      x="55"
      y="80"
      width="90"
      height="12"
      rx="6"
      fill="#9b87f5"
      opacity="0.7"
    />
    <rect
      x="55"
      y="105"
      width="90"
      height="12"
      rx="6"
      fill="#9b87f5"
      opacity="0.5"
    />
    <rect
      x="55"
      y="130"
      width="60"
      height="12"
      rx="6"
      fill="#9b87f5"
      opacity="0.3"
    />
    <circle cx="140" cy="135" r="15" fill="#7E69AB" />
    <path
      d="M134 135L138 139L146 131"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AnalyticsIllustration: FC<IllustrationProps> = ({
  className,
}): JSX.Element => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="30" y="50" width="140" height="100" rx="8" fill="#E5DEFF" />
    <rect x="45" y="110" width="20" height="30" rx="4" fill="#9b87f5" />
    <rect
      x="75"
      y="90"
      width="20"
      height="50"
      rx="4"
      fill="#9b87f5"
      opacity="0.8"
    />
    <rect
      x="105"
      y="70"
      width="20"
      height="70"
      rx="4"
      fill="#9b87f5"
      opacity="0.6"
    />
    <rect
      x="135"
      y="60"
      width="20"
      height="80"
      rx="4"
      fill="#9b87f5"
      opacity="0.4"
    />
    <path
      d="M40 165 L160 165"
      stroke="#7E69AB"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
  </svg>
);

export const ComparisonIllustration: FC<IllustrationProps> = ({
  className,
}): JSX.Element => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="60" cy="80" r="30" fill="#E5DEFF" />
    <circle cx="140" cy="80" r="30" fill="#E5DEFF" />
    <rect
      x="50"
      y="120"
      width="20"
      height="40"
      rx="4"
      fill="#9b87f5"
      opacity="0.6"
    />
    <rect
      x="130"
      y="120"
      width="20"
      height="40"
      rx="4"
      fill="#9b87f5"
      opacity="0.9"
    />
    <path
      d="M100 80 L100 160"
      stroke="#7E69AB"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <circle cx="60" cy="80" r="15" fill="#9b87f5" opacity="0.4" />
    <circle cx="140" cy="80" r="15" fill="#9b87f5" opacity="0.7" />
  </svg>
);

export const TransparencyIllustration: FC<IllustrationProps> = ({
  className,
}): JSX.Element => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 40 L140 65 L140 115 L100 140 L60 115 L60 65 L100 40Z"
      fill="#E5DEFF"
      stroke="#9b87f5"
      strokeWidth="3"
    />
    <path
      d="M100 60 L125 75 L125 105 L100 120 L75 105 L75 75 L100 60Z"
      fill="#9b87f5"
      fillOpacity="0.3"
    />
    <circle cx="100" cy="90" r="15" fill="#7E69AB" fillOpacity="0.6" />
  </svg>
);

export const WavyBackground: FC<IllustrationProps> = ({
  className,
}): JSX.Element => (
  <svg
    className={className}
    width="100%"
    height="100"
    viewBox="0 0 1200 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 50C200 110, 400 10, 600 50C800 90, 1000 10, 1200 50V100H0V50Z"
      fill="currentColor"
      fillOpacity="0.05"
    />
    <path
      d="M0 70C200 130, 400 30, 600 70C800 110, 1000 30, 1200 70V100H0V70Z"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </svg>
);
