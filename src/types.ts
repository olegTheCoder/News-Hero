export interface NewsItem {
  id: string;
  category: string;
  categoryColor: "secondary" | "primary" | "default";
  time: string;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
}
