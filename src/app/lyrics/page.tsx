'use client';

import Head from 'next/head';
import { useState } from 'react';

export default function Lyrics() {
  const [lyrics, setLyrics] = useState('');

  const removeChords = () => {
    const textarea = document.getElementById('lyrics') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = textarea.value
        .replace(/\[[^\]]+\]/g, '') // Remove chords
        .replace(/[ ]{2,}/g, ' ') // Remove extra spaces
        .replace(/^\s+|\s+$/gm, ''); // Remove leading/trailing whitespace
      setLyrics(textarea.value);
    }
  };

  const swapAnhEm = () => {
    const textarea = document.getElementById('lyrics') as HTMLTextAreaElement;
    if (textarea) {
      let text = textarea.value;

      text = text.replace(/\bAnh\b/g, '__TMP1__');
      text = text.replace(/\banh\b/g, '__TMP2__');
      text = text.replace(/\bEm\b/g, 'Anh');
      text = text.replace(/\bem\b/g, 'anh');
      text = text.replace(/__TMP1__/g, 'Em');
      text = text.replace(/__TMP2__/g, 'em');

      textarea.value = text;
      setLyrics(text);
    }
  };

  return (
    <>
      <Head>
        <title>Ai Vậy - Lyrics Tool</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container">
        <header className="profile">
          <h1>Lyrics Tool</h1>
          <p className="subtitle">Process Vietnamese song lyrics</p>
        </header>

        <main className="section">
          <div className="content-card">
            <textarea
              id="lyrics"
              rows={10}
              placeholder="Paste song lyrics with chords here..."
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button type="button" onClick={removeChords}>Remove Chords</button>
              <button type="button" onClick={swapAnhEm}>Swap Anh ↔ Em</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
