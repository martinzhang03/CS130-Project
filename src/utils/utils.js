export const getRandomRgbColor = () => {
  // 生成三个介于 0 和 255 之间的随机整数
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  // 返回 RGB 颜色字符串
  return `rgb(${r}, ${g}, ${b})`;
};

export const colorMaps = {
  0: "#DCB007",
  1: "#A4A202",
  2: "#36974A",
  3: "#583B6B",
  4: "#452453",
};
