# usecraft

A small React hook for debouncing a value.

[![CI](https://github.com/zeynepbass/usecraft/actions/workflows/ci.yml/badge.svg)](https://github.com/zeynepbass/usecraft/actions/workflows/ci.yml)

## Installation

```sh
npm install usecraft
```

## Usage

```jsx
import { useDebounce } from 'usecraft';

const debouncedValue = useDebounce(value, 300);
```

## API

### `useDebounce(value, delay?)`

#### Parameters

| Name    | Type     | Default | Description                                               |
| ------- | -------- | ------- | --------------------------------------------------------- |
| `value` | `any`    | –       | The value to debounce.                                    |
| `delay` | `number` | `300`   | Time in milliseconds to wait after the last value change. |

#### Return value

The debounced value. On the first render it equals `value`. After that it
updates only once `value` has stayed unchanged for `delay` milliseconds.

#### Notes

- Values are compared with `Object.is`. An object or array created during
  render is a new value on every render and restarts the delay each time, so
  memoize it or debounce the primitive it is derived from.
- Changing `delay` restarts the pending timer.
- The pending timer is cleared when the component unmounts.

## Example

```jsx
import { useEffect, useState } from 'react';
import { useDebounce } from 'usecraft';

function Search() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then(setResults)
      .catch(() => {});

    return () => controller.abort();
  }, [debouncedSearch]);

  return (
    <>
      <input value={search} onChange={(event) => setSearch(event.target.value)} />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  );
}
```

## Requirements

- React 16.8 or newer
- A bundler or runtime that supports ES modules. The package is ESM-only.

### Why React is a peer dependency

A hook has to run on the same React instance as the component that calls it.
If React were a regular dependency, the package manager could install a second
copy, which breaks hooks with an "Invalid hook call" error and adds React to
the bundle twice. Declaring it as a peer dependency makes the package use the
React version the application already has.

## Development

```sh
npm install
npm test
npm run lint
npm run build
```

`dist/` is not committed. It is built by the `prepack` script, so it is always
present in the tarball created by `npm pack` and `npm publish`.

### Trying the package locally

Install the packed tarball in another React project. Unlike `npm link`, this
installs exactly the files that would be published and does not leave a second
copy of React in the dependency tree.

```sh
npm pack
cd ../my-app
npm install ../usecraft/usecraft-1.0.0.tgz
```

### Releasing

```sh
npm version patch   # or minor / major
npm publish
git push --follow-tags
```

## Versioning

This package follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):

- **PATCH** – bug fixes that do not change the API.
- **MINOR** – new, backwards compatible functionality.
- **MAJOR** – breaking changes, such as a changed signature or a dropped React version.

## License

[MIT](./LICENSE)
