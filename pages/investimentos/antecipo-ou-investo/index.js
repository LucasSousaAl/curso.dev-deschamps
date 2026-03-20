import { useState, useEffect } from "react";

const fmt = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtPct = (v) => `${v.toFixed(4)}%`;

export default function App() {
  const [totalCompra, setTotalCompra] = useState(1000);
  const [numParcelas, setNumParcelas] = useState(6);
  const [desconto, setDesconto] = useState(30);
  const [taxaMensal, setTaxaMensal] = useState(1.0);
  const [resultado, setResultado] = useState(null);
  const [animating, setAnimating] = useState(false);

  const calcular = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    const valorAntecipado = totalCompra - desconto;
    const parcela = totalCompra / numParcelas;
    const taxa = taxaMensal / 100;

    // Valor presente das parcelas futuras (quanto valeria hoje pagar as parcelas)
    // VP = PMT * [1 - (1+i)^-n] / i
    let vpParcelas = 0;
    for (let t = 1; t <= numParcelas; t++) {
      vpParcelas += parcela / Math.pow(1 + taxa, t);
    }

    // Se eu mantiver o dinheiro investido e pagar as parcelas mês a mês:
    // Quanto sobra no investimento após pagar todas as parcelas?
    let saldo = totalCompra;
    const evolucaoInvestimento = [];
    for (let t = 1; t <= numParcelas; t++) {
      saldo = saldo * (1 + taxa) - parcela;
      evolucaoInvestimento.push({
        mes: t,
        saldo: saldo,
        parcela: parcela,
      });
    }
    const sobradoInvestindo = saldo;

    // Rendimento total bruto do investimento (sem pagar parcelas)
    const rendimentoBruto =
      totalCompra * (Math.pow(1 + taxa, numParcelas) - 1);

    // Economia real: antecipando economizo `desconto`, mas perco o rendimento que teria
    // Economia líquida de antecipar = desconto - rendimento que teria no período
    const economiaNeta = desconto - rendimentoBruto;
    const valeAntecipar = sobradoInvestindo < 0 ? true : desconto > rendimentoBruto;

    // Qual taxa tornaria indiferente? (taxa de break-even)
    // Resolver: sum(parcela/(1+i)^t, t=1..n) = valorAntecipado
    // Usamos busca binária
    let low = 0,
      high = 1;
    for (let iter = 0; iter < 100; iter++) {
      const mid = (low + high) / 2;
      let vp = 0;
      for (let t = 1; t <= numParcelas; t++) vp += parcela / Math.pow(1 + mid, t);
      if (vp > valorAntecipado) low = mid;
      else high = mid;
    }
    const taxaBreakEven = ((low + high) / 2) * 100;

    setResultado({
      valorAntecipado,
      parcela,
      rendimentoBruto,
      sobradoInvestindo,
      valeAntecipar,
      economiaNeta,
      taxaBreakEven,
      evolucaoInvestimento,
      vpParcelas,
    });
  };

  useEffect(() => {
    calcular();
  }, []);

  const verde = "#00e5a0";
  const vermelho = "#ff4757";
  const amarelo = "#ffd32a";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0e1a",
        fontFamily: "'Courier New', monospace",
        color: "#e0e6f0",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,229,160,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.4em",
              color: verde,
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            ◈ Calculadora Financeira ◈
          </div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            ANTECIPAR
            <span style={{ color: verde }}> vs </span>
            INVESTIR
          </h1>
          <p
            style={{
              marginTop: "0.75rem",
              color: "#8899bb",
              fontSize: "0.9rem",
              maxWidth: 440,
              margin: "0.75rem auto 0",
              lineHeight: 1.6,
            }}
          >
            Vale mais quitar a dívida com desconto ou manter o dinheiro
            rendendo?
          </p>
        </div>

        {/* Input Panel */}
        <div
          style={{
            background: "#111827",
            border: "1px solid #1e2d45",
            borderRadius: 16,
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "#556",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            — Parâmetros da Compra —
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1.25rem",
            }}
          >
            <InputField
              label="Total da Compra"
              prefix="R$"
              value={totalCompra}
              onChange={setTotalCompra}
              step={50}
              min={1}
            />
            <InputField
              label="Nº de Parcelas"
              suffix="x"
              value={numParcelas}
              onChange={setNumParcelas}
              step={1}
              min={2}
              max={48}
              integer
            />
            <InputField
              label="Desconto p/ Antecipar"
              prefix="R$"
              value={desconto}
              onChange={setDesconto}
              step={5}
              min={0}
            />
            <InputField
              label="Rentabilidade Mensal"
              suffix="%"
              value={taxaMensal}
              onChange={setTaxaMensal}
              step={0.1}
              min={0.01}
              decimals={2}
            />
          </div>

          <button
            onClick={calcular}
            style={{
              marginTop: "1.75rem",
              width: "100%",
              padding: "0.85rem",
              background: verde,
              color: "#0a0e1a",
              border: "none",
              borderRadius: 10,
              fontSize: "0.85rem",
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = 0.85)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            ▶ Calcular
          </button>
        </div>

        {/* Results */}
        {resultado && (
          <div
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "all 0.4s ease",
            }}
          >
            {/* Verdict */}
            <div
              style={{
                background: resultado.valeAntecipar
                  ? "linear-gradient(135deg, #0d2a1e, #0f1f14)"
                  : "linear-gradient(135deg, #2a0d0d, #1f0f0f)",
                border: `2px solid ${resultado.valeAntecipar ? verde : vermelho}`,
                borderRadius: 16,
                padding: "2rem",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {resultado.valeAntecipar ? "✅" : "📈"}
              </div>
              <div
                style={{
                  fontSize: "clamp(1.2rem, 4vw, 1.7rem)",
                  fontWeight: 900,
                  color: resultado.valeAntecipar ? verde : vermelho,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {resultado.valeAntecipar
                  ? "Vale Antecipar!"
                  : "Mantenha Investido!"}
              </div>
              <p
                style={{
                  marginTop: "0.75rem",
                  color: "#aab",
                  fontSize: "0.9rem",
                  maxWidth: 480,
                  margin: "0.75rem auto 0",
                  lineHeight: 1.7,
                }}
              >
                {resultado.valeAntecipar
                  ? `O desconto de ${fmt(desconto)} supera o rendimento de ${fmt(resultado.rendimentoBruto)} que você teria no investimento. Antecipar é a escolha mais inteligente.`
                  : `Seu investimento renderia ${fmt(resultado.rendimentoBruto)} — mais que o desconto de ${fmt(desconto)}. Mantenha o dinheiro trabalhando por você.`}
              </p>
            </div>

            {/* Metrics Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <MetricCard
                label="Valor p/ Antecipar"
                value={fmt(resultado.valorAntecipado)}
                sub={`Economiza ${fmt(desconto)} no total`}
                color={verde}
              />
              <MetricCard
                label="Rendimento do Investimento"
                value={fmt(resultado.rendimentoBruto)}
                sub={`em ${numParcelas} meses à ${taxaMensal}%/mês`}
                color={resultado.rendimentoBruto > desconto ? verde : vermelho}
              />
              <MetricCard
                label="Saldo Final Investindo"
                value={fmt(resultado.sobradoInvestindo)}
                sub="após pagar todas as parcelas"
                color={resultado.sobradoInvestindo >= 0 ? verde : vermelho}
              />
              <MetricCard
                label="Taxa de Break-even"
                value={fmtPct(resultado.taxaBreakEven)}
                sub="taxa que iguala as opções"
                color={amarelo}
              />
            </div>

            {/* Breakdown Table */}
            <div
              style={{
                background: "#111827",
                border: "1px solid #1e2d45",
                borderRadius: 16,
                padding: "1.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: "#556",
                  marginBottom: "1.25rem",
                  textTransform: "uppercase",
                }}
              >
                — Evolução Mês a Mês (Cenário: Manter Investido) —
              </div>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.8rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #1e2d45",
                        color: "#667",
                        textAlign: "left",
                      }}
                    >
                      {["Mês", "Parcela", "Saldo Após Parcela", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "0.5rem 0.75rem",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              fontSize: "0.65rem",
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.evolucaoInvestimento.map((row, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid #151f30",
                          background: i % 2 === 0 ? "transparent" : "#0d1525",
                        }}
                      >
                        <td style={{ padding: "0.6rem 0.75rem", color: "#889" }}>
                          {row.mes}
                        </td>
                        <td
                          style={{ padding: "0.6rem 0.75rem", color: vermelho }}
                        >
                          -{fmt(row.parcela)}
                        </td>
                        <td
                          style={{
                            padding: "0.6rem 0.75rem",
                            color: row.saldo >= 0 ? verde : vermelho,
                            fontWeight: 700,
                          }}
                        >
                          {fmt(row.saldo)}
                        </td>
                        <td style={{ padding: "0.6rem 0.75rem" }}>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              padding: "0.2rem 0.5rem",
                              borderRadius: 4,
                              background:
                                row.saldo >= 0 ? "#0d2a1e" : "#2a0d0d",
                              color: row.saldo >= 0 ? verde : vermelho,
                              letterSpacing: "0.05em",
                            }}
                          >
                            {row.saldo >= 0 ? "OK" : "NEGATIVO"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Summary */}
            <div
              style={{
                background: "#111827",
                border: "1px solid #1e2d45",
                borderRadius: 16,
                padding: "1.75rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: "#556",
                  marginBottom: "1.25rem",
                  textTransform: "uppercase",
                }}
              >
                — Resumo Comparativo —
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <SummaryBox
                  title="Se Antecipar"
                  icon="⚡"
                  items={[
                    {
                      label: "Paga hoje",
                      value: fmt(resultado.valorAntecipado),
                      color: vermelho,
                    },
                    {
                      label: "Economiza",
                      value: fmt(desconto),
                      color: verde,
                    },
                    {
                      label: "Rende depois",
                      value: "R$ 0,00",
                      color: "#556",
                    },
                    {
                      label: "Resultado líquido",
                      value: `+${fmt(desconto)}`,
                      color: verde,
                      bold: true,
                    },
                  ]}
                />
                <SummaryBox
                  title="Se Investir"
                  icon="📊"
                  items={[
                    {
                      label: "Mantém investido",
                      value: fmt(totalCompra),
                      color: verde,
                    },
                    {
                      label: "Rendimento bruto",
                      value: `+${fmt(resultado.rendimentoBruto)}`,
                      color: verde,
                    },
                    {
                      label: "Total de parcelas",
                      value: `-${fmt(totalCompra)}`,
                      color: vermelho,
                    },
                    {
                      label: "Saldo final",
                      value: fmt(resultado.sobradoInvestindo),
                      color:
                        resultado.sobradoInvestindo >= 0 ? verde : vermelho,
                      bold: true,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "#334",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
          }}
        >
          ◈ Os cálculos assumem juros compostos e parcelas fixas mensais ◈
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min,
  max,
  integer,
  decimals = 0,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          color: "#667",
          textTransform: "uppercase",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#0d1525",
          border: "1px solid #1e2d45",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {prefix && (
          <span
            style={{
              padding: "0 0.6rem",
              color: "#556",
              fontSize: "0.8rem",
              borderRight: "1px solid #1e2d45",
            }}
          >
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => {
            const v = integer
              ? parseInt(e.target.value)
              : parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e0e6f0",
            fontSize: "0.95rem",
            fontWeight: 700,
            padding: "0.6rem 0.75rem",
            fontFamily: "inherit",
            minWidth: 0,
          }}
        />
        {suffix && (
          <span
            style={{
              padding: "0 0.6rem",
              color: "#556",
              fontSize: "0.8rem",
              borderLeft: "1px solid #1e2d45",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e2d45",
        borderRadius: 12,
        padding: "1.25rem",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: "#556",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.3rem",
          fontWeight: 900,
          color: color,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.7rem", color: "#445", marginTop: "0.3rem" }}>
        {sub}
      </div>
    </div>
  );
}

function SummaryBox({ title, icon, items }) {
  return (
    <div
      style={{
        background: "#0d1525",
        borderRadius: 10,
        padding: "1.25rem",
        border: "1px solid #1a2540",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span>{icon}</span>
        <span style={{ letterSpacing: "0.05em" }}>{title}</span>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.35rem 0",
            borderBottom:
              i < items.length - 1 ? "1px solid #151f30" : "none",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "#667" }}>
            {item.label}
          </span>
          <span
            style={{
              fontSize: item.bold ? "0.9rem" : "0.78rem",
              fontWeight: item.bold ? 900 : 600,
              color: item.color,
            }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
