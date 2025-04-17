<!-- # Beshara Store

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
- DND KIT

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

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->
# 🛒 Beshara Store

**Beshara Store** is a modern and fully responsive e-commerce web application built using **Next.js**, **TypeScript**, **Material-UI**, and **Redux Toolkit**.

---

## 🚀 Features

- 🔐 User registration & authentication  
- 🛕️ Product catalog with category filtering  
- 📦 Detailed product view  
- 🛒 Shopping cart with drag-and-drop support  
- 📱 Responsive design for mobile and desktop  
- ✅ Form validation with React Hook Form + Yup  
- ⚡ Optimized data fetching with React Query  

---

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Material-UI (MUI)
- **Forms**: React Hook Form + Yup
- **Data Fetching**: React Query
- **HTTP Client**: Axios
- **Drag and Drop**: DND Kit

---

## 📁 Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable components
├── hooks/            # Custom hooks
├── middleware/       # Custom middleware
├── schemas/          # Schema validation with Yup
├── store/            # Redux store configuration and slices
├── styles/           # Global styles
└── types/            # TypeScript type definitions


---

## 📡 API Endpoints

This project uses the [Fake Store API](https://fakestoreapi.com/):

- 💂 Categories: `GET /products/categories`
- 📦 Products by Category: `GET /products/category/{category}`
- 📄 Product Details: `GET /products/{id}`

---

## 🛠️ Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/beshara-store.git
   cd beshara-store
   ```

2. **Install dependencies**  
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**  
   ```bash
   npm run dev
   ```

4. **Open in browser**  
   [http://localhost:3000](http://localhost:3000)

---

## 🌠 Fonts

Beshara Store uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load [Geist](https://vercel.com/font), optimized for performance.

---

## 📦 Deployment

Deploy effortlessly on [Vercel](https://vercel.com):

- Automatic CI/CD integration
- Optimized performance
- Built-in analytics

Learn more in the [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Docs](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)

---

