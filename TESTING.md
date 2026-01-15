# Testing Guide - CoffeeCat

## 🧪 Overview

Aplikasi ini dilengkapi dengan comprehensive testing menggunakan Jest dan React Native Testing Library.

## 📦 Test Dependencies

Dependencies yang sudah diinstall:
- `jest` - Testing framework
- `@testing-library/react-native` - React Native testing utilities
- `react-test-renderer` - React renderer untuk testing

## 🗂️ Test Structure

```
CoffeeCat/
├── src/
│   └── context/
│       └── __tests__/
│           ├── AuthContext.test.tsx      # Unit test untuk Auth
│           └── CartContext.test.tsx      # Unit test untuk Cart
└── app/
    └── __tests__/
        ├── login.test.tsx                # Integration test Login
        ├── cart.test.tsx                 # Integration test Cart
        └── checkout.test.tsx             # Integration test Checkout
```

## 🚀 Running Tests

### Menjalankan Semua Tests
```bash
npm test
```

### Watch Mode (Auto re-run saat file berubah)
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

Coverage report akan tersimpan di folder `coverage/`

## ✅ Test Coverage

### Unit Tests

#### AuthContext Tests
File: `src/context/__tests__/AuthContext.test.tsx`

**Test Cases:**
- ✅ Login dengan credentials yang benar
- ✅ Login dengan credentials salah
- ✅ Logout functionality
- ✅ Load user dari AsyncStorage
- ✅ Handle AsyncStorage errors

**Mock yang digunakan:**
```javascript
- AsyncStorage (getItem, setItem, removeItem)
- expo-router (useRouter, useSegments)
```

#### CartContext Tests
File: `src/context/__tests__/CartContext.test.tsx`

**Test Cases:**
- ✅ Add item ke cart
- ✅ Increase quantity item yang sudah ada
- ✅ Add multiple items
- ✅ Update quantity (increase/decrease)
- ✅ Remove item saat quantity = 0
- ✅ Clear cart
- ✅ Load cart dari AsyncStorage
- ✅ Save cart ke AsyncStorage

**Mock yang digunakan:**
```javascript
- AsyncStorage (getItem, setItem, removeItem)
```

---

### Integration Tests

#### Login Screen Tests
File: `app/__tests__/login.test.tsx`

**Test Cases:**
- ✅ Render login form dengan benar
- ✅ Handle successful login
- ✅ Show error pada login gagal
- ✅ Pre-filled credentials

**Mock yang digunakan:**
```javascript
- expo-router (useRouter, useSegments)
- AsyncStorage
- Alert
```

#### Cart Screen Tests
File: `app/__tests__/cart.test.tsx`

**Test Cases:**
- ✅ Render empty cart message
- ✅ Render cart items dengan benar
- ✅ Calculate total dengan benar
- ✅ Navigate to checkout
- ✅ Disable checkout button saat empty
- ✅ Navigate back

**Mock yang digunakan:**
```javascript
- expo-router (useRouter)
- AsyncStorage
- react-native-reanimated
```

#### Checkout Screen Tests
File: `app/__tests__/checkout.test.tsx`

**Test Cases:**
- ✅ Render checkout form
- ✅ Display correct total amount
- ✅ Validate empty fields
- ✅ Process payment dengan valid data
- ✅ Save order ke database
- ✅ Clear cart after checkout
- ✅ Navigate to home after success

**Mock yang digunakan:**
```javascript
- expo-router (useRouter, useLocalSearchParams)
- AsyncStorage
- Alert
- react-native-reanimated
```

## 🔧 Troubleshooting

### Babel Parser Error
Jika mendapat error "Unexpected token" dari babel parser:

**Solution:**
Pastikan `babel.config.js` sudah ada:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

### Transform Ignore Patterns
Jika module tidak ter-transform dengan benar, update `jest.config.js`:
```javascript
transformIgnorePatterns: [
  'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation|react-native-reanimated|@react-native-async-storage)/)',
],
```

### Mock Issues
Jika mock tidak bekerja:
1. Pastikan mock dideklarasikan sebelum import
2. Clear mock di beforeEach: `jest.clearAllMocks()`
3. Check apakah path mock sudah benar

## 📊 Expected Output

### Successful Test Run
```
PASS  src/context/__tests__/AuthContext.test.tsx
PASS  src/context/__tests__/CartContext.test.tsx
PASS  app/__tests__/login.test.tsx
PASS  app/__tests__/cart.test.tsx
PASS  app/__tests__/checkout.test.tsx

Test Suites: 5 passed, 5 total
Tests:       XX passed, XX total
```

### Coverage Report
```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   XX.XX |    XX.XX |   XX.XX |   XX.XX |
 context/             |         |          |         |         |
  AuthContext.tsx     |  100.00 |   100.00 |  100.00 |  100.00 |
  CartContext.tsx     |  100.00 |   100.00 |  100.00 |  100.00 |
----------------------|---------|----------|---------|---------|
```

## 🎯 Writing New Tests

### Template untuk Unit Test
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { YourContext, YourProvider } from '../YourContext';

describe('YourContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test something', async () => {
    const { result } = renderHook(() => useYourContext(), {
      wrapper: ({ children }) => <YourProvider>{children}</YourProvider>,
    });

    act(() => {
      // Trigger action
    });

    expect(result.current.someValue).toBe(expectedValue);
  });
});
```

### Template untuk Integration Test
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import YourScreen from '../YourScreen';

jest.mock('dependencies');

describe('YourScreen Integration Test', () => {
  it('should render correctly', () => {
    const { getByText } = render(<YourScreen />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('should handle user interaction', async () => {
    const { getByText } = render(<YourScreen />);
    
    fireEvent.press(getByText('Button'));
    
    await waitFor(() => {
      expect(someMock).toHaveBeenCalled();
    });
  });
});
```

## 📝 Best Practices

1. **Clear Mocks**: Selalu clear mocks di beforeEach
2. **Async Operations**: Gunakan waitFor untuk async operations
3. **User-centric**: Test dari perspektif user
4. **Descriptive Names**: Gunakan nama test yang descriptive
5. **Arrange-Act-Assert**: Follow AAA pattern
6. **Mock External Dependencies**: Mock API calls, databases, etc.
7. **Test Edge Cases**: Test error cases, empty states, etc.

## 🚫 Known Limitations

Testing di Expo/React Native memiliki beberapa limitasi:
- Tidak bisa test native modules tanpa mock
- Animasi tidak bisa di-test secara visual
- Beberapa gesture sulit di-simulate
- Database operations perlu di-mock

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

Happy Testing! 🧪✨
