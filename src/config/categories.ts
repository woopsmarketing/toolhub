export interface Category {
  slug: string;
  icon: string;
  color: string;
}

export const categories: Record<string, Category> = {
  text: {
    slug: "text",
    icon: "Type",
    color: "#3B82F6",
  },
  developer: {
    slug: "developer",
    icon: "Code",
    color: "#8B5CF6",
  },
  calculator: {
    slug: "calculator",
    icon: "Calculator",
    color: "#10B981",
  },
  converter: {
    slug: "converter",
    icon: "ArrowLeftRight",
    color: "#F59E0B",
  },
  generator: {
    slug: "generator",
    icon: "Sparkles",
    color: "#EC4899",
  },
  image: {
    slug: "image",
    icon: "Image",
    color: "#06B6D4",
  },
  pdf: {
    slug: "pdf",
    icon: "FileText",
    color: "#EF4444",
  },
} as const;

export const categoryOrder = [
  "text",
  "developer",
  "calculator",
  "converter",
  "generator",
  "image",
  "pdf",
];
