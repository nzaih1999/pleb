"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const API_KEY = "AIzaSyDS7gNQhle6Nd99hGjy-i3PrplovTlMpao";
const DESTINATION = { lat: -1.3509182971909748, lng: 36.75714349474812 };

export default function GoogleMapsDirections() {
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="flex justify-center items-center  bg-gray-100">
        <div className="w-full max-w-4xl p-4">
          {userLocation ? (
            <div className="relative w-full h-[400px]">
              <Map
                mapId="google-map-directions"
                defaultCenter={userLocation}
                defaultZoom={10}
                gestureHandling={"greedy"}
                fullscreenControl={false}
              >
                <Directions userLocation={userLocation} />
              </Map>
            </div>
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-lg shadow-md">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </APIProvider>
  );
}

interface DirectionsProps {
  userLocation: google.maps.LatLngLiteral;
}

function Directions({ userLocation }: DirectionsProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !userLocation) return;

    setIsLoading(true);
    setError(null);

    directionsService
      .route({
        origin: userLocation,
        destination: DESTINATION,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching directions:", error);
        setError("Failed to fetch directions. Please try again.");
        setIsLoading(false);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, userLocation]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (isLoading) {
    return (
      <Card className="absolute top-4 left-4 w-80 bg-white/90 backdrop-blur">
        <CardContent className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2">Loading directions...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="absolute top-4 left-4 w-80 bg-white/90 backdrop-blur">
        <CardContent className="p-4">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!leg) return null;

  return (
    <Card className="absolute top-4 left-4 w-72 bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle>{selected.summary}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Your location to Destination
        </p>
        <p className="text-sm font-medium">Distance: {leg.distance?.text}</p>
        <p className="text-sm font-medium mb-4">
          Duration: {leg.duration?.text}
        </p>
        <h3 className="text-sm font-semibold mb-2">Alternative Routes</h3>
        <div className="flex flex-wrap gap-2">
          {routes.map((route, index) => (
            <Button
              key={route.summary}
              variant={index === routeIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setRouteIndex(index)}
            >
              Route {index + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
