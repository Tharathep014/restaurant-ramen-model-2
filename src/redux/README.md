# redux/

Reserved for advanced state management if the app grows past what
React Context handles cleanly (see `src/context/`).

At this app's current size — cart, one fulfillment flow, one user
session — Context + hooks is enough and keeps the bundle smaller.
If you later add things like multi-location ordering, staff-facing
order queues, or complex undo/redo on the cart, that's the point to
introduce Redux Toolkit here:

```
redux/
  store.js
  cartSlice.js
  authSlice.js
```

and swap `CartContext` for a `useSelector`/`useDispatch` pair without
changing how pages consume cart state (keep the same hook name,
`useCart()`, as the public interface).
