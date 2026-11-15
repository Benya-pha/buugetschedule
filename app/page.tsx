const features = [
  {
    number: "01",
    title: "Your timetable",
    description: "A clearer way to see your university week."
  },
  {
    number: "02",
    title: "Make it yours",
    description: "Personalize colors, cards, and the timetable layout."
  },
  {
    number: "03",
    title: "Stay in sync",
    description: "Timetable data will come directly from REG BUU."
  }
];

export default function Home() {
  return (
    <main className="welcome">
      <header className="topbar">
        <a className="brand" href="/" aria-label="buugetschedule home">
          <span className="brand-mark">b.</span>
          <span>buugetschedule</span>
        </a>
        <span className="topbar-note">A LITTLE MORE CLARITY, EVERY DAY</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            BURAPHA UNIVERSITY · PERSONAL TIMETABLE
          </div>
          <h1 id="hero-title">
            Your week,
            <br />
            <span>in a clearer view.</span>
          </h1>
          <p className="hero-description">
            A calmer space for your class schedule. See your week, make it
            yours, and keep everything in one place.
          </p>
          <div className="connection-card" role="status">
            <span className="connection-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.75 19 6.5v5.15c0 4.2-2.9 7.1-7 8.6-4.1-1.5-7-4.4-7-8.6V6.5l7-2.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12h6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="connection-copy">
              <strong>REG BUU connection</strong>
              <small>Integration setup is the next step</small>
            </span>
            <span className="status-label">NOT CONNECTED</span>
          </div>
          <p className="privacy-note">
            Your REG BUU password will never be stored by this website.
          </p>
        </div>

        <div className="hero-art" aria-label="A preview of a weekly timetable layout">
          <div className="preview-window">
            <div className="preview-top">
              <div>
                <span className="preview-kicker">YOUR SCHEDULE</span>
                <strong>This week</strong>
              </div>
              <span className="preview-menu" aria-hidden="true">···</span>
            </div>
            <div className="preview-days" aria-hidden="true">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span>
            </div>
            <div className="preview-grid" aria-hidden="true">
              <div className="preview-time"><span>09</span><span>10</span><span>11</span><span>12</span><span>13</span></div>
              <div className="preview-column">
                <div className="preview-course mint"><b>Class</b><small>09:00 — 10:50</small></div>
                <div className="preview-course peach"><b>Workshop</b><small>11:00 — 12:50</small></div>
              </div>
              <div className="preview-column">
                <div className="preview-course lilac"><b>Lecture</b><small>09:00 — 11:50</small></div>
              </div>
              <div className="preview-column">
                <div className="preview-course blue"><b>Seminar</b><small>10:00 — 11:50</small></div>
              </div>
              <div className="preview-column">
                <div className="preview-course peach"><b>Studio</b><small>09:00 — 10:50</small></div>
                <div className="preview-course mint"><b>Class</b><small>12:00 — 13:50</small></div>
              </div>
              <div className="preview-column">
                <div className="preview-course blue"><b>Lecture</b><small>10:00 — 12:50</small></div>
              </div>
            </div>
            <div className="preview-footer"><span /> A little more room to think.</div>
          </div>
          <div className="floating-note">
            <span className="floating-note-icon">✳</span>
            <span><b>Made to feel like yours</b><small>Colors · Layout · Details</small></span>
          </div>
        </div>
      </section>

      <section className="features" aria-label="What is coming">
        <div className="section-heading">
          <span>THE EXPERIENCE</span>
          <p>Thoughtful tools for a more organized week.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature" key={feature.number}>
              <span>{feature.number}</span>
              <div><h2>{feature.title}</h2><p>{feature.description}</p></div>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 buugetschedule</span>
        <span>Independent student project · Not an official BUU service</span>
      </footer>
    </main>
  );
}
