(() => {
  if (window.__TEXT_CMD_PALETTE__) return;
  window.__TEXT_CMD_PALETTE__ = true;

  const COMMANDS = [
    { id: "upper", label: "toUpperCase", icon: '<svg viewBox="0 0 24 24"><polyline points="4,7 4,4 20,4 20,7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>', run: t => t.toUpperCase() },
    { id: "lower", label: "toLowerCase", icon: '<svg viewBox="0 0 24 24"><polyline points="4,7 4,4 20,4 20,7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>', run: t => t.toLowerCase() },
    { id: "title", label: "toTitleCase", icon: '<svg viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>', run: t =>
        t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    },
    { id: "sentence", label: "toSentenceCase", icon: '<svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>', run: t =>
        t.replace(/(^\w|\.\s*\w)/g, c => c.toUpperCase())
    },
    { id: "camel", label: "toCamelCase", icon: '<svg viewBox="0 0 24 24"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg>', run: t =>
        t.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '')
    },
    { id: "kebab", label: "toKebabCase", icon: '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line></svg>', run: t =>
        t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    },
    { id: "reverse", label: "Reverse Text", icon: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>', run: t => t.split('').reverse().join('') },
    { id: "trim", label: "Trim Whitespace", icon: '<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M20 4L8.12 15.88"></path><path d="M14.47 14.48L20 20"></path><path d="M8.12 8.12L12 12"></path></svg>', run: t => t.trim() },
    { id: "remove-punct", label: "Remove Punctuation", icon: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', run: t => t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') },
    { id: "count-words", label: "Count Words", icon: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>', run: t => `Words: ${t.trim().split(/\s+/).length}, Characters: ${t.length}` },
    { id: "copy", label: "Copy to Clipboard", icon: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>', run: t => { navigator.clipboard.writeText(t); return t; } },
    { id: "format-date-ist", label: "Format Date to IST", icon: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', run: t => {
        t = t.trim();
        let date;
        if (!isNaN(t)) {
          // Assume milliseconds timestamp
          date = new Date(parseInt(t));
        } else {
          // Try parsing as date string
          date = new Date(t);
        }
        if (isNaN(date.getTime())) return t; // Invalid date
        return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    } }
  ];

  let lastCommand = localStorage.getItem("tcp:lastCommand");
  let activeIndex = 0;
  let editableElement = null;
  let selectionStart = 0;
  let selectionEnd = 0;
  let rangeObj = null;
  let shadowRoot, paletteEl;

  // Default shortcut: Cmd+Shift+O on Mac, Ctrl+Shift+O on other platforms
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const currentShortcut = {
    ctrlKey: !isMac,
    metaKey: isMac,
    shiftKey: true,
    key: 'o'
  };

  // Listen for keyboard shortcuts
  document.addEventListener("keydown", e => {
    if (!currentShortcut) return;

    if (e.ctrlKey === currentShortcut.ctrlKey &&
        e.metaKey === currentShortcut.metaKey &&
        e.shiftKey === currentShortcut.shiftKey &&
        e.key.toLowerCase() === currentShortcut.key) {
      e.preventDefault();
      openPalette();
    }
  });

  function openPalette() {
    const activeElement = document.activeElement;
    const isEditable = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true');

    if (isEditable) {
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        if (start !== end) {
          editableElement = activeElement;
          selectionStart = start;
          selectionEnd = end;
          rangeObj = null;
        } else {
          editableElement = null; // no selection
        }
      } else if (activeElement.contentEditable === 'true') {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (!range.collapsed && activeElement.contains(range.commonAncestorContainer)) {
            editableElement = activeElement;
            rangeObj = range.cloneRange();
            selectionStart = 0;
            selectionEnd = 0;
          } else {
            editableElement = null;
          }
        } else {
          editableElement = null;
        }
      } else {
        editableElement = null;
      }
    } else {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (!range.collapsed) {
          editableElement = null;
          rangeObj = range.cloneRange();
        } else {
          editableElement = null; // no selection, but open anyway
        }
      } else {
        editableElement = null;
      }
    }

    closePalette();

    const host = document.createElement("div");
    shadowRoot = host.attachShadow({ mode: "open" });
    document.documentElement.appendChild(host);

    shadowRoot.innerHTML = `
      <style>
        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.09);
          backdrop-filter: blur(1px);
          z-index: 999998;
        }
        .palette {
          position: fixed;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          max-width: 90vw;
          background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          border-radius: 12px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1);
          z-index: 999999;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .palette input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255,255,255,0.05);
          border: none;
          color: white;
          outline: none;
          font-size: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .palette input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .palette ul {
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 300px;
          overflow-y: auto;
        }
        .palette li {
          padding: 12px 20px;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.15s ease;
        }
        .palette li .icon {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .palette li .icon svg {
          width: 18px;
          height: 18px;
          color: inherit;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .palette li .label {
          flex: 1;
        }
        .palette li.active,
        .palette li:hover {
          background: rgba(0, 122, 255, 0.2);
          color: #ffffff;
        }
        .palette li.active {
          background: rgba(0, 122, 255, 0.3);
          box-shadow: inset 0 0 0 1px rgba(0, 122, 255, 0.5);
        }
        .palette::-webkit-scrollbar {
          width: 6px;
        }
        .palette::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        .palette::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }
        .palette::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }
      </style>
      <div class="backdrop"></div>
      <div class="palette">
        <input placeholder="Type a command or search…" />
        <ul></ul>
      </div>
    `;

    const backdrop = shadowRoot.querySelector('.backdrop');
    backdrop.addEventListener('click', closePalette);

    paletteEl = shadowRoot.querySelector(".palette");
    const input = shadowRoot.querySelector("input");
    const list = shadowRoot.querySelector("ul");

    input.focus();
    renderList(COMMANDS, list);

    input.addEventListener("input", () =>
      renderList(fuzzyFilter(input.value), list)
    );

    input.addEventListener("keydown", e => {
      const items = list.querySelectorAll("li");

      if (e.key === "ArrowDown") {
        activeIndex = (activeIndex + 1) % items.length;
        updateActive(items);
      }

      if (e.key === "ArrowUp") {
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateActive(items);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        items[activeIndex]?.click();
      }

      if (e.key === "Escape") {
        closePalette();
      }
    });
  }

  function renderList(cmds, list) {
    list.innerHTML = "";

    // Sort commands so last used command appears first
    let sortedCmds = [...cmds];
    if (lastCommand) {
      const lastCmdIndex = sortedCmds.findIndex(c => c.id === lastCommand);
      if (lastCmdIndex !== -1) {
        const lastCmd = sortedCmds.splice(lastCmdIndex, 1)[0];
        sortedCmds.unshift(lastCmd);
        activeIndex = 0; // Last used command is now at index 0
      } else {
        activeIndex = 0;
      }
    } else {
      activeIndex = 0;
    }

    sortedCmds.forEach(cmd => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="icon">${cmd.icon}</span><span class="label">${cmd.label}</span>`;
      li.onclick = () => run(cmd);
      list.appendChild(li);
    });

    updateActive(list.querySelectorAll("li"));
  }

  function updateActive(items) {
    items.forEach((el, i) => {
      el.classList.toggle("active", i === activeIndex);
      if (i === activeIndex) {
        // Scroll the list container to show the active item
        const list = el.parentElement;
        const itemTop = el.offsetTop;
        const itemHeight = el.offsetHeight;
        const listHeight = list.clientHeight;
        const scrollTop = list.scrollTop;

        // Check if item is above visible area
        if (itemTop < scrollTop) {
          list.scrollTop = itemTop;
        }
        // Check if item is below visible area
        else if (itemTop + itemHeight > scrollTop + listHeight) {
          list.scrollTop = itemTop + itemHeight - listHeight;
        }
      }
    });
  }

  function fuzzyFilter(query) {
    if (!query) return COMMANDS;
    query = query.toLowerCase();

    return COMMANDS.filter(c =>
      [...query].every(ch =>
        c.label.toLowerCase().includes(ch)
      )
    );
  }

  function run(cmd) {
    try {
      if (editableElement) {
        if (editableElement.tagName === 'INPUT' || editableElement.tagName === 'TEXTAREA') {
          const text = editableElement.value.substring(selectionStart, selectionEnd);
          const newText = cmd.run(text);

          // Use execCommand for proper undo support
          editableElement.focus();
          editableElement.setSelectionRange(selectionStart, selectionEnd);
          document.execCommand('insertText', false, newText);

          // Update selection to end of inserted text
          const newSelectionStart = selectionStart + newText.length;
          editableElement.setSelectionRange(newSelectionStart, newSelectionStart);
        } else if (editableElement.contentEditable === 'true') {
          // For contentEditable, use execCommand for undo support
          const text = rangeObj.toString();
          const newText = cmd.run(text);

          // Select the range and use insertText command
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(rangeObj);
          document.execCommand('insertText', false, newText);

          // Clear selection and focus
          selection.removeAllRanges();
          editableElement.focus();
        }
      } else {
        // For non-editable content
        if (cmd.id === 'format-date-ist') {
          const text = rangeObj.toString();
          const newText = cmd.run(text);
          const input = shadowRoot.querySelector("input");
          input.value = newText;
          input.select();
          localStorage.setItem("tcp:lastCommand", cmd.id);
          return;
        }
        const text = rangeObj.toString();
        const newText = cmd.run(text);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(rangeObj);
        document.execCommand('insertText', false, newText);

        // Clear selection
        selection.removeAllRanges();
      }

      localStorage.setItem("tcp:lastCommand", cmd.id);
      closePalette();
    } catch (error) {
      console.error('Error running command:', error);
      closePalette();
    }
  }

  function closePalette() {
    shadowRoot?.host?.remove();
    shadowRoot = null;
  }
})();
