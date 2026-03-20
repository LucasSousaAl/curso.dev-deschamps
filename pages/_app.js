export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html,
        body,
        #__next {
          margin: 0;
          padding: 0;
          min-height: 100%;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
