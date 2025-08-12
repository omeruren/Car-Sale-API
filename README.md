# Car Sale API

A robust and scalable RESTful API for a car sales platform built with Node.js, Express.js, TypeScript, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based authentication with secure middleware
- **Car Management** - Complete CRUD operations for car listings with filtering capabilities
- **Brand & Category Management** - Organized car categorization system
- **User Profiles** - User registration, login, and profile management
- **Favorites System** - Users can save and manage favorite car listings
- **Sales Tracking** - Track car sales and transaction history
- **Security** - Rate limiting, CORS, helmet, and input validation
- **Logging** - Comprehensive logging with Winston
- **Database** - MongoDB with Mongoose ODM

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcrypt
- **Logging**: Winston
- **Rate Limiting**: express-rate-limit
- **Development**: Nodemon, ts-node

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/omeruren/Car-Sale-API.git
   cd Car-Sale-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/car-sale
   JWT_SECRET=your-super-secret-jwt-key
   WHITELIST_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **API will be running at** `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```http
GET /api/v1/
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| GET | `/auth/profile` | Get user profile (Protected) |

### Car Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cars` | Get all cars with filtering |
| GET | `/cars/:id` | Get car by ID |
| POST | `/cars` | Create new car (Protected) |
| PUT | `/cars/:id` | Update car (Protected) |
| DELETE | `/cars/:id` | Delete car (Protected) |

### Brand Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/brands` | Get all brands |
| GET | `/brands/:id` | Get brand by ID |
| POST | `/brands` | Create new brand (Protected) |
| PUT | `/brands/:id` | Update brand (Protected) |
| DELETE | `/brands/:id` | Delete brand (Protected) |

### Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| GET | `/categories/:id` | Get category by ID |
| POST | `/categories` | Create new category (Protected) |
| PUT | `/categories/:id` | Update category (Protected) |
| DELETE | `/categories/:id` | Delete category (Protected) |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

Or as a cookie:
```http
Cookie: token=<your-jwt-token>
```

## 📊 Data Models

### User
```typescript
{
  name: string;
  email: string;
  password: string; // hashed with bcrypt
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Car
```typescript
{
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  description: string;
  brand: ObjectId; // Reference to Brand
  category: ObjectId; // Reference to Category
  seller: ObjectId; // Reference to User
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Development

### Project Structure
```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
│   └── v1/         # API version 1 controllers
├── lib/            # Utility libraries
├── middlewares/    # Custom middlewares
├── models/         # MongoDB models
├── routes/         # API routes
│   └── v1/         # API version 1 routes
└── server.ts       # Main server file
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start
```

## 🚦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `WHITELIST_ORIGINS` | CORS allowed origins | Required |

## 🛡️ Security Features

- **Rate Limiting** - Prevents API abuse
- **CORS Protection** - Configurable cross-origin requests
- **Helmet** - Sets security-related HTTP headers
- **Input Validation** - Validates and sanitizes user input
- **Password Hashing** - bcrypt for secure password storage
- **JWT Authentication** - Stateless authentication

## 📝 Logging

The application uses Winston for comprehensive logging:
- **Console logging** in development
- **File rotation** in production
- **Error tracking** with stack traces
- **Request/Response logging**

## 🚀 Deployment

### Docker (Coming Soon)
```dockerfile
# Dockerfile example coming soon
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Use a secure `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Enable HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ömer Üren**
- GitHub: [@omeruren](https://github.com/omeruren)

## 🙏 Acknowledgments

- Express.js team for the robust framework
- MongoDB team for the flexible database
- All open-source contributors

---

⭐ If you found this project helpful, please give it a star!