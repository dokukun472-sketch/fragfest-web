// =============================================
// CONFIG — Replace with your Supabase keys
// =============================================
const SUPABASE_URL     = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// =============================================
// ELEMENT REFERENCES
// =============================================
const form           = document.getElementById('registration-form');
const submitBtn      = document.getElementById('submit-btn');
const btnText        = document.getElementById('btn-text');
const btnLoading     = document.getElementById('btn-loading');
const successMsg     = document.getElementById('success-message');
const errorMsg       = document.getElementById('error-message');
const progressBar    = document.getElementById('progress-bar');
const progressCount  = document.getElementById('progress-count');

// =============================================
// PROGRESS TRACKER
// Track which player blocks are "complete"
// =============================================
const playerInputs = {
  captain: ['full-name', 'email', 'phone', 'team-name', 'game-username', 'game-id'],
  p2:      ['p2-username', 'p2-id'],
  p3:      ['p3-username', 'p3-id'],
  p4:      ['p4-username', 'p4-id'],
  p5:      ['p5-username', 'p5-id'],
  p6:      ['p6-username', 'p6-id'],
  p7:      ['p7-username', 'p7-id'],
};

function updateProgress() {
  let completedPlayers = 0;

  for (const [key, ids] of Object.entries(playerInputs)) {
    const filled   = ids.filter(id => document.getElementById(id)?.value.trim() !== '').length;
    const total    = ids.length;
    const indicator = document.getElementById(`indicator-${key}`);

    if (indicator) {
      indicator.classList.remove('complete', 'partial');
      if (filled === total)       indicator.classList.add('complete');
      else if (filled > 0)        indicator.classList.add('partial');
    }

    // Count subs as optional — only count captain + players 2–5 as required progress
    const required = ['captain', 'p2', 'p3', 'p4', 'p5'];
    if (required.includes(key) && filled === total) completedPlayers++;
    // Subs count too if filled
    if (!required.includes(key) && filled === total) completedPlayers++;
  }

  const pct = Math.round((completedPlayers / 7) * 100);
  progressBar.style.width = pct + '%';
  progressCount.textContent = completedPlayers;
}

// =============================================
// LIVE INPUT VALIDATION — checkmarks & color
// =============================================
function attachInputListeners() {
  form.querySelectorAll('input').forEach(input => {
    // On blur — validate
    input.addEventListener('blur', () => {
      validateInput(input);
      updateProgress();
    });

    // On input — clear error state, update progress
    input.addEventListener('input', () => {
      input.classList.remove('is-error');
      updateProgress();

      // Show check if filled
      const check = input.parentElement.querySelector('.input-check');
      if (check) {
        if (input.value.trim()) {
          check.classList.add('show-check');
        } else {
          check.classList.remove('show-check');
        }
      }
    });
  });
}

function validateInput(input) {
  const val = input.value.trim();
  const isRequired = input.hasAttribute('required');
  const check = input.parentElement.querySelector('.input-check');

  if (isRequired && val === '') {
    input.classList.add('is-error');
    input.classList.remove('is-valid');
    if (check) check.classList.remove('show-check');
    return false;
  }

  if (input.type === 'email' && val !== '') {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!ok) {
      input.classList.add('is-error');
      input.classList.remove('is-valid');
      if (check) check.classList.remove('show-check');
      return false;
    }
  }

  if (val !== '') {
    input.classList.add('is-valid');
    input.classList.remove('is-error');
    if (check) check.classList.add('show-check');
  }

  return true;
}

// =============================================
// LOADING STATE
// =============================================
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnText.classList.toggle('hidden', isLoading);
  btnLoading.classList.toggle('hidden', !isLoading);
}

// =============================================
// SHOW ALERT
// =============================================
function showAlert(type) {
  successMsg.classList.add('hidden');
  errorMsg.classList.add('hidden');

  const el = type === 'success' ? successMsg : errorMsg;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// =============================================
// FORM VALIDATION (full submit check)
// =============================================
function validateAll(data) {
  const requiredFields = [
    'full_name', 'email', 'phone', 'team_name',
    'game_username', 'game_id',
    'p2_username', 'p2_id',
    'p3_username', 'p3_id',
    'p4_username', 'p4_id',
    'p5_username', 'p5_id',
  ];

  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === '') {
      const input = form.querySelector(`[name="${field}"]`);
      if (input) {
        input.classList.add('is-error');
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!emailOk) {
    const emailInput = document.getElementById('email');
    emailInput.classList.add('is-error');
    emailInput.focus();
    return false;
  }

  return true;
}

// =============================================
// FORM SUBMIT
// =============================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    full_name:    document.getElementById('full-name').value.trim(),
    email:        document.getElementById('email').value.trim(),
    phone:        document.getElementById('phone').value.trim(),
    team_name:    document.getElementById('team-name').value.trim(),
    game_username: document.getElementById('game-username').value.trim(),
    game_id:      document.getElementById('game-id').value.trim(),
    p2_username:  document.getElementById('p2-username').value.trim(),
    p2_id:        document.getElementById('p2-id').value.trim(),
    p3_username:  document.getElementById('p3-username').value.trim(),
    p3_id:        document.getElementById('p3-id').value.trim(),
    p4_username:  document.getElementById('p4-username').value.trim(),
    p4_id:        document.getElementById('p4-id').value.trim(),
    p5_username:  document.getElementById('p5-username').value.trim(),
    p5_id:        document.getElementById('p5-id').value.trim(),
    p6_username:  document.getElementById('p6-username').value.trim(),
    p6_id:        document.getElementById('p6-id').value.trim(),
    p7_username:  document.getElementById('p7-username').value.trim(),
    p7_id:        document.getElementById('p7-id').value.trim(),
  };

  if (!validateAll(formData)) return;

  setLoading(true);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      form.reset();
      form.querySelectorAll('input').forEach(i => {
        i.classList.remove('is-valid', 'is-error');
        const check = i.parentElement.querySelector('.input-check');
        if (check) check.classList.remove('show-check');
      });
      document.querySelectorAll('.block-indicator').forEach(d => d.classList.remove('complete', 'partial'));
      progressBar.style.width = '0%';
      progressCount.textContent = '0';
      showAlert('success');
    } else {
      console.error('Supabase error:', await response.json());
      showAlert('error');
    }
  } catch (err) {
    console.error('Network error:', err);
    showAlert('error');
  } finally {
    setLoading(false);
  }
});

// =============================================
// INIT
// =============================================
attachInputListeners();
updateProgress();