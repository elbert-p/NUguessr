import type { NextConfig } from "next";

const fs = require("fs-extra");
const path = require("path");

const leafletImages = path.join(__dirname, "node_modules/leaflet/dist/images");
const publicImages = path.join(__dirname, "public");

fs.copySync(leafletImages, publicImages);

module.exports = {
  reactStrictMode: true,
};
