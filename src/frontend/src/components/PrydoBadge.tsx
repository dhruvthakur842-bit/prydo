import { motion } from "motion/react";
import type React from "react";

export interface PrydoBadgeProps {
  variant: "genesis" | "member";
  name: string;
  pronouns: string;
  avatarContent: React.ReactNode;
  votingPower?: number;
  reputation?: number;
  joinedYear?: number;
  isPreview?: boolean;
}

function GenesisWingsAndGem() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: -28,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        pointerEvents: "none",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="wingGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE599" />
          <stop offset="40%" stopColor="#F5C84C" />
          <stop offset="100%" stopColor="#A07010" />
        </linearGradient>
        <linearGradient id="wingGoldR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE599" />
          <stop offset="40%" stopColor="#F5C84C" />
          <stop offset="100%" stopColor="#A07010" />
        </linearGradient>
        <radialGradient id="gemGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="20%" stopColor="#a8f0e0" />
          <stop offset="45%" stopColor="#9b59f0" />
          <stop offset="70%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#5b21b6" stopOpacity="0.7" />
        </radialGradient>
        <filter id="gemGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="wingGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* LEFT WING */}
      <g filter="url(#wingGlow)">
        {/* Main wing body */}
        <path
          d="M160,54 C140,48 110,35 75,28 C50,22 25,24 10,30 C30,32 55,38 80,50 C105,62 135,70 160,68 Z"
          fill="url(#wingGold)"
          opacity="0.95"
        />
        {/* Wing feather lines */}
        <path
          d="M160,54 C145,46 120,34 90,28"
          stroke="#FFE599"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M155,58 C138,52 108,42 75,36"
          stroke="#F5C84C"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M150,63 C130,58 100,50 65,44"
          stroke="#D4A820"
          strokeWidth="0.7"
          fill="none"
          opacity="0.45"
        />
        {/* Secondary wing blade */}
        <path
          d="M160,54 C145,42 125,28 100,18 C80,10 55,8 35,14 C60,16 90,26 115,42 C135,54 150,60 160,60 Z"
          fill="url(#wingGold)"
          opacity="0.7"
        />
        {/* Tertiary narrow blade */}
        <path
          d="M160,52 C148,38 132,22 112,12 C95,4 72,2 52,8 C76,10 102,20 124,36 Z"
          fill="#FFE599"
          opacity="0.4"
        />
      </g>

      {/* RIGHT WING (mirrored) */}
      <g filter="url(#wingGlow)" transform="scale(-1,1) translate(-320,0)">
        <path
          d="M160,54 C140,48 110,35 75,28 C50,22 25,24 10,30 C30,32 55,38 80,50 C105,62 135,70 160,68 Z"
          fill="url(#wingGoldR)"
          opacity="0.95"
        />
        <path
          d="M160,54 C145,46 120,34 90,28"
          stroke="#FFE599"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M155,58 C138,52 108,42 75,36"
          stroke="#F5C84C"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M150,63 C130,58 100,50 65,44"
          stroke="#D4A820"
          strokeWidth="0.7"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M160,54 C145,42 125,28 100,18 C80,10 55,8 35,14 C60,16 90,26 115,42 C135,54 150,60 160,60 Z"
          fill="url(#wingGoldR)"
          opacity="0.7"
        />
        <path
          d="M160,52 C148,38 132,22 112,12 C95,4 72,2 52,8 C76,10 102,20 124,36 Z"
          fill="#FFE599"
          opacity="0.4"
        />
      </g>

      {/* CRYSTAL GEM at center top */}
      <g filter="url(#gemGlow)" transform="translate(160,10)">
        {/* Outer facets */}
        <polygon
          points="0,-22 12,-8 8,10 -8,10 -12,-8"
          fill="url(#gemGrad)"
          opacity="0.95"
        />
        {/* Inner highlight facets */}
        <polygon points="0,-22 12,-8 0,-2" fill="#ffffff" opacity="0.35" />
        <polygon points="0,-22 -12,-8 0,-2" fill="#a8f0e0" opacity="0.25" />
        <polygon points="12,-8 8,10 0,-2" fill="#9b59f0" opacity="0.4" />
        <polygon points="-12,-8 -8,10 0,-2" fill="#22d3ee" opacity="0.35" />
        <polygon points="8,10 -8,10 0,-2" fill="#5b21b6" opacity="0.5" />
        {/* Sparkle dots */}
        <circle cx="-6" cy="-18" r="1.2" fill="white" opacity="0.9" />
        <circle cx="8" cy="-14" r="0.8" fill="white" opacity="0.7" />
        <circle cx="-10" cy="-6" r="0.7" fill="#a8f0e0" opacity="0.8" />
        <circle cx="10" cy="2" r="0.6" fill="#FF9EEF" opacity="0.8" />
        {/* Gem outline */}
        <polygon
          points="0,-22 12,-8 8,10 -8,10 -12,-8"
          fill="none"
          stroke="#FFE599"
          strokeWidth="0.8"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

