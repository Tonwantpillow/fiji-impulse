# Session Management Usage Examples

## Updated Behavior - Browse Freely, Login When Needed

✅ **Customers can browse the website freely without login**
✅ **Login modal only appears when accessing protected actions**
✅ **Product-details page triggers login modal for unauthenticated users**
✅ **"Add to Cart" requires authentication**

## Basic Usage

### 1. Requiring Authentication for Actions
```tsx
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function AddToCartButton({ product }) {
  const { requireAuth } = useRequireAuth();

  const handleAddToCart = () => {
    requireAuth(() => {
      // This only runs if user is authenticated
      console.log('Adding to cart:', product.name);
      // TODO: Add actual cart logic
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### 2. Manual Login Trigger
```tsx
import { useSession } from '@/contexts/SessionContext';

export default function LoginButton() {
  const { user, setShowLoginModal } = useSession();

  return (
    <button onClick={() => setShowLoginModal(true)}>
      {user ? 'Logged in' : 'Login'}
    </button>
  );
}
```

### 3. Checking Authentication Status
```tsx
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function MyComponent() {
  const { isAuthenticated, user, isLoading } = useRequireAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome back, {user.username}!</div>
      ) : (
        <div>Please login to continue</div>
      )}
    </div>
  );
}
```

## Backend Endpoints to Implement

Replace the TODO comments in `contexts/SessionContext.tsx` with your actual endpoints:

### Session Validation
```typescript
// TODO: Replace with your actual session validation endpoint
const response = await axios.get('/api/auth/validate-session', { withCredentials: true });
```

### Login
```typescript
// TODO: Replace with your actual login endpoint
const response = await axios.post('/api/auth/login', { username, password }, { withCredentials: true });
```

### Logout
```typescript
// TODO: Replace with your actual logout endpoint
await axios.post('/api/auth/logout', {}, { withCredentials: true });
```

## How It Works

1. **SessionProvider** wraps the entire app in layout.tsx
2. **LoginModal** appears automatically when user is not authenticated
3. **AccountBtn** shows username when logged in, "เข้าสู่ระบบ" when not
4. **ProtectedContent** conditionally renders based on auth status
5. Session is stored in localStorage (temporary - replace with secure cookies)

## Files Created

- `contexts/SessionContext.tsx` - Main session management
- `components/LoginModal.tsx` - Login popup
- `components/LoginInput.tsx` - Input fields for login form
- `components/ProtectedContent.tsx` - Conditional rendering wrapper
- Updated `interface/components/AccountBtn.tsx` - Integration with session
- Updated `app/layout.tsx` - Session provider integration