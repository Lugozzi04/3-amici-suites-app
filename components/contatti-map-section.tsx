"use client";

import dynamic from "next/dynamic";

const VeronaMap = dynamic(() => import("@/components/verona-map").then((module) => module.VeronaMap), {
  ssr: false,
  loading: () => <MapShell />,
});

export function ContattiMapSection() {
  return <VeronaMap />;
}

function MapShell() {
  return <div className="h-[390px] rounded-[2rem] border border-white/60 bg-white/55 shadow-soft backdrop-blur" />;
}
