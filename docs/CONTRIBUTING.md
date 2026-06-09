# Contributing Guide

Terima kasih telah tertarik untuk berkontribusi pada Retinopathy Disease Detection! Panduan ini akan membantu Anda memulai.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📖 Code of Conduct

Kami berkomitmen untuk menyediakan lingkungan yang ramah dan inklusif. Semua kontributor harus:
- Menghormati pendapat orang lain
- Memberikan feedback yang konstruktif
- Fokus pada apa yang terbaik untuk komunitas
- Menunjukkan empati terhadap anggota komunitas lainnya

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git
- Docker (optional)

### Setup Development Environment

1. **Fork Repository**
   ```bash
   # Fork di GitHub, kemudian clone
   git clone https://github.com/your-username/retinopaty-disease-detection.git
   cd retinopaty-disease-detection
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies**
   ```bash
   # Frontend
   npm install
   npx playwright install

   # Backend
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd backend
   python -m uvicorn app.main:app --reload
   ```

## 💻 Development Workflow

### Frontend Development

#### Project Structure
```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── landing/      # Landing page sections
│   └── ui/          # UI components
├── hooks/           # Custom hooks
├── lib/             # Utilities
└── data/            # Static data
```

#### Creating Components
```typescript
// src/components/MyComponent.tsx
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

const MyComponent: FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div onClick={onClick}>
      {title}
    </div>
  );
};

export default MyComponent;
```

#### Available Scripts
```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run tests with UI
```

### Backend Development

#### Project Structure
```
backend/
├── app/
│   ├── main.py          # FastAPI app
│   ├── routes/          # API routes
│   ├── models/          # Pydantic models
│   └── services/        # Business logic
├── models/              # ML models
├── requirements.txt
└── .env
```

#### Creating API Endpoints
```python
# backend/app/routes/predict.py
from fastapi import APIRouter, File, UploadFile
from app.services.ml import predict_image

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Analyze retinal image"""
    result = await predict_image(file)
    return result
```

#### Running Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```

## 📐 Coding Standards

### Frontend (TypeScript/React)

#### Style Guide
- Use TypeScript for type safety
- Use functional components with hooks
- Use meaningful variable names
- Keep components small and focused
- Use proper prop typing

#### Example
```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// Avoid
const Button = ({ label, onClick, disabled }) => {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
};
```

### Backend (Python)

#### Style Guide
- Follow PEP 8
- Use type hints
- Write docstrings
- Keep functions small and focused
- Use meaningful variable names

#### Example
```python
# Good
from typing import Optional
from pydantic import BaseModel

class PredictionResult(BaseModel):
    label: str
    confidence: float
    top_5: list[dict]

async def predict_image(file: UploadFile) -> PredictionResult:
    """
    Analyze retinal image and return prediction.
    
    Args:
        file: Uploaded image file
        
    Returns:
        PredictionResult with classification
    """
    # Implementation
    pass

# Avoid
async def predict(f):
    # Implementation
    pass
```

## 🧪 Testing

### E2E Testing

#### Running Tests
```bash
# All tests
npm run test:e2e

# Interactive UI
npm run test:e2e:ui

# Specific test file
npx playwright test e2e/header-navigation.spec.ts

# Specific browser
npx playwright test --project=chromium
```

#### Writing Tests
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display element', async ({ page }) => {
    const element = page.locator('button:has-text("Click")');
    await expect(element).toBeVisible();
  });

  test('should handle interaction', async ({ page }) => {
    const button = page.locator('button:has-text("Click")');
    await button.click();
    
    const result = page.locator('text=Success');
    await expect(result).toBeVisible();
  });
});
```

#### Test Requirements
- All new features must have E2E tests
- Tests should be descriptive and focused
- Use semantic selectors (ARIA labels, data-testid)
- Wait for elements properly (toBeVisible, toBeInViewport)
- Maintain >80% test coverage

## 📝 Commit Messages

### Format
```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build, dependencies, tooling

### Examples
```bash
# Good
git commit -m "feat: add image upload functionality"
git commit -m "fix: resolve mobile menu toggle issue"
git commit -m "docs: update E2E testing guide"
git commit -m "test: add header navigation tests"

# Avoid
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update Your Branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run Tests**
   ```bash
   npm run test:e2e
   npm run lint
   ```

3. **Build Check**
   ```bash
   npm run build
   ```

### Submitting PR

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use descriptive title
   - Reference related issues
   - Describe changes clearly
   - Include screenshots if UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Related Issues
   Fixes #123

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation

   ## Testing
   - [ ] E2E tests pass
   - [ ] Lint passes
   - [ ] Build succeeds
   - [ ] Manual testing done

   ## Screenshots (if applicable)
   <!-- Add screenshots here -->
   ```

### Review Process

- At least 1 approval required
- All tests must pass
- No merge conflicts
- Code review feedback addressed

## 🐛 Reporting Issues

### Bug Report Template
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome, Firefox]
- Version: [e.g., 1.0.0]

## Screenshots
<!-- Add screenshots if applicable -->
```

### Feature Request Template
```markdown
## Description
Clear description of the feature

## Motivation
Why is this feature needed?

## Proposed Solution
How should this be implemented?

## Alternatives
Other possible solutions

## Additional Context
Any other relevant information
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [PEP 8 Style Guide](https://pep8.org)

## 🎯 Development Tips

### Frontend
- Use React DevTools for debugging
- Use Chrome DevTools for network inspection
- Use Playwright Inspector for test debugging
- Check console for errors and warnings

### Backend
- Use FastAPI's built-in Swagger UI at `/docs`
- Use Python debugger (pdb) for debugging
- Use logging for tracking execution
- Test endpoints with curl or Postman

### General
- Keep commits small and focused
- Write clear commit messages
- Update documentation with changes
- Ask questions if unsure
- Help review others' PRs

## 📞 Getting Help

- Check existing issues and discussions
- Read documentation in `docs/` folder
- Ask in GitHub Discussions
- Contact maintainers

## ✨ Thank You!

Terima kasih telah berkontribusi pada proyek ini! Setiap kontribusi, besar atau kecil, sangat dihargai.

---

**Happy Contributing! 🚀**
