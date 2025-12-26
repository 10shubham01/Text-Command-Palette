import { useState } from 'react'

function App() {
  const [text, setText] = useState('Hello World Example')
  const [commands] = useState([
    { id: "upper", label: "toUpperCase", run: (t: string) => t.toUpperCase() },
    { id: "lower", label: "toLowerCase", run: (t: string) => t.toLowerCase() },
    { id: "title", label: "toTitleCase", run: (t: string) =>
        t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    },
    { id: "sentence", label: "toSentenceCase", run: (t: string) =>
        t.replace(/(^\w|\.\s*\w)/g, c => c.toUpperCase())
    },
    { id: "camel", label: "toCamelCase", run: (t: string) =>
        t.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '')
    },
    { id: "kebab", label: "toKebabCase", run: (t: string) =>
        t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    },
    { id: "reverse", label: "Reverse Text", run: (t: string) => t.split('').reverse().join('') },
    { id: "trim", label: "Trim Whitespace", run: (t: string) => t.trim() },
    { id: "remove-punct", label: "Remove Punctuation", run: (t: string) => t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') },
    { id: "count-words", label: "Count Words", run: (t: string) => `Words: ${t.trim().split(/\s+/).length}, Characters: ${t.length}` },
    { id: "copy", label: "Copy to Clipboard", run: (t: string) => { navigator.clipboard.writeText(t); return t; } }
  ])

  const runCommand = (cmd: typeof commands[0]) => {
    setText(cmd.run(text))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Text Command Palette
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            VS Code–style command palette for transforming selected text anywhere on the web
          </p>
          <div className="bg-gray-800 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-400">Shortcut:</p>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">Cmd + Shift + O</kbd>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-4">Try it out:</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
            className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commands.slice(0, 9).map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => runCommand(cmd)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Universal Support</h3>
              <p className="text-gray-300">
                Works on any website with input fields, textareas, and contenteditable elements.
                Transform text in forms, rich text editors, and more.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">11 Powerful Commands</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Case transformations (upper, lower, title, sentence)</li>
                <li>• Programming formats (camelCase, kebab-case)</li>
                <li>• Text utilities (reverse, trim, remove punctuation)</li>
                <li>• Analysis tools (word/character count)</li>
                <li>• Clipboard operations</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          <ol className="text-gray-300 space-y-2 max-w-md mx-auto text-left">
            <li>1. Download the extension files</li>
            <li>2. Open Chrome extensions page</li>
            <li>3. Enable Developer mode</li>
            <li>4. Load unpacked extension</li>
            <li>5. Start transforming text!</li>
          </ol>
        </div>

        <footer className="text-center mt-16 pt-8 border-t border-gray-700">
          <p className="text-gray-400 mb-4">
            Built by <a href="https://shubhamgupta.dev/" className="text-blue-400 hover:text-blue-300">Shubham Gupta</a>
          </p>
          <div className="flex justify-center space-x-4">
            <a href="https://shubhamgupta.dev/" className="text-gray-400 hover:text-white">Portfolio</a>
            <a href="https://www.linkedin.com/in/shubhamgupta001/" className="text-gray-400 hover:text-white">LinkedIn</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App