import { ImageSourcePropType } from "react-native";
import { icons } from "@/constants/icons";

interface BrandConfig {
  icon: ImageSourcePropType;
  color: string;
}

const brandIcons: Record<string, BrandConfig> = {
  netflix: { icon: icons.wallet, color: "#E50914" },
  spotify: { icon: icons.spotify, color: "#1DB954" },
  youtube: { icon: icons.wallet, color: "#FF0000" },
  icloud: { icon: icons.wallet, color: "#3478F6" },
  chatgpt: { icon: icons.openai, color: "#10a37f" },
  openai: { icon: icons.openai, color: "#10a37f" },
  adobe: { icon: icons.adobe, color: "#FF0000" },
  figma: { icon: icons.figma, color: "#F24E1E" },
  "disney+": { icon: icons.wallet, color: "#113CCF" },
  disney: { icon: icons.wallet, color: "#113CCF" },
  notion: { icon: icons.notion, color: "#000000" },
  dropbox: { icon: icons.dropbox, color: "#0061FF" },
  github: { icon: icons.github, color: "#24292e" },
  claude: { icon: icons.claude, color: "#e16a3f" },
  canva: { icon: icons.canva, color: "#00C4CC" },
  medium: { icon: icons.medium, color: "#292929" },
};

export function getBrandConfig(name: string): BrandConfig | null {
  return brandIcons[name.toLowerCase().trim()] ?? null;
}
