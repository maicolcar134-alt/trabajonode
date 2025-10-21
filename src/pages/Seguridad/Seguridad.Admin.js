import React, { useEffect, useState } from "react";

export default function SeguridadAdmin() {
  // Reloj para el header
  const [hora, setHora] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      setHora(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Confirmación en localStorage
  const LS_KEY = "seguridad_confirmado_v1";
  const [confirmado, setConfirmado] = useState(
    () => localStorage.getItem(LS_KEY) === "true"
  );
  const confirmarLectura = () => {
    localStorage.setItem(LS_KEY, "true");
    setConfirmado(true);
  };

  // Small helper lists (you can edit these)
  const antes = [
    "Leer completamente la ficha técnica del producto",
    "Verificar la fecha de caducidad",
    "Inspeccionar el producto en busca de daños",
  ];
  const durante = [
    "Mantener distancia de seguridad mínima de 10 metros",
    "No dirigir hacia personas o estructuras",
    "Supervisión adulta obligatoria",
  ];
  const despues = [
    "Esperar 15 minutos antes de acercarse",
    "Descartar según normativa local",
    "Guardar producto en lugar seguro y seco",
  ];
  const prohibiciones = [
    "Venta a menores de 18 años",
    "Manipulación de productos dañados",
    "Uso en espacios cerrados sin ventilación",
    "Combinación con líquidos inflamables",
    "Uso sin equipos de protección",
    "Transporte inadecuado en cabina",
  ];

  return (
    <>
      {/* ====== Estilos embebidos (único archivo) ====== */}
      <style>{`
        :root{
          --bg:#071023;
          --card:#0b1220;
          --muted:#9aa6b2;
          --accent:#ef4444;
          --accent-2:#22c55e;
          --accent-3:#f59e0b;
          --panel-border: rgba(255,255,255,0.06);
          --glass: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          --radius:12px;
        }
        *{box-sizing:border-box}
        body { margin:0; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background: var(--bg); color: #e6eef6; }
        .sa-header {
          position: sticky;
          top: 0;
          z-index: 60;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:12px 20px;
          background: linear-gradient(180deg, rgba(2,6,23,0.85), rgba(2,6,23,0.75));
          border-bottom: 1px solid rgba(255,255,255,0.03);
          backdrop-filter: blur(6px);
        }
        .sa-header .brand { display:flex; align-items:center; gap:12px; }
        .sa-brand-logo {
          width:44px;height:44px;border-radius:10px;display:grid;place-items:center;
          background: linear-gradient(135deg,#0ea5e9,#06b6d4);
          box-shadow: 0 6px 18px rgba(2,6,23,0.6);
        }
        .sa-brand-logo img{width:26px;height:26px}
        .sa-title { font-weight:700; color:#cfe8ff; font-size:16px; }
        .sa-sub { font-size:12px;color:var(--muted) }

        .sa-clock { font-weight:700; color:#ffd9b3; font-family:monospace; }

        .sa-wrap{ max-width:1100px; margin:20px auto; padding:18px; }

        .sa-grid { display:grid; gap:16px; grid-template-columns: 1fr; }

        /* Larger layout */
        @media(min-width:900px){
          .sa-grid { grid-template-columns: 1fr 360px; align-items:start; }
          .main-col{ order:1; }
          .side-col{ order:2; }
        }

        .card{
          background: var(--card);
          border:1px solid var(--panel-border);
          padding:16px;
          border-radius:var(--radius);
          box-shadow: 0 10px 30px rgba(2,6,23,0.6);
        }

        .warning {
          display:flex; gap:12px; align-items:flex-start;
          background: linear-gradient(90deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02));
          border:1px solid rgba(239,68,68,0.18);
          padding:16px;
          border-radius:var(--radius);
        }
        .warning .icon{ width:36px;height:36px; display:grid; place-items:center; color:var(--accent); font-size:20px }
        .warning h3{ margin:0; font-size:15px; color:#ffefef }
        .warning p{ margin:6px 0 0; color:var(--muted); font-size:13px }

        .steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:6px; }
        @media(max-width:880px){ .steps-grid{ grid-template-columns:1fr } }

        .step-card h4{ margin:0 0 8px; font-size:14px; color:#cfe8ff }
        .step-list{ display:flex; flex-direction:column; gap:8px }
        .step-item{ display:flex; gap:10px; align-items:flex-start }
        .dot { width:10px;height:10px;border-radius:50%; background:rgba(99,102,241,0.95); margin-top:6px; flex:0 0 10px }

        .prohibitions { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-top:12px; }
        @media(max-width:880px){ .prohibitions{ grid-template-columns:1fr } }

        .pill{ display:flex; gap:10px; align-items:center; padding:10px; border-radius:8px; background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00)); border:1px solid rgba(255,255,255,0.03); color:var(--muted); font-size:13px }
        .pill .dot-small { width:10px;height:10px;border-radius:3px;background:rgba(255,255,255,0.06) }

        .protocols { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:12px }
        @media(max-width:880px){ .protocols{ grid-template-columns:1fr } }
        .protocol { border-radius:10px;padding:12px; background:linear-gradient(180deg, rgba(245,158,11,0.03), rgba(255,255,255,0.01)); border:1px solid rgba(245,158,11,0.22) }
        .protocol h5{ margin:0 0 6px; font-size:13px; color:#ffd9b3 }
        .protocol p{ margin:0; color:var(--muted); font-size:13px }

        details{ background:var(--card); border:1px solid rgba(255,255,255,0.03); padding:10px 12px; margin-bottom:8px; border-radius:8px; }
        summary{ list-style:none; cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:12px; color:#dbeefe; font-weight:600; font-size:14px; }
        summary .chev{ font-size:12px; color:var(--muted) }
        details p{ margin:8px 0 0; color:var(--muted); font-size:13px }

        .downloads .file{ display:flex; align-items:center; justify-content:space-between; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.03); margin-bottom:8px; }
        .downloads .file .meta{ display:flex; gap:10px; align-items:center }
        .btn { background:transparent; border:1px solid rgba(255,255,255,0.06); padding:8px 12px; border-radius:8px; color:#dbeefe; font-weight:600; cursor:pointer }
        .btn.primary { background:linear-gradient(90deg,#0ea5a7 0%, #06b6d4 100%); border:0; color:#021826; padding:8px 12px; border-radius:8px; font-weight:700 }

        .confirm-row { display:flex; gap:12px; align-items:center; justify-content:flex-end; margin-top:12px }
        .confirm-chip { padding:8px 10px; border-radius:8px; background: rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.14); color: #d7ffea; font-weight:700; }

        /* small helpers */
        .muted{ color:var(--muted); font-size:13px }
      `}</style>

      {/* ===== Header ===== */}
      <header className="sa-header">
        <div className="brand">
          <div className="sa-brand-logo" aria-hidden>
            <img
              src="https://cdn-icons-png.flaticon.com/512/482/482469.png"
              alt="logo"
            />
          </div>
          <div>
            <div className="sa-title">PyroDigital MC</div>
            <div className="sa-sub">Panel de Seguridad</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div className="sa-clock" aria-live="polite">{hora}</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            <small>Usuario: Admin</small>
          </div>
        </div>
      </header>

      {/* ===== Layout wrap ===== */}
      <div className="sa-wrap">
        <div className="sa-grid">
          {/* ===== Main column ===== */}
          <main className="main-col">
            {/* Advertencia */}
            <div className="warning card" role="alert" aria-label="Advertencia legal">
              <div className="icon" aria-hidden>⚠️</div>
              <div>
                <h3>Advertencia Legal Importante</h3>
                <p>
                  El uso indebido de productos pirotécnicos puede causar lesiones graves o muerte.
                  Es obligatorio seguir todas las instrucciones. El responsable asume toda responsabilidad legal.
                </p>
              </div>
            </div>

            {/* Antes / Durante / Después */}
            <div className="card" style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <h4 style={{ margin: 0, color: "#cfe8ff" }}>Instrucciones de Uso</h4>
                <div className="muted" style={{ fontSize: 13 }}>Sigue las recomendaciones para evitar riesgos</div>
              </div>

              <div className="steps-grid" style={{ marginTop: 12 }}>
                <div className="step-card">
                  <h4>Antes del Uso</h4>
                  <div className="step-list">
                    {antes.map((t) => (
                      <div key={t} className="step-item">
                        <div className="dot" aria-hidden></div>
                        <small style={{ color: "var(--muted)" }}>{t}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="step-card">
                  <h4>Durante el Uso</h4>
                  <div className="step-list">
                    {durante.map((t) => (
                      <div key={t} className="step-item">
                        <div className="dot" aria-hidden></div>
                        <small style={{ color: "var(--muted)" }}>{t}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="step-card">
                  <h4>Después del Uso</h4>
                  <div className="step-list">
                    {despues.map((t) => (
                      <div key={t} className="step-item">
                        <div className="dot" aria-hidden></div>
                        <small style={{ color: "var(--muted)" }}>{t}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prohibiciones */}
            <div className="card" style={{ marginTop: 12 }}>
              <h4 style={{ margin: 0, color: "#cfe8ff" }}>Prohibiciones Estrictas</h4>
              <div className="prohibitions" style={{ marginTop: 12 }}>
                {prohibiciones.map((p) => (
                  <div key={p} className="pill">
                    <div className="dot-small" aria-hidden></div>
                    <div style={{ color: "var(--muted)" }}>{p}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocolos */}
            <div className="card" style={{ marginTop: 12 }}>
              <h4 style={{ margin: 0, color: "#cfe8ff" }}>Protocolos de Emergencia</h4>
              <div className="protocols">
                <div className="protocol">
                  <h5>Quemaduras</h5>
                  <p>Enfriar con agua durante 10–20 minutos. No aplicar helio o ungüentos. Cubrir con gasa estéril y acudir a servicio médico si es severo.</p>
                </div>
                <div className="protocol">
                  <h5>Inhalación de Humo</h5>
                  <p>Llevar a zona ventilada. Posición semi-incorporada. Atención médica inmediata si hay dificultad respiratoria.</p>
                </div>
                <div className="protocol">
                  <h5>Incendio</h5>
                  <p>Usar extintor tipo ABC. Nunca usar agua si hay productos químicos. Evacuar y llamar a emergencias (112 / 911 según país).</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }} className="emergency-contact card">
                  <strong style={{ display: "block", marginBottom: 6, color: "#ffd6d6" }}>Contacto Ocular</strong>
                  <p className="muted" style={{ margin: 0 }}>Lavar con abundante agua durante 15 minutos. Mantener ojos abiertos. Atención oftalmológica urgente si persiste.</p>
                </div>

                <div style={{ width: 220 }} className="emergency-contact card">
                  <small className="muted">Número de Emergencia</small>
                  <div style={{ fontWeight: 800, marginTop: 6, color: "#ffd9b3" }}>112 — 911</div>
                  <button className="btn" style={{ marginTop: 10 }} onClick={() => window.open("tel:112")}>Llamar ahora</button>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="card" style={{ marginTop: 12 }}>
              <h4 style={{ margin: 0, color: "#cfe8ff" }}>Preguntas Frecuentes sobre Seguridad</h4>
              <div style={{ marginTop: 10 }}>
                <details open>
                  <summary><span>¿Qué equipo de protección necesito?</span><span className="chev">▾</span></summary>
                  <p>Se recomienda guantes resistentes, gafas de seguridad y protección auditiva según el tipo de producto.</p>
                </details>

                <details>
                  <summary><span>¿Qué hago si un producto no se enciende?</span><span className="chev">▾</span></summary>
                  <p>No intentar reencender. Mantener distancia y esperar 15 minutos antes de acercarse. Desechar según normativa local.</p>
                </details>

                <details>
                  <summary><span>¿Puedo usar pirotecnia en mi jardín?</span><span className="chev">▾</span></summary>
                  <p>Depende de la normativa local y las condiciones del entorno. Mantén distancia de estructuras y materiales inflamables.</p>
                </details>

                <details>
                  <summary><span>¿Cómo almacenar productos pirotécnicos?</span><span className="chev">▾</span></summary>
                  <p>En un lugar seco, frío y ventilado, fuera del alcance de menores, separado de fuentes de calor y líquidos inflamables.</p>
                </details>
              </div>
            </div>
          </main>

          {/* ===== Side column ===== */}
          <aside className="side-col">
            <div className="card">
              <h4 style={{ margin: 0, color: "#cfe8ff" }}>Documentación Descargable</h4>

              <div className="downloads" style={{ marginTop: 10 }}>
                <div className="file">
                  <div className="meta">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.3" opacity="0.6"/></svg>
                    <div>
                      <div style={{ fontWeight: 700 }}>Manual Completo de Seguridad (PDF)</div>
                      <small className="muted">2.4 MB</small>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <a className="btn" href="#" download>Descargar</a>
                    <button className="btn">Ver</button>
                  </div>
                </div>

                <div className="file">
                  <div className="meta">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/></svg>
                    <div>
                      <div style={{ fontWeight: 700 }}>Normativa Local Colombiana (PDF)</div>
                      <small className="muted">1.8 MB</small>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <a className="btn" href="#" download>Descargar</a>
                    <button className="btn">Ver</button>
                  </div>
                </div>

                <div className="file">
                  <div className="meta">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2v20" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/></svg>
                    <div>
                      <div style={{ fontWeight: 700 }}>Protocolo Primeros Auxilios (PDF)</div>
                      <small className="muted">860 KB</small>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <a className="btn primary" href="#" download>Descargar</a>
                  </div>
                </div>
              </div>

              <div className="confirm-row" style={{ marginTop: 12 }}>
                {confirmado ? (
                  <div className="confirm-chip">✅ Lectura confirmada</div>
                ) : (
                  <button className="btn primary" onClick={confirmarLectura}>Confirmar lectura</button>
                )}
              </div>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <h4 style={{ margin: 0, color: "#cfe8ff" }}>Contacto</h4>
              <p className="muted" style={{ marginTop: 8 }}>
                soporte@pyrodigital.com<br/>
                +57 3213148729<br/>
                Horario: 24:00
              </p>
              <div style={{ marginTop: 12 }}>
                <button className="btn" onClick={() => window.open("mailto:soporte@pyrodigital.com")}>Enviar email</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {/* ===== Accessibility: enable keyboard toggle for details ===== */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.querySelectorAll('summary').forEach(s=>{
              s.setAttribute('tabindex','0');
              s.setAttribute('role','button');
              s.addEventListener('keydown', (e)=>{
                if(e.key === 'Enter' || e.key === ' '){
                  e.preventDefault();
                  s.parentElement.open = !s.parentElement.open;
                }
              });
            });
          `,
        }}
      />
    </>
  );
}
