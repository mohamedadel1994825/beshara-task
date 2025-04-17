export interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity:number
    description: string;
    rating?: {
      rate: number;
      count: number;
    };
  }