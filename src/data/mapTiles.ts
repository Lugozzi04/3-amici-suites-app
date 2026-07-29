export const mapTileProvider = {
  name: "CartoDB Positron",
  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  tileSize: 256,
  zoomOffset: 0,
  maxZoom: 20,
  detectRetina: true,
  tint:
    "linear-gradient(135deg, rgba(202, 74, 61, 0.08), rgba(104, 114, 90, 0.04) 42%, rgba(255, 255, 255, 0) 78%)",
} as const;