function RainbowTopOrnament() {
  const colors = [
    "#FF0018",
    "#FF8C00",
    "#FFE400",
    "#008018",
    "#0000F8",
    "#86007D",
  ];
  const stripeH = 5;
  const totalH = colors.length * stripeH;
  const stripW = 80;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${stripW} ${totalH + 16}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: -(totalH + 8),
        left: "50%",
        transform: "translateX(-50%)",
        width: stripW,
        pointerEvents: "none",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="silverStem" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <rect
        x={stripW / 2 - 2}
        y={totalH}
        width="4"
        height="16"
        fill="url(#silverStem)"
        rx="2"
      />
      {/* Rainbow stripes */}
      {colors.map((color, i) => (
        <rect
          key={color}
          x="0"
          y={i * stripeH}
          width={stripW}
          height={stripeH}
          fill={color}
          rx={i === 0 ? 3 : 0}
        />
      ))}
      {/* Shine */}
      <rect
        x="0"
        y="0"
        width={stripW}
        height={totalH}
        fill="white"
        opacity="0.15"
        rx="3"
      />
    </svg>
  );
}

function RainbowCornerTab({ side }: { side: "left" | "right" }) {
  const colors = [
    "#FF0018",
    "#FF8C00",
    "#FFE400",
    "#008018",
    "#0000F8",
    "#86007D",
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: -6,
        [side]: 8,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        zIndex: 10,
      }}
    >
      {colors.map((c) => (
        <div
          key={c}
          style={{
            width: 10,
            height: 3,
            backgroundColor: c,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

export default function PrydoBadge({
  variant,
  name,
  pronouns,
  avatarContent,
  votingPower = 150,
  reputation = 75,
  joinedYear = 2024,
  isPreview = false,
}: PrydoBadgeProps) {
  const cardW = isPreview ? 200 : 280;
  const cardH = isPreview ? 272 : 382;
  const scale = isPreview ? 200 / 280 : 1;

  if (variant === "genesis") {
    return (
      <motion.div
        whileHover={isPreview ? {} : { y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: cardW,
          height: cardH,
          position: "relative",
          borderRadius: 18,
          flexShrink: 0,
          // Outer gold glow
          boxShadow:
            "0 0 40px rgba(245,200,76,0.55), 0 0 80px rgba(245,200,76,0.2), 0 8px 32px rgba(0,0,0,0.7)",
          // Multi-layer gold border via outline trick
          outline: "2px solid rgba(255,230,100,0.6)",
          outlineOffset: 3,
        }}
      >
        {/* Wings + gem ornament */}
        {!isPreview && <GenesisWingsAndGem />}
        {isPreview && (
          <div
            style={{
              position: "absolute",
              top: -10,
              left: "50%",
              transform: "translateX(-50%) scale(0.7)",
              zIndex: 10,
              transformOrigin: "bottom center",
            }}
          >
            <svg
              aria-hidden="true"
              width="160"
              height="50"
              viewBox="0 0 320 100"
              overflow="visible"
            >
              <defs>
                <linearGradient
                  id="wingGold2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFE599" />
                  <stop offset="50%" stopColor="#F5C84C" />
                  <stop offset="100%" stopColor="#A07010" />
                </linearGradient>
              </defs>
              <path
                d="M160,54 C140,48 110,35 75,28 C50,22 25,24 10,30 C30,32 55,38 80,50 C105,62 135,70 160,68 Z"
                fill="url(#wingGold2)"
                opacity="0.95"
              />
              <g transform="scale(-1,1) translate(-320,0)">
                <path
                  d="M160,54 C140,48 110,35 75,28 C50,22 25,24 10,30 C30,32 55,38 80,50 C105,62 135,70 160,68 Z"
                  fill="url(#wingGold2)"
                  opacity="0.95"
                />
              </g>
              <g transform="translate(160,14)">
                <polygon
                  points="0,-16 9,-6 6,8 -6,8 -9,-6"
                  fill="#9b59f0"
                  opacity="0.9"
                />
                <polygon points="0,-16 9,-6 0,-1" fill="#fff" opacity="0.4" />
                <polygon
                  points="0,-16 -9,-6 0,-1"
                  fill="#22d3ee"
                  opacity="0.3"
                />
              </g>
            </svg>
          </div>
        )}

        {/* Main card */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 18,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            // Gold border
            border: "3px solid #D4A820",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Inner gold line border */}
          <div
            style={{
              position: "absolute",
              inset: 5,
              borderRadius: 13,
              border: "1px solid rgba(255,230,100,0.5)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* Gold corner ornaments */}
          {[
            ["top", "left"],
            ["top", "right"],
            ["bottom", "left"],
            ["bottom", "right"],
          ].map(([v, h]) => (
            <div
              key={`${v}-${h}`}
              style={{
                position: "absolute",
                [v]: 4,
                [h]: 4,
                width: 20,
                height: 20,
                borderTop: v === "top" ? "3px solid #F5C84C" : "none",
                borderBottom: v === "bottom" ? "3px solid #F5C84C" : "none",
                borderLeft: h === "left" ? "3px solid #F5C84C" : "none",
                borderRight: h === "right" ? "3px solid #F5C84C" : "none",
                borderRadius:
                  v === "top" && h === "left"
                    ? "6px 0 0 0"
                    : v === "top" && h === "right"
                      ? "0 6px 0 0"
                      : v === "bottom" && h === "left"
                        ? "0 0 0 6px"
                        : "0 0 6px 0",
                zIndex: 6,
              }}
            />
          ))}

          {/* Art area — deep space */}
          <div
            style={{
              flex: 1,
              background:
                "radial-gradient(ellipse at 50% 40%, #3d1578 0%, #1a0a5e 35%, #0a0020 100%)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Nebula wisps */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 70% 40% at 30% 60%, rgba(255,100,200,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 30%, rgba(34,211,238,0.13) 0%, transparent 60%)",
              }}
            />
            {/* Stars */}
            {[...Array(18)]
              .map(
                (_, i) => `star-pos-${(i * 17 + 7) % 95}-${(i * 23 + 11) % 95}`,
              )
              .map((key, i) => (
                <div
                  key={key}
                  style={{
                    position: "absolute",
                    width: i % 4 === 0 ? 2 : 1,
                    height: i % 4 === 0 ? 2 : 1,
                    borderRadius: "50%",
                    background: "white",
                    opacity: 0.4 + (i % 5) * 0.12,
                    top: `${(i * 17 + 7) % 95}%`,
                    left: `${(i * 23 + 11) % 95}%`,
                  }}
                />
              ))}
            {/* Avatar */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                transform: `scale(${scale})`,
                transformOrigin: "center",
              }}
            >
              {avatarContent}
            </div>
            {/* Name plate */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(5,2,20,0.82)",
                backdropFilter: "blur(6px)",
                padding: "8px 12px",
                zIndex: 3,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: isPreview ? 13 : 17,
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                {name}
              </p>
              <p
                style={{
                  margin: 0,
                  fontWeight: 400,
                  fontSize: isPreview ? 9 : 11,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 2,
                }}
              >
                {pronouns}
              </p>
            </div>
          </div>

          {/* GENESIS ribbon */}
          <div
            style={{
              background:
                "linear-gradient(90deg, #A07010 0%, #D4A820 25%, #F5C84C 50%, #FFE566 70%, #D4A820 100%)",
              padding: isPreview ? "5px 0" : "7px 0",
              textAlign: "center",
              position: "relative",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)",
            }}
          >
            <span
              style={{
                fontWeight: 900,
                fontSize: isPreview ? 11 : 15,
                letterSpacing: "0.25em",
                color: "#3D1F00",
                textShadow: "0 1px 1px rgba(255,220,100,0.6)",
              }}
            >
              ✦ GENESIS ✦
            </span>
          </div>

          {/* Stats row */}
          <div
            style={{
              background: "rgba(5,2,20,0.95)",
              padding: isPreview ? "5px 8px" : "7px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: isPreview ? 11 : 14 }}>🌈</span>
              <span
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: isPreview ? 8 : 10,
                  fontWeight: 600,
                }}
              >
                LGBTQ+ Pioneer
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: isPreview ? 11 : 13 }}>⭐</span>
              <span
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: isPreview ? 8 : 10,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Voting Power {votingPower}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Member variant
  return (
    <motion.div
      whileHover={isPreview ? {} : { y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        width: cardW,
        height: cardH,
        position: "relative",
        borderRadius: 18,
        flexShrink: 0,
        boxShadow:
          "0 0 30px rgba(148,163,184,0.35), 0 0 60px rgba(148,163,184,0.12), 0 8px 32px rgba(0,0,0,0.6)",
        outline: "2px solid rgba(200,215,230,0.35)",
        outlineOffset: 3,
      }}
    >
      {/* Rainbow flag top center ornament */}
      {!isPreview && <RainbowTopOrnament />}
      {/* Rainbow corner tabs */}
      {!isPreview && <RainbowCornerTab side="left" />}
      {!isPreview && <RainbowCornerTab side="right" />}
      {isPreview && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            zIndex: 10,
          }}
        >
          {[
            "#FF0018",
            "#FF8C00",
            "#FFE400",
            "#008018",
            "#0000F8",
            "#86007D",
          ].map((c) => (
            <div
              key={c}
              style={{
                width: 40,
                height: 3,
                backgroundColor: c,
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      )}

      {/* Main card */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 18,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: "3px solid #94A3B8",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Inner silver line border */}
        <div
          style={{
            position: "absolute",
            inset: 5,
            borderRadius: 13,
            border: "1px solid rgba(203,213,225,0.4)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />

        {/* Geometric corner notches */}
        {[
          ["top", "left"],
          ["top", "right"],
          ["bottom", "left"],
          ["bottom", "right"],
        ].map(([v, h]) => (
          <div
            key={`${v}-${h}`}
            style={{
              position: "absolute",
              [v]: 4,
              [h]: 4,
              width: 18,
              height: 18,
              borderTop: v === "top" ? "2px solid #CBD5E1" : "none",
              borderBottom: v === "bottom" ? "2px solid #CBD5E1" : "none",
              borderLeft: h === "left" ? "2px solid #CBD5E1" : "none",
              borderRight: h === "right" ? "2px solid #CBD5E1" : "none",
              borderRadius:
                v === "top" && h === "left"
                  ? "5px 0 0 0"
                  : v === "top" && h === "right"
                    ? "0 5px 0 0"
                    : v === "bottom" && h === "left"
                      ? "0 0 0 5px"
                      : "0 0 5px 0",
              zIndex: 6,
            }}
          />
        ))}

        {/* Art area — blue sunburst */}
        <div
          style={{
            flex: 1,
            background:
              "radial-gradient(ellipse at 50% 45%, #0077e6 0%, #0044aa 45%, #001a5e 100%)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Sunburst rays */}
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.25,
            }}
            viewBox="0 0 280 320"
            preserveAspectRatio="xMidYMid slice"
          >
            {[...Array(16)]
              .map((_, i) => i)
              .map((i) => {
                const angle = (i * 360) / 16;
                const rad = (angle * Math.PI) / 180;
                const x2 = 140 + Math.cos(rad) * 280;
                const y2 = 160 + Math.sin(rad) * 280;
                return (
                  <line
                    key={`ray-angle-${angle}`}
                    x1="140"
                    y1="160"
                    x2={x2}
                    y2={y2}
                    stroke="white"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                );
              })}
          </svg>
          {/* Radial glow over rays */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 55% 55% at 50% 48%, rgba(0,120,230,0.7) 0%, transparent 65%)",
            }}
          />
          {/* Avatar */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              transform: `scale(${scale})`,
              transformOrigin: "center",
            }}
          >
            {avatarContent}
          </div>
          {/* Name plate */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0,10,40,0.82)",
              backdropFilter: "blur(6px)",
              padding: "8px 12px",
              zIndex: 3,
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: isPreview ? 13 : 17,
                color: "white",
                lineHeight: 1.2,
              }}
            >
              {name}
            </p>
            <p
              style={{
                margin: 0,
                fontWeight: 400,
                fontSize: isPreview ? 9 : 11,
                color: "rgba(255,255,255,0.65)",
                marginTop: 2,
              }}
            >
              {pronouns}
            </p>
          </div>
        </div>

        {/* Tier label */}
        <div
          style={{
            background:
              "linear-gradient(90deg, #475569 0%, #64748B 40%, #94A3B8 70%, #64748B 100%)",
            padding: isPreview ? "5px 0" : "7px 0",
            textAlign: "center",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)",
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: isPreview ? 10 : 13,
              letterSpacing: "0.2em",
              color: "#F1F5F9",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            ◈ PRYDO MEMBER ◈
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            background: "rgba(0,5,25,0.95)",
            padding: isPreview ? "5px 8px" : "7px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: isPreview ? 11 : 13 }}>💎</span>
            <span
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: isPreview ? 8 : 10,
                fontWeight: 600,
              }}
            >
              Joined {joinedYear}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: isPreview ? 11 : 13 }}>🌈</span>
            <span
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: isPreview ? 8 : 10,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Reputation: {reputation}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
