/*!
 * DCT-RAG / Hexa Assist — embeddable chatbot widget
 * Drop-in: <script src=".../widget.js"
 *            data-api-url="https://api.example.com"
 *            data-trial-id="e593c748-14c6-4021-bf17-32e30e1c4545"
 *            data-trial-name="Healwell"
 *            data-user-name="Sarah"></script>
 *
 * data-trial-id is the LMS trial UUID — sent verbatim in the Trial header
 * on every backend call. data-trial-name is the friendly study name shown
 * in chat copy ("the Healwell study"). Both per-page customisable.
 *
 * No dependencies. Self-contained CSS.
 */
(function () {
  "use strict";

  // -------------------------------------------------------------
  // Resolve our own <script> tag (so we can read data-* attributes)
  // -------------------------------------------------------------
  function resolveOwnScript() {
    if (document.currentScript) return document.currentScript;
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = (scripts[i].getAttribute("src") || "").toLowerCase();
      if (src.indexOf("widget.js") !== -1 || src.indexOf("hexa") !== -1) {
        return scripts[i];
      }
    }
    return scripts[scripts.length - 1];
  }

  var SCRIPT_TAG = resolveOwnScript();
  function attr(name, def) {
    var v = SCRIPT_TAG && SCRIPT_TAG.getAttribute(name);
    return v == null || v === "" ? def : v;
  }

  // -------------------------------------------------------------
  // Configuration (from data-* attributes; runtime overridable)
  // -------------------------------------------------------------
  var config = {
    apiUrl: (attr("data-api-url", "") || "").replace(/\/+$/, ""),
    trialId: attr("data-trial-id", ""),
    trialName: attr("data-trial-name", ""),
    userName: attr("data-user-name", ""),
    title: attr("data-title", "Hexa Assist"),
    subtitle: attr(
      "data-subtitle",
      "Your Assistant, Hexa Assist Here to Help!"
    ),
    position: attr("data-position", "bottom-right"), // bottom-right | bottom-left
    primaryColor: attr("data-primary-color", "#1B6FE6"),
    autoOpen: attr("data-auto-open", "false") === "true",
    storage: attr("data-storage", "session"), // session | local | none
    zIndex: parseInt(attr("data-z-index", "2147483000"), 10),
    // ---- voice input ----
    voiceEnabled: attr("data-voice-enabled", "true") !== "false",
    voiceMode: attr("data-voice-mode", "manual"), // manual | auto
    voiceLang: attr("data-voice-lang", "en-US"),
    voiceSilenceMs: parseInt(attr("data-voice-silence-ms", "1500"), 10),
    voiceEngine: attr("data-voice-engine", "auto"), // auto | webspeech | whisper
    voiceDebug: attr("data-voice-debug", "false") === "true",
  };

  // Allow window.HexaAssistConfig to override script attrs (advanced use).
  if (window.HexaAssistConfig && typeof window.HexaAssistConfig === "object") {
    var w = window.HexaAssistConfig;
    if (w.apiUrl) config.apiUrl = String(w.apiUrl).replace(/\/+$/, "");
    if (w.trialId) config.trialId = w.trialId;
    if (w.trialName) config.trialName = w.trialName;
    if (w.userName) config.userName = w.userName;
    if (w.title) config.title = w.title;
    if (w.subtitle) config.subtitle = w.subtitle;
    if (w.position) config.position = w.position;
    if (w.primaryColor) config.primaryColor = w.primaryColor;
    if (typeof w.autoOpen === "boolean") config.autoOpen = w.autoOpen;
    if (w.storage) config.storage = w.storage;
    if (typeof w.voiceEnabled === "boolean") config.voiceEnabled = w.voiceEnabled;
    if (w.voiceMode) config.voiceMode = w.voiceMode;
    if (w.voiceLang) config.voiceLang = w.voiceLang;
    if (typeof w.voiceSilenceMs === "number") config.voiceSilenceMs = w.voiceSilenceMs;
    if (w.voiceEngine) config.voiceEngine = w.voiceEngine;
    if (typeof w.voiceDebug === "boolean") config.voiceDebug = w.voiceDebug;
  }

  if (!config.apiUrl || !config.trialId) {
    console.warn(
      "[HexaAssist] data-api-url and data-trial-id are required. Widget not loaded."
    );
    return;
  }

  // -------------------------------------------------------------
  // Session id storage
  // -------------------------------------------------------------
  var SESSION_KEY = "hexa_assist:" + config.trialId + ":sid";

  function getStore() {
    try {
      if (config.storage === "local") return window.localStorage;
      if (config.storage === "session") return window.sessionStorage;
    } catch (e) {
      // privacy mode etc.
    }
    return null;
  }
  function loadSessionId() {
    var s = getStore();
    return s ? s.getItem(SESSION_KEY) : null;
  }
  function saveSessionId(id) {
    var s = getStore();
    if (s && id) s.setItem(SESSION_KEY, id);
  }
  function clearSessionId() {
    var s = getStore();
    if (s) s.removeItem(SESSION_KEY);
  }

  // -------------------------------------------------------------
  // Styles (one block, scoped via .hxa- prefix)
  // -------------------------------------------------------------
  var STYLE = [
    ":root{--hxa-primary:" + config.primaryColor + ";}",
    ".hxa-root,.hxa-root *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;}",
    ".hxa-root{position:fixed;" +
      (config.position === "bottom-left" ? "left:20px;" : "right:20px;") +
      "bottom:20px;z-index:" + config.zIndex + ";}",
    ".hxa-fab{width:60px;height:60px;border:none;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,var(--hxa-primary) 0%,#3a89f0 100%);box-shadow:0 6px 24px rgba(27,111,230,.45);display:flex;align-items:center;justify-content:center;transition:transform .15s ease;color:#fff;}",
    ".hxa-fab:hover{transform:translateY(-2px);}",
    ".hxa-fab svg{width:30px;height:30px;}",
    ".hxa-panel{position:absolute;bottom:75px;" +
      (config.position === "bottom-left" ? "left:0;" : "right:0;") +
      "width:380px;max-width:calc(100vw - 32px);height:600px;max-height:calc(100vh - 100px);background:#fff;border-radius:18px;box-shadow:0 18px 60px rgba(15,30,80,.22);display:flex;flex-direction:column;overflow:hidden;border:1px solid #E5ECF7;}",
    ".hxa-panel.hxa-hidden{display:none;}",
    ".hxa-panel.hxa-min{height:60px;}",
    ".hxa-panel.hxa-min .hxa-body,.hxa-panel.hxa-min .hxa-input-wrap{display:none;}",
    ".hxa-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #EAF1FB;background:#fff;}",
    ".hxa-title{color:var(--hxa-primary);font-weight:700;font-size:16px;letter-spacing:.2px;}",
    ".hxa-actions{display:flex;gap:6px;}",
    ".hxa-iconbtn{width:30px;height:30px;border:none;background:transparent;border-radius:6px;cursor:pointer;color:#6B7DA0;display:flex;align-items:center;justify-content:center;}",
    ".hxa-iconbtn:hover{background:#F1F5FC;color:#1B2A4E;}",
    ".hxa-iconbtn svg{width:14px;height:14px;}",
    ".hxa-body{flex:1;overflow-y:auto;padding:18px 16px;background:linear-gradient(180deg,#FFFFFF 0%,#FAFBFE 30%,#F5F7FF 100%);scroll-behavior:smooth;}",
    ".hxa-body::-webkit-scrollbar{width:6px;}",
    ".hxa-body::-webkit-scrollbar-thumb{background:#D5DEEE;border-radius:4px;}",
    ".hxa-subhead{text-align:center;font-weight:600;color:#1B2A4E;font-size:14px;margin-bottom:14px;}",
    ".hxa-subhead .hxa-brand{color:var(--hxa-primary);}",
    ".hxa-row{display:flex;margin-bottom:10px;align-items:flex-end;gap:8px;}",
    ".hxa-row.hxa-bot{justify-content:flex-start;}",
    ".hxa-row.hxa-user{justify-content:flex-end;}",
    ".hxa-avatar{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--hxa-primary),#5aa0ff);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}",
    ".hxa-avatar svg{width:18px;height:18px;}",
    ".hxa-bubble{max-width:78%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5;color:#1B2A4E;white-space:pre-wrap;word-wrap:break-word;}",
    ".hxa-row.hxa-bot .hxa-bubble{background:#fff;border:1px solid #EAF1FB;border-top-left-radius:4px;}",
    ".hxa-row.hxa-user .hxa-bubble{background:#EFF4FD;color:#1B2A4E;border-top-right-radius:4px;}",
    ".hxa-meta{font-size:11px;color:#9AA8C4;margin:2px 0 8px 38px;}",
    ".hxa-row.hxa-user + .hxa-meta{text-align:right;margin:2px 0 8px 0;}",
    ".hxa-options{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 12px 38px;}",
    ".hxa-opt{padding:9px 14px;border-radius:10px;border:1px solid var(--hxa-primary);background:#fff;color:var(--hxa-primary);font-size:13px;cursor:pointer;font-weight:500;transition:all .12s ease;}",
    ".hxa-opt:hover{background:var(--hxa-primary);color:#fff;}",
    ".hxa-opt.hxa-primary{background:var(--hxa-primary);color:#fff;}",
    ".hxa-opt.hxa-primary:hover{filter:brightness(.92);}",
    ".hxa-opt:disabled{opacity:.55;cursor:not-allowed;}",
    ".hxa-form{margin:6px 0 12px 38px;background:#fff;border:1px solid #EAF1FB;border-radius:12px;padding:12px;}",
    ".hxa-form label{display:block;font-size:12px;color:#6B7DA0;margin-bottom:4px;font-weight:500;}",
    ".hxa-form input{width:100%;padding:9px 11px;font-size:13px;border:1px solid #DDE5F2;border-radius:8px;margin-bottom:10px;color:#1B2A4E;background:#FAFBFE;}",
    ".hxa-form input:focus{outline:none;border-color:var(--hxa-primary);background:#fff;}",
    ".hxa-form button{width:100%;padding:10px;background:var(--hxa-primary);color:#fff;border:none;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;}",
    ".hxa-form button:disabled{opacity:.6;cursor:not-allowed;}",
    ".hxa-card{margin:6px 0 12px 38px;background:#fff;border:1px solid #EAF1FB;border-radius:12px;padding:12px;font-size:13px;color:#1B2A4E;}",
    ".hxa-card .hxa-card-title{color:var(--hxa-primary);font-weight:600;margin-bottom:4px;}",
    ".hxa-progress{height:3px;background:#EAF1FB;border-radius:2px;margin:0 0 10px 38px;overflow:hidden;}",
    ".hxa-progress-fill{height:100%;background:var(--hxa-primary);transition:width .25s ease;}",
    ".hxa-typing{display:flex;align-items:center;gap:5px;padding:10px 14px;}",
    ".hxa-typing span{width:7px;height:7px;border-radius:50%;background:#BCC8E0;animation:hxa-bounce 1.4s infinite ease-in-out;}",
    ".hxa-typing span:nth-child(2){animation-delay:.16s;}",
    ".hxa-typing span:nth-child(3){animation-delay:.32s;}",
    "@keyframes hxa-bounce{0%,80%,100%{transform:translateY(0);opacity:.4;}40%{transform:translateY(-5px);opacity:1;}}",
    ".hxa-input-wrap{border-top:1px solid #EAF1FB;padding:10px 12px;display:flex;gap:8px;background:#fff;}",
    ".hxa-input-wrap.hxa-disabled{opacity:.5;pointer-events:none;}",
    ".hxa-input{flex:1;padding:10px 12px;font-size:14px;border:1px solid #DDE5F2;border-radius:10px;color:#1B2A4E;background:#FAFBFE;}",
    ".hxa-input:focus{outline:none;border-color:var(--hxa-primary);background:#fff;}",
    ".hxa-send{padding:0 14px;background:var(--hxa-primary);color:#fff;border:none;border-radius:10px;cursor:pointer;font-weight:600;}",
    ".hxa-send:disabled{opacity:.5;cursor:not-allowed;}",
    ".hxa-mic{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border:1px solid #DDE5F2;background:#fff;color:var(--hxa-primary);border-radius:10px;cursor:pointer;flex-shrink:0;transition:all .15s ease;}",
    ".hxa-mic:hover{background:#F1F5FC;}",
    ".hxa-mic svg{width:18px;height:18px;}",
    ".hxa-mic.hxa-recording{background:#FDE7E7;border-color:#E0606A;color:#C92A2A;animation:hxa-pulse 1.4s ease-in-out infinite;}",
    "@keyframes hxa-pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,42,42,.45);}50%{box-shadow:0 0 0 8px rgba(201,42,42,0);}}",
    ".hxa-mic:disabled{opacity:.4;cursor:not-allowed;}",
    ".hxa-error{color:#C92A2A;font-size:12px;margin:4px 0 8px 38px;}",
    "@media(max-width:480px){.hxa-panel{width:calc(100vw - 32px);right:0!important;left:0!important;margin:0 auto;}}",
  ].join("\n");

  // -------------------------------------------------------------
  // SVG icons
  // -------------------------------------------------------------
  var ICON_HEX =
    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L21 7v10l-9 5-9-5V7l9-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>';
  var ICON_MIN =
    '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 12h10v1.5H3z"/></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l8 8M12 4L4 12"/></svg>';
  var ICON_EXPAND =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 3h4v4M7 13H3V9M13 3l-5 5M3 13l5-5"/></svg>';
  var ICON_MIC =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
  var ICON_MIC_OFF =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

  // -------------------------------------------------------------
  // DOM helpers
  // -------------------------------------------------------------
  function el(tag, opts) {
    var node = document.createElement(tag);
    if (opts) {
      if (opts.cls) node.className = opts.cls;
      if (opts.html != null) node.innerHTML = opts.html;
      if (opts.text != null) node.textContent = opts.text;
      if (opts.attrs) {
        for (var k in opts.attrs)
          if (Object.prototype.hasOwnProperty.call(opts.attrs, k))
            node.setAttribute(k, opts.attrs[k]);
      }
      if (opts.on) {
        for (var ev in opts.on)
          if (Object.prototype.hasOwnProperty.call(opts.on, ev))
            node.addEventListener(ev, opts.on[ev]);
      }
    }
    return node;
  }

  function nowTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + " " + ampm;
  }

  // Tiny, safe markdown subset: **bold**, *italic*, `code`, line breaks.
  function renderText(s) {
    if (!s) return "";
    var out = String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    return out;
  }

  // -------------------------------------------------------------
  // Build the widget DOM
  // -------------------------------------------------------------
  var styleEl = el("style", { html: STYLE, attrs: { "data-hxa": "1" } });
  document.head.appendChild(styleEl);

  var root = el("div", { cls: "hxa-root", attrs: { "data-hxa": "1" } });

  var fab = el("button", {
    cls: "hxa-fab",
    attrs: { "aria-label": "Open chat" },
    html: ICON_HEX,
  });

  var panel = el("div", { cls: "hxa-panel hxa-hidden" });

  var header = el("div", { cls: "hxa-header" });
  var title = el("div", { cls: "hxa-title", text: config.title });
  var actions = el("div", { cls: "hxa-actions" });
  var btnMin = el("button", {
    cls: "hxa-iconbtn",
    attrs: { "aria-label": "Minimize", title: "Minimize" },
    html: ICON_MIN,
  });
  var btnClose = el("button", {
    cls: "hxa-iconbtn",
    attrs: { "aria-label": "Close", title: "Close" },
    html: ICON_CLOSE,
  });
  actions.appendChild(btnMin);
  actions.appendChild(btnClose);
  header.appendChild(title);
  header.appendChild(actions);

  var body = el("div", { cls: "hxa-body" });

  var subhead = el("div", {
    cls: "hxa-subhead",
    html:
      "Your Assistant, " +
      "<span class='hxa-brand'>" +
      config.title +
      "</span> Here to Help!",
  });
  body.appendChild(subhead);

  var inputWrap = el("div", { cls: "hxa-input-wrap hxa-disabled" });
  var input = el("input", {
    cls: "hxa-input",
    attrs: {
      type: "text",
      placeholder: "Type your message...",
      autocomplete: "off",
    },
  });
  var micBtn = el("button", {
    cls: "hxa-mic",
    attrs: {
      type: "button",
      title: "Speak your message",
      "aria-label": "Voice input",
    },
    html: ICON_MIC,
  });
  var sendBtn = el("button", {
    cls: "hxa-send",
    attrs: { type: "button" },
    text: "Send",
  });
  inputWrap.appendChild(input);
  if (config.voiceEnabled) inputWrap.appendChild(micBtn);
  inputWrap.appendChild(sendBtn);

  panel.appendChild(header);
  panel.appendChild(body);
  panel.appendChild(inputWrap);

  root.appendChild(panel);
  root.appendChild(fab);

  function mount() {
    if (document.body) {
      document.body.appendChild(root);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        document.body.appendChild(root);
      });
    }
  }
  mount();

  // -------------------------------------------------------------
  // State
  // -------------------------------------------------------------
  var state = {
    open: false,
    minimized: false,
    busy: false,
    started: false,
    sessionId: loadSessionId(),
    lastInputType: "none",
  };

  // -------------------------------------------------------------
  // Rendering helpers
  // -------------------------------------------------------------
  function appendBotMessage(text) {
    var row = el("div", { cls: "hxa-row hxa-bot" });
    var av = el("div", { cls: "hxa-avatar", html: ICON_HEX });
    var bubble = el("div", { cls: "hxa-bubble", html: renderText(text) });
    row.appendChild(av);
    row.appendChild(bubble);
    body.appendChild(row);
    var meta = el("div", {
      cls: "hxa-meta",
      text: config.title + ". " + nowTime(),
    });
    body.appendChild(meta);
    scrollToBottom();
    return row;
  }

  function appendUserMessage(text) {
    var row = el("div", { cls: "hxa-row hxa-user" });
    var bubble = el("div", { cls: "hxa-bubble", text: text });
    row.appendChild(bubble);
    body.appendChild(row);
    var meta = el("div", { cls: "hxa-meta", text: "You. " + nowTime() });
    body.appendChild(meta);
    scrollToBottom();
  }

  function appendOptions(options, onPick) {
    var wrap = el("div", { cls: "hxa-options" });
    options.forEach(function (label, idx) {
      var btn = el("button", {
        cls: "hxa-opt" + (idx === 0 ? " hxa-primary" : ""),
        text: label,
      });
      btn.addEventListener("click", function () {
        if (state.busy) return;
        // Disable all buttons in this group after a pick.
        Array.prototype.forEach.call(wrap.querySelectorAll("button"), function (b) {
          b.disabled = true;
        });
        onPick(label);
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollToBottom();
  }

  function appendForm(fields, onSubmit) {
    var f = el("form", { cls: "hxa-form" });
    var inputs = {};
    fields.forEach(function (name) {
      var label = el("label", { text: properCase(name) });
      var inp = el("input", {
        attrs: {
          name: name,
          type: name === "email" ? "email" : name === "phone" ? "tel" : "text",
          placeholder: placeholderFor(name),
          required: "required",
        },
      });
      inputs[name] = inp;
      f.appendChild(label);
      f.appendChild(inp);
    });
    var submit = el("button", { attrs: { type: "submit" }, text: "Submit" });
    f.appendChild(submit);
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (state.busy) return;
      var values = {};
      var ok = true;
      fields.forEach(function (name) {
        var v = (inputs[name].value || "").trim();
        if (!v) ok = false;
        values[name] = v;
      });
      if (!ok) return;
      submit.disabled = true;
      Array.prototype.forEach.call(f.querySelectorAll("input"), function (i) {
        i.disabled = true;
      });
      onSubmit(values);
    });
    body.appendChild(f);
    scrollToBottom();
  }

  function appendSiteCard(site) {
    if (!site) return;
    var card = el("div", { cls: "hxa-card" });
    card.appendChild(el("div", { cls: "hxa-card-title", text: site.name || "" }));
    if (site.address) card.appendChild(el("div", { text: site.address }));
    body.appendChild(card);
    scrollToBottom();
  }

  function appendProgress(p) {
    if (!p || !p.total) return;
    var idx = Math.max(1, Math.min(p.total, p.index || 1));
    var pct = Math.round((idx / p.total) * 100);
    var label = el("div", {
      cls: "hxa-meta",
      text: "Question " + idx + " of " + p.total,
    });
    body.appendChild(label);
    var bar = el("div", { cls: "hxa-progress" });
    var fill = el("div", { cls: "hxa-progress-fill" });
    fill.style.width = pct + "%";
    bar.appendChild(fill);
    body.appendChild(bar);
    scrollToBottom();
  }

  function appendTyping() {
    var row = el("div", { cls: "hxa-row hxa-bot" });
    var av = el("div", { cls: "hxa-avatar", html: ICON_HEX });
    var bubble = el("div", {
      cls: "hxa-bubble",
      html:
        '<div class="hxa-typing"><span></span><span></span><span></span></div>',
    });
    row.appendChild(av);
    row.appendChild(bubble);
    body.appendChild(row);
    scrollToBottom();
    return row;
  }

  function scrollToBottom() {
    requestAnimationFrame(function () {
      body.scrollTop = body.scrollHeight;
    });
  }

  function placeholderFor(name) {
    if (name === "name") return "Your full name";
    if (name === "email") return "you@example.com";
    if (name === "phone") return "+1 555 123 4567";
    return name;
  }

  function properCase(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // -------------------------------------------------------------
  // API client
  // -------------------------------------------------------------
  function postChat(message) {
    var body = {
      trial_id: config.trialId,
      trial_name: config.trialName || null,
      session_id: state.sessionId || null,
      message: message || null,
      user_name: config.userName || null,
    };
    return fetch(config.apiUrl + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error("HTTP " + res.status + ": " + (t || res.statusText));
        });
      }
      return res.json();
    });
  }

  // -------------------------------------------------------------
  // Conversation flow
  // -------------------------------------------------------------
  function start() {
    if (state.started) return;
    state.started = true;
    sendTurn(null);
  }

  function sendTurn(message) {
    if (state.busy) return;
    state.busy = true;
    setInputEnabled(false);
    if (message) appendUserMessage(message);

    var typing = appendTyping();

    postChat(message)
      .then(function (resp) {
        typing.remove();
        if (resp.session_id) {
          state.sessionId = resp.session_id;
          saveSessionId(resp.session_id);
        }
        renderResponse(resp);
      })
      .catch(function (err) {
        typing.remove();
        appendBotMessage(
          "Sorry — I had trouble reaching the server. Please try again in a moment."
        );
        var er = el("div", { cls: "hxa-error", text: String(err.message || err) });
        body.appendChild(er);
        scrollToBottom();
        state.lastInputType = "text";
        setInputEnabled(true);
      })
      .then(function () {
        state.busy = false;
      });
  }

  function renderResponse(resp) {
    // Progress indicator (shown above the question for screening turns)
    if (resp.meta && resp.meta.progress) {
      appendProgress(resp.meta.progress);
    }

    if (resp.message) appendBotMessage(resp.message);

    // Site card if backend included one in meta.
    if (resp.meta && resp.meta.site) {
      appendSiteCard(resp.meta.site);
    }

    var inputType = resp.input_type || "text";
    state.lastInputType = inputType;

    if (inputType === "buttons" && resp.options && resp.options.length) {
      appendOptions(resp.options, function (label) {
        sendTurn(label);
      });
      setInputEnabled(false);
    } else if (inputType === "form") {
      var fields =
        (resp.meta && resp.meta.form_fields) || ["name", "email", "phone"];
      appendForm(fields, function (values) {
        var lines = [];
        if (values.name) lines.push("Name: " + values.name);
        if (values.email) lines.push("Email: " + values.email);
        if (values.phone) lines.push("Phone: " + values.phone);
        sendTurn(lines.join("\n"));
      });
      setInputEnabled(false);
    } else if (inputType === "none") {
      setInputEnabled(false);
    } else {
      // text
      setInputEnabled(true);
      input.focus();
    }
  }

  function setInputEnabled(enabled) {
    if (enabled) {
      inputWrap.classList.remove("hxa-disabled");
    } else {
      inputWrap.classList.add("hxa-disabled");
      // If voice was running and the input got disabled, stop it.
      if (voice && voice.isActive && voice.isActive()) voice.stop(false);
    }
    input.disabled = !enabled;
    sendBtn.disabled = !enabled;
    if (config.voiceEnabled) micBtn.disabled = !enabled;
  }

  // -------------------------------------------------------------
  // Voice input — hybrid (Web Speech API → MediaRecorder/Whisper)
  // -------------------------------------------------------------
  // Two engines, identical interface from the widget's perspective:
  //   start() : begin capturing; updates `input.value` with interim/final
  //             transcript as it comes in.
  //   stop()  : stop capturing; resolves with the final transcript text.
  //
  // Engine selection at runtime:
  //   1. Web Speech API if window.SpeechRecognition (or webkit-prefixed)
  //      exists. Free, instant, no backend hit. Chrome/Edge/Safari.
  //   2. Otherwise MediaRecorder → POST /transcribe → Whisper.
  //
  // UX modes:
  //   "manual" (default): mic button toggles. Transcript fills the input.
  //                       User edits and clicks Send.
  //   "auto":             starts listening; on ~voiceSilenceMs of silence,
  //                       sends automatically.
  // -------------------------------------------------------------
  var voice = (function () {
    var WebSR =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;

    function vlog() {
      if (!config.voiceDebug) return;
      var args = ["[HexaAssist:voice]"];
      for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
      try {
        console.log.apply(console, args);
      } catch (e) {}
    }

    function hasMediaRecorder() {
      // Despite the name, we no longer use MediaRecorder — we capture raw
      // PCM via Web Audio and encode to WAV ourselves. We just need
      // getUserMedia + AudioContext, which is everywhere modern.
      return (
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function" &&
        !!(window.AudioContext || window.webkitAudioContext)
      );
    }

    var state = {
      active: false,
      engine: null, // "webspeech" | "media"
      stopFn: null,
      onResult: null,
      onError: null,
      onEnd: null,
      silenceTimer: null,
    };

    function isAvailable() {
      var pref = (config.voiceEngine || "auto").toLowerCase();
      if (pref === "webspeech") return !!WebSR;
      if (pref === "whisper") return hasMediaRecorder();
      return !!WebSR || hasMediaRecorder();
    }

    function start(opts) {
      if (state.active) return;
      opts = opts || {};
      state.onResult = opts.onResult || function () {};
      state.onError = opts.onError || function () {};
      state.onEnd = opts.onEnd || function () {};
      state.active = true;

      var pref = (config.voiceEngine || "auto").toLowerCase();
      vlog("requested engine=" + pref + " webSR=" + !!WebSR + " mediaRec=" + hasMediaRecorder());

      if (pref === "whisper") {
        if (!hasMediaRecorder()) {
          state.active = false;
          state.onError(new Error("MediaRecorder not supported in this browser."));
          return;
        }
        return startMediaRecorder(opts);
      }
      if (pref === "webspeech") {
        if (!WebSR) {
          state.active = false;
          state.onError(new Error("Web Speech API not available in this browser."));
          return;
        }
        return startWebSpeech(opts);
      }
      // auto
      if (WebSR) return startWebSpeech(opts);
      if (hasMediaRecorder()) return startMediaRecorder(opts);
      state.active = false;
      state.onError(new Error("Voice input is not supported in this browser."));
    }

    function stop(commit) {
      if (!state.active) return;
      if (state.stopFn) {
        try {
          state.stopFn(commit !== false);
        } catch (e) {
          /* swallow */
        }
      }
    }

    // ---- Web Speech engine ----
    function startWebSpeech(opts) {
      state.engine = "webspeech";
      vlog("starting webspeech engine, lang=" + config.voiceLang);
      var rec;
      try {
        rec = new WebSR();
      } catch (e) {
        state.active = false;
        state.onError(e);
        return;
      }
      rec.lang = config.voiceLang;
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;

      var finalText = "";
      var lastInterim = "";

      rec.onstart = function () {
        vlog("webspeech: start");
      };
      rec.onaudiostart = function () {
        vlog("webspeech: audio captured (mic ok)");
      };
      rec.onspeechstart = function () {
        vlog("webspeech: speech detected");
      };
      rec.onspeechend = function () {
        vlog("webspeech: speech ended");
      };
      rec.onnomatch = function () {
        vlog("webspeech: no match");
      };

      rec.onresult = function (ev) {
        var interim = "";
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          var r = ev.results[i];
          if (r.isFinal) finalText += r[0].transcript;
          else interim += r[0].transcript;
        }
        lastInterim = interim;
        var current = (finalText + " " + interim).trim();
        vlog(
          "webspeech: result final='" +
            finalText.trim() +
            "' interim='" +
            interim +
            "'"
        );
        state.onResult({ text: current, final: false });
        // Auto mode: reset silence timer on each interim result.
        if (opts.autoSubmit) armSilence(opts.silenceMs);
      };

      rec.onerror = function (ev) {
        var code = ev.error || "speech_error";
        vlog("webspeech: error=" + code);
        // "no-speech" is benign — user clicked mic but didn't say anything.
        // Don't surface as a hard error; let onend fall through.
        if (code === "no-speech" || code === "aborted") return;
        state.onError(new Error(code));
      };

      rec.onend = function () {
        clearSilence();
        state.active = false;
        state.engine = null;
        state.stopFn = null;
        // CRITICAL: combine final + lastInterim. Chrome with continuous=false
        // sometimes ends without promoting the last interim result to final;
        // if we only used finalText we'd lose what the user actually said.
        var text = (finalText + " " + lastInterim).trim();
        vlog("webspeech: end — combined text='" + text + "'");
        state.onResult({ text: text, final: true });
        state.onEnd({ text: text, autoSubmitted: !!opts.autoSubmit && !!text });
      };

      state.stopFn = function () {
        clearSilence();
        try {
          rec.stop();
        } catch (e) {
          /* ignore */
        }
      };

      try {
        rec.start();
      } catch (e) {
        state.active = false;
        state.onError(e);
      }
    }

    // ---- Web Audio + WAV encoder + /transcribe engine ----
    //
    // We don't use MediaRecorder here. Chrome's MediaRecorder emits
    // webm/opus blobs with a missing/zero `duration` field in the EBML
    // header, which OpenAI Whisper rejects with "audio file could not
    // be decoded". Capturing raw PCM via a ScriptProcessor and packing
    // it into a WAV file ourselves sidesteps the issue entirely:
    // proper RIFF header, no streaming-encoder quirks, ~100% compatible.
    //
    // ScriptProcessorNode is deprecated in favour of AudioWorklet, but
    // AudioWorklet requires loading a worker module which doesn't fit
    // a single-file embed. ScriptProcessor is still supported in every
    // major browser; we'll migrate when Chrome actually removes it.
    function startMediaRecorder(opts) {
      state.engine = "media";
      vlog("starting Web Audio → WAV → /transcribe pipeline");
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          vlog("mic stream acquired");
          var Ctx = window.AudioContext || window.webkitAudioContext;
          var ctx = new Ctx();
          var sampleRate = ctx.sampleRate;
          var source = ctx.createMediaStreamSource(stream);
          var bufferSize = 4096;
          var processor = ctx.createScriptProcessor(bufferSize, 1, 1);

          var buffers = [];
          var totalSamples = 0;

          processor.onaudioprocess = function (ev) {
            var ch = ev.inputBuffer.getChannelData(0);
            var copy = new Float32Array(ch.length);
            copy.set(ch);
            buffers.push(copy);
            totalSamples += ch.length;
          };

          source.connect(processor);
          processor.connect(ctx.destination);

          var finished = false;
          function finish(commit) {
            if (finished) return;
            finished = true;
            try {
              processor.disconnect();
              source.disconnect();
            } catch (e) {}
            stream.getTracks().forEach(function (t) {
              t.stop();
            });
            ctx.close().catch(function () {});
            clearSilence();
            state.active = false;
            state.engine = null;
            state.stopFn = null;

            vlog(
              "captured " +
                totalSamples +
                " samples (" +
                (totalSamples / sampleRate).toFixed(2) +
                "s) at " +
                sampleRate +
                "Hz"
            );

            // Reject suspiciously short recordings — Whisper bills per
            // request and a sub-300ms blob is almost always a misclick.
            var minSamples = sampleRate * 0.3;
            if (!commit || totalSamples < minSamples) {
              state.onEnd({ text: "", autoSubmitted: false });
              return;
            }

            // Flatten captured Float32 chunks → one PCM array.
            var flat = new Float32Array(totalSamples);
            var offset = 0;
            for (var i = 0; i < buffers.length; i++) {
              flat.set(buffers[i], offset);
              offset += buffers[i].length;
            }

            var wavBuf = encodeWAV(flat, sampleRate);
            var blob = new Blob([wavBuf], { type: "audio/wav" });

            uploadAudio(blob, "recording.wav")
              .then(function (text) {
                state.onResult({ text: text, final: true });
                state.onEnd({
                  text: text,
                  autoSubmitted: !!opts.autoSubmit && !!text,
                });
              })
              .catch(function (err) {
                state.onError(err);
                state.onEnd({ text: "", autoSubmitted: false });
              });
          }

          state.stopFn = function (commit) {
            finish(commit !== false);
          };

          // For auto mode set up silence detection on the live stream.
          if (opts.autoSubmit) {
            try {
              setupSilenceDetection(stream, opts.silenceMs);
            } catch (e) {
              state.silenceTimer = setTimeout(function () {
                state.stopFn && state.stopFn(true);
              }, Math.max(3000, opts.silenceMs * 2));
            }
          }
        })
        .catch(function (err) {
          state.active = false;
          state.onError(err);
        });
    }

    // Pack mono Float32 PCM samples into a 16-bit little-endian WAV.
    function encodeWAV(samples, sampleRate) {
      var bytesPerSample = 2;
      var blockAlign = 1 * bytesPerSample;
      var byteRate = sampleRate * blockAlign;
      var dataSize = samples.length * bytesPerSample;
      var buf = new ArrayBuffer(44 + dataSize);
      var v = new DataView(buf);
      writeString(v, 0, "RIFF");
      v.setUint32(4, 36 + dataSize, true);
      writeString(v, 8, "WAVE");
      writeString(v, 12, "fmt ");
      v.setUint32(16, 16, true); // PCM fmt chunk size
      v.setUint16(20, 1, true);  // PCM format
      v.setUint16(22, 1, true);  // mono
      v.setUint32(24, sampleRate, true);
      v.setUint32(28, byteRate, true);
      v.setUint16(32, blockAlign, true);
      v.setUint16(34, 16, true); // bits/sample
      writeString(v, 36, "data");
      v.setUint32(40, dataSize, true);
      var offset = 44;
      for (var i = 0; i < samples.length; i++) {
        var s = Math.max(-1, Math.min(1, samples[i]));
        v.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        offset += 2;
      }
      return buf;
    }
    function writeString(view, offset, str) {
      for (var i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }

    function uploadAudio(blob, filename) {
      var fd = new FormData();
      fd.append("audio", blob, filename || "recording.wav");
      if (config.voiceLang && config.voiceLang.length === 2) {
        fd.append("language", config.voiceLang);
      } else if (config.voiceLang && config.voiceLang.indexOf("-") !== -1) {
        fd.append("language", config.voiceLang.split("-")[0]);
      }
      // Trial id lets the backend build a domain prompt that biases
      // Whisper toward the right vocabulary. Big accuracy boost for
      // medical terms.
      if (config.trialId) fd.append("trial_id", config.trialId);
      vlog(
        "uploading " +
          (blob.size / 1024).toFixed(1) +
          " KB " +
          (blob.type || "audio/wav") +
          " to " +
          config.apiUrl +
          "/transcribe"
      );
      return fetch(config.apiUrl + "/transcribe", {
        method: "POST",
        body: fd,
      }).then(function (res) {
        if (!res.ok) {
          return res.text().then(function (t) {
            throw new Error("transcribe " + res.status + ": " + t);
          });
        }
        return res.json().then(function (d) {
          vlog("transcribe response:", d);
          return (d && d.text) || "";
        });
      });
    }

    function armSilence(ms) {
      clearSilence();
      state.silenceTimer = setTimeout(function () {
        // Web Speech API: stop() will trigger onend with finalText.
        if (state.stopFn) state.stopFn();
      }, ms || config.voiceSilenceMs);
    }
    function clearSilence() {
      if (state.silenceTimer) {
        clearTimeout(state.silenceTimer);
        state.silenceTimer = null;
      }
    }

    // VAD-lite for MediaRecorder path: stop after `silenceMs` of low RMS
    // following at least one detected utterance.
    function setupSilenceDetection(stream, silenceMs) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) throw new Error("no audio context");
      var ctx = new Ctx();
      var src = ctx.createMediaStreamSource(stream);
      var analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);
      var data = new Uint8Array(analyser.fftSize);
      var heardSpeech = false;
      var silentSince = null;

      function tick() {
        if (!state.active) return;
        analyser.getByteTimeDomainData(data);
        // RMS of the centred waveform (each byte ~128 = silence).
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
          var v = (data[i] - 128) / 128;
          sum += v * v;
        }
        var rms = Math.sqrt(sum / data.length);
        var threshold = 0.045;
        var now = Date.now();
        if (rms > threshold) {
          heardSpeech = true;
          silentSince = null;
        } else if (heardSpeech) {
          if (silentSince == null) silentSince = now;
          if (now - silentSince >= silenceMs) {
            ctx.close().catch(function () {});
            if (state.stopFn) state.stopFn();
            return;
          }
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    return {
      isAvailable: isAvailable,
      start: start,
      stop: stop,
      isActive: function () {
        return state.active;
      },
      engine: function () {
        return state.engine;
      },
    };
  })();

  // -------------------------------------------------------------
  // UI events
  // -------------------------------------------------------------
  function openPanel() {
    panel.classList.remove("hxa-hidden");
    panel.classList.remove("hxa-min");
    state.open = true;
    state.minimized = false;
    fab.style.display = "none";
    if (!state.started) start();
  }

  function closePanel() {
    panel.classList.add("hxa-hidden");
    state.open = false;
    fab.style.display = "flex";
  }

  function toggleMin() {
    state.minimized = !state.minimized;
    panel.classList.toggle("hxa-min", state.minimized);
  }

  fab.addEventListener("click", openPanel);
  btnClose.addEventListener("click", closePanel);
  btnMin.addEventListener("click", toggleMin);

  function trySend() {
    if (state.busy) return;
    if (state.lastInputType !== "text") return;
    var v = input.value.trim();
    if (!v) return;
    input.value = "";
    sendTurn(v);
  }
  sendBtn.addEventListener("click", trySend);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      trySend();
    }
  });

  // ------ Mic button wiring ------
  function showVoiceError(msg) {
    // Surface as a sticky banner inside the chat body so it's
    // unmissable, not a buried error line.
    var er = el("div", {
      cls: "hxa-error",
      text: "Voice input: " + msg,
    });
    body.appendChild(er);
    scrollToBottom();
    try {
      console.warn("[HexaAssist] voice error:", msg);
    } catch (e) {}
  }

  // Track whether the previous Web Speech attempt failed so we can promote
  // the engine to Whisper for subsequent clicks in this page session.
  var voiceFallbackEngaged = false;

  if (config.voiceEnabled && voice.isAvailable()) {
    micBtn.addEventListener("click", function () {
      if (voice.isActive()) {
        voice.stop(true);
        return;
      }
      if (state.busy || state.lastInputType !== "text") return;

      micBtn.classList.add("hxa-recording");
      micBtn.setAttribute("title", "Listening… click to stop");
      micBtn.innerHTML = ICON_MIC_OFF;
      input.placeholder = "Listening…";
      try {
        console.log("[HexaAssist] voice start (mode=" + config.voiceMode + ", engine=" + config.voiceEngine + ")");
      } catch (e) {}

      var auto = config.voiceMode === "auto";
      voice.start({
        autoSubmit: auto,
        silenceMs: config.voiceSilenceMs,
        onResult: function (r) {
          // Live-update the input box as speech comes in.
          input.value = r.text || input.value;
        },
        onError: function (err) {
          micBtn.classList.remove("hxa-recording");
          micBtn.innerHTML = ICON_MIC;
          micBtn.setAttribute("title", "Speak your message");
          input.placeholder = "Type your message...";
          var msg = (err && err.message) || String(err) || "voice_error";
          var hint = "";
          if (msg === "network")
            hint = " (Chrome's speech service couldn't be reached — try data-voice-engine=\"whisper\" to route through your backend instead.)";
          else if (msg === "not-allowed" || msg === "service-not-allowed")
            hint = " (microphone permission was denied — allow it in your browser site settings.)";
          else if (msg.indexOf("MediaRecorder") !== -1 || msg.indexOf("NotAllowedError") !== -1)
            hint = " (mic permission required — check your browser's site permissions.)";
          showVoiceError(msg + hint);
        },
        onEnd: function (r) {
          micBtn.classList.remove("hxa-recording");
          micBtn.innerHTML = ICON_MIC;
          micBtn.setAttribute("title", "Speak your message");
          input.placeholder = "Type your message...";
          try {
            console.log("[HexaAssist] voice end:", r);
          } catch (e) {}
          if (r && r.autoSubmitted && r.text) {
            input.value = "";
            sendTurn(r.text);
            return;
          }
          if (r && r.text) {
            input.value = r.text;
            input.focus();
            return;
          }
          // Empty result. If the user is on engine=auto and Web Speech
          // came back with nothing, switch to Whisper for this session
          // and retry automatically (the typical cause is Chrome's
          // speech service being unreachable through proxies / VPNs).
          var engineUsed = voice.engine && voice.engine();
          if (
            (config.voiceEngine || "auto") === "auto" &&
            engineUsed === null &&
            !voiceFallbackEngaged
          ) {
            voiceFallbackEngaged = true;
            config.voiceEngine = "whisper";
            try {
              console.warn(
                "[HexaAssist] Web Speech returned empty — falling back to backend Whisper for the rest of this session."
              );
            } catch (e) {}
            showVoiceError(
              "switching to backend transcription. Click the mic and try again."
            );
            return;
          }
          showVoiceError(
            "didn't catch anything. Try speaking a little louder, or set data-voice-engine=\"whisper\" to force the backend transcriber."
          );
        },
      });
    });
  } else if (config.voiceEnabled) {
    // Voice was requested but not available — hide the button so the
    // input row doesn't look broken.
    micBtn.style.display = "none";
  }

  // -------------------------------------------------------------
  // Public API on window.HexaAssist
  // -------------------------------------------------------------
  window.HexaAssist = {
    open: openPanel,
    close: closePanel,
    minimize: toggleMin,
    reset: function () {
      clearSessionId();
      state.sessionId = null;
      state.started = false;
      // wipe rendered messages but keep subhead
      while (body.firstChild) body.removeChild(body.firstChild);
      body.appendChild(subhead);
    },
    setUserName: function (name) {
      config.userName = name || "";
    },
    config: config,
  };

  if (config.autoOpen) {
    // Defer to next tick so any inline init code can run first.
    setTimeout(openPanel, 0);
  }
})();
