# E-commerce Store

A modern e-commerce web application built with Next.js, Redux Toolkit, and Material-UI.

## Features

- User registration and authentication
- Product catalog with categories
- Product details page
- Shopping cart with drag-and-drop functionality
- Responsive design for all devices

## Tech Stack

- Next.js
- TypeScript
- Redux Toolkit
- Material-UI
- React Hook Form
- Yup
- React Query
- Axios
- React Beautiful DnD

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable components
├── features/         # Redux slices
├── hooks/           # Custom hooks
├── lib/             # Utility functions and API clients
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## API Endpoints

The application uses the Fake Store API:

- Categories: https://fakestoreapi.com/products/categories
- Products by category: https://fakestoreapi.com/products/category/{category}
- Product details: https://fakestoreapi.com/products/{id}

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
