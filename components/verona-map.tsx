"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { mapTileProvider } from "@/src/data/mapTiles";
import { propertiesMap } from "@/src/data/propertiesMap";

import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({
  className: "boutique-map-marker",
  html: `
    <span class="boutique-map-marker__halo"></span>
    <span class="boutique-map-marker__pin">
      <svg viewBox="0 0 36 52" aria-hidden="true" focusable="false">
        <path d="M18 50c.6 0 1.1-.3 1.5-.8l10-13.6C33.7 31 36 25.5 36 19.4 36 8.7 27.9 0 18 0S0 8.7 0 19.4C0 25.5 2.3 31 6.5 35.6l10 13.6c.4.5.9.8 1.5.8Z" fill="currentColor"/>
        <circle cx="18" cy="18.5" r="6.1" fill="#fff"/>
        <circle cx="18" cy="18.5" r="3.2" fill="currentColor"/>
      </svg>
    </span>
  `,
  iconSize: [36, 52],
  iconAnchor: [18, 50],
  popupAnchor: [0, -46],
});

export function VeronaMap() {
  const bounds = useMemo(
    () => propertiesMap.map((property) => [property.lat, property.lng] as [number, number]),
    [],
  );

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/72 shadow-soft backdrop-blur">
      <div className="border-b border-stone/15 px-6 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-earth">Mappa</p>
        <p className="mt-2 text-sm leading-7 text-ink/70">
          Quattro strutture a Verona, mostrate su una mappa interattiva con un look sobrio e premium.
        </p>
      </div>

      <div className="relative h-[340px] overflow-hidden sm:h-[360px] md:h-[390px]">
        <div
          className="pointer-events-none absolute inset-0 z-[405]"
          style={{ background: mapTileProvider.tint }}
        />
        <MapContainer
          className="boutique-map relative z-[300] h-full w-full"
          center={[45.4387, 10.989]}
          zoom={15}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          preferCanvas
        >
          <MapBehavior bounds={bounds} />
          <TileLayer
            attribution={mapTileProvider.attribution}
            url={mapTileProvider.url}
            subdomains={mapTileProvider.subdomains}
            tileSize={mapTileProvider.tileSize}
            zoomOffset={mapTileProvider.zoomOffset}
            maxZoom={mapTileProvider.maxZoom}
            detectRetina={mapTileProvider.detectRetina}
          />
          {propertiesMap.map((property) => (
            <Marker
              key={property.slug}
              position={[property.lat, property.lng]}
              icon={markerIcon}
              title={property.name}
            >
              <Popup
                className="boutique-map-popup"
                closeButton={false}
                autoPan
                offset={[0, -24]}
              >
                <PopupCard
                  name={property.name}
                  address={property.address}
                  href={property.googleMapsDirectionsUrl}
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

function MapBehavior({ bounds }: { bounds: Array<[number, number]> }) {
  const map = useMap();

  useEffect(() => {
    if (bounds.length === 0) {
      return;
    }

    const zoomControl = L.control.zoom({ position: "bottomright" });
    zoomControl.addTo(map);
    map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [32, 32] });

    return () => {
      zoomControl.remove();
    };
  }, [bounds, map]);

  return null;
}

function PopupCard({
  name,
  address,
  href,
}: {
  name: string;
  address: string;
  href: string;
}) {
  return (
    <div className="min-w-[200px] max-w-[240px] space-y-3 p-0.5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-earth">Struttura</p>
        <p className="mt-1 text-sm font-semibold text-ink">{name}</p>
        <p className="mt-1 text-xs leading-5 text-ink/65">{address}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-full bg-[#b7352d] px-3.5 py-2 text-[11px] uppercase tracking-[0.2em] text-paper transition hover:bg-[#a62d26]"
      >
        Apri su Google Maps
      </a>
    </div>
  );
}
