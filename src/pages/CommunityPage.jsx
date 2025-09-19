import React from "react";
import discordLogo from "../assets/discord-logo.png";
import whatsappLogo from "../assets/whatsapp-logo.png";

export default function CommunityPage() {
  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(ellipse 70% 60% at 70% 90%, #e8f0ff 0%, #f8faff 70%)"
    }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          boxShadow: "0 10px 42px 0 rgba(88,101,242,0.12), 0 2px 10px 0 rgba(34,54,99,0.08)",
          padding: "54px 44px 38px 44px",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          position: "relative",
          border: "1.5px solid #eceefd",
          animation: "popIn 0.8s cubic-bezier(.23,1.23,.32,1) 1"
        }}
      >
        {/* Creative floating planet and sparkles */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "-38px",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <svg width="56" height="32" viewBox="0 0 56 32" fill="none">
            <ellipse cx="28" cy="16" rx="24" ry="9" fill="#e5eefd" />
            <ellipse cx="28" cy="16" rx="15" ry="5" fill="#d6eaff" />
            {/* Saturn-like planet */}
            <g>
              <ellipse cx="40" cy="9" rx="6" ry="6" fill="#ffe18f" />
              <ellipse cx="40" cy="9" rx="8" ry="3" fill="#ffe18f88" transform="rotate(-13 40 9)" />
              <ellipse cx="40" cy="9" rx="8" ry="2" fill="#f7c87377" transform="rotate(14 40 9)" />
            </g>
            {/* Sparkles */}
            <g>
              <circle cx="16" cy="7" r="1.3" fill="#b1f0f6" />
              <circle cx="49" cy="23" r="0.9" fill="#ffc1c1" />
              <circle cx="12" cy="23" r="0.7" fill="#b2ffd6" />
              <circle cx="32" cy="4" r="0.8" fill="#ffe18f" />
            </g>
          </svg>
        </div>
        {/* Main heading and subtitle */}
        <h2 style={{
          color: "#222548",
          fontWeight: 900,
          fontSize: 28,
          margin: 0,
          marginBottom: 8,
          letterSpacing: "-0.5px",
          textShadow: "0 2px 8px #f3f3f9"
        }}>
          <span role="img" aria-label="rocket">🚀</span> Welcome to the <span style={{color: "#5865f2"}}>Community!</span>
        </h2>
        <div style={{
          color: "#5a627a",
          fontSize: 17,
          marginBottom: 8,
          fontWeight: 500
        }}>
          Connect, share ideas, and collaborate with others in <span style={{color: "#5865f2", fontWeight: 700}}>CareerFlow</span>.
        </div>
        {/* Buttons */}
        <div style={{
          margin: "35px 0 15px 0",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <a
            href="https://discord.gg/FwE77yWh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#5865F2",
              color: "#fff",
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 12,
              padding: "13px 0",
              textDecoration: "none",
              boxShadow: "0 2px 14px rgba(88,101,242,0.13)",
              transition: "background 0.15s, transform 0.13s",
              cursor: "pointer",
              border: "none"
            }}
            onMouseOver={e => e.currentTarget.style.background = "#4752c4"}
            onMouseOut={e => e.currentTarget.style.background = "#5865F2"}
          >
            <img
              src={discordLogo}
              alt="Discord"
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "#fff",
                padding: 3,
                boxShadow: "0 1px 3px #5865f233",
                objectFit: "contain"
              }}
            />
            Join our Discord Community
          </a>
          <a
            href="https://whatsapp.com/channel/0029VbBCk3IEKyZJYSKGog1s"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#25D366",
              color: "#fff",
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 12,
              padding: "13px 0",
              textDecoration: "none",
              boxShadow: "0 2px 14px rgba(37,211,102,0.13)",
              transition: "background 0.15s, transform 0.13s",
              cursor: "pointer",
              border: "none"
            }}
            onMouseOver={e => e.currentTarget.style.background = "#1ba94c"}
            onMouseOut={e => e.currentTarget.style.background = "#25D366"}
          >
            <img
              src={whatsappLogo}
              alt="WhatsApp"
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "#fff",
                padding: 3,
                boxShadow: "0 1px 3px #25d36633",
                objectFit: "contain"
              }}
            />
            Join our WhatsApp Community
          </a>
        </div>
        {/* Feature update note */}
        <div style={{
          color: "#a2a8c9",
          fontSize: 15,
          marginTop: 22,
          marginBottom: -6,
          fontWeight: 500,
          letterSpacing: "0.01em"
        }}>
          <span style={{fontWeight: 600}}>Feature updates coming soon!</span>
          <br />
          You&apos;ll be able to post, comment, and join discussions here.
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.88) translateY(30px); opacity: 0; }
          70% { transform: scale(1.03) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}