**`MakeWatchedObject`** is an example often shown in TypeScript’s docs or tutorials to illustrate how you can create an object whose properties you can “observe” for changes (at least in a demo/teaching sense). It is _not_ a built-in TypeScript feature. Instead, it’s just an ordinary function that:

1. **Creates** some internal data structure to track “listeners” or “watchers.”  
2. **Returns** an augmented version of the original object—one that can register callbacks and notify them whenever a property changes.

Below is a conceptual breakdown of how it typically works.

---

## 1. The Shape of the Returned Object

A common pattern is that `makeWatchedObject(obj)` returns an object with:

- The **original** properties from `obj` (e.g., `firstName`, `age`, etc.).  
- An additional method to **register** watchers (e.g., `on(eventName, callback)`).

In TypeScript terms, you often see something like:

```ts
function makeWatchedObject<T>(obj: T): T & {
  on<Key extends keyof T>(
    eventName: `${string & Key}Changed`,
    callback: (newValue: T[Key]) => void
  ): void;
} {
  // ...
}
```

The returned type is “`T & { on(...) }`,” meaning “all the original properties plus an `on(...)` method.”

---

## 2. How Callbacks Are Registered

Inside `makeWatchedObject`, you typically keep an internal registry of callbacks keyed by property name. For example:

```ts
function makeWatchedObject<T>(obj: T): T & { on(...): void } {
  // A mapping from property name to an array of listener callbacks.
  const handlers: { [K in keyof T]?: Array<(value: T[K]) => void> } = {};

  return {
    ...obj,   // spread original props
    on(eventName, callback) {
      // parse the eventName, e.g. "ageChanged" => "age"
      const propName = eventName.replace("Changed", "") as keyof T;
      // add the callback to the array
      (handlers[propName] ??= []).push(callback);
    },
  };
}
```

- When someone calls `on("ageChanged", callback)`, you store that `callback` in `handlers["age"]`.  
- `??=` is a newer JS operator that means “assign if undefined or null.”  
- The `keyof T` + template-literal trick ensures TypeScript only allows watchers for valid properties and event strings (e.g. `"ageChanged"` or `"firstNameChanged"`, but not `"whateverChanged"`).

---

## 3. Detecting Property Changes

In a “full” implementation, you’d intercept writes to the object’s properties and then call all relevant callbacks. That might look like:

1. **Using getters/setters**: You could create a new object and define each property with a `get` and `set`. Whenever the setter sees a new value, it triggers the callbacks.  
2. **Using a `Proxy`** (at runtime) to intercept property writes, then triggers the callbacks.

For example, a simplistic `Object.defineProperty` approach for each key might be:

```ts
function makeWatchedObject<T extends object>(obj: T): T & { on(...): void } {
  const handlers: { [K in keyof T]?: Array<(value: T[K]) => void> } = {};

  // We'll copy the properties onto a new object with getters/setters.
  const newObj = {} as T;

  for (const key of Object.keys(obj) as (keyof T)[]) {
    let value = obj[key];
    Object.defineProperty(newObj, key, {
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        // If there are watchers for this key, call them:
        handlers[key]?.forEach(fn => fn(newValue));
      },
      enumerable: true,
      configurable: true,
    });
  }

  return Object.assign(newObj, {
    on(eventName, callback) {
      const propName = eventName.replace("Changed", "") as keyof T;
      (handlers[propName] ??= []).push(callback);
    },
  });
}
```

### How the “new value” is given to callbacks

In this snippet, note how we do:

```ts
set(newValue) {
  value = newValue;
  handlers[key]?.forEach(fn => fn(newValue));
}
```

That is precisely how the second callback function “reads” the new value. The setter calls each registered callback with `newValue`. Because TypeScript’s type system knows that `handlers[key]` is an array of functions that accept `T[key]`, it type-checks nicely.

---

## 4. Example of Using It

Say we define:

```ts
const watched = makeWatchedObject({
  firstName: "Homer",
  age: 32
});

watched.on("firstNameChanged", (newName) => {
  console.log("First name is now:", newName.toUpperCase());
});

watched.on("ageChanged", (newAge) => {
  console.log("Age changed to:", newAge);
});

watched.firstName = "Bart";  // triggers the firstNameChanged callback
watched.age = 50;            // triggers the ageChanged callback
```

- Setting `watched.firstName = "Bart"` goes through the setter for `firstName`, which calls all listeners in `handlers["firstName"]`.  
- Each listener receives the new value `"Bart"`, so it can do something with it.

---

## 5. TypeScript’s Role

All of the code above is standard JavaScript plus a bit of “fancy” property manipulation. **TypeScript**’s main role is:

1. Enforcing that we only attach listeners to valid property keys.  
2. Ensuring that the callback parameter type matches the actual property type.

So, if we tried something like `watched.on("ageChanged", (val: string) => ...)`, TypeScript would complain: “`val` must be a number, because `age` is a number.” Likewise, if we tried `watched.on("unknownChanged", ...)`, it wouldn’t compile, since `unknown` is not a valid property name.

---

## Recap

1. **`makeWatchedObject` is not built in** – it’s just a pattern that showcases how TS type inference can track property keys and apply watchers.  
2. **Internally**, it typically uses an object/array of callbacks and either “defineProperty” or a `Proxy` to intercept writes.  
3. **The second callback** (or any callback) gets the new value because the setter in the new object calls all registered callbacks with that updated value.  
4. **TypeScript** checks that you only register watchers for real properties and that your callbacks use the correct property types.  

That’s the high-level idea behind how `MakeWatchedObject` (or any “watched object” utility) works.