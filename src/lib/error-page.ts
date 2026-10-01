export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AZ Solution — Server Error</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Arial, sans-serif; background: #f8fafc; color: #0f172a; }
      main { max-width: 560px; padding: 32px; text-align: center; }
      h1 { margin: 0 0 12px; font-size: 28px; }
      p { margin: 0; color: #475569; line-height: 1.6; }
    </style>
  </head>
  <body>
    <main>
      <h1>Something went wrong</h1>
      <p>Please refresh the page and try again.</p>
    </main>
  </body>
</html>`;
}
