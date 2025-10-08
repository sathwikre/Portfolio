# Portfolio Site

Simple, responsive portfolio you can customize. Built with vanilla HTML/CSS/JS.

## Quick start

1. Open `index.html` in your browser (double-click) to view locally.
2. Or use a lightweight dev server (recommended for live reload):
   - VS Code: install "Live Server" extension and click "Go Live".
   - Node users: `npx serve .` then open the shown URL.

## Customize

- Update your details in `index.html`:
  - Replace "Your Name", email, and links in header/Contact.
  - Edit the Projects cards: titles, descriptions, and links.
  - Update Experience timeline entries.
- Replace the resume link if desired: the CTA points to `./sathwu.pdf`.
- Theme: click the moon/sun button to switch; preference is saved.

Pro tip for recruiters / HR
- Use the "Hire me" mailto button on the home hero to quickly start a hiring conversation. The site also includes a print-friendly layout — open the page and print to PDF to get a clean single-page résumé view.

## Deploy

- GitHub Pages
  1. Create a repo and push these files.
  2. In repo Settings → Pages, set Source to `main` branch `/ (root)`.
  3. Your site will be live at the provided URL.

- Netlify
  1. Drag-and-drop the folder at `https://app.netlify.com/drop`.
  2. Or connect your Git repository and deploy from `main`.

## Structure

```
index.html   # markup and sections
styles.css   # theme, layout, responsive styles
script.js    # nav toggle, smooth scroll, theme persistence
sathwu.pdf   # your résumé (already in workspace)
```

## License

MIT


