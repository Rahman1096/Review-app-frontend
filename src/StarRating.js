import React, { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
  size = 24,
  readOnly = false,
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value || 0;
  const stars = [1, 2, 3, 4, 5];
  const color = (i) => (i <= display ? "#ffd700" : "#e0e0e0");

  return (
    <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      {stars.map((i) => (
        <span
          key={i}
          role={readOnly ? undefined : "button"}
          aria-label={readOnly ? undefined : `${i} star`}
          style={{
            cursor: readOnly ? "default" : "pointer",
            fontSize: size,
            color: color(i),
            transition: "transform 0.1s",
          }}
          onMouseEnter={() => !readOnly && setHover(i)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(i)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
