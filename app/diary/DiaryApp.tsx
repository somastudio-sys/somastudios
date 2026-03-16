"use client";

export default function DiaryApp() {
  return (
    <main className="diary" id="diary">
      <header className="diary-header">
        <h2>Your nightly entries</h2>
        <p className="tagline">
          Capture and recreate the things that disturb you at night.
        </p>
      </header>

      <section className="entry-section">
        <div className="entry-toolbar">
          <label className="date-label">
            <span>Date of dream</span>
            <input type="date" id="dream-date" />
          </label>

          <label className="title-label">
            <span>Title (optional)</span>
            <input
              type="text"
              id="dream-title"
              placeholder="e.g. The flying house"
              maxLength={80}
            />
          </label>
        </div>

        <div className="textarea-wrapper">
          <textarea
            id="dream-content"
            placeholder="Type your dream here, or tap the microphone to speak it..."
            rows={8}
          />
          <button
            type="button"
            id="record-btn"
            className="record-btn"
            title="Record with voice"
            aria-label="Start voice recording"
          >
            <span className="mic-icon" aria-hidden="true">
              🎤
            </span>
            <span className="record-label">Record</span>
          </button>
        </div>

        <div className="entry-actions">
          <button type="button" id="save-btn" className="btn btn-primary">
            Save dream
          </button>
          <button type="button" id="clear-btn" className="btn btn-ghost">
            Clear
          </button>
        </div>
      </section>

      <section className="archive-section">
        <h2>Archive</h2>
        <div id="archive-list" className="archive-list">
          {/* Dreams loaded from memory */}
        </div>
      </section>
    </main>
  );
}
