export interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  images: string[];
  category: string;
  type: string
  specs: string[];
  reviews: number;
  rating: number;
  description: string,
  comments: Comment[]
}
export interface IUser{
  fullName: string,
  password: string,
  email: string,
  id: string,
  profilePicture: string,
  OrderHistory: {ProductName: String, price: Number}[],
  bio: string,
  cart: {ProductName: String, price: Number}
}
export interface Comment{
  author?: string | undefined
  content: string
  profilePicture?: string | undefined
  rating: number
  title: string,
  date: string
}