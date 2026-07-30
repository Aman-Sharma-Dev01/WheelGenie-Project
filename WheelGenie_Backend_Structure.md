# Backend Directory Structure Summary

## 1. Overall Project Structure & Framework

- **Root workspace:** `C:\IMP\WheelGenie-Project` (monorepo with `Backend/` and `Frontend/`)
- **Backend directory:** `C:\IMP\WheelGenie-Project\Backend`
- **Framework:** Express 5.2.1 (ES modules, `"type": "module"`)
- **Language:** JavaScript (Node.js)
- **Entry point:** `C:\IMP\WheelGenie-Project\Backend\src\server.js`

```
Backend/
  .gitignore
  package.json
  package-lock.json
  test-api.js
  WheelGenie_API.postman_collection.json
  src/
    app.js              <-- Express app setup, route mounting, middleware
    server.js           <-- Main entry; loads env, connects DB, starts server
    config/
      db.js             <-- Mongoose connection
      swagger.js        <-- Swagger/OpenAPI 3.0 docs setup
    routes/
      authRoutes.js
      marketplaceRoutes.js
      bookingRoutes.js
      aiRoutes.js
      valuationRoutes.js
    controllers/
      authController.js
      marketplaceController.js
      bookingController.js
      aiController.js
      valuationController.js
    models/
      User.js
      Vehicle.js
      Listing.js
      Mechanic.js
      Booking.js
      Review.js
      AIEvaluation.js
      ServiceHistory.js
      Notification.js
    middleware/
      authMiddleware.js
      errorHandler.js
    validators/
      authValidator.js
      aiValidator.js
      bookingValidator.js
      marketplaceValidator.js
    ai/
      geminiService.js
    services/        -- empty (only .gitkeep)
    jobs/            -- empty (only .gitkeep)
    utils/
      appError.js
      catchAsync.js
```

## 2. Routes & Controller Mapping

All routes are registered in `app.js` under `/api/v1` prefixes:

| Route File | Prefix | Public Endpoints |
|---|---|---|
| `authRoutes.js` | `/api/v1/auth` | `POST /register`, `POST /login`, `POST /logout`, `POST /forgot-password`, `PATCH /reset-password/:token`, `POST /google-login` |
| `marketplaceRoutes.js` | `/api/v1/vehicles` | `GET /`, `GET /:id` |
| `bookingRoutes.js` | `/api/v1` | `GET /mechanics`, `GET /mechanics/:id` |
| `aiRoutes.js` | `/api/v1/ai` | (all protected) |
| `valuationRoutes.js` | `/api/v1/valuation` | (all protected) |

**Pattern:** Each route file imports its controller via `import * as XController from '.../controllers/XController.js'`, uses the `protect` middleware from `authMiddleware.js` for guarded routes, and validates request bodies via Zod schemas with a shared `validate` middleware.

## 3. Models (Mongoose ORM)

All models live in `C:\IMP\WheelGenie-Project\Backend\src\models`. Mongoose 9.7.3 is the ORM. MongoDB connection string defaults to `mongodb://127.0.0.1:27017/wheelgenie`.

| File | Model Name | Key Fields |
|---|---|---|
| `User.js` (73 lines) | `User` | `name`, `email` (unique), `password` (bcrypt-hashed, `select: false`), `role` (customer/mechanic/admin), `phone`, `address` (embedded), `profilePic`, `refreshToken`, `passwordResetToken`, `passwordResetExpires` |
| `Vehicle.js` (71 lines) | `Vehicle` | `owner` (ref `User`), `brand`, `model`, `variant`, `fuel` (enum), `transmission` (enum), `kms`, `year`, `ownership`, `city`, `images[]`, `status` (active/sold/paused) |
| `Listing.js` (41 lines) | `Listing` | `vehicle` (ref `Vehicle`, unique), `seller` (ref `User`), `price`, `description`, `status`, `views` |
| `Mechanic.js` (52 lines) | `Mechanic` | `userId` (ref `User`, unique), `experience`, `skills[]`, `garageAddress` (sub-schema with `city` indexed), `averageRating`, `reviews`, `availabilityStatus`, `isVerified` |
| `Booking.js` (44 lines) | `Booking` | `customer` (ref `User`), `mechanic` (ref `Mechanic`), `vehicle` (ref `Vehicle`), `service`, `date`, `status` (Pending/Accepted/On The Way/In Progress/Completed/Cancelled), `paymentStatus` |
| `Review.js` (78 lines) | `Review` | `customer` (ref `User`), `mechanic` (ref `Mechanic`), `booking` (ref `Booking`), `rating` (1–5), `comment`. Post-save/post-findOneAnd- hooks auto-recalculate `Mechanic.averageRating`. |
| `AIEvaluation.js` (49 lines) | `AIEvaluation` | `user`, `inputData` (detailed vehicle specs), `evaluation` (Gemini response with `estimatedMarketPrice`, `priceRange`, `isAskingPriceFair`, `hiddenRisks`, `pros`/`cons`, `buyAvoidRecommendation`, etc.) |
| `ServiceHistory.js` (49 lines) | `ServiceHistory` | `vehicle`, `owner`, `serviceType` (enum), `serviceDate`, `partsReplaced[]`, `cost`, `description`, `performedBy` (ref `Mechanic`), `nextServiceReminder` |
| `Notification.js` (35 lines) | `Notification` | `recipient` (ref `User`), `title`, `message`, `type` (Booking/Service/System/Promotion), `isRead` |

