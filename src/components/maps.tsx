// @ts-nocheck
"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage } from "@/app/(ai)/actions";
import { generateId } from "ai";

const API_KEY = "AIzaSyDS7gNQhle6Nd99hGjy-i3PrplovTlMpao";
const DESTINATION = { lat: -1.3509182971909748, lng: 36.75714349474812 };

const suggestedActions = [
  {
    title: "Sign in",
    label: "Sign in to Rendercon",
    action: "Show the sign in button",
  },
  {
    title: "who",
    label: " see the speakers",
    action: "Show the speakers",
  },
];

const loggedInActions = [
  {
    title: "create",
    label: "create your card",
    action: "Show the registration form for rendercon",
  },
  {
    title: "Speakers",
    label: "Who are the speakers?",
    action: "Show the speakers",
  },
  {
    title: "When",
    label: "When is rendercon?",
    action: "Show dates for rendercon",
  },
];

const socialCardActions = [
  {
    title: "Edit",
    label: "Edit your card",
    action: "Show the registration form for rendercon",
  },
  {
    title: "view",
    label: "view your card",
    action: "show my card",
  },
  {
    title: "Speakers",
    label: "Who are the speakers?",
    action: "Show the speakers",
  },
  {
    title: "When",
    label: "When is rendercon?",
    action: "Show dates for rendercon",
  },
];

export default function GoogleMapsDirections({
  user,
  socialCard,
}: {
  user: boolean;
  socialCard: boolean;
}) {
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  const { continueConversation } = useActions();
  const [_, setConversation] = useUIState();

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

  const getActions = () => {
    if (user && socialCard) return socialCardActions;
    if (user) return loggedInActions;
    return suggestedActions;
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="flex justify-center items-center">
        <div className="w-full md:max-w-4xl p-4">
          {userLocation ? (
            <>
              <div className="relative  w-full h-[400px]">
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
              <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] my-6 z-10">
                {getActions().map((action, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 * index }}
                    key={index}
                    className={"sm:block"}
                  >
                    <button
                      onClick={async () => {
                        setConversation((messages: ClientMessage[]) => [
                          ...messages,
                          {
                            id: generateId(),
                            role: "user",
                            display: action.action,
                          },
                        ]);
                        const response: ReactNode = await continueConversation(
                          action.action
                        );
                        setConversation((messages: ClientMessage[]) => [
                          ...messages,
                          response,
                        ]);
                      }}
                      className="w-full text-left border border-zinc-800 text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-800 transition-colors flex flex-col"
                    >
                      <span className="font-medium text-purple-500">
                        {action.title}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {action.label}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
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
  const [isExpanded, setIsExpanded] = useState(false);
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
      <Card className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur">
        <CardContent className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2">Loading directions...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur">
        <CardContent className="p-4">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!leg) return null;

  return (
    <Card className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur">
      <CardHeader
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{selected.summary}</CardTitle>
          {isExpanded ? (
            <ChevronDown className="h-6 w-6" />
          ) : (
            <ChevronUp className="h-6 w-6" />
          )}
        </div>
        <p className="text-sm font-medium mt-2">
          Distance: {leg.distance?.text} | Duration: {leg.duration?.text}
        </p>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground mb-2">
            Your location to Destination
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
      )}
    </Card>
  );
}
