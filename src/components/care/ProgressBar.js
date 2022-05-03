import React, { useEffect, useState } from "react";

const ProgressBar = ({ currentValue, max = 30 }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds < 30) {
      setTimeout(() => setSeconds(seconds + 0.25), 250);
    } else {
      setSeconds(30);
    }
  });

  return <progress className="progress-bar" value={seconds} max={max} />;
};

export default ProgressBar;
