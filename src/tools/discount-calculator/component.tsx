"use client";
import FormToResult from "@/tools/templates/FormToResult";
import { config } from "./config";
import { process } from "./logic";

export default function DiscountCalculatorTool() {
  return <FormToResult tool={config} process={process} />;
}
