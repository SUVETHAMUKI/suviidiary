import { spawn } from "child_process";
import http from "http";

console.log("🌸 ======================================================== 🌸");
console.log("   Suvii Diary — Option 1B: Instant Public Share Tunnel");
console.log("🌸 ======================================================== 🌸\n");

// Check if Next.js dev server is running on port 3000
const req = http.get("http://localhost:3000", (res) => {
  console.log("✅ Detected local server running on http://localhost:3000 !");
  startTunnel();
});

req.on("error", () => {
  console.log("⏳ Local server not detected on port 3000.");
  console.log("🚀 Starting Suvii Diary Dev Server (next dev) in background...");

  const devServer = spawn("npm", ["run", "dev", "--", "-H", "0.0.0.0"], {
    stdio: "inherit",
    shell: true,
  });

  setTimeout(() => {
    startTunnel();
  }, 4000);
});

function startTunnel() {
  console.log("\n🌐 Creating free public HTTPS share link using LocalTunnel...");
  console.log("💡 You can send the URL below to ANYONE on Mobile or Desktop!\n");

  const tunnel = spawn("npx", ["-y", "localtunnel", "--port", "3000"], {
    stdio: "inherit",
    shell: true,
  });

  tunnel.on("close", (code) => {
    console.log(`Tunnel closed with code ${code}`);
  });
}
