export interface NewsItem {
  id: string;
  category: string;
  categoryColor: "secondary" | "primary" | "default";
  time: string;
  title: string;
  image: string;
  imageAlt: string;
}
