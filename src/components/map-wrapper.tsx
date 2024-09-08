"use client";

import dynamic from "next/dynamic";

const DistanceMap = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const MapWrapper = () => {
  return <DistanceMap />;
};

export default MapWrapper;
