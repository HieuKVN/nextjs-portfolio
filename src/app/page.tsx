import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>HieuK | Portfolio</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <header className="profile">
          <div className="profile-image">
            <Image
              src="/hieuk.png"
              alt="HieuK Profile Picture"
              className="profile-pic"
              width={160}
              height={160}
            />
          </div>
          <h1>HieuK</h1>
          <p className="subtitle">🎮 IT Student & Freelance Editor 🌙</p>
          <div className="social-links">
            <a href="mailto:main@hieuk.id.vn" className="social-link" title="Email">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="https://github.com/HieuKVN" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </header>

        <main>
          {/* About Me */}
          <section id="about" className="section">
            <h2><i className="fas fa-user"></i> About Me</h2>
            <div className="content-card">
              <p>
                Hi! I'm <b>HieuK</b>, an <b>IT student at HUSC University</b> 🎓.
                I balance <b>coding</b>, <b>video editing</b>, and <b>gaming</b> every day.
                Currently working as a <b>Freelancer Audio Spectrum Editor</b> 🎬.
              </p>
              <div className="skills">
                <span className="skill-tag">HTML</span>
                <span className="skill-tag">CSS</span>
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">PHP</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">C++</span>
                <span className="skill-tag">SQL</span>
                <span className="skill-tag">NodeJS</span>
              </div>
            </div>
          </section>

          {/* Goals */}
          <section id="goals" className="section">
            <h2><i className="fas fa-flag"></i> Current Quests</h2>
            <div className="content-card goals-grid">
              <div className="goal-item">
                <i className="fas fa-code"></i>
                <h3>Sharpen coding skills</h3>
                <p>Master modern web technologies and best practices 💻</p>
              </div>
              <div className="goal-item">
                <i className="fas fa-laptop-code"></i>
                <h3>Build web apps</h3>
                <p>Create meaningful applications that solve real problems 🚀</p>
              </div>
              <div className="goal-item">
                <i className="fas fa-rocket"></i>
                <h3>Explore new tech</h3>
                <p>Stay current with emerging trends ⚡</p>
              </div>
              <div className="goal-item">
                <i className="fas fa-briefcase"></i>
                <h3>Expand freelance work</h3>
                <p>Take on challenging editing projects 🎬</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="section">
            <h2><i className="fas fa-envelope"></i> Get in Touch</h2>
            <div className="content-card contact-grid">
              <a href="mailto:main@hieuk.id.vn" className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>main@hieuk.id.vn</span>
              </a>
              <a href="https://github.com/HieuKVN" target="_blank" rel="noopener noreferrer" className="contact-item">
                <i className="fab fa-github"></i>
                <span>github.com/HieuKVN</span>
              </a>
            </div>
          </section>
        </main>

        <footer>
          <p>&copy; 2025 HieuK</p>
        </footer>
      </div>
    </>
  );
}
