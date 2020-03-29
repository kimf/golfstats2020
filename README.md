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

```javascript
componentDidMount() {
  hoodie.connectionStatus.startChecking({interval: 3000})
  hoodie.connectionStatus.on('disconnect', () => this.props.updateStatus(false))
  hoodie.connectionStatus.on('reconnect', () => this.props.updateStatus(true))
}
```
