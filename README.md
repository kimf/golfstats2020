# 🏌️‍♂️📊Kim Fransmans Mediokre Golfstats

## PS: I use this repo as a playground

Right now I'm playing around with React concurrent mode + gqless + mapbox stuff

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## Code stuff (notes etc, for my future self)

```javascript
const [startTransition, isPending] = useTransition({
  timeoutMs: 2000
});

const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```
