export default function Home() {
  return (
    <>
      <main className="wrap">
        <section className="card">
          <span className="badge">modo construção</span>

          <h1>
            Continue.<br />
            Mesmo quando parecer lento.
          </h1>

          <p>
            Consistência vira habilidade. Habilidade vira confiança.
            Confiança vira resultado.
          </p>

          <footer>
            consistência &gt; perfeição
          </footer>
        </section>
      </main>
        <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          background: #070a12;
        }
      `}</style>
      
      <style jsx>{`
        main {
          height: 100vh;
          display: grid;
          place-items: center;
          background: radial-gradient(
              600px 300px at 50% 30%,
              rgba(34, 211, 238, 0.12),
              transparent 60%
            ),
            #070a12;
          color: rgba(255, 255, 255, 0.9);
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .card {
          max-width: 720px;
          padding: 48px 40px;
          border-radius: 24px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.07),
            rgba(255, 255, 255, 0.04)
          );
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-align: center;
        }

        .badge {
          display: inline-block;
          padding: 6px 14px;
          margin-bottom: 24px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.4px;
          color: #22d3ee;
          background: rgba(34, 211, 238, 0.15);
          border: 1px solid rgba(34, 211, 238, 0.25);
        }

        h1 {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          letter-spacing: -0.6px;
          margin: 0 0 16px;
          line-height: 1.1;
        }

        p {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        footer {
          margin-top: 36px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.3px;
        }
      `}</style>
    </>
  );
}