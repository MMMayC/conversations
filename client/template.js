function template(initialState = {}, content = "") {
  const scripts = `<script>
                   window.__STATE__ = ${JSON.stringify(initialState)}
                </script>
                <script src="public/client.js"></script>
                `;
  const page = `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="utf-8">
                <title> The Conversation </title>
                <link href="https://fonts.googleapis.com/css?family=Asap" rel="stylesheet">
              </head>
              <body>
                <div class="content">
                   <div id="app" class="wrap-inner">${content}</div>
                </div>
                  ${scripts}
              </body>
              </html>
              `;

  return page;
}

module.exports = template;
