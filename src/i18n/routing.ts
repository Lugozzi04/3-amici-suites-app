import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en", "de", "fr", "es"],
  defaultLocale: "it",
  localePrefix: "always",
});
