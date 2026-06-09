# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  Frontend (Next.js)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Components (Landing Page)                     │  │
│  │  - HeroSection                                       │  │
│  │  - UploadSection                                     │  │
│  │  - FaqSection                                        │  │
│  │  - Navigation                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management & Hooks                            │  │
│  │  - useScrollReveal                                   │  │
│  │  - Custom hooks                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Styling                                             │  │
│  │  - Tailwind CSS                                      │  │
│  │  - Motion animations                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API (JSON)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  Backend (FastAPI)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes                                          │  │
│  │  - POST /predict                                     │  │
│  │  - GET /health                                       │  │
│  │  - GET /docs                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ML Services                                         │  │
│  │  - Image preprocessing                              │  │
│  │  - Model inference                                   │  │
│  │  - Result formatting                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ML Model                                            │  │
│  │  - Deep Learning Model (19 classes)                  │  │
│  │  - 94.2% accuracy                                    │  │
│  │  - <3 second inference                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Frontend (`src/`)

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
│
├── components/
│   ├── landing/                # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── UploadSection.tsx
│   │   ├── FaqSection.tsx
│   │   ├── StepsSection.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   └── BackgroundDecor.tsx
│   │
│   └── ui/                     # Reusable UI components
│       ├── text-generate-effect.tsx
│       ├── wobble-card.tsx
│       └── infinite-moving-cards.tsx
│
├── hooks/
│   └── useScrollReveal.ts      # Scroll animation hook
│
├── lib/
│   └── utils.ts                # Utility functions
│
└── data/
    └── landing.ts              # Landing page data
```

### Backend (`backend/`)

```
backend/
├── app/
│   ├── main.py                 # FastAPI app
│   ├── routes/
│   │   └── predict.py          # Prediction endpoint
│   ├── models/
│   │   └── schemas.py          # Pydantic models
│   └── services/
│       └── ml_service.py       # ML inference logic
│
├── models/                     # ML model files
│   └── model.h5               # Trained model
│
├── requirements.txt            # Python dependencies
└── .env                        # Environment variables
```

### Testing (`e2e/`)

```
e2e/
├── accessibility.spec.ts       # A11y tests (19)
├── cross-browser.spec.ts       # Browser tests (47)
├── faq-section.spec.ts         # FAQ tests (13)
├── header-navigation.spec.ts   # Header tests (8)
├── hero-section.spec.ts        # Hero tests (11)
├── page-flow.spec.ts           # Flow tests (13)
├── responsive-design.spec.ts   # Responsive tests (27)
└── upload-section.spec.ts      # Upload tests (12)
```

## Data Flow

### Image Upload & Analysis

```
1. User selects image
   ↓
2. Frontend validates file
   - Check file type (PNG, JPG, JPEG)
   - Check file size (<10MB)
   ↓
3. User clicks "Mulai Analisis"
   ↓
4. Frontend sends POST /predict
   - FormData with image file
   ↓
5. Backend receives request
   ↓
6. Backend processes image
   - Load image
   - Preprocess (resize, normalize)
   - Run ML model inference
   ↓
7. Backend returns prediction
   {
     "class_index": 0,
     "label": "normal",
     "confidence": 0.95,
     "top_5": [...]
   }
   ↓
8. Frontend displays results
   - Show prediction label
   - Show confidence percentage
   - Show recommendation
   - Show top 5 predictions
