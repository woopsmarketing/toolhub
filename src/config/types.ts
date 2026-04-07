export type TemplateType = "TextToText" | "FormToResult" | "LivePreview" | "FileToFile" | "Custom";
export type ProcessingType = "client" | "server";

export interface FaqItem {
  q: string;
  a: string;
}

export interface UseCase {
  title: string;
  description: string;
  example?: {
    input: string;
    output: string;
  };
}

export interface InputFieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export interface ToolConfig {
  slug: string;
  category: string;
  template: TemplateType;
  processingType: ProcessingType;
  icon: string;

  // TextToText template config
  inputConfig?: {
    placeholder?: string;
    inputLabel?: string;
    outputLabel?: string;
    inputType?: "text" | "code";
    outputType?: "text" | "code" | "stats";
  };

  // FormToResult template config
  formFields?: InputFieldConfig[];
  resultLabels?: { key: string; label: string; suffix?: string }[];

  // SEO landing page content (per locale)
  seo: {
    [locale: string]: {
      title: string;
      description: string;
      keywords: string[];
    };
  };

  howToUse: {
    [locale: string]: string[];
  };

  features: {
    [locale: string]: string[];
  };

  useCases?: {
    [locale: string]: UseCase[];
  };

  guide?: {
    [locale: string]: {
      title: string;
      content: string;
    };
  };

  faq: {
    [locale: string]: FaqItem[];
  };

  relatedTools: string[];
}
