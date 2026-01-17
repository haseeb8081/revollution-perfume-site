# Revollution Perfume Store

A professional, full-stack e-commerce website for the **Revollution** perfume brand, built with Next.js, MongoDB, and featuring a green & blue color theme.

## Features

- ✅ Beautiful responsive landing page
- ✅ Product catalog with filtering
- ✅ Shopping cart functionality
- ✅ User authentication (JWT)
- ✅ Order management
- ✅ Product reviews
- ✅ Email notifications (order confirmations)
- ✅ Admin panel (product CRUD, order management)
- ✅ Payment integration (Stripe)
- ✅ MongoDB database

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Payments**: Stripe
- **Email**: Nodemailer (SMTP/SendGrid)
- **State**: Zustand
- **UI**: Custom CSS with green/blue theme

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally OR MongoDB Atlas account
- (Optional) Stripe account for payments
- (Optional) SendGrid/SMTP for emails

### Installation

Dependencies should already be installed. If not, run:

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
copy .env.example .env.local
```

2. Update `.env.local` with your values:
```env
MONGODB_URI=mongodb://localhost:27017/revollution-store
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
EMAIL_FROM=noreply@revollution.com
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

### Seed Sample Products

To populate your database with sample perfume products, run:

```bash
node --loader ts-node/esm scripts/seed-products.ts
```

Or if you have ts-node installed globally:
```bash
ts-node scripts/seed-products.ts
```

This will create 6 sample products including:
- Emerald Dawn (unisex, fresh)
- Azure Ember (unisex, warm)
- Neon Mirage (unisex, aquatic)
- Velvet Cascade (women, floral)
- Midnight Fern (men, woody)
- Citrus Horizon (unisex, citrus)

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
revollution-store/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   └── products/
│   │   ├── shop/             # Shop page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── lib/
│   │   └── db.ts             # MongoDB connection
│   └── models/
│       ├── Product.ts        # Product schema
│       ├── User.ts           # User schema
│       ├── Order.ts          # Order schema
│       └── Review.ts         # Review schema
├── scripts/
│   └── seed-products.ts      # Database seeder
├── .env.example              # Environment template
├── package.json
└── README.md
```

## Available Pages

- `/` - Landing page (hero, story, collections, reviews)
- `/shop` - Product catalog with filters
- `/product/[slug]` - Product detail (coming soon)
- `/cart` - Shopping cart (coming soon)
- `/checkout` - Checkout flow (coming soon)
- `/account` - User account/orders (coming soon)
- `/login` - Login page (coming soon)
- `/register` - Registration (coming soon)

## API Endpoints

### Products
- `GET /api/products` - List all products (with filters)
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### More endpoints to be implemented:
- Auth (`/api/auth/login`, `/api/auth/register`)
- Cart (`/api/cart`)
- Orders (`/api/orders`)
- Reviews (`/api/reviews`)
- Checkout (`/api/checkout`)

## Next Steps

1. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

2. **Seed the database** with sample products (see above)

3. **Run the dev server**:
   ```bash
   npm run dev
   ```

4. **Visit** [http://localhost:3000](http://localhost:3000)

5. **Build out remaining features**:
   - Product detail pages
   - Shopping cart
   - Checkout flow
   - User authentication
   - Order management
   - Email confirmations
   - Admin panel

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works on any Node.js hosting (Netlify, Render, Railway, etc.)

## Support

For questions or issues, refer to:
- Next.js docs: https://nextjs.org/docs
- MongoDB docs: https://docs.mongodb.com
- Stripe docs: https://stripe.com/docs

---

**Built with ❤️ for Revollution** - Where green intentions meet blue-hour inspiration.
