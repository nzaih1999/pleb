"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockCardProps {
  symbol?: string;
  companyName?: string;
  currentPrice?: number;
  priceChange?: number;
  percentageChange?: number;
  priceHistory?: number[];
}

export default function Stock({
  symbol = "AAPL",
  companyName = "Apple Inc.",
  currentPrice = 150.25,
  priceChange = 2.75,
  percentageChange = 1.86,
  priceHistory = [140, 144, 147, 145, 149, 150, 150.25],
}: StockCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const Icon = isPositive ? TrendingUp : TrendingDown;

  // Normalize the price history for the chart
  const minPrice = Math.min(...priceHistory);
  const maxPrice = Math.max(...priceHistory);
  const normalizedPrices = priceHistory.map(
    (price) => ((price - minPrice) / (maxPrice - minPrice)) * 40
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="w-full max-w-md mx-auto cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">{symbol}</CardTitle>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {companyName}
            </motion.p>
          </div>
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className={`w-6 h-6 ${changeColor}`} />
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex justify-between items-baseline mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-3xl font-bold">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`text-lg font-semibold ${changeColor}`}>
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)} ({percentageChange.toFixed(2)}%)
            </span>
          </motion.div>
          <div className="w-full h-12">
            <svg width="100%" height="100%" viewBox="0 0 100 40">
              <motion.polyline
                fill="none"
                stroke={isPositive ? "rgb(22 163 74)" : "rgb(220 38 38)"}
                strokeWidth="2"
                points={normalizedPrices
                  .map(
                    (price, index) =>
                      `${index * (100 / (normalizedPrices.length - 1))},${
                        40 - price
                      }`
                  )
                  .join(" ")}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
