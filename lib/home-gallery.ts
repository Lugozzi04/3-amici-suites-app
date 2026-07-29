import fs from "node:fs";
import path from "node:path";

export type HomeGalleryGroup = {
  name: string;
  subtitle: string;
  images: string[];
};

const imageRoot = path.join(process.cwd(), "public", "img");

function readImages(folder: string) {
  const directory = path.join(imageRoot, folder);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => /\.(avif|jpe?g|png|webp)$/i.test(file))
    .sort((left, right) => left.localeCompare(right))
    .map((file) => `/img/${folder}/${file}`);
}

export function getHomeGalleryGroups(): HomeGalleryGroup[] {
  return [
    {
      name: "3 Amici Suites",
      subtitle: "Centro storico",
      images: readImages("suites"),
    },
    {
      name: "3 Amici al Teatro",
      subtitle: "Verona centrale",
      images: readImages("teatro"),
    },
    {
      name: "3 Amici al Castello",
      subtitle: "Borgo Trento",
      images: readImages("castello"),
    },
    {
      name: "3 Amici all’Arena",
      subtitle: "Vicino all’Arena",
      images: readImages("arena"),
    },
  ];
}

export function getPropertyImagePools() {
  return {
    "3-amici-suites": readImages("suites"),
    "3-amici-al-teatro": readImages("teatro"),
    "3-amici-al-castello": readImages("castello"),
    "3-amici-all-arena": readImages("arena"),
  };
}
