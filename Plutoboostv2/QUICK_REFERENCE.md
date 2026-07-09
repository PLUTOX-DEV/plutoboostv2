# 🎯 Quick Reference - React Performance Optimizations

## 📦 New Components Available

### Skeleton Loaders
```jsx
import { 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  ListSkeleton, 
  ChartSkeleton 
} from '@/components/Skeleton';

// Usage
{isLoading ? <CardSkeleton /> : <YourCard />}
```

### Lazy Images
```jsx
import { LazyImage, ResponsiveImage } from '@/components/LazyImage';

// Basic lazy image
<LazyImage src="/image.jpg" alt="Description" className="w-full" />

// With WebP support
<ResponsiveImage 
  src="/image.jpg" 
  webpSrc="/image.webp"
  alt="Description" 
/>
```

### Memoized Components
```jsx
import { MemoizedCard, MemoizedButton } from '@/components/MemoizedComponents';

<MemoizedCard>
  <MemoizedButton>Click Me</MemoizedButton>
</MemoizedCard>
```

---

## 🎣 New Hooks Available

### Lazy Load Observer
```jsx
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

return (
  <div ref={ref}>
    {isVisible && <HeavyComponent />}
  </div>
);
```

### Debounce & Throttle
```jsx
import { useDebounce, useThrottle } from '@/hooks/useDebounceThrottle';

// Debounce: Wait for user to stop typing (500ms)
const handleSearch = useDebounce((query) => {
  api.search(query);
}, 500);

// Throttle: Max once every 200ms (for scroll)
const handleScroll = useThrottle(() => {
  updateUI();
}, 200);
```

---

## 🔄 React Query Setup

Already configured! Just use it:

```jsx
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['transactions'],
  queryFn: () => api.get('/transactions'),
  // Auto-cached for 5 minutes, no refetch on window focus
});

// Mutation for POST/PUT/DELETE
const { mutate } = useMutation({
  mutationFn: (data) => api.post('/submit', data),
  onSuccess: () => {
    // Auto-refetch related queries
  },
});
```

---

## 🔍 Performance Monitoring

### In Console
Look for `[Performance]` warnings for renders >1000ms:
```
[Performance] App (update) took 1523.45ms - Base: 1204.32ms
```

### React DevTools
1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click "Record" → interact with app → Stop
4. See component render times

---

## 📝 Best Practices

### ✅ DO:
- Use `lazy()` for page components
- Use `React.memo()` for expensive components
- Use `useCallback()` for expensive functions
- Use `useMemo()` for expensive calculations
- Use `useDebounce()` for search/input
- Use React Query for all API calls
- Use `LazyImage` for images
- Use skeletons while loading

### ❌ DON'T:
- Import large pages without lazy()
- Use `fetch()` directly (use React Query)
- Re-render entire lists without virtualization
- Load images without lazy loading
- Forget to memoize heavy components
- Reload data on every component render

---

## 🚀 Common Patterns

### Pattern 1: Lazy Loaded Page with Skeleton
```jsx
import { lazy, Suspense } from 'react';
import { CardSkeleton } from '@/components/Skeleton';

const HeavyPage = lazy(() => import('./pages/HeavyPage'));

export function Dashboard() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <HeavyPage />
    </Suspense>
  );
}
```

### Pattern 2: Data Fetching with Cache
```jsx
import { useQuery } from '@tanstack/react-query';
import { CardSkeleton } from '@/components/Skeleton';

export function UsersList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
  });

  if (isLoading) return <CardSkeleton />;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Pattern 3: Search with Debounce
```jsx
import { useDebounce } from '@/hooks/useDebounceThrottle';
import { useQuery } from '@tanstack/react-query';

export function SearchUsers() {
  const [query, setQuery] = useState('');

  const handleSearch = useDebounce((q) => {
    // This runs only after user stops typing for 500ms
  }, 500);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    handleSearch(q);
  };

  return <input onChange={handleChange} placeholder="Search..." />;
}
```

### Pattern 4: Lazy Loaded Image
```jsx
import { LazyImage } from '@/components/LazyImage';

export function Hero() {
  return (
    <div className="hero">
      <LazyImage 
        src="/hero.jpg" 
        alt="Hero"
        className="w-full h-96 object-cover"
      />
    </div>
  );
}
```

---

## 🔧 Configuration Files

All pre-configured! Located at:

- **`vite.config.js`** - Build optimization + PWA
- **`src/utils/queryClient.js`** - React Query defaults
- **`tailwind.config.js`** - CSS optimization
- **`package.json`** - Dependencies (already installed)

---

## 📊 Build & Preview

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Code quality check
npm lint
```

---

## 📚 Full Documentation

See **`PERFORMANCE_OPTIMIZATIONS.md`** for:
- Detailed implementation of each optimization
- Configuration explanations
- Performance impact estimates
- Advanced usage patterns
- Best practices

---

## 💡 Tips

1. **Check build size:** After `npm run build`, check `dist/` folder sizes
2. **Monitor in DevTools:** Use Profiler tab to find slow components
3. **Use Performance tab:** Record and analyze page load times
4. **Check Network tab:** See bundle splitting and caching
5. **Mobile test:** Test on real mobile device for accurate metrics

---

## 🆘 Troubleshooting

**Q: Images not loading?**
A: Make sure the src path is correct and image exists in public folder

**Q: React Query queries not caching?**
A: Check browser DevTools → Application → Cache Storage

**Q: Service Worker not updating?**
A: It auto-updates. Force clear cache in DevTools if needed

**Q: Performance warning in console?**
A: Check which component is rendering slowly in React Profiler

---

**Happy Optimizing! 🚀**
