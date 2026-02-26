# DS-Algo Playground

Interactive educational website for learning Data Structures and Algorithms through visualizations, multi-language code examples, and quizzes.

## Features

- **Interactive Visualizations** — Canvas-based animations with play/pause, step-through, speed control, and reset
- **Multi-Language Code** — Python, Java, and C++ implementations with syntax highlighting and copy button
- **Knowledge Quizzes** — Multiple-choice questions with explanations and score tracking
- **Progress Tracking** — localStorage-based progress saved across sessions
- **Dark/Light Themes** — Auto-detects OS preference, manual toggle with persistence
- **Keyboard Shortcuts** — Press `?` to see all shortcuts
- **Complexity Cheat Sheet** — Searchable, sortable reference table
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Print Friendly** — Clean output when printing topic pages

## Topics (V1)

| Topic | Category | Visualization |
|-------|----------|---------------|
| Arrays | Data Structure | Cell insert/delete/search with shifting animation |
| Linked Lists | Data Structure | Node-pointer traversal with arrow animations |
| Bubble Sort | Sorting | Bar chart with compare/swap step-through |
| Binary Search | Searching | Sorted array with low/mid/high pointer arrows |

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/DS-Algo-Playground.git
   cd DS-Algo-Playground
   ```

2. Start a local server (required for `fetch()` calls to load JSON data):
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Node.js
   npx serve .
   ```

3. Open `http://localhost:8000` in your browser.

### GitHub Pages Deployment

1. Push to a GitHub repository
2. Go to **Settings > Pages**
3. Set source to **Deploy from a branch**, select `main` branch and `/ (root)` folder
4. The `.nojekyll` file is included to skip Jekyll processing

## Tech Stack

- Vanilla HTML, CSS, JavaScript — no frameworks or build tools
- Canvas API for all visualizations
- CSS Custom Properties for theming
- localStorage for progress persistence
- Regex-based syntax highlighting

## Project Structure

```
DS-Algo-Playground/
├── index.html              # Home page
├── complexity.html         # Cheat sheet
├── about.html              # About page
├── topics/                 # Topic pages
│   ├── arrays.html
│   ├── linked-lists.html
│   ├── bubble-sort.html
│   └── binary-search.html
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
│   └── topics/             # Topic-specific visualizations
├── data/                   # JSON data files
└── assets/                 # Favicon
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `t` | Toggle dark/light theme |
| `/` | Focus search |
| `Space` | Play/Pause visualization |
| `←` | Step backward |
| `→` | Step forward |
| `?` | Show shortcuts modal |
| `Esc` | Close modal/search |

## License

MIT
