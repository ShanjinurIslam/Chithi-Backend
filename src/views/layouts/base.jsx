var React = require('react');

function BaseLayout(props) {
  return (
      <html lang="en">
      <head>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>{props.title}</title>
          <link rel="stylesheet" href="/css/bootstrap.min.css"></link>
          
      </head>
      <body>
        {props.children}
      </body>
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossOrigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossOrigin="anonymous"></script>
      <script src="/js/bootstrap.min.js"></script>
      </html>
  );
}

module.exports = BaseLayout;