"use strict";

function template() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var scripts = "<script>\n                   window.__STATE__ = ".concat(JSON.stringify(initialState), "\n                </script>\n                <script src=\"public/client.js\"></script>\n                ");
  var page = "<!DOCTYPE html>\n              <html lang=\"en\">\n              <head>\n                <meta charset=\"utf-8\">\n                <title> The Conversation </title>\n                <link href=\"https://fonts.googleapis.com/css?family=Asap\" rel=\"stylesheet\">\n              </head>\n              <body>\n                <div class=\"content\">\n                   <div id=\"app\" class=\"wrap-inner\">".concat(content, "</div>\n                </div>\n                  ").concat(scripts, "\n              </body>\n              </html>\n              ");
  return page;
}

module.exports = template;