```

## Component Hierarchy

```
App (page.tsx)
├── BackgroundDecor
├── SiteHeader
│   └── Navigation
│       ├── Desktop Nav
│       └── Mobile Menu
├── Main
│   ├── HeroSection
│   │   ├── TextGenerateEffect
│   │   └── Stats Cards
│   ├── TestimonialsSection
│   │   └── InfiniteMovingCards
│   ├── FeatureSection
│   │   └── WobbleCards
│   ├── StepsSection
│   │   └── Step Cards
│   ├── UploadSection
│   │   ├── File Input
│   │   ├── Image Preview
│   │   └── Results Display
│   └── FaqSection
│       └── FAQ Cards
└── SiteFooter
```

## State Management

### Frontend State

#### Global State
- None (using React Context if needed)

#### Component State
- **UploadSection**
  - `selectedFile`: File | null
  - `isLoading`: boolean
  - `result`: PredictionResponse | null
  - `errorMessage`: string | null
  - `inferenceTime`: string | null

- **SiteHeader**
  - `menuOpen`: boolean

#### Custom Hooks
- `useScrollReveal`: Manages scroll animation visibility

### Backend State

- **ML Model**: Loaded once at startup
- **Request/Response**: Stateless API

## API Endpoints

### POST /predict
Analyze retinal image

**Request:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@image.jpg"
```

**Response:**
```json
{
  "class_index": 0,
  "label": "normal",
  "confidence": 0.95,
  "top_5": [
    {
      "class_index": 0,
      "label": "normal",
      "confidence": 0.95
    },
    {
      "class_index": 1,
      "label": "diabetic-retinopathy-mild",
      "confidence": 0.03
    }
  ]
}
```

### GET /health
Health check

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

### GET /docs
OpenAPI documentation (Swagger UI)

## Technology Choices

### Frontend
- **Next.js**: Server-side rendering, static generation, API routes
- **React**: Component-based UI
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety
- **Playwright**: E2E testing

### Backend
- **FastAPI**: Modern, fast, async-capable API framework
- **Python**: ML ecosystem, easy to use
- **Pydantic**: Data validation
- **TensorFlow/PyTorch**: ML inference

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Local development

## Performance Considerations

### Frontend
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component
- **CSS-in-JS**: Tailwind CSS for minimal CSS
- **Animations**: GPU-accelerated with Motion
- **Lazy Loading**: Components loaded on demand

### Backend
- **Async Processing**: FastAPI async endpoints
- **Model Caching**: ML model loaded once
- **Image Preprocessing**: Optimized pipeline
- **Inference Time**: <3 seconds per image

### Database
- Currently stateless (no database)
- Can add PostgreSQL for history/logging

## Security Considerations

### Frontend
- Input validation (file type, size)
- XSS protection (React escaping)
- CSRF protection (if needed)

### Backend
- File upload validation
- API rate limiting (can add)
- CORS configuration
- Input sanitization

### General
- Environment variables for secrets
- HTTPS in production
- Regular dependency updates

## Scalability

### Current Architecture
- Single instance deployment
- Suitable for: <1000 requests/day

### Scaling Options
- **Horizontal**: Load balancer + multiple backend instances
- **Vertical**: Larger server resources
- **Caching**: Redis for model caching
- **Queue**: Celery for async processing
- **CDN**: CloudFlare for static assets

## Testing Strategy

### E2E Testing
- 792 tests across 8 test files
- 6 browser/device configurations
- Covers all user journeys
- Accessibility testing (WCAG AA)

### Unit Testing (Optional)
- Component tests with React Testing Library
- Service tests with pytest

### Integration Testing (Optional)
- API endpoint tests
- Database tests

## Deployment

### Development
```bash
npm run dev          # Frontend
python -m uvicorn app.main:app --reload  # Backend
```

### Production
```bash
npm run build && npm run start  # Frontend
gunicorn app.main:app          # Backend
```

### Docker
```bash
docker-compose up -d
```

## Monitoring & Logging

### Frontend
- Browser console logs
- Error tracking (Sentry optional)

### Backend
- Application logs
- Request/response logging
- Error tracking
- Performance monitoring

## Future Improvements

1. **Database**: Add PostgreSQL for history
2. **Authentication**: User accounts and login
3. **Caching**: Redis for model caching
4. **Queue**: Celery for async processing
5. **Monitoring**: Prometheus + Grafana
6. **CI/CD**: GitHub Actions for automated testing
7. **API**: GraphQL option
8. **Mobile**: React Native app

---

**Architecture Version**: 1.0.0  
**Last Updated**: June 9, 2026
