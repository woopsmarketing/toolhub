"use client";

import FormToVisual from "@/tools/templates/FormToVisual";
import { config } from "./config";
import { process } from "./logic";

export default function QrCodeGeneratorTool() {
  return <FormToVisual tool={config} process={process} />;
}
