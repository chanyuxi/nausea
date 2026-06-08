import ReactMarkdown from 'react-markdown'

import intro from './content/intro.md?raw'

function MarkdownReact({ source }: { source: string }) {
  return <ReactMarkdown>{source}</ReactMarkdown>
}

export function App() {
  return (
    <main className="docs-shell">
      <aside
        className="docs-sidebar"
        aria-label="Documentation navigation"
      >
        <a href="#introduction">Introduction</a>
        <a href="#packages">Packages</a>
        <a href="#workflow">Workflow</a>
      </aside>
      <article className="docs-content">
        <MarkdownReact source={intro} />
      </article>
    </main>
  )
}
