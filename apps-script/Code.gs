/**
 * United Porte Academy — online grade book
 * Paste this into Extensions → Apps Script of a Google Sheet, then Deploy → New deployment → Web app
 * (Execute as: Me · Who has access: Anyone). Copy the web app URL into index.html (CONFIG.apiUrl).
 */
var SETTINGS = {
  NOTIFY_EMAIL: 'andrew@unitedporte.us', // every quiz/test result is emailed here. Leave '' for no result emails.
  ALLOWED_DOMAIN: '',      // e.g. 'unitedporte.us' to allow only company emails. '' = any email.
  CODE_MINUTES: 15,        // how long a sign-in code works
  SESSION_DAYS: 365        // how long a device stays signed in
};

var TABS = {
  trainees: ['Email', 'Name', 'Showroom', 'Modules done', 'Quiz average', 'Midpoint', 'Final', 'Last active', 'Data (do not edit)'],
  results: ['Date', 'Email', 'Name', 'Showroom', 'Item', 'Score', 'Percent', 'Grade', 'Result', 'Attempt', 'Missed questions'],
  codes: ['Email', 'Code hash', 'Expires', 'Tries', 'Sent'],
  sessions: ['Token hash', 'Email', 'Created']
};

function doGet() {
  return json_({ ok: true, service: 'United Porte Academy' });
}

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad_request' }); }
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    setup_();
    switch (req.action) {
      case 'requestCode': return json_(requestCode_(req));
      case 'verifyCode': return json_(verifyCode_(req));
      case 'load': return json_(load_(req));
      case 'save': return json_(save_(req));
      case 'result': return json_(result_(req));
      default: return json_({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- actions ---------- */

function requestCode_(req) {
  var email = cleanEmail_(req.email);
  if (!email) return { ok: false, error: 'bad_email' };
  if (SETTINGS.ALLOWED_DOMAIN && email.split('@')[1] !== SETTINGS.ALLOWED_DOMAIN.toLowerCase()) return { ok: false, error: 'domain_not_allowed' };
  var sh = sheet_('codes'), row = findRow_(sh, email), now = Date.now();
  if (row) {
    var sent = Number(sh.getRange(row, 5).getValue());
    if (now - sent < 60 * 1000) return { ok: false, error: 'wait' };
  }
  var code = String(Math.floor(100000 + Math.random() * 900000));
  var values = [email, hash_(email + ':' + code), now + SETTINGS.CODE_MINUTES * 60000, 0, now];
  if (row) sh.getRange(row, 1, 1, 5).setValues([values]); else sh.appendRow(values);
  MailApp.sendEmail({
    to: email,
    subject: 'Your United Porte Academy code: ' + code,
    body: 'Your sign-in code is ' + code + '\n\nIt works for ' + SETTINGS.CODE_MINUTES + ' minutes. If you did not ask for it, you can ignore this email.\n\nUnited Porte Academy'
  });
  return { ok: true };
}

function verifyCode_(req) {
  var email = cleanEmail_(req.email), code = String(req.code || '').replace(/\D/g, '');
  if (!email || code.length !== 6) return { ok: false, error: 'bad_code' };
  var sh = sheet_('codes'), row = findRow_(sh, email);
  if (!row) return { ok: false, error: 'no_code' };
  var v = sh.getRange(row, 1, 1, 5).getValues()[0];
  if (Date.now() > Number(v[2])) return { ok: false, error: 'expired' };
  if (Number(v[3]) >= 5) return { ok: false, error: 'too_many_tries' };
  if (hash_(email + ':' + code) !== v[1]) {
    sh.getRange(row, 4).setValue(Number(v[3]) + 1);
    return { ok: false, error: 'wrong_code' };
  }
  sh.deleteRow(row);
  var token = Utilities.getUuid() + Utilities.getUuid();
  sheet_('sessions').appendRow([hash_(token), email, Date.now()]);
  return { ok: true, token: token, email: email, data: readData_(email) };
}

function load_(req) {
  var email = session_(req.token);
  if (!email) return { ok: false, error: 'signed_out' };
  return { ok: true, email: email, data: readData_(email) };
}

function save_(req) {
  var email = session_(req.token);
  if (!email) return { ok: false, error: 'signed_out' };
  var data = req.data || {}, p = data.profile || {}, r = data.results || {};
  var mods = [], i;
  for (i = 1; i <= 14; i++) if (r['m' + i]) mods.push(r['m' + i].pct);
  var avg = mods.length ? Math.round(mods.reduce(function (a, b) { return a + b; }, 0) / mods.length) + '%' : '';
  var row = [email, p.name || '', p.showroom || '', mods.length + ' / 14', avg,
    r.mid ? r.mid.pct + '% ' + r.mid.grade : '', r['final'] ? r['final'].pct + '% ' + r['final'].grade : '',
    new Date(), JSON.stringify(data)];
  var sh = sheet_('trainees'), at = findRow_(sh, email);
  if (at) sh.getRange(at, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
  return { ok: true };
}

function result_(req) {
  var email = session_(req.token);
  if (!email) return { ok: false, error: 'signed_out' };
  var x = req.result || {}, p = req.profile || {};
  sheet_('results').appendRow([new Date(), email, p.name || '', p.showroom || '', x.item || '', x.score || '', x.percent || '',
    x.grade || '', x.status || '', x.attempt || '', x.missed || '']);
  if (SETTINGS.NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: SETTINGS.NOTIFY_EMAIL,
      replyTo: email,
      subject: 'Training result: ' + (p.name || email) + ' - ' + x.item + ' - ' + x.percent + ' (' + x.grade + ')',
      body: 'Trainee: ' + (p.name || '') + ' <' + email + '>\nShowroom: ' + (p.showroom || '') + '\nItem: ' + x.item +
        '\nScore: ' + x.score + ' (' + x.percent + ')\nGrade: ' + x.grade + '\nResult: ' + x.status + '\nAttempt: ' + x.attempt +
        '\nMissed: ' + (x.missed || 'None') + '\n\nAll results: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
    });
  }
  return { ok: true };
}

/* ---------- helpers ---------- */

function setup_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABS).forEach(function (key) {
    var name = key.charAt(0).toUpperCase() + key.slice(1);
    if (!ss.getSheetByName(name)) {
      var sh = ss.insertSheet(name);
      sh.appendRow(TABS[key]);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, TABS[key].length).setFontWeight('bold');
      if (key === 'codes' || key === 'sessions') sh.hideSheet();
    }
  });
}

function sheet_(key) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(key.charAt(0).toUpperCase() + key.slice(1));
}

function findRow_(sh, value, col) {
  col = col || 1;
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var vals = sh.getRange(2, col, last - 1, 1).getValues();
  for (var i = 0; i < vals.length; i++) if (String(vals[i][0]) === value) return i + 2;
  return 0;
}

function session_(token) {
  if (!token) return '';
  var sh = sheet_('sessions'), row = findRow_(sh, hash_(String(token)));
  if (!row) return '';
  var v = sh.getRange(row, 1, 1, 3).getValues()[0];
  if (Date.now() - Number(v[2]) > SETTINGS.SESSION_DAYS * 86400000) return '';
  return String(v[1]);
}

function readData_(email) {
  var sh = sheet_('trainees'), row = findRow_(sh, email);
  if (!row) return null;
  try { return JSON.parse(sh.getRange(row, 9).getValue()); } catch (e) { return null; }
}

function cleanEmail_(e) {
  e = String(e || '').trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) ? e : '';
}

function hash_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create the tabs and approve email sending. */
function setupSheet() {
  setup_();
  MailApp.getRemainingDailyQuota();
}
