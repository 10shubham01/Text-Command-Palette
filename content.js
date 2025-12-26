(() => {
  if (window.__TEXT_CMD_PALETTE__) return;
  window.__TEXT_CMD_PALETTE__ = true;

  const COMMANDS = [
    { id: "upper", label: "toUpperCase", run: t => t.toUpperCase() },
    { id: "lower", label: "toLowerCase", run: t => t.toLowerCase() },
    { id: "title", label: "toTitleCase", run: t =>
        t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    },
    { id: "sentence", label: "toSentenceCase", run: t =>
        t.replace(/(^\w|\.\s*\w)/g, c => c.toUpperCase())
    },
    { id: "camel", label: "toCamelCase", run: t =>
        t.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '')
    },
    { id: "kebab", label: "toKebabCase", run: t =>
        t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    },
    { id: "reverse", label: "Reverse Text", run: t => t.split('').reverse().join('') },
    { id: "trim", label: "Trim Whitespace", run: t => t.trim() },
    { id: "remove-punct", label: "Remove Punctuation", run: t => t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') },
    { id: "count-words", label: "Count Words", run: t => `Words: ${t.trim().split(/\s+/).length}, Characters: ${t.length}` },
    { id: "copy", label: "Copy to Clipboard", run: t => { navigator.clipboard.writeText(t); return t; } }
  ];

  let lastCommand = localStorage.getItem("tcp:lastCommand");
  let activeIndex = 0;
  let editableElement = null;
  let selectionStart = 0;
  let selectionEnd = 0;
  let rangeObj = null;
  let shadowRoot, paletteEl;

  document.addEventListener("keydown", e => {
    if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "o") {
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
          background: rgba(0,0,0,0.5);
          z-index: 999998;
        }
        .palette {
          position: fixed;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          background: #1e1e1e;
          color: white;
          font-family: system-ui, sans-serif;
          border-radius: 6px;
          box-shadow: 0 20px 50px rgba(0,0,0,.6);
          z-index: 999999;
          overflow: hidden;
        }
        .palette input {
          width: 100%;
          padding: 10px;
          background: #252526;
          border: none;
          color: white;
          outline: none;
          font-size: 14px;
        }
        .palette ul {
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 200px;
          overflow-y: auto;
        }
        .palette li {
          padding: 8px 10px;
          cursor: pointer;
          font-size: 14px;
        }
        .palette li.active,
        .palette li:hover {
          background: #094771;
        }
      </style>
      <div class="backdrop"></div>
      <div class="palette">
        <input placeholder="Type a command…" />
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

    if (lastCommand) {
      const index = COMMANDS.findIndex(c => c.id === lastCommand);
      if (index !== -1) activeIndex = index;
    }
  }

  function renderList(cmds, list) {
    list.innerHTML = "";
    activeIndex = 0;

    cmds.forEach(cmd => {
      const li = document.createElement("li");
      li.textContent = cmd.label;
      li.onclick = () => run(cmd);
      list.appendChild(li);
    });

    updateActive(list.querySelectorAll("li"));
  }

  function updateActive(items) {
    items.forEach((el, i) => {
      el.classList.toggle("active", i === activeIndex);
      if (i === activeIndex) {
        el.scrollIntoView({ block: "nearest", inline: "nearest" });
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
    if (editableElement) {
      if (editableElement.tagName === 'INPUT' || editableElement.tagName === 'TEXTAREA') {
        const text = editableElement.value.substring(selectionStart, selectionEnd);
        const newText = cmd.run(text);
        const before = editableElement.value.substring(0, selectionStart);
        const after = editableElement.value.substring(selectionEnd);
        editableElement.value = before + newText + after;
        editableElement.selectionStart = editableElement.selectionEnd = selectionStart + newText.length;
        editableElement.focus();
      } else if (editableElement.contentEditable === 'true') {
        // For contentEditable, use the range
        const text = rangeObj.toString();
        const newText = cmd.run(text);
        rangeObj.deleteContents();
        rangeObj.insertNode(document.createTextNode(newText));
        window.getSelection().removeAllRanges();
        editableElement.focus();
      }
    } else {
      const text = rangeObj.toString();
      const newText = cmd.run(text);
      rangeObj.deleteContents();
      rangeObj.insertNode(document.createTextNode(newText));
      window.getSelection().removeAllRanges();
    }

    localStorage.setItem("tcp:lastCommand", cmd.id);
    closePalette();
  }

  function closePalette() {
    shadowRoot?.host?.remove();
    shadowRoot = null;
  }
})();
