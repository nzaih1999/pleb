// app/open-graph.tsx
import { prisma } from "@/lib/prisma";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "RenderCon 2024 Badge";

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const logoSrc = await fetch(
    new URL("./Rendercon-wb.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const user = await prisma.user.findFirst({
    where: { id: params.slug },
    include: {
      socialCard: true,
    },
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: "#f3f4f6",
        }}
      >
        {/* New div with large text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#9333ea",
              display: "flex",
              gap: "4px",
            }}
          >
            {user?.socialCard?.name}
          </div>
          <div
            style={{ fontSize: "24px", color: "#4b5563", marginTop: "10px" }}
          >
            is coming to RenderCon 2024
          </div>
          <div
            style={{ fontSize: "36px", color: "#9333ea", marginTop: "10px" }}
          >
            On 5th and 6th October!
          </div>
        </div>

        {/* Existing badge design */}
        <div
          style={{
            width: "256px",
            height: "400px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#9333ea",
            color: "white",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Top banner */}
          <div
            style={{
              position: "absolute",
              top: "-32px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "32px",
              backgroundColor: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", fontSize: "8px" }}>
              RENDER CON &apos;24
            </div>
          </div>

          {/* Main content */}
          <div
            style={{
              padding: "16px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              RENDER CON &apos;24
            </div>
            <div
              style={{
                display: "flex",
                width: "24px",
                height: "24px",
                border: "2px solid white",
                borderRadius: "50%",
                marginBottom: "32px",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {user?.socialCard?.name}
            </div>
            <div style={{ display: "flex", fontSize: "14px" }}>
              {user?.socialCard?.profession}
            </div>
            <div
              style={{ display: "flex", fontSize: "12px", color: "#e5e7eb" }}
            >
              {user?.socialCard?.companyName}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#1f2937",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
              }}
            >
              <img
                // @ts-ignore
                src={logoSrc}
                alt="Clerk"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
              />
            </div>
            <div
              style={{ display: "flex", color: "#9333ea", fontSize: "20px" }}
            >
              #{user?.number.toString().padStart(3, "0")}
            </div>
          </div>

          {/* Bottom clip */}
          <div
            style={{
              position: "absolute",
              bottom: "-16px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "64px",
              height: "32px",
              backgroundColor: "black",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    {
      height: 630,
      width: 1200,
    }
  );
}
