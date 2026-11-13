(function () {
  "use strict";

  /* =====================================================================
     SETTINGS — change these before you publish
     apiUrl:       the Google Sheet web app URL. When set, trainees sign in with
                   their email and a code, and progress is saved online.
                   Leave "" to save progress only in each browser.
     resultsEmail: used only when apiUrl is "": results emailed via FormSubmit
     passMark:     percent needed to pass a quiz or test
     lockTests:    true = midpoint/final open only after the modules before them
     ===================================================================== */
  var CONFIG = {
    apiUrl: "",
    resultsEmail: "YOUR-EMAIL@example.com",
    passMark: 80,
    lockTests: true
  };

  /* ---------- Course map (order = learning order) ---------- */
  var PARTS = [
    { name: "Know United Porte", modules: [
      { id: "m1", t: "Company and team", covers: "Who we are, brands, services, showrooms, warehouses, customer types, who to ask." },
      { id: "m2", t: "Door basics and terminology", covers: "Parts of a door, sets, opening types, swing direction, sizes, rough opening formulas, cores, finishes, hardware terms." },
      { id: "m3", t: "Product lines", covers: "Interior upgrades, exterior doors, hardware rules, windows, kitchens, vanities, add-ons, what we cannot make." },
      { id: "m4", t: "Measuring and feasibility", covers: "Measuring, wall thickness, extensions, trimming limits, custom size vs custom order, pre-order checklist." }
    ]},
    { name: "Quote and sell", modules: [
      { id: "m5", t: "Pricing and quoting", covers: "Building a quote, price factors, delivery zones, installation rates, discounts." },
      { id: "m6", t: "Lead times and expectations", covers: "Stock, custom, windows, shipping times, delays, faster options." },
      { id: "m7", t: "Customers and channels", covers: "Customer types, questions to ask, how customers find us, government and commercial bids." },
      { id: "m8", t: "Selling skills", covers: "Showroom visit, discovery questions, website tools, objections, add-ons, follow-up." }
    ], test: "mid" },
    { name: "Process orders", modules: [
      { id: "m9", t: "Order entry in 1C", covers: "Invoice steps, sales schema, cuts, handles and locks, reserves, common mistakes." },
      { id: "m10", t: "Payment, credit and fraud", covers: "Payment methods, storage fees, dealer credit, chargebacks, fraud signs." },
      { id: "m11", t: "Delivery, pick-up and receiving", covers: "Trucks, freight, parcel, pick-up, insurance certificates, the 48-hour rule." }
    ]},
    { name: "After the sale", modules: [
      { id: "m12", t: "Returns, exchanges and claims", covers: "Return rules, evidence, troubleshooting, exchanges in 1C." },
      { id: "m13", t: "Warranty", covers: "Coverage, exclusions, tolerances, storage and install rules, claims." },
      { id: "m14", t: "Dealer program", covers: "Dealer pricing, obligations, accounts, partnership formats, escalations." }
    ], test: "final" }
  ];

/*@@TESTS@@*/

  var MODULES = [], SEQ = [], ITEMS = {};
  PARTS.forEach(function (p, pi) {
    p.modules.forEach(function (m) { m.part = pi; m.kind = "module"; m.n = MODULES.length + 1; MODULES.push(m); SEQ.push(m); ITEMS[m.id] = m; });
    if (p.test) {
      var t = p.test === "mid"
        ? { id: "mid", kind: "test", t: "Midpoint test", qs: MID_QS, covers: "Modules 1 to 8" }
        : { id: "final", kind: "test", t: "Final test", qs: FINAL_QS, covers: "All 14 modules" };
      t.needs = SEQ.filter(function (x) { return x.kind === "module" || x.id === "mid"; }).map(function (x) { return x.id; });
      t.part = pi; SEQ.push(t); ITEMS[t.id] = t;
    }
  });
  var SHOWROOMS = ["Bayonne, NJ", "Brooklyn, NY", "Staten Island, NY", "Farmingdale, NY", "Port Jervis, NY", "North Miami Beach, FL", "Boca Raton, FL", "Fort Lauderdale, FL", "Fort Myers, FL", "Huntingdon Valley, PA", "Richmond, TX", "Carpentersville, IL", "River Grove, IL", "Albuquerque, NM", "Scottsdale, AZ", "Sandy, UT", "San Jose, CA", "San Bruno, CA", "Santa Fe Springs, CA", "Office / other"];

  /* ---------- Saved progress (per browser) ---------- */
  var KEY = "upa-v2";
  var store = { tasks: {}, profile: null, results: {}, outbox: [], auth: null };
  var ONLINE = !!CONFIG.apiUrl;
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) store = Object.assign(store, JSON.parse(raw));
    else { var old = localStorage.getItem("upa-progress"); if (old) { var o = JSON.parse(old); if (o.tasks) store.tasks = o.tasks; } }
  } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} if (ONLINE && store.auth) scheduleSync(); }

  /* ---------- Online sign-in and sync (Google Sheet web app) ---------- */
  function api(action, body) {
    body = Object.assign({ action: action }, body || {});
    return fetch(CONFIG.apiUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: "network" }; });
  }
  function snapshot() { return { profile: store.profile, results: store.results, tasks: store.tasks }; }
  var syncTimer = null;
  function scheduleSync() { clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 1200); }
  function syncNow() {
    if (!ONLINE || !store.auth) return Promise.resolve(false);
    return api("save", { token: store.auth.token, data: snapshot() }).then(function (j) {
      if (!j.ok && j.error === "signed_out") signedOut();
      store.unsynced = !j.ok; try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
      return j.ok;
    });
  }
  function merge(data) {
    if (!data) return;
    var r = data.results || {};
    Object.keys(r).forEach(function (id) {
      var mine = store.results[id];
      if (!mine || new Date(r[id].date) > new Date(mine.date)) store.results[id] = r[id];
    });
    Object.keys(data.tasks || {}).forEach(function (k) { store.tasks[k] = 1; });
    if (data.profile && data.profile.name) store.profile = data.profile;
  }
  function signedOut() {
    store.auth = null; try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
    toast("Please sign in again."); route();
  }
  function ready() { return ONLINE ? !!(store.auth && store.profile && store.profile.name) : !!store.profile; }
  var SIGN = { step: "email", email: "" };
  var ERRORS = {
    bad_email: "That email doesn't look right. Check it and try again.",
    domain_not_allowed: "Use your company email address.",
    wait: "A code was just sent. Wait a minute before asking for another.",
    bad_code: "Enter the 6-digit code from the email.",
    wrong_code: "That code is not right. Check the email and try again.",
    expired: "That code has expired. Send a new one.",
    no_code: "Send yourself a new code first.",
    too_many_tries: "Too many tries. Send a new code.",
    network: "Can't reach the server. Check your connection and try again."
  };
  function signInBox(intro) {
    if (SIGN.step === "code") {
      return '<form class="profile signin" id="codeForm"><p>We sent a 6-digit code to <b>' + esc(SIGN.email) + "</b>. It works for 15 minutes. Check spam if you don't see it.</p>" +
        '<div class="fields"><label for="si-code">Code<input id="si-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required></label></div>' +
        '<p class="formerr" id="signErr" hidden></p><div class="row"><button class="btn btn-primary" type="submit">Sign in</button>' +
        '<button class="btn btn-ghost" type="button" id="resendCode">Send a new code</button><button class="btn btn-ghost" type="button" id="changeEmail">Use a different email</button></div></form>';
    }
    return '<form class="profile signin" id="signInForm"><p>' + (intro || "Sign in with your email. Use the same email on any device to pick up where you left off.") + "</p>" +
      '<div class="fields"><label for="si-email">Work email<input id="si-email" name="email" type="email" autocomplete="email" required value="' + esc(SIGN.email) + '"></label></div>' +
      '<p class="formerr" id="signErr" hidden></p><button class="btn btn-primary" type="submit">Email me a code</button></form>';
  }
  function showErr(code) { var el = document.getElementById("signErr"); if (el) { el.textContent = ERRORS[code] || "Something went wrong (" + code + "). Try again."; el.hidden = false; } }

  /* ---------- Helpers ---------- */
  var CUR = "home", QUIZZES = {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function grade(p) { return p >= 90 ? "A" : p >= 80 ? "B" : p >= 70 ? "C" : p >= 60 ? "D" : "F"; }
  function fmtDate(iso) { try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch (e) { return iso; } }
  function modulesDone() { return MODULES.filter(function (m) { return store.results[m.id]; }).length; }
  function missing(t) { return t.needs.filter(function (id) { return !store.results[id]; }); }
  function emailReady() { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(CONFIG.resultsEmail) && !/example\.com$/i.test(CONFIG.resultsEmail); }
  function toast(msg) {
    var t = document.getElementById("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toast.h); toast.h = setTimeout(function () { t.hidden = true; }, 3500);
  }

  /* ---------- Sending results by email (FormSubmit) ---------- */
  function payloadFor(id, r) {
    var it = ITEMS[id], p = store.profile || {};
    var data = {
      _subject: "Training result: " + (p.name || "Trainee") + " - " + it.t + " - " + r.pct + "% (" + r.grade + ")",
      _template: "table",
      _captcha: "false",
      "Trainee": p.name || "",
      "Trainee email": p.email || "",
      "Showroom": p.showroom || "",
      "Item": (it.kind === "module" ? "Module " + it.n + ": " : "") + it.t,
      "Score": r.score + " of " + r.total,
      "Percent": r.pct + "%",
      "Grade": r.grade,
      "Result": r.pass ? "Passed" : "Not passed (pass mark " + CONFIG.passMark + "%)",
      "Attempt": String(r.attempt),
      "Completed": new Date(r.date).toLocaleString(),
      "Missed questions": r.missed.length ? r.missed.join(" | ") : "None"
    };
    if (p.email) data.email = p.email;
    return data;
  }
  function post(data) {
    return fetch("https://formsubmit.co/ajax/" + CONFIG.resultsEmail, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    }).then(function (res) { return res.json(); }).then(function (j) { return String(j.success) === "true"; }).catch(function () { return false; });
  }
  function apiResult(id) {
    var d = payloadFor(id, store.results[id]);
    return { token: store.auth && store.auth.token, profile: store.profile,
      result: { item: d.Item, score: d.Score, percent: d.Percent, grade: d.Grade, status: d.Result, attempt: d.Attempt, missed: d["Missed questions"] } };
  }
  function sendResult(id) {
    var r = store.results[id];
    if (ONLINE) {
      var body = apiResult(id);
      return api("result", body).then(function (j) {
        r.sent = !!j.ok;
        if (!j.ok) store.outbox.push({ id: id, api: true });
        save(); refreshSentLabels(); return j.ok;
      });
    }
    if (!emailReady()) { r.sent = false; save(); return Promise.resolve(false); }
    var data = payloadFor(id, r);
    return post(data).then(function (ok) {
      r.sent = ok;
      if (!ok) store.outbox.push({ id: id, data: data });
      save(); refreshSentLabels();
      return ok;
    });
  }
  function flushOutbox() {
    if (!store.outbox.length || (ONLINE ? !store.auth : !emailReady())) return Promise.resolve(0);
    var queue = store.outbox.slice(); store.outbox = []; save();
    var sent = 0;
    return queue.reduce(function (pr, item) {
      return pr.then(function () {
        var send = item.api ? (store.results[item.id] ? api("result", apiResult(item.id)).then(function (j) { return !!j.ok; }) : Promise.resolve(true)) : post(item.data);
        return send.then(function (ok) {
          if (ok) { sent++; if (store.results[item.id]) store.results[item.id].sent = true; }
          else store.outbox.push(item);
          save();
        });
      });
    }, Promise.resolve()).then(function () { refreshSentLabels(); return sent; });
  }
  function sentLabel(r) {
    if (ONLINE) return r.sent ? "Saved to your record and sent to your manager." : "Not saved online yet. It will retry automatically.";
    if (!emailReady()) return "Email results are not set up yet.";
    return r.sent ? "Results emailed to your manager." : "Not emailed yet. It will retry automatically.";
  }
  function refreshSentLabels() {
    document.querySelectorAll("[data-sent-for]").forEach(function (el) { var r = store.results[el.getAttribute("data-sent-for")]; if (r) el.textContent = sentLabel(r); });
  }

  /* ---------- Recording a result ---------- */
  function record(id, score, total, missedList, answers) {
    var pct = Math.round(score / total * 100), prev = store.results[id];
    store.results[id] = {
      score: score, total: total, pct: pct, grade: grade(pct), pass: pct >= CONFIG.passMark,
      date: new Date().toISOString(), attempt: prev ? prev.attempt + 1 : 1, missed: missedList, answers: answers || null, sent: false
    };
    save();
    sendResult(id);
    renderNav(CUR);
    return store.results[id];
  }
  function resultCard(id) {
    var r = store.results[id], it = ITEMS[id];
    return '<div class="result ' + (r.pass ? "pass" : "fail") + '"><div class="big">' + r.pct + '%</div><div class="rbody"><b>Grade ' + r.grade + " · " + (r.pass ? "Passed" : "Not passed") + "</b>" +
      "<p>" + r.score + " of " + r.total + " correct · attempt " + r.attempt + " · " + fmtDate(r.date) + "</p>" +
      '<p class="sent" data-sent-for="' + id + '">' + sentLabel(r) + "</p>" +
      (r.pass ? "" : "<p>You need " + CONFIG.passMark + "% to pass. Review " + (it.kind === "test" ? "the modules" : "the module") + " and try again.</p>") +
      '</div><button class="btn btn-ghost ' + (it.kind === "test" ? "tretake" : "retake") + '" data-id="' + id + '">Retake</button></div>';
  }

  /* ---------- Trainee details ---------- */
  function profileForm(intro) {
    var p = store.profile || {};
    return '<form class="profile" id="profileForm">' + (intro ? "<p>" + intro + "</p>" : "") +
      '<div class="fields"><label for="pf-name">Full name<input id="pf-name" name="name" required autocomplete="name" value="' + esc(p.name || "") + '"></label>' +
      (ONLINE ? "" : '<label for="pf-email">Your email (optional)<input id="pf-email" name="email" type="email" autocomplete="email" value="' + esc(p.email || "") + '"></label>') +
      '<label for="pf-room">Showroom<select id="pf-room" name="showroom">' + SHOWROOMS.map(function (s) { return "<option" + (p.showroom === s ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select></label></div>" +
      '<button class="btn btn-primary" type="submit">' + (store.profile ? "Save changes" : "Save and continue") + "</button></form>";
  }
  function profileGate() {
    if (ONLINE && !store.auth) return '<div class="gate">' + signInBox("Sign in before you take the quiz, so your grade is saved to your record.") + "</div>";
    return '<div class="gate">' + profileForm("Enter your name before you take the quiz, so your grade can be recorded and sent to your manager.") + "</div>";
  }
  function startBox() {
    if (ONLINE && !store.auth) return signInBox();
    return profileForm(ONLINE ? "Welcome! Tell us your name and showroom. They are added to your record." : "Start by entering your name. It is saved in this browser and added to every result you send.");
  }

  /* ---------- Shared page parts ---------- */
  function fact(color, text) {
    return '<aside class="fact fact-' + color + '"><span class="dots3" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><div><b>Did you know?</b><p>' + text + "</p></div></aside>";
  }
  function tasks(id, list) {
    var h = '<ul class="tasks">';
    list.forEach(function (t, i) {
      var key = id + "-" + i, on = store.tasks[key];
      h += '<li><label><input type="checkbox" id="task-' + key + '" data-key="' + key + '"' + (on ? " checked" : "") + "><span>" + t + "</span></label></li>";
    });
    return h + "</ul>";
  }
  function order(n) {
    var a = []; for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[k]; a[k] = t; }
    return a;
  }
  function quizQuestions(qs) {
    return qs.map(function (q, qi) {
      return '<div class="q" data-answer="' + q.a + '"><p class="ask">' + (qi + 1) + ". " + esc(q.q) + '</p><div class="opts">' +
        order(q.o.length).map(function (oi) { return '<button class="opt" type="button" data-i="' + oi + '">' + esc(q.o[oi]) + "</button>"; }).join("") +
        '</div><p class="why" hidden>' + esc(q.why) + "</p></div>";
    }).join("");
  }
  function quiz(qs) {
    var id = CUR; QUIZZES[id] = qs;
    var intro = "<p>Pick an answer to see why it is right or wrong. Your score counts when you answer the last question. Pass mark: " + CONFIG.passMark + "%.</p>";
    if (!ready()) return intro + profileGate();
    var r = store.results[id];
    return intro + '<div class="quizwrap" data-id="' + id + '">' + (r ? resultCard(id) : '<div class="rslot"></div>') +
      '<div class="quiz"' + (r ? " hidden" : "") + ">" + quizQuestions(qs) + "</div></div>";
  }
  function completeBox() { return ""; }
  function pager(id) {
    var i = SEQ.indexOf(ITEMS[id]);
    var prev = i === 0 ? { id: "home", t: "Start here", l: "Back" } : (i > 0 ? { id: SEQ[i - 1].id, t: label(SEQ[i - 1]), l: "Previous" } : null);
    var next = i + 1 < SEQ.length ? { id: SEQ[i + 1].id, t: label(SEQ[i + 1]), l: "Next" } : { id: "grades", t: "My grades", l: "Next" };
    var h = '<nav class="pager" aria-label="Page navigation">';
    if (prev) h += '<a href="#' + prev.id + '"><small>← ' + prev.l + "</small><b>" + esc(prev.t) + "</b></a>";
    h += '<a class="next" href="#' + next.id + '"><small>' + next.l + " →</small><b>" + esc(next.t) + "</b></a>";
    return h + "</nav>";
  }
  function label(it) { return it.kind === "module" ? it.n + ". " + it.t : it.t; }

  /* ---------- Nav ---------- */
  function pill(it) {
    var r = store.results[it.id];
    if (r) return '<span class="pill ' + (r.pass ? "good" : "bad") + '">' + r.pct + "%</span>";
    if (it.kind === "test") return CONFIG.lockTests && missing(it).length ? '<span class="pill">Locked</span>' : '<span class="pill ready">Open</span>';
    return "";
  }
  function navLink(it, current) {
    var r = store.results[it.id];
    var num = it.kind === "test" ? "✎" : (r ? "✓" : it.n);
    return '<li><a class="navlink' + (r ? " done" : "") + (it.kind === "test" ? " testlink" : "") + '" href="#' + it.id + '"' + (current === it.id ? ' aria-current="page"' : "") +
      '><span class="num">' + num + "</span><span>" + esc(it.t) + "</span>" + pill(it) + "</a></li>";
  }
  function renderNav(current) {
    var q = (document.getElementById("search").value || "").trim().toLowerCase();
    var html = "";
    PARTS.forEach(function (p, pi) {
      var items = p.modules.filter(function (m) { return !q || (m.t + " " + m.covers).toLowerCase().indexOf(q) > -1; });
      if (p.test && (!q || "test".indexOf(q) > -1 || ITEMS[p.test].t.toLowerCase().indexOf(q) > -1)) items = items.concat([ITEMS[p.test]]);
      if (!items.length) return;
      html += "<h3>Part " + "ABCD"[pi] + " · " + esc(p.name) + "</h3><ol>" + items.map(function (it) { return navLink(it, current); }).join("") + "</ol>";
    });
    if (!html) html = '<p class="nomatch">No module matches that search.</p>';
    document.getElementById("navParts").innerHTML = html;
    document.querySelectorAll(".toplinks a").forEach(function (a) { if (a.getAttribute("data-id") === current) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.getElementById("progMini").textContent = (store.profile ? store.profile.name + " · " : "") + modulesDone() + " of " + MODULES.length + " modules";
  }

  /* ---------- Pages ---------- */
  var PAGES = {};

  PAGES.home = function () {
    var dc = modulesDone(), pct = Math.round(dc / MODULES.length * 100);
    var nextUp = SEQ.filter(function (it) { return !store.results[it.id]; })[0];
    var cards = PARTS.map(function (p, pi) {
      var list = p.modules.map(function (m) { return '<li><a href="#' + m.id + '">' + m.n + ". " + esc(m.t) + "</a></li>"; }).join("");
      var t = p.test ? '<div class="gate-line"><b>Then</b><a href="#' + p.test + '">' + ITEMS[p.test].t + "</a></div>" : "";
      return '<div class="phase"><span class="when">Part ' + "ABCD"[pi] + "</span><h3>" + esc(p.name) + "</h3><ol>" + list + "</ol>" + t + "</div>";
    }).join("");
    return '<section class="hero"><div class="dots" aria-hidden="true">' +
      "iiiii i...i i.i.i i.i.i i.i.i".split(" ").join("").split("").map(function (c) { return c === "i" ? "<i></i>" : '<i class="k"></i>'; }).join("") +
      '</div><p class="eyebrow">New team member training</p><h1>Welcome to United Porte</h1>' +
      '<p class="lead">Fourteen short modules in the order you need them, a midpoint test after Part B and a final test at the end. Your quizzes and tests are graded and your results are sent to your manager.</p>' +
      (ready()
        ? '<p class="who">Signed in as <b>' + esc(store.profile.name) + "</b>" + (store.profile.showroom ? " · " + esc(store.profile.showroom) : "") + (ONLINE ? " · " + esc(store.auth.email) : "") + ' · <a href="#me">change</a></p>' +
          '<p style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px"><a class="btn btn-primary" href="#' + (nextUp ? nextUp.id : "grades") + '">' + (nextUp ? (dc ? "Continue: " : "Start: ") + esc(label(nextUp)) + " →" : "See my grades →") + '</a><a class="btn btn-ghost" href="#grades">My grades</a></p>'
        : startBox()) +
      "</section>" +
      '<h2>Your progress</h2><div class="bigprog" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div><p class="muted-s">' + dc + " of " + MODULES.length + " modules complete" + (store.results.mid ? " · midpoint " + store.results.mid.pct + "%" : "") + (store.results.final ? " · final " + store.results.final.pct + "%" : "") + (ONLINE ? (store.auth ? " · saved to your account" : "") : " · saved in this browser") + "</p>" +
      "<h2>The course</h2><p>Go through the modules in order. Product and measuring come before selling, because wrong sizes, wrong swings and bad invoices are the most expensive mistakes.</p>" +
      '<div class="phases">' + cards + "</div>" +
      "<h2>How it works</h2>" +
      '<ol class="steps"><li>Read the module and do the hands-on tasks with your trainer.</li><li>Take the quiz at the end. Pass mark is ' + CONFIG.passMark + "%. You can retake it.</li><li>After Part B, take the 20-question midpoint test.</li><li>After Part D, take the 30-question final test.</li><li>Every quiz and test result is " + (ONLINE ? "saved to your record and sent to your manager" : "emailed to your manager") + " automatically.</li></ol>" +
      (ONLINE ? '<div class="rule"><strong>Use the same email everywhere</strong><p>Your progress is saved to your account. Sign in with the same email on any computer or phone and you pick up where you left off.</p></div>'
              : '<div class="rule"><strong>Your progress stays in this browser</strong><p>Use the same browser and device each time. Clearing your browser data, or using a private window, starts you over.</p></div>') +
      '<div class="rule"><strong>When the manual and the website disagree</strong><p>Follow the manual. It reflects what the team has confirmed internally, such as quoting custom orders at 3–4 months.</p></div>';
  };

  PAGES.me = function () {
    if (ONLINE && !store.auth) return '<p class="eyebrow">Your details</p><h1>Sign in</h1>' + signInBox();
    return '<p class="eyebrow">Your details</p><h1>Who is taking this course?</h1><p class="lead">Your name and showroom are added to every result sent to your manager.' + (ONLINE ? "" : " They are saved only in this browser.") + "</p>" +
      (ONLINE ? '<p class="who">Signed in as <b>' + esc(store.auth.email) + "</b></p>" : "") + profileForm("") +
      (ONLINE ? '<h2>Sign out</h2><p>Signing out removes your progress from this device. It stays saved in your account; sign in again with the same email to get it back.</p><p><button class="btn btn-ghost" id="signOut">Sign out</button></p>' : "");
  };

  PAGES.grades = function () {
    var rows = SEQ.map(function (it) {
      var r = store.results[it.id];
      return "<tr" + (it.kind === "test" ? ' class="trow"' : "") + '><td><a href="#' + it.id + '">' + esc(label(it)) + "</a></td>" +
        (r ? '<td class="num">' + r.score + "/" + r.total + '</td><td class="num">' + r.pct + '%</td><td><span class="gpill ' + (r.pass ? "good" : "bad") + '">' + r.grade + "</span></td><td>" + (r.pass ? "Passed" : "Not passed") + '</td><td class="num">' + fmtDate(r.date) + "</td><td>" + (r.sent ? (ONLINE ? "Saved" : "Sent") : (ONLINE || emailReady() ? "Waiting" : "Off")) + "</td>"
           : '<td class="num muted-c">—</td><td class="num muted-c">—</td><td class="muted-c">—</td><td class="muted-c">' + (it.kind === "test" && CONFIG.lockTests && missing(it).length ? "Locked" : "Not started") + '</td><td class="muted-c">—</td><td class="muted-c">—</td>') + "</tr>";
    }).join("");
    var mods = MODULES.filter(function (m) { return store.results[m.id]; });
    var avg = mods.length ? Math.round(mods.reduce(function (s, m) { return s + store.results[m.id].pct; }, 0) / mods.length) : null;
    var tiles = [
      ["Modules complete", modulesDone() + " / " + MODULES.length],
      ["Quiz average", avg === null ? "—" : avg + "% · " + grade(avg)],
      ["Midpoint test", store.results.mid ? store.results.mid.pct + "% · " + store.results.mid.grade : "—"],
      ["Final test", store.results.final ? store.results.final.pct + "% · " + store.results.final.grade : "—"]
    ].map(function (t) { return '<div class="tile"><span>' + t[0] + "</span><b>" + t[1] + "</b></div>"; }).join("");
    return '<p class="eyebrow">Report card</p><h1>My grades</h1>' +
      (ready() ? '<p class="lead">' + esc(store.profile.name) + (store.profile.showroom ? " · " + esc(store.profile.showroom) : "") + ' · <a href="#me">edit details</a></p>' : '<p class="lead">Add your details on the <a href="#home">Start page</a> to take quizzes.</p>') +
      '<div class="tiles">' + tiles + "</div>" +
      '<div class="tablewrap"><table class="gtable"><thead><tr><th>Item</th><th>Score</th><th>%</th><th>Grade</th><th>Status</th><th>Date</th><th>' + (ONLINE ? "Record" : "Email") + '</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      '<p class="muted-s">Grades: A 90%+ · B 80%+ · C 70%+ · D 60%+ · F below 60%. Pass mark ' + CONFIG.passMark + "%.</p>" +
      (!ONLINE && !emailReady() ? '<div class="rule"><strong>Results email is off</strong><p>The person who set up this site has not entered a results email address yet. Your grades are still saved here.</p></div>' : "") +
      (store.outbox.length ? '<p><button class="btn btn-primary" id="flush">Send ' + store.outbox.length + " unsent result" + (store.outbox.length > 1 ? "s" : "") + "</button></p>" : "") +
      (ONLINE ? "" : '<h2>Start over</h2><p>Clears every grade, checkbox and your details from this browser. Results already emailed are not affected.</p><p><button class="btn btn-ghost" id="resetBtn">Reset my progress</button> <button class="btn btn-danger" id="resetYes" hidden>Yes, erase everything</button></p>');
  };

/*@@MODULES@@*/

  /* ---------- Tests ---------- */
  function renderTest(id) {
    var t = ITEMS[id], qs = t.qs;
    var head = '<p class="eyebrow">' + (id === "mid" ? "After Part B" : "After Part D") + '</p><h1>' + t.t + "</h1>" +
      '<div class="meta"><span><b>Covers</b> ' + t.covers + "</span><span><b>Questions</b> " + qs.length + "</span><span><b>Pass mark</b> " + CONFIG.passMark + "%</span></div>";
    if (!ready()) return head + profileGate() + pager(id);
    var miss = CONFIG.lockTests ? missing(t) : [];
    if (miss.length) {
      return head + '<div class="lockbox"><b>This test opens when you finish:</b><ul>' + miss.map(function (m) { return '<li><a href="#' + m + '">' + esc(label(ITEMS[m])) + "</a></li>"; }).join("") + "</ul></div>" + pager(id);
    }
    var r = store.results[id];
    if (r && !renderTest.retake) {
      return head + resultCard(id) + review(id) + pager(id);
    }
    renderTest.retake = false;
    var body = qs.map(function (q, qi) {
      return '<fieldset class="tq"><legend>' + (qi + 1) + ". " + esc(q.q) + "</legend>" +
        order(q.o.length).map(function (oi) { return '<label><input type="radio" name="tq-' + qi + '" id="tq-' + qi + "-" + oi + '" value="' + oi + '"><span>' + esc(q.o[oi]) + "</span></label>"; }).join("") + "</fieldset>";
    }).join("");
    return head + "<p>Answer every question, then submit. You will see your score and the correct answers after you submit.</p>" +
      '<form id="testForm" data-id="' + id + '">' + body +
      '<div class="submitbar"><span id="answered">0 of ' + qs.length + ' answered</span><button class="btn btn-primary" id="submitTest" type="submit" disabled>Submit test</button></div></form>' + pager(id);
  }
  function review(id) {
    var r = store.results[id], qs = ITEMS[id].qs;
    if (!r.answers) return "";
    return "<h2>Review your answers</h2>" + qs.map(function (q, i) {
      var a = r.answers[i], ok = a === q.a;
      return '<div class="rv ' + (ok ? "ok" : "no") + '"><p class="ask">' + (i + 1) + ". " + esc(q.q) + "</p>" +
        "<p>" + (ok ? "✓ " : "✗ Your answer: " + esc(q.o[a]) + " · Correct: ") + "<b>" + esc(q.o[q.a]) + "</b></p><p class=\"why\">" + esc(q.why) + "</p></div>";
    }).join("");
  }
  PAGES.mid = function () { return renderTest("mid"); };
  PAGES["final"] = function () { return renderTest("final"); };

  /* ---------- Router ---------- */
  function route() {
    var id = (location.hash || "#home").slice(1);
    if (!PAGES[id]) id = "home";
    CUR = id;
    document.getElementById("page").innerHTML = PAGES[id]();
    renderNav(id);
    document.body.classList.remove("nav-open");
    document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    document.title = (ITEMS[id] ? label(ITEMS[id]) + " · " : id === "grades" ? "My grades · " : "") + "United Porte Academy";
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var opt = e.target.closest(".opt");
    if (opt) {
      var q = opt.closest(".q"); if (q.dataset.done) return;
      var ans = +q.dataset.answer, pick = +opt.dataset.i;
      q.dataset.done = pick === ans ? "right" : "wrong";
      q.querySelectorAll(".opt").forEach(function (b) { var i = +b.dataset.i; b.disabled = true; if (i === ans) b.classList.add("right"); else if (i === pick) b.classList.add("wrong"); });
      q.querySelector(".why").hidden = false;
      var wrap = q.closest(".quizwrap"), all = wrap.querySelectorAll(".q"), answered = wrap.querySelectorAll(".q[data-done]");
      if (answered.length === all.length) {
        var right = wrap.querySelectorAll('.q[data-done="right"]').length;
        var missed = Array.prototype.map.call(wrap.querySelectorAll('.q[data-done="wrong"] .ask'), function (p) { return p.textContent; });
        var id = wrap.dataset.id;
        record(id, right, all.length, missed);
        var slot = wrap.querySelector(".rslot, .result");
        var div = document.createElement("div"); div.innerHTML = resultCard(id);
        slot.replaceWith(div.firstChild);
        wrap.querySelector(".result").scrollIntoView({ behavior: "smooth", block: "center" });
        toast("Quiz graded: " + store.results[id].pct + "% (" + store.results[id].grade + ")");
      }
      return;
    }
    var rt = e.target.closest(".retake");
    if (rt) {
      var w = rt.closest(".quizwrap"), qz = w.querySelector(".quiz");
      qz.innerHTML = quizQuestions(QUIZZES[w.dataset.id]); qz.hidden = false;
      var res = w.querySelector(".result"), sl = document.createElement("div"); sl.className = "rslot"; res.replaceWith(sl);
      qz.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (e.target.closest(".tretake")) { renderTest.retake = true; route(); return; }
    if (e.target.closest("#resendCode")) {
      api("requestCode", { email: SIGN.email }).then(function (j) { if (j.ok) toast("New code sent to " + SIGN.email); else showErr(j.error); });
      return;
    }
    if (e.target.closest("#changeEmail")) { SIGN.step = "email"; route(); return; }
    if (e.target.closest("#signOut")) {
      syncNow().then(function () {
        store = { tasks: {}, profile: null, results: {}, outbox: [], auth: null };
        try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (err) {}
        location.hash = "#home"; route(); toast("Signed out.");
      });
      return;
    }
    if (e.target.closest("#flush")) { flushOutbox().then(function (n) { toast(n ? n + " result(s) sent." : "Could not send yet. Check your connection."); route(); }); return; }
    if (e.target.closest("#resetBtn")) { document.getElementById("resetYes").hidden = false; return; }
    if (e.target.closest("#resetYes")) { store = { tasks: {}, profile: null, results: {}, outbox: [] }; save(); location.hash = "#home"; route(); toast("Progress erased."); return; }
    var cp = e.target.closest(".copy");
    if (cp) {
      var txt = cp.dataset.copy;
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { cp.textContent = "Copied"; setTimeout(function () { cp.textContent = "Copy"; }, 1500); }, function () { cp.textContent = "Select and copy"; });
      return;
    }
  });
  document.addEventListener("submit", function (e) {
    if (e.target.id === "profileForm") {
      e.preventDefault();
      var f = e.target, el = f.elements, name = el["name"].value.trim();
      if (!name) { el["name"].focus(); return; }
      store.profile = { name: name, email: ONLINE ? store.auth.email : el["email"].value.trim(), showroom: el["showroom"].value };
      save(); flushOutbox(); toast("Saved. Welcome, " + name.split(" ")[0] + "!");
      var y = window.scrollY; route(); window.scrollTo(0, CUR === "home" ? 0 : y);
      return;
    }
    if (e.target.id === "signInForm" || e.target.id === "codeForm") {
      e.preventDefault();
      var form = e.target, btn = form.querySelector("button[type=submit]"); btn.disabled = true;
      if (form.id === "signInForm") {
        SIGN.email = form.elements["email"].value.trim().toLowerCase();
        api("requestCode", { email: SIGN.email }).then(function (j) {
          btn.disabled = false;
          if (j.ok || j.error === "wait") { SIGN.step = "code"; route(); toast(j.ok ? "Code sent to " + SIGN.email : ERRORS.wait); }
          else showErr(j.error);
        });
      } else {
        api("verifyCode", { email: SIGN.email, code: form.elements["code"].value }).then(function (j) {
          btn.disabled = false;
          if (!j.ok) { showErr(j.error); return; }
          store.auth = { email: j.email, token: j.token };
          merge(j.data);
          if (store.profile) store.profile.email = j.email;
          SIGN = { step: "email", email: "" };
          save(); flushOutbox(); route();
          toast(store.profile && store.profile.name ? "Welcome back, " + store.profile.name.split(" ")[0] + "!" : "Signed in. Add your name to finish.");
        });
      }
      return;
    }
    if (e.target.id === "testForm") {
      e.preventDefault();
      var id = e.target.dataset.id, qs = ITEMS[id].qs, answers = [], score = 0, missed = [];
      for (var i = 0; i < qs.length; i++) {
        var c = e.target.querySelector('input[name="tq-' + i + '"]:checked');
        if (!c) { toast("Answer every question first."); return; }
        var a = +c.value; answers.push(a);
        if (a === qs[i].a) score++; else missed.push((i + 1) + ". " + qs[i].q);
      }
      record(id, score, qs.length, missed, answers);
      route();
      toast(ITEMS[id].t + " graded: " + store.results[id].pct + "% (" + store.results[id].grade + ")");
    }
  });
  document.addEventListener("change", function (e) {
    if (e.target.matches(".tasks input")) { var k = e.target.dataset.key; if (e.target.checked) store.tasks[k] = 1; else delete store.tasks[k]; save(); }
    if (e.target.matches("#testForm input[type=radio]")) {
      var f = e.target.form, total = ITEMS[f.dataset.id].qs.length, n = f.querySelectorAll("input[type=radio]:checked").length;
      document.getElementById("answered").textContent = n + " of " + total + " answered";
      document.getElementById("submitTest").disabled = n < total;
      e.target.closest("fieldset").classList.add("answered");
    }
  });
  document.getElementById("search").addEventListener("input", function () { renderNav(CUR); });
  document.getElementById("menuBtn").addEventListener("click", function () { var open = document.body.classList.toggle("nav-open"); this.setAttribute("aria-expanded", String(open)); });
  document.getElementById("scrim").addEventListener("click", function () { document.body.classList.remove("nav-open"); document.getElementById("menuBtn").setAttribute("aria-expanded", "false"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") document.body.classList.remove("nav-open"); });
  window.addEventListener("hashchange", route);
  route();
  if (ONLINE && store.auth) {
    api("load", { token: store.auth.token }).then(function (j) {
      if (j.ok) { merge(j.data); save(); route(); flushOutbox(); }
      else if (j.error === "signed_out") signedOut();
    });
  } else flushOutbox();
})();