All models use `timestamps: true`. Relations use `mongoose.Schema.Types.ObjectId` with `ref` strings matching model names.

## 4. Middleware Patterns

Two files in `C:\IMP\WheelGenie-Project\Backend\src\middleware\`:

**`authMiddleware.js` (42 lines):**
- `protect`: Async wrapper using `catchAsync`. Checks Bearer token from the `Authorization` header or `accessToken` cookie. Verifies JWT with `JWT_SECRET`. Looks up user via `User.findById(decoded.id)`. Sets `req.user = currentUser`. Returns 401 for missing/invalid/expired tokens or deleted users.
- `restrictTo(...roles)`: Higher-order function returning middleware that checks `req.user.role` against allowed roles. Returns 403 if unauthorized.
- **Note:** `restrictTo` is exported but not used anywhere in the current routes — all route-level protection uses only `protect`.

**`errorHandler.js` (90 lines):**
- Centralized error handler, mounted via `app.use(errorHandler)` after all routes.
- Converts known errors to `AppError`: `CastError` (400), `11000` duplicate key (409), Mongoose `ValidationError` (400), `JsonWebTokenError` (401), `TokenExpiredError` (401), `ZodError` (400).
- Different responses for development (includes stack trace) vs. production (hides stack for non-operational errors, shows operational errors cleanly).

## 5. Auth Code (Auth-related code details)

- **Auth routes:** `C:\IMP\WheelGenie-Project\Backend\src\routes\authRoutes.js` (29 lines)
- **Auth controller:** `C:\IMP\WheelGenie-Project\Backend\src\controllers\authController.js` (263 lines) — the most comprehensive auth file.

**JWT Helper Functions** (internal, not exported):
- `signAccessToken(id)` — signs with `JWT_SECRET`, expires in `JWT_EXPIRES_IN` (default 7d)
- `signRefreshToken(id)` — signs with `JWT_REFRESH_SECRET`, expires in `JWT_REFRESH_EXPIRES_IN` (default 7d)
- `createSendToken(user, statusCode, res, message)` — generates both tokens, saves `refreshToken` to the user doc, sets `httpOnly` cookies (`sameSite: Lax` in dev, `None` in prod), removes `password`/`refreshToken` from the response body

**Exported Controller Functions:**
1. `register` — creates user via `User.create()`, sends token cookie response
2. `login` — `User.findOne({ email }).select('+password')`, compares with `user.comparePassword()` and sends token
3. `logout` — clears `refreshToken` in DB and clears both cookies
4. `getMe` — returns `req.user`
5. `updateProfile` — updates `name`, `phone`, `address`, `profilePic` (excludes `password`/`email`/`role`)
6. `forgotPassword` — generates `crypto.randomBytes(32)`, hashes with SHA-256, saves to `passwordResetToken`, returns `resetURL` in dev mode, sets 10-minute expiry
7. `resetPassword` — validates hashed token and expiry, sets new password, sends new auth tokens
8. `googleLogin` — `jwt.decode(token)` to extract email, auto-creates `User` if not found, sends auth tokens

**Auth validator:** `C:\IMP\WheelGenie-Project\Backend\src\validators\authValidator.js` (71 lines) — Zod schemas for:
- `registerSchema`: `body.name`, `email`, `password` (min 6), `phone` (min 10), `role` (enum: customer/mechanic/admin), optional `address`/`profilePic`
- `loginSchema`: `body.email`, `body.password`
- `updateProfileSchema`: all fields optional
- `forgotPasswordSchema`: `body.email`
- `resetPasswordSchema`: `body.password` (min 6)
- `googleLoginSchema`: `body.token`
- Shared `validate` middleware (in the same file, exported) — calls `schema.parse({ body, query, params })` and forwards any `ZodError` to `next`.

Auth middleware (documented above) handles token verification.

## 6. Package Dependencies

`C:\IMP\WheelGenie-Project\Backend\package.json`:

| Dependency | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | Web framework |
| `mongoose` | ^9.7.3 | MongoDB ODM |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT token signing / verification |
| `dotenv` | ^17.4.2 | Environment variables |
| `cors` | ^2.8.6 | CORS middleware |
| `cookie-parser` | ^1.4.7 | Parse cookies |
| `morgan` | ^1.11.0 | HTTP request logger |
| `multer` | ^2.2.0 | File uploads (not used in controllers yet) |
| `zod` | ^4.4.3 | Schema validation |
| `cloudinary` | ^2.10.0 | Image/file hosting (not used in controllers yet) |
| `@google/generative-ai` | ^0.24.1 | Google Gemini AI service |
| `swagger-jsdoc` | ^6.3.0 | Swagger spec generation |
| `swagger-ui-express` | ^5.0.1 | Swagger UI serving |

**Scripts:** `start` runs `node src/server.js`, `dev` runs `node --watch src/server.js`. Express approach based on `"type": "module"` in `package.json`. Zod 4.4.3 used across all validators. Cloudinary and multer are dependencies but not wired to any route yet.

## 7. Entry Point / Server File & Startup Flow

**`C:\IMP\WheelGenie-Project\Backend\src\server.js`** (32 lines):
1. Imports `app` from `./app.js`
2. Calls `dotenv.config()`
3. Calls `connectDB()` from `./config/db.js` (connects to MongoDB via Mongoose)
4. Starts Express server on `PORT` env var or 5000
5. Logs banner with port and environment name
6. Registers global handlers for `unhandledRejection` and `uncaughtException`

**`C:\IMP\WheelGenie-Project\Backend\src\app.js`** (65 lines):
1. Creates Express app
2. Applies global middleware: CORS, cookie parser, JSON, urlencoded, morgan
3. Sets up Swagger docs at `/api-docs`
4. Base route `GET /` returns welcome message
5. Health route `GET /health`
6. Mounts 5 route groups under `/api/v1`
7. 404 catcher `app.use()`
8. Global error handler `app.use(errorHandler)`

**Environment variables expected** (referenced in code but no `.env` file was found):
- `PORT` (default 5000)
- `NODE_ENV` (development or production)
- `MONGODB_URI` (default `mongodb://127.0.0.1:27017/wheelgenie`)
- `JWT_SECRET` (for access tokens)
- `JWT_REFRESH_SECRET` (for refresh tokens)
- `JWT_EXPIRES_IN` (default 1d)
- `JWT_REFRESH_EXPIRES_IN` (default 7d)
- `GEMINI_API_KEY` (for Google Gemini AI)

