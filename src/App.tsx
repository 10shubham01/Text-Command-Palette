import { commands } from "./commands";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Text Command Palette
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            VS Code–style command palette for transforming selected text
            anywhere on the web
          </p>
          <div className="bg-gray-800 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-400">Shortcut:</p>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">
              Cmd + Shift + O
            </kbd>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Universal Support</h3>
              <p className="text-gray-300">
                Works on any website with input fields, textareas, and
                contenteditable elements. Transform text in forms, rich text
                editors, and more.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                {commands.length} Powerful Commands
              </h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Case transformations (upper, lower, title, sentence)</li>
                <li>• Programming formats (camelCase, kebab-case)</li>
                <li>• Text utilities (reverse, trim, remove punctuation)</li>
                <li>• Analysis tools (word/character count)</li>
                <li>• Clipboard operations</li>
                <li>• Date formatting (IST timestamps)</li>
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
            Built by{" "}
            <a
              href="https://shubhamgupta.dev/"
              className="text-blue-400 hover:text-blue-300"
            >
              Shubham Gupta
            </a>
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://shubhamgupta.dev/"
              className="text-gray-400 hover:text-white"
            >
              Portfolio
            </a>
            <a
              href="https://www.linkedin.com/in/shubhamgupta001/"
              className="text-gray-400 hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
