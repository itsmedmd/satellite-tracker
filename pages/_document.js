import Document, { Html, Head, Main, NextScript } from "next/document";

class AppDocument extends Document {
  static async getInitialProps(context) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/static/favicon.ico" type="image/x-icon" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;700&display=swap"
            rel="stylesheet" />
          <meta name="title" content="Front-end developer Deimantas Butėnas" />
          <meta
            name="description"
            content="Portfolio website of a front-end developer Deimantas Butėnas."
          />
          <meta
            name="keywords"
            content="deimantas butėnas, deimantas butenas, web development, frontend, front-end,
              front end, front end development, front end developer, portfolio, design, web design,
              react, vue, javascript, typescript, js, ts, html, css, scss, sass, git, aws"
          />
          <link rel="canonical" href="https://www.deimantasb.com/" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.deimantasb.com/" />
          <meta
            property="og:title"
            content="Front-end developer Deimantas Butėnas"
          />
          <meta
            property="og:description"
            content="Portfolio website of a front-end developer Deimantas Butėnas where you can see his work!"
          />
          <meta
            property="og:image"
            content="https://www.deimantasb.com/meta-image.png"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://www.deimantasb.com/" />
          <meta
            property="twitter:title"
            content="Front-end developer Deimantas Butėnas"
          />
          <meta
            property="twitter:description"
            content="Portfolio website of a front-end developer Deimantas Butėnas where you can see his work!"
          />
          <meta
            property="twitter:image"
            content="https://www.deimantasb.com/meta-image.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  };
}

export default AppDocument;