## 8. Utility & Remaining Files

- **`utils/appError.js`**: Custom `AppError` class extending `Error` with `statusCode`, `status`, `errors`, and `isOperational` flag.
- **`utils/catchAsync.js`**: Async wrapper — takes an async function, returns `(req, res, next) => fn(req, res, next).catch(next)` to delegate async errors to the Express error handler.
- **`config/swagger.js`** (442 lines): Comprehensive OpenAPI 3.0 spec with JWT security scheme, tagged groups (Auth, Marketplace, Mechanics, Bookings, AI Evaluation, Valuation), and detailed request/response schemas for all endpoints.
- **`ai/geminiService.js`** (121 lines): Exports `evaluateWithGemini(vehicleData)` and `valuateWithGemini(vehicleData)`. Constructs detailed prompts, calls the Gemini 2.0 Flash model, parses JSON responses with code-fence stripping. Returns structured evaluation/valuation objects.

## 9. Key Patterns Summary

- **Controller pattern:** `catchAsync` wrapper → operation logic (models/errors) → standard response shape `{ success, statusCode, message, data }`
- **Validation:** Zod schemas define a `{ body: z.object(...) }` pattern. Central `validate` middleware in `authValidator.js` checks the entire request object. All routes import `validate` from `authValidator.js`.
- **Auth flow:** Access JWT + Refresh JWT stored as `httpOnly` cookies. Refresh token also persisted in DB. `protect` middleware reads from header or cookies.
- **Services/jobs folders are empty** — placeholders for async tasks (file processing, notifications, background jobs).
- **No file upload routes wired yet**, though `multer` is in dependencies.
- **Cloudinary integration is also unused** for now.
- **`restrictTo` middleware is defined but not applied** in any route (all routes use only `protect`).
