import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

function App() {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [commands] = useState([
    { id: "upper", label: "toUpperCase", run: (t: string) => t.toUpperCase() },
    { id: "lower", label: "toLowerCase", run: (t: string) => t.toLowerCase() },
    { id: "title", label: "toTitleCase", run: (t: string) =>
        t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    }
  ])

  const runCommand = (cmd: typeof commands[0]) => {
    setText(cmd.run(text))
    setOpen(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Text Command Palette</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        className="w-full h-32 p-2 border rounded mb-4"
      />
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Command Palette
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Commands">
            {commands.map((cmd) => (
              <CommandItem
                key={cmd.id}
                onSelect={() => runCommand(cmd)}
              >
                {cmd.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

export default App