(function () {
  const STORAGE_KEY = 'dream-diary-entries';

  const dreamDate = document.getElementById('dream-date');
  const dreamTitle = document.getElementById('dream-title');
  const dreamContent = document.getElementById('dream-content');
  const recordBtn = document.getElementById('record-btn');
  const saveBtn = document.getElementById('save-btn');
  const clearBtn = document.getElementById('clear-btn');
  const archiveList = document.getElementById('archive-list');
  const toast = document.getElementById('toast');

  if (!dreamDate || !dreamContent || !recordBtn || !saveBtn || !clearBtn || !archiveList || !toast) return;

  function setDefaultDate() {
    const today = new Date().toISOString().slice(0, 10);
    if (!dreamDate.value) dreamDate.value = today;
  }

  function getEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function setEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function showToast(message, type) {
    type = type || '';
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    toast.setAttribute('aria-hidden', 'false');
    clearTimeout(toast._tid);
    toast._tid = setTimeout(function () {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 2800);
  }

  const API_BASE = '';

  async function analyzeDreamWithFreud(dream) {
    const res = await fetch(API_BASE + '/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: dream.content,
        title: dream.title || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Analysis failed');
    return data.analysis;
  }

  function renderArchive() {
    const entries = getEntries();
    if (entries.length === 0) {
      archiveList.innerHTML = '<p class="empty-archive">No dreams archived yet. Write one above and save it.</p>';
      return;
    }
    const sorted = entries.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    archiveList.innerHTML = sorted
      .map(function (dream) {
        const title = dream.title || 'Untitled dream';
        const date = new Date(dream.date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const short = dream.content.slice(0, 180) + (dream.content.length > 180 ? '\u2026' : '');
        const hasAnalysis = dream.freudAnalysis;
        return (
          '<article class="dream-card" data-id="' + dream.id + '">' +
          '<div class="dream-card-header">' +
          '<h3 class="dream-card-title">' + escapeHtml(title) + '</h3>' +
          '<time class="dream-card-date">' + date + '</time>' +
          '</div>' +
          '<p class="dream-card-content">' + escapeHtml(short) + '</p>' +
          (hasAnalysis
            ? '<div class="dream-analysis">' +
              '<button type="button" class="toggle-analysis" aria-expanded="false">Freud analysis</button>' +
              '<div class="dream-analysis-text" hidden>' + escapeHtml(dream.freudAnalysis) + '</div>' +
              '</div>'
            : '') +
          '<div class="dream-card-actions">' +
          '<button type="button" class="expand">Read full</button>' +
          '<button type="button" class="analyze" ' + (hasAnalysis ? ' title="Re-run analysis"' : '') + '>' +
          (hasAnalysis ? 'Re-analyse' : 'Analyse (Freud)') + '</button>' +
          '<button type="button" class="delete">Delete</button>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    archiveList.querySelectorAll('.dream-card').forEach(function (card) {
      const id = card.dataset.id;
      card.querySelector('.expand').addEventListener('click', function () {
        const dream = getEntries().find(function (e) { return e.id === id; });
        if (dream) {
          dreamTitle.value = dream.title || '';
          dreamDate.value = dream.date;
          dreamContent.value = dream.content;
          showToast('Dream loaded into editor. You can edit and save again.');
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      const analyzeBtn = card.querySelector('.analyze');
      if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async function () {
          const dream = getEntries().find(function (e) { return e.id === id; });
          if (!dream) return;
          analyzeBtn.disabled = true;
          analyzeBtn.textContent = 'Analysing\u2026';
          try {
            const analysis = await analyzeDreamWithFreud(dream);
            const entries = getEntries();
            const entry = entries.find(function (e) { return e.id === id; });
            if (entry) {
              entry.freudAnalysis = analysis;
              entry.analyzedAt = new Date().toISOString();
              setEntries(entries);
              renderArchive();
              showToast('Freudian analysis saved.', 'success');
            }
          } catch (err) {
            showToast(err.message || 'Analysis failed.');
          } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = dream.freudAnalysis ? 'Re-analyse' : 'Analyse (Freud)';
          }
        });
      }
      const toggleAnalysis = card.querySelector('.toggle-analysis');
      if (toggleAnalysis) {
        const analysisText = card.querySelector('.dream-analysis-text');
        if (analysisText) {
          toggleAnalysis.addEventListener('click', function () {
            const open = analysisText.hidden;
            analysisText.hidden = !open;
            toggleAnalysis.setAttribute('aria-expanded', open);
          });
        }
      }
      card.querySelector('.delete').addEventListener('click', function () {
        if (confirm('Delete this dream from your diary?')) {
          const entries = getEntries().filter(function (e) { return e.id !== id; });
          setEntries(entries);
          renderArchive();
          showToast('Dream removed.', 'success');
        }
      });
    });
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function saveDream() {
    const content = dreamContent.value.trim();
    if (!content) {
      showToast('Write or record something first.');
      return;
    }
    const date = dreamDate.value || new Date().toISOString().slice(0, 10);
    const title = dreamTitle.value.trim() || '';

    const entries = getEntries();
    const newDream = {
      id: 'dream-' + Date.now(),
      date: date,
      title: title || undefined,
      content: content,
      createdAt: new Date().toISOString(),
    };
    entries.push(newDream);
    setEntries(entries);
    renderArchive();
    dreamContent.value = '';
    dreamTitle.value = '';
    setDefaultDate();
    showToast('Dream saved to your archive.', 'success');
  }

  function clearForm() {
    dreamContent.value = '';
    dreamTitle.value = '';
    setDefaultDate();
    showToast('Editor cleared.');
  }

  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = null;
  var isRecording = false;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || 'en-US';

    recognition.onresult = function (e) {
      var last = e.results.length - 1;
      var transcript = e.results[last][0].transcript;
      if (e.results[last].isFinal) {
        dreamContent.value += (dreamContent.value ? ' ' : '') + transcript;
      }
    };

    recognition.onerror = function (e) {
      if (e.error !== 'aborted') {
        showToast('Speech error: ' + (e.error || 'unknown'));
      }
      stopRecording();
    };

    recognition.onend = function () {
      stopRecording();
    };
  }

  function startRecording() {
    if (!recognition) {
      showToast('Speech recognition is not supported in this browser.');
      return;
    }
    if (isRecording) return;
    try {
      recognition.start();
      isRecording = true;
      recordBtn.classList.add('recording');
      recordBtn.querySelector('.record-label').textContent = 'Stop';
      showToast('Listening\u2026 speak your dream.');
    } catch (err) {
      showToast('Could not start microphone.');
    }
  }

  function stopRecording() {
    if (!recognition || !isRecording) return;
    try {
      recognition.stop();
    } catch (_) {}
    isRecording = false;
    recordBtn.classList.remove('recording');
    recordBtn.querySelector('.record-label').textContent = 'Record';
  }

  recordBtn.addEventListener('click', function () {
    if (isRecording) stopRecording();
    else startRecording();
  });

  saveBtn.addEventListener('click', saveDream);
  clearBtn.addEventListener('click', clearForm);

  setDefaultDate();
  renderArchive();
})();
