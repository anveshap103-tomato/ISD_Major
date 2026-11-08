import React from 'react';

/**
 * Editorial Illustration: Human Connection, Networking & Knowledge Sharing
 * Palette: Forest Green (#28634F), Sage (#DCE8E0, #8FAFA0), Warm Amber (#D9A66C), Cream (#F7F5EF)
 */
export default function HeroArtwork() {
  return (
    <div className="relative w-full max-w-[460px] pointer-events-none select-none flex items-center justify-end">
      <svg
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-h-[250px] object-contain drop-shadow-sm"
      >
        <defs>
          {/* Subtle Arch Clip */}
          <clipPath id="editorialFrame">
            <path d="M40 300 C40 140, 160 20, 310 20 C435 20, 485 110, 485 300 Z" />
          </clipPath>

          {/* Gradients */}
          <linearGradient id="canvasGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EBF2ED" />
            <stop offset="65%" stopColor="#F4F7F4" />
            <stop offset="100%" stopColor="#F7F5EF" />
          </linearGradient>

          <linearGradient id="forestProfile" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E4D3D" />
            <stop offset="100%" stopColor="#28634F" />
          </linearGradient>

          <linearGradient id="sageProfile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DA491" />
            <stop offset="100%" stopColor="#4A7562" />
          </linearGradient>

          <linearGradient id="amberGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2B47F" />
            <stop offset="100%" stopColor="#D9A66C" />
          </linearGradient>

          <linearGradient id="softMist" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F7F5EF" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#F7F5EF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Framing Group */}
        <g clipPath="url(#editorialFrame)">
          {/* Background Wash */}
          <rect width="500" height="300" fill="url(#canvasGrad)" />

          {/* Abstract Connection Arcs / Orbit Rays */}
          <circle cx="370" cy="115" r="95" stroke="#DCE8E0" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="370" cy="115" r="65" stroke="#C5DACE" strokeWidth="1.5" />
          <circle cx="370" cy="115" r="40" stroke="#B2CEBE" strokeWidth="1.5" />

          {/* Warm Amber Sun / Knowledge Nexus */}
          <circle cx="370" cy="115" r="32" fill="url(#amberGlow)" />
          {/* Radiating beacon ring */}
          <circle cx="370" cy="115" r="38" stroke="#D9A66C" strokeWidth="1" opacity="0.6" strokeDasharray="3 3" />

          {/* Tertiary Connecting Form: Mentorship Bridge Arc */}
          <path
            d="M170 300 C170 190, 240 140, 370 115"
            stroke="#28634F"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 6"
            opacity="0.4"
          />

          {/* Distant Stylized Human Silhouette (Looking Right toward Nexus) */}
          <g opacity="0.85">
            {/* Head Circle */}
            <circle cx="215" cy="130" r="24" fill="url(#sageProfile)" />
            {/* Contoured Profile / Torso Form */}
            <path
              d="M140 300 C140 230, 180 185, 220 185 C245 185, 275 220, 285 300 Z"
              fill="url(#sageProfile)"
            />
          </g>

          {/* Central Knowledge Wave & Exchange Ribbons */}
          <path
            d="M190 300 C210 210, 290 190, 360 170 C410 155, 450 180, 485 240 L485 300 Z"
            fill="#B9D4C5"
            opacity="0.6"
          />

          {/* Primary Foreground Human Silhouette (Creator / Innovator, Left-Facing / Collaborative) */}
          <g>
            {/* Head Silhouette with sculpted profile contour */}
            <path
              d="M345 80 C362 80, 375 94, 375 112 C375 125, 368 136, 356 142 L356 152 C356 156, 352 160, 347 160 C340 160, 332 153, 332 144 C320 140, 312 128, 312 112 C312 94, 327 80, 345 80 Z"
              fill="url(#forestProfile)"
            />
            {/* Elegant Torso & Shoulders Silhouette */}
            <path
              d="M260 300 C265 240, 305 190, 348 190 C395 190, 440 235, 455 300 Z"
              fill="url(#forestProfile)"
            />
          </g>

          {/* Network Nodes & Intersecting Thought Lines */}
          <g>
            {/* Connection Line 1: Creator to Knowledge Nexus */}
            <line x1="345" y1="112" x2="370" y2="115" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="345" cy="112" r="3.5" fill="#FFFFFF" />

            {/* Connection Line 2: Creator to Peer Silhouette */}
            <path
              d="M332 144 C280 148, 250 135, 225 132"
              stroke="#D9A66C"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="225" cy="132" r="4" fill="#D9A66C" />
            <circle cx="332" cy="144" r="3.5" fill="#D9A66C" />

            {/* Micro Networking Dot Constellation */}
            <circle cx="280" cy="100" r="3" fill="#28634F" opacity="0.6" />
            <circle cx="295" cy="85" r="2" fill="#D9A66C" opacity="0.8" />
            <circle cx="305" cy="120" r="2.5" fill="#28634F" opacity="0.5" />
            <circle cx="410" cy="160" r="3" fill="#D9A66C" opacity="0.7" />
            <circle cx="430" cy="135" r="2.5" fill="#28634F" opacity="0.4" />

            <line x1="280" y1="100" x2="295" y2="85" stroke="#B0C8BC" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="295" y1="85" x2="345" y2="80" stroke="#B0C8BC" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* Organic Grounding Horizon Contour */}
          <path
            d="M40 300 C150 265, 320 270, 485 285 L485 300 Z"
            fill="#1E4D3D"
            opacity="0.3"
          />
        </g>

        {/* Soft edge feathering on left boundary */}
        <rect x="0" y="0" width="100" height="300" fill="url(#softMist)" />
      </svg>
    </div>
  );
}
