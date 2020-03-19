export const defaultSquareSize = 32;
export const arcRadius = Math.sqrt(1.25);
export const vertexAngle = Math.atan(0.5);

export const angleEquals = (a, b) => Math.abs(a - b) < 0.05;

export const getEllipsePointCoords = (a, b, angle) => {
  let normalizedAngle = Math.abs(angle) % 360;

  let x, y;
  if (angleEquals(normalizedAngle, Math.PI / 2)) {
    x = 0;
    y = -b;
  } else if (angleEquals(normalizedAngle, (3 * Math.PI) / 2)) {
    x = 0;
    y = b;
  } else {
    const tan = Math.tan(normalizedAngle);
    const sqrTan = tan * tan;
    const sqrA = a * a;
    const sqrB = b * b;

    x = (a * b) / Math.sqrt(sqrB + sqrA * sqrTan);
    y = -x * tan;

    if (normalizedAngle > Math.PI / 2 && normalizedAngle < (3 * Math.PI) / 2) {
      x = -x;
      y = -y;
    }
  }

  if (angle < 0) {
    y = -y;
  }

  return { x, y };
};

export const sum = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });