**🛒 Beshara Store**
**Live Demo**: https://beshara-store-2.vercel.app

**Beshara Store** is a modern and fully responsive e-commerce web application built using **Next.js**, **TypeScript**, **Material-UI**, **Tailwind CSS**,  **yup**, **react-hook-form** and **Redux Toolkit**.

---

## 🚀 Features

- 🔐 User registration & authentication
- 🛕️ Product catalog with category filtering
- 📦 Detailed product view
- 🛒 Shopping cart with drag-and-drop support
- 💳 Seamless checkout process with order confirmation
- 📱 Responsive design for mobile and desktop
- ✅ Form validation with React Hook Form + Yup
- ⚡ Optimized data fetching with React Query

---

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Material-UI (MUI) + Tailwind CSS
- **Forms**: React Hook Form + Yup
- **Data Fetching**: React Query
- **HTTP Client**: Fetch Default By [Next.js]
- **Drag and Drop**: DND Kit

---

## 📁 Project Structure

````
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
   git clone https://github.com/mohamedadel1994825/beshara-task.git
   cd beshara-store
````

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

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Docs](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)

---
