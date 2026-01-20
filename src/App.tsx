import { commands } from "./commands";
import {
  Type,
  FileText,
  BookOpen,
  Code,
  Minus,
  RotateCcw,
  Scissors,
  X,
  BarChart3,
  Clipboard,
  Calendar,
  Palette,
  Zap,
  Globe,
  Rocket,
} from "lucide-react";

const iconMap = {
  Type,
  FileText,
  BookOpen,
  Code,
  Minus,
  RotateCcw,
  Scissors,
  X,
  BarChart3,
  Clipboard,
  Calendar,
  Palette,
  Zap,
  Globe,
  Rocket,
};

function getIcon(iconName: string) {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent size={20} /> : null;
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Text Command Palette
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            VS Code–style command palette for transforming selected text
            anywhere on the web with powerful commands and instant results.
          </p>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 inline-block border border-gray-700/50 shadow-xl">
            <p className="text-sm text-gray-400 mb-2">Keyboard Shortcut</p>
            <kbd className="px-4 py-2 bg-gray-700 rounded-lg text-sm font-mono shadow-inner">
              ⌘ + ⇧ + O
            </kbd>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center">
            Powerful Commands
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Palette size={30} />
                Text Transformations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {commands.slice(0, 6).map((cmd) => (
                  <div
                    key={cmd.id}
                    className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    {getIcon(cmd.icon)}
                    <span className="text-sm">{cmd.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Zap size={30} />
                Utilities & Tools
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {commands.slice(6).map((cmd) => (
                  <div
                    key={cmd.id}
                    className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    {getIcon(cmd.icon)}
                    <span className="text-sm">{cmd.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Globe size={30} />
                Universal Support
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Works seamlessly across all websites with input fields,
                textareas, and contenteditable elements. Transform text in
                forms, rich text editors, social media, and more with a single
                keyboard shortcut.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Rocket size={30} />
                Instant Results
              </h3>
              <p className="text-gray-300 leading-relaxed">
                No page reloads or context switches. Apply transformations
                instantly with fuzzy search, keyboard navigation, and smart
                command suggestions. Your workflow stays uninterrupted.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-8">Get Started</h2>
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">Installation</h3>
            <ol className="text-gray-300 space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Download the extension files</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>Open Chrome extensions page</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>Enable Developer mode</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>Load unpacked extension</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  5
                </span>
                <span className="text-green-400">Start transforming text!</span>
              </li>
            </ol>
          </div>
        </div>

        <footer className="text-center mt-16 pt-8 border-t border-gray-700/50">
          <p className="text-gray-400 mb-6">
            Built with ❤️ by{" "}
            <a
              href="https://shubhamgupta.dev/"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Shubham Gupta
            </a>
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://shubhamgupta.dev/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Portfolio
            </a>
            <a
              href="https://www.linkedin.com/in/shubhamgupta001/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/yourusername/text-command-palette"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
