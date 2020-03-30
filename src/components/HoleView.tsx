import "mapbox-gl/dist/mapbox-gl.css";

import { Button } from "@material-ui/core";
import * as turf from "@turf/turf";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import mapboxgl from "mapbox-gl";
import React, { CSSProperties, useEffect, useRef, useState } from "react";

import { Hole } from "../api/api";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN as string;
mapboxgl.workerCount = 10;

interface Props {
  holes: Hole[];
}

const styles: CSSProperties = {
  width: "100%",
  height: "90%",
  position: "absolute"
};

let movingFeatureId = "";
let firMarker: mapboxgl.Marker | null = null;
let layupMarker: mapboxgl.Marker | null = null;
const firMarkerEl = document.createElement("div");
firMarkerEl.className = "distance";
const layupMarkerEl = document.createElement("div");
layupMarkerEl.className = "distance";

const getMarkerText = (distance: number, backDistance: number) => {
  return `👇 ${backDistance.toFixed()}m / 👆${distance.toFixed()}m`;
};

const setMarkers = (
  holeCoords: [number, number][],
  par: number,
  map: mapboxgl.Map
) => {
  if (par !== 3) {
    const distance = turf.distance(holeCoords[1], holeCoords[2], {
      units: "meters"
    });
    const backDistance = turf.distance(holeCoords[1], holeCoords[0], {
      units: "meters"
    });
    firMarkerEl.innerText = getMarkerText(distance, backDistance);
    firMarker = new mapboxgl.Marker(firMarkerEl, { offset: [-50, 0] })
      .setLngLat(holeCoords[1])
      .addTo(map);
  }
  if (par === 5) {
    const distance = turf.distance(holeCoords[2], holeCoords[3], {
      units: "meters"
    });
    const backDistance = turf.distance(holeCoords[2], holeCoords[1], {
      units: "meters"
    });
    layupMarkerEl.innerText = getMarkerText(distance, backDistance);
    layupMarker = new mapboxgl.Marker(layupMarkerEl, { offset: [-50, 0] })
      .setLngLat(holeCoords[2])
      .addTo(map);
  }
};

const buildHoleMarkers = (hole: Hole, holeCoords: [number, number][]) => {
  const holeMarkers: FeatureCollection<Point, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: holeCoords.map((hc, index) => ({
      type: "Feature",
      properties: {
        id: hole.keypoints[index].type,
        "marker-symbol": hole.keypoints[index].type,
        unikum: `${index}-${hole.keypoints[index].type}`
      },
      geometry: {
        type: "Point",
        coordinates: hc
      }
    }))
  };

  return holeMarkers;
};

