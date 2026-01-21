# Introduction

A practical front-end React component library for personal use.

# Usage

Firstly, install the library.

```bash
pnpm i @chanyuxi/nausea
```

Secondly, import the css file.

```scss
@use '@chanyuxi/nausea/dist/styles/index.scss';
```

Then import the component you want to use.

```tsx
import { Button } from '@chanyuxi/nausea'

export default function App() {
    return (
        <Button>Hello Nausea</Button>
    )
}
```

# Development

These plugins *(in vscode)* are helpful for development.

- `ESLint`
- `Stylelint`
- `SCSS IntelliSense`
