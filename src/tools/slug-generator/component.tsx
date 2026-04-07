"use client";

import TextToText from "@/tools/templates/TextToText";
import { config } from "./config";
import { process } from "./logic";

export default function SlugGeneratorTool() {
  return <TextToText tool={config} process={process} />;
}