const HoleView: React.FC<Props> = ({ holes }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [currentHole, setCurrentHole] = useState(0);
  const mapContainer = useRef<HTMLElement | null>(null);

  const changeHole = (newHole: number) => {
    const holeCoords = holes[newHole].keypoints.map(kp => [kp.lng, kp.lat]) as [
      number,
      number
    ][];
    const holeMarkers = buildHoleMarkers(holes[newHole], holeCoords);
    // @ts-ignore
    map.getSource("markers").setData(holeMarkers);
    // @ts-ignore
    map.getSource("route").setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: holeMarkers.features.map(hm => hm.geometry.coordinates)
      }
    });

    if (map) {
      setMarkers(holeCoords, holes[newHole].par, map);
      const bearing = turf.bearing(
        holeCoords[0],
        holeCoords[holeCoords.length - 1]
      );
      const bounds = turf.bbox(holeMarkers) as mapboxgl.LngLatBoundsLike;

      // map.easeTo(bearing);
      map.fitBounds(bounds, {
        padding: { bottom: 100, top: 100, left: 0, right: 0 },
        bearing
      });
    }
    setCurrentHole(newHole);
  };

  useEffect(() => {
    const initializeMap = (setMap: any, mapContainer: any) => {
      const holeCoords = holes[0].keypoints.map(kp => [kp.lng, kp.lat]) as [
        number,
        number
      ][];
      const par = holes[0].par;

      const holeMarkers = buildHoleMarkers(holes[0], holeCoords);
      const bearing = turf.bearing(
        holeCoords[0],
        holeCoords[holeCoords.length - 1]
      );
      const bounds = turf.bbox(holeMarkers) as mapboxgl.LngLatBoundsLike;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        // interactive: false,
        bounds: bounds,
        fitBoundsOptions: {
          padding: { top: 100, bottom: 100, left: 10, right: 10 }
        }
      });
      (window as any).map = map;

      const canvas = map.getCanvasContainer();

      // TODO: This is using holeMarkers that are defined in same scope.
      // Move out as much as possible from useEffect!
      function onMove(e: mapboxgl.EventData) {
        const coords = e.lngLat;
        // Set a UI indicator for dragging.
        canvas.style.cursor = "grabbing";
        const newHoleMarkers = {
          type: "FeatureCollection",
          features: holeMarkers.features.map(hm => {
            if (hm.properties!.id === movingFeatureId) {
              return {
                ...hm,
                geometry: {
                  ...hm.geometry,
                  coordinates: [coords.lng, coords.lat]
                }
              };
            } else {
              return hm;
            }
          })
        };

        if (movingFeatureId === "fir") {
          const distance = turf.distance(
            [coords.lng, coords.lat],
            holeCoords[2],
            {
              units: "meters"
            }
          );
          const backDistance = turf.distance(
            [coords.lng, coords.lat],
            holeCoords[0],
            {
              units: "meters"
            }
          );
          firMarkerEl.innerText = getMarkerText(distance, backDistance);
          firMarker?.setLngLat(coords);
        }

        if (movingFeatureId === "layup") {
          const distance = turf.distance(
            [coords.lng, coords.lat],
            holeCoords[3],
            {
              units: "meters"
            }
          );
          const backDistance = turf.distance(
            [coords.lng, coords.lat],
            holeCoords[1],
            {
              units: "meters"
            }
          );
          layupMarkerEl.innerText = getMarkerText(distance, backDistance);
          layupMarker?.setLngLat(coords);
        }

        // @ts-ignore
        map.getSource("markers").setData(newHoleMarkers);
        // @ts-ignore
        map.getSource("route").setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: newHoleMarkers.features.map(
              hm => hm.geometry.coordinates
            )
          }
        });
      }

      function onUp(e: mapboxgl.EventData) {
        // const coords = e.lngLat;
        canvas.style.cursor = "";

        // Unbind mouse/touch events
        map.off("mousemove", onMove);
        map.off("touchmove", onMove);
      }

      // map.on("move", () => {
      //   const lng = map.getCenter().lng.toFixed(6);
      //   const lat = map.getCenter().lat.toFixed(6);
      //   const zoom = map.getZoom().toFixed(2);
      //   const bearing = map.getBearing().toFixed(2);
      //   const pitch = map.getPitch().toFixed(2);
      //   console.log({ lng, lat, zoom, bearing, pitch });
      // });

      map.on("load", () => {
        setMap(map);

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: holeCoords
            }
          }
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "rgba(100, 255, 255, 0.5)",
            "line-width": 2,
            "line-dasharray": [1, 5]
          }
        });

        map.addSource("markers", {
          type: "geojson",
          data: holeMarkers
        });

        map.addLayer({
          id: "point",
          type: "circle",
          source: "markers",
          paint: {
            "circle-radius": 10,
            "circle-color": "#55ffff"
          }
        });

        // Set up point moves
        map.on("mouseenter", "point", () => {
          canvas.style.cursor = "move";
        });

        map.on("mouseleave", "point", () => {
          canvas.style.cursor = "";
        });

        map.on("mousedown", "point", e => {
          if (e.features && e.features.length > 0) {
            movingFeatureId = e.features[0]!.properties!.id;
          }
          e.preventDefault();
          canvas.style.cursor = "grab";
          map.on("mousemove", onMove);
          map.once("mouseup", onUp);
        });

        map.on("touchstart", "point", e => {
          if (e.points.length !== 1) return;
          if (e.features && e.features.length > 0) {
            movingFeatureId = e.features[0]!.properties!.id;
            if (movingFeatureId === "tee") return;
          }
          e.preventDefault();
          map.on("touchmove", onMove);
          map.once("touchend", onUp);
        });

        setMarkers(holeCoords, par, map);

        map.easeTo({
          bearing,
          // @ts-ignore
          padding: { bottom: 100, top: 100, left: 0, right: 0 }
        });
      });
    };

    if (!map) initializeMap(setMap, mapContainer);
  }, [map, holes]);

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => changeHole(currentHole + 1)}
        style={{ zIndex: 1000 }}
      >
        Byt hål
      </Button>
      <div ref={el => (mapContainer.current = el)} style={styles} />
    </div>
  );
};

export default HoleView;
