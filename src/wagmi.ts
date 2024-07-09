import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

// Infer the return type of getDefaultConfig
type RainbowKitConfig = ReturnType<typeof getDefaultConfig>;

export const config: RainbowKitConfig = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: [sepolia],
});
