interface Post {
  id: number;
  url: string;
  title: string;
  description: string;
  computedDescription: string;
  content: string;
  publicationDate: Date;
  categoryId: number;
  category: Category;
  tags: string[];
}
interface PostList {
  posts: Post[];
  currentPageIndex: number;
  totalPageNumber: number;
}
