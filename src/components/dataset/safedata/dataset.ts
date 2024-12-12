interface SubCategory {
    id: number;
    name: string;
    description: string;
    count: number;
    thumbnail: string;
  }
  
  interface MainCategory {
    id: number;
    name: string;
    description: string;
    subCategories: SubCategory[];
    icon: string;
  }