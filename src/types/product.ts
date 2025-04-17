// export interface Product {
//     id: number;
//     title: string;
//     price: number;
//     image: string;
//     quantity:number
//     description: string;
//     rating?: {
//       rate: number;
//       count: number;
//     };
// }
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    quantity: number;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}