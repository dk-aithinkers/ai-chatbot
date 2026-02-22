var DCTChat=function(l){"use strict";var v=Object.defineProperty;var k=(l,d,o)=>d in l?v(l,d,{enumerable:!0,configurable:!0,writable:!0,value:o}):l[d]=o;var a=(l,d,o)=>k(l,typeof d!="symbol"?d+"":d,o);const d=`
/* CSS Reset for widget */
.dct-chat-widget *,
.dct-chat-widget *::before,
.dct-chat-widget *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Floating Button */
.dct-chat-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 999998;
}

.dct-chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

.dct-chat-button svg {
  width: 28px;
  height: 28px;
  fill: white;
  transition: transform 0.3s ease;
}

.dct-chat-button.open svg {
  transform: rotate(90deg);
}

/* Chat Window */
.dct-chat-window {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 380px;
  height: 680px;
  max-height: calc(100vh - 140px);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 999999;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(0.95);
  transition: all 0.3s ease;
}

.dct-chat-window.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

/* Header */
.dct-chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.dct-chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dct-chat-avatar svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.dct-chat-header-info {
  flex: 1;
}

.dct-chat-header-title {
  font-size: 16px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-header-subtitle {
  font-size: 13px;
  opacity: 0.9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.dct-chat-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dct-chat-close svg {
  width: 16px;
  height: 16px;
  fill: white;
}

/* Messages Container */
.dct-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f9fb;
}

.dct-chat-messages::-webkit-scrollbar {
  width: 6px;
}

.dct-chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.dct-chat-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

/* Message Bubbles */
.dct-chat-message {
  display: flex;
  gap: 10px;
  max-width: 85%;
  animation: dct-message-in 0.3s ease;
}

@keyframes dct-message-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dct-chat-message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.dct-chat-message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dct-chat-message.user .dct-chat-message-avatar {
  background: #e5e7eb;
}

.dct-chat-message-avatar svg {
  width: 16px;
  height: 16px;
  fill: white;
}

.dct-chat-message.user .dct-chat-message-avatar svg {
  fill: #6b7280;
}

.dct-chat-message-content {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  border-top-left-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-message.user .dct-chat-message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  border-top-right-radius: 4px;
}

/* Markdown content styles */
.dct-chat-message-content p {
  margin: 0;
}

.dct-chat-message-content p + p {
  margin-top: 12px;
}

.dct-chat-message-content strong {
  font-weight: 600;
  color: #1f2937;
}

.dct-chat-message-content em {
  font-style: italic;
}

.dct-chat-message-content a {
  color: #667eea;
  text-decoration: none;
}

.dct-chat-message-content a:hover {
  text-decoration: underline;
}

.dct-chat-message-content code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Monaco', 'Menlo', monospace;
}

.dct-chat-message.user .dct-chat-message-content strong,
.dct-chat-message.user .dct-chat-message-content em {
  color: inherit;
}

/* Typing Indicator */
.dct-chat-typing {
  display: flex;
  gap: 10px;
  max-width: 85%;
}

.dct-chat-typing-dots {
  background: white;
  padding: 16px 20px;
  border-radius: 16px;
  border-top-left-radius: 4px;
  display: flex;
  gap: 5px;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dct-chat-typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  animation: dct-typing 1.4s infinite;
}

.dct-chat-typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dct-chat-typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dct-typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* Input Area */
.dct-chat-input-container {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.dct-chat-input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.dct-chat-input {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 12px 18px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  resize: none;
  max-height: 120px;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.dct-chat-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.dct-chat-input::placeholder {
  color: #9ca3af;
}

.dct-chat-send {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.dct-chat-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.dct-chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dct-chat-send svg {
  width: 20px;
  height: 20px;
  fill: white;
  margin-left: 2px;
}

/* Welcome Message */
.dct-chat-welcome {
  text-align: center;
  padding: 20px;
}

.dct-chat-welcome-emoji {
  font-size: 48px;
  margin-bottom: 12px;
}

.dct-chat-welcome-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-welcome-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .dct-chat-window {
    width: 100%;
    height: 100%;
    max-height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
  
  .dct-chat-button {
    bottom: 16px;
    right: 16px;
  }
}

/* Powered By */
.dct-chat-powered {
  text-align: center;
  padding: 8px;
  font-size: 11px;
  color: #9ca3af;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-powered a {
  color: #667eea;
  text-decoration: none;
}

.dct-chat-powered a:hover {
  text-decoration: underline;
}

/* Trial Info Card */
.dct-chat-trial-info {
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.dct-chat-trial-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background 0.2s ease;
}

.dct-chat-trial-toggle:hover {
  background: #f9fafb;
}

.dct-chat-trial-toggle-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.dct-chat-trial-toggle-icon {
  font-size: 12px;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.dct-chat-trial-info.expanded .dct-chat-trial-toggle-icon {
  transform: rotate(180deg);
}

.dct-chat-trial-body {
  padding: 0 20px 16px;
  display: none;
}

.dct-chat-trial-info.expanded .dct-chat-trial-body {
  display: block;
}

.dct-chat-trial-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.4;
}

.dct-chat-trial-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.dct-chat-trial-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dct-chat-trial-badge.phase {
  background: #ede9fe;
  color: #6d28d9;
}

.dct-chat-trial-badge.status {
  background: #d1fae5;
  color: #065f46;
}

.dct-chat-trial-meta {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-trial-meta strong {
  color: #374151;
}

/* Quick Reply Buttons */
.dct-chat-quick-replies {
  display: flex;
  gap: 8px;
  padding: 8px 20px 12px;
  background: #f8f9fb;
  flex-wrap: wrap;
}

.dct-chat-quick-reply-btn {
  padding: 8px 16px;
  border: 1.5px solid #667eea;
  border-radius: 20px;
  background: white;
  color: #667eea;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dct-chat-quick-reply-btn:hover {
  background: #667eea;
  color: white;
}

/* Progress Bar */
.dct-chat-progress {
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.dct-chat-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-progress-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.dct-chat-progress-count {
  font-size: 12px;
  color: #6b7280;
}

.dct-chat-progress-track {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.dct-chat-progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.4s ease;
}

/* Contact Form */
.dct-chat-contact-form {
  padding: 12px 20px;
  background: #f8f9fb;
  border-top: 1px solid #e5e7eb;
}

.dct-chat-contact-form p {
  font-size: 13px;
  color: #374151;
  margin-bottom: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-contact-form input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-bottom: 8px;
  outline: none;
  transition: border-color 0.2s ease;
}

.dct-chat-contact-form input:focus {
  border-color: #667eea;
}

.dct-chat-contact-submit {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: opacity 0.2s ease;
}

.dct-chat-contact-submit:hover {
  opacity: 0.9;
}

.dct-chat-contact-hint {
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  margin-top: 6px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Qualification Badge */
.dct-chat-qualification {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: dct-message-in 0.3s ease;
}

.dct-chat-qualification.qualified {
  background: #d1fae5;
  color: #065f46;
}

.dct-chat-qualification.not-qualified {
  background: #fef3c7;
  color: #92400e;
}

.dct-chat-qualification-icon {
  font-size: 16px;
}

/* Processing Indicator */
.dct-chat-processing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #eff6ff;
  color: #1e40af;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-processing-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #93c5fd;
  border-top-color: #1e40af;
  border-radius: 50%;
  animation: dct-spin 0.8s linear infinite;
}

@keyframes dct-spin {
  to { transform: rotate(360deg); }
}

/* Completion Screen */
.dct-chat-completion {
  text-align: center;
  padding: 16px 20px;
  background: #f0fdf4;
  border-top: 1px solid #bbf7d0;
}

.dct-chat-completion-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.dct-chat-completion-text {
  font-size: 14px;
  font-weight: 600;
  color: #166534;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Promotional Banner */
.dct-chat-promo {
  position: fixed;
  bottom: 100px;
  right: 24px;
  max-width: 280px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.35);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 999997;
  animation: slideInRight 0.5s ease, pulse 2s ease-in-out infinite;
  cursor: default;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dct-chat-promo.left {
  right: auto;
  left: 24px;
  animation: slideInLeft 0.5s ease, pulse 2s ease-in-out infinite;
}

.dct-chat-promo-content {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.dct-chat-promo-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.dct-chat-promo-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(50px);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.35);
  }
  50% {
    box-shadow: 0 8px 35px rgba(16, 185, 129, 0.5);
  }
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .dct-chat-promo {
    bottom: 90px;
    right: 16px;
    left: 16px;
    max-width: calc(100% - 32px);
  }

  .dct-chat-promo.left {
    left: 16px;
    right: 16px;
  }
}
`,o={chat:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
  </svg>`,close:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>`,send:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>`,bot:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5m9 0a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5"/>
  </svg>`,user:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>`},f="dct_prescreening_session_id";class b{constructor(t){a(this,"config");a(this,"sessionId");this.config=t,this.sessionId=t.sessionId||this.loadOrCreateSessionId()}loadOrCreateSessionId(){if(this.config.prescreeningMode){const t=sessionStorage.getItem(f);if(t)return t;const e=this.generateSessionId();return sessionStorage.setItem(f,e),e}return this.generateSessionId()}generateSessionId(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const e=Math.random()*16|0;return(t==="x"?e:e&3|8).toString(16)})}getBaseUrl(){try{const t=new URL(this.config.apiUrl);return`${t.protocol}//${t.host}`}catch{return this.config.apiUrl.replace(/\/[^/]*$/,"")}}getHeaders(){const t={"Content-Type":"application/json"};return this.config.apiKey&&(t.Authorization=`Bearer ${this.config.apiKey}`),this.config.trialNctId&&(t["X-Trial-NCT-ID"]=this.config.trialNctId),t}async fetchTrialInfo(){const t=this.getBaseUrl(),e=await fetch(`${t}/prescreening/trial-info`,{headers:this.getHeaders()});if(!e.ok)throw new Error(`API error: ${e.status}`);return e.json()}async fetchConversationHistory(){const t=this.getBaseUrl(),e=await fetch(`${t}/prescreening/session/${this.sessionId}/history`,{headers:this.getHeaders()});if(e.status===404)return null;if(!e.ok)throw new Error(`API error: ${e.status}`);return e.json()}async sendPrescreeningMessage(t){const e=this.getBaseUrl(),i=await fetch(`${e}/prescreening/message`,{method:"POST",headers:this.getHeaders(),body:JSON.stringify({session_id:this.sessionId,message:t})});if(!i.ok)throw new Error(`API error: ${i.status}`);return i.json()}async sendMessage(t){try{const e=await fetch(this.config.apiUrl,{method:"POST",headers:this.getHeaders(),body:JSON.stringify({session_id:this.sessionId,message:t})});if(!e.ok)throw new Error(`API error: ${e.status}`);const i=await e.json();return{message:i.message||i.response||i.reply||i.content||"No response",sessionId:i.session_id}}catch(e){throw console.error("DCT Chat API Error:",e),e}}resetConversation(){this.sessionId=this.generateSessionId(),this.config.prescreeningMode&&sessionStorage.setItem(f,this.sessionId)}getSessionId(){return this.sessionId}}function y(s){let t=w(s);return t=t.replace(/\\n/g,`
`),t=t.replace(/^### (.+)$/gm,'<strong style="font-size: 1em;">$1</strong>'),t=t.replace(/^## (.+)$/gm,'<strong style="font-size: 1.1em;">$1</strong>'),t=t.replace(/^# (.+)$/gm,'<strong style="font-size: 1.2em;">$1</strong>'),t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/__(.+?)__/g,"<strong>$1</strong>"),t=t.replace(new RegExp("(?<!\\*)\\*([^*]+?)\\*(?!\\*)","g"),"<em>$1</em>"),t=t.replace(new RegExp("(?<!_)_([^_]+?)_(?!_)","g"),"<em>$1</em>"),t=t.replace(/`([^`]+?)`/g,'<code style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em;">$1</code>'),t=t.replace(/^(\d+)\. (.+)$/gm,'<div style="margin-left: 16px; margin-bottom: 4px;">$1. $2</div>'),t=t.replace(/^[-•] (.+)$/gm,'<div style="margin-left: 16px; margin-bottom: 4px;">• $1</div>'),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #667eea;">$1</a>'),t=t.replace(/\n\n+/g,'</p><p style="margin-top: 12px;">'),t=t.replace(/\n/g,"<br>"),t="<p>"+t+"</p>",t=t.replace(/<p><\/p>/g,""),t=t.replace(/<p>\s*<br>\s*<\/p>/g,""),t}function w(s){const t=document.createElement("div");return t.textContent=s,t.innerHTML}class m{constructor(t){a(this,"config");a(this,"api");a(this,"container",null);a(this,"chatWindow",null);a(this,"messagesContainer",null);a(this,"input",null);a(this,"sendButton",null);a(this,"toggleButton",null);a(this,"isOpen",!1);a(this,"isLoading",!1);a(this,"messages",[]);a(this,"conversationStage","greeting");a(this,"isQualified",null);a(this,"trialInfo",null);a(this,"prescreeningQuestionIndex",0);a(this,"secondaryQuestionIndex",0);a(this,"prescreeningInitialized",!1);this.config={title:"Chat with us",subtitle:"We typically reply within minutes",placeholder:"Type your message...",welcomeMessage:"Hi there! 👋 How can we help you today?",position:"bottom-right",showPoweredBy:!0,...t},this.api=new b(this.config)}init(){this.injectStyles(),this.createWidget(),this.attachEventListeners(),this.config.prescreeningMode&&this.initPrescreening()}async initPrescreening(){try{this.trialInfo=await this.api.fetchTrialInfo(),this.renderTrialInfo()}catch(t){console.error("Failed to fetch trial info:",t)}try{const t=await this.api.fetchConversationHistory();if(t&&t.messages&&t.messages.length>0){await this.restoreConversation(t),this.prescreeningInitialized=!0;return}}catch(t){console.error("Failed to fetch conversation history:",t)}await this.sendPrescreeningMessage("Hi",!0),this.prescreeningInitialized=!0}async restoreConversation(t){this.conversationStage=t.conversation_stage,t.is_qualified!==null&&(this.isQualified=t.is_qualified,this.showQualificationBadge(t.is_qualified)),t.current_question_index!==null&&t.total_questions!==null&&(t.conversation_stage==="prescreening"?this.prescreeningQuestionIndex=t.current_question_index:t.conversation_stage==="secondary_screening"&&(this.secondaryQuestionIndex=t.current_question_index)),t.messages.forEach((e,i)=>{this.addMessage({id:`restored-${i}`,content:e.content,role:e.role,timestamp:new Date(e.timestamp)})}),this.updateStageUI(t.conversation_stage)}injectStyles(){if(document.getElementById("dct-chat-styles"))return;const t=document.createElement("style");t.id="dct-chat-styles",t.textContent=d,this.config.primaryColor&&(t.textContent=d.replace(/linear-gradient\(135deg, #667eea 0%, #764ba2 100%\)/g,this.config.primaryColor)),document.head.appendChild(t)}createWidget(){this.container=document.createElement("div"),this.container.className="dct-chat-widget",this.container.innerHTML=this.getWidgetHTML(),document.body.appendChild(this.container),this.chatWindow=this.container.querySelector(".dct-chat-window"),this.messagesContainer=this.container.querySelector(".dct-chat-messages"),this.input=this.container.querySelector(".dct-chat-input"),this.sendButton=this.container.querySelector(".dct-chat-send"),this.toggleButton=this.container.querySelector(".dct-chat-button"),!this.config.prescreeningMode&&this.config.welcomeMessage&&this.addMessage({id:"welcome",content:this.config.welcomeMessage,role:"assistant",timestamp:new Date})}getWidgetHTML(){const t=this.config.position==="bottom-left"?"left":"right";return`
      <!-- Promotional Banner -->
      ${this.config.showPromotionalBanner&&this.config.promotionalText?`<div class="dct-chat-promo ${t}">
          <div class="dct-chat-promo-content">
            ${this.escapeHtml(this.config.promotionalText)}
          </div>
          <button class="dct-chat-promo-close" aria-label="Close banner">×</button>
        </div>`:""}

      <!-- Toggle Button -->
      <button class="dct-chat-button" aria-label="Open chat">
        ${o.chat}
      </button>

      <!-- Chat Window -->
      <div class="dct-chat-window ${t}">
        <!-- Header -->
        <div class="dct-chat-header">
          <div class="dct-chat-avatar">
            ${o.bot}
          </div>
          <div class="dct-chat-header-info">
            <div class="dct-chat-header-title">${this.escapeHtml(this.config.title||"")}</div>
            <div class="dct-chat-header-subtitle">${this.escapeHtml(this.config.subtitle||"")}</div>
          </div>
          <button class="dct-chat-close" aria-label="Close chat">
            ${o.close}
          </button>
        </div>

        <!-- Trial Info (placeholder, populated later) -->
        <div class="dct-chat-trial-info" style="display:none;"></div>

        <!-- Qualification Badge (placeholder) -->
        <div class="dct-chat-qualification" style="display:none;"></div>

        <!-- Progress Bar (placeholder) -->
        <div class="dct-chat-progress" style="display:none;"></div>

        <!-- Messages -->
        <div class="dct-chat-messages"></div>

        <!-- Quick Replies (placeholder) -->
        <div class="dct-chat-quick-replies" style="display:none;"></div>

        <!-- Contact Form (placeholder) -->
        <div class="dct-chat-contact-form" style="display:none;"></div>

        <!-- Input -->
        <div class="dct-chat-input-container">
          <div class="dct-chat-input-wrapper">
            <textarea 
              class="dct-chat-input" 
              placeholder="${this.escapeHtml(this.config.placeholder||"")}"
              rows="1"
            ></textarea>
            <button class="dct-chat-send" aria-label="Send message">
              ${o.send}
            </button>
          </div>
        </div>

        ${this.config.showPoweredBy?`
          <div class="dct-chat-powered">
            Powered by <a href="#" target="_blank">DCT</a>
          </div>
        `:""}
      </div>
    `}attachEventListeners(){var t,e,i,n,c,h,u,p;(t=this.toggleButton)==null||t.addEventListener("click",()=>this.toggle()),(i=(e=this.container)==null?void 0:e.querySelector(".dct-chat-close"))==null||i.addEventListener("click",()=>this.close()),(c=(n=this.container)==null?void 0:n.querySelector(".dct-chat-promo-close"))==null||c.addEventListener("click",()=>{var g;const r=(g=this.container)==null?void 0:g.querySelector(".dct-chat-promo");r&&(r.style.animation="slideOutRight 0.3s ease",setTimeout(()=>{r.style.display="none"},300))}),(h=this.sendButton)==null||h.addEventListener("click",()=>this.handleSend()),(u=this.input)==null||u.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),this.handleSend())}),(p=this.input)==null||p.addEventListener("input",()=>{this.autoResizeInput(),this.updateSendButton()}),document.addEventListener("click",r=>{this.isOpen&&this.container&&!this.container.contains(r.target)&&r.target.closest(".dct-chat-button")})}toggle(){this.isOpen?this.close():this.open()}open(){var t,e,i;this.isOpen=!0,(t=this.chatWindow)==null||t.classList.add("open"),(e=this.toggleButton)==null||e.classList.add("open"),this.toggleButton&&(this.toggleButton.innerHTML=o.close),(i=this.input)==null||i.focus()}close(){var t,e;this.isOpen=!1,(t=this.chatWindow)==null||t.classList.remove("open"),(e=this.toggleButton)==null||e.classList.remove("open"),this.toggleButton&&(this.toggleButton.innerHTML=o.chat)}async handleSend(){var e;const t=(e=this.input)==null?void 0:e.value.trim();!t||this.isLoading||(this.input&&(this.input.value="",this.autoResizeInput(),this.updateSendButton()),this.config.prescreeningMode?await this.sendPrescreeningMessage(t,!1):await this.sendGenericMessage(t))}async sendPrescreeningMessage(t,e){e||this.addMessage({id:this.generateId(),content:t,role:"user",timestamp:new Date}),this.hideQuickReplies(),this.hideContactForm(),this.showTypingIndicator(),this.isLoading=!0,this.input&&(this.input.disabled=!0),this.sendButton&&(this.sendButton.disabled=!0);try{const i=await this.api.sendPrescreeningMessage(t);this.hideTypingIndicator(),this.addMessage({id:this.generateId(),content:i.message,role:"assistant",timestamp:new Date}),this.conversationStage=i.conversation_stage,this.updateStageUI(i.conversation_stage),i.is_qualified!==null&&(this.isQualified=i.is_qualified,this.showQualificationBadge(i.is_qualified)),i.next_action==="start_prescreening"&&setTimeout(()=>{this.sendPrescreeningMessage("continue",!0)},1e3),i.next_action==="auto_evaluate"&&(this.addMessage({id:this.generateId(),content:"Evaluating your responses...",role:"assistant",timestamp:new Date}),setTimeout(()=>{this.sendPrescreeningMessage("evaluate",!0)},500)),i.next_action==="start_secondary"&&setTimeout(()=>{this.sendPrescreeningMessage("start_secondary",!0)},1e3)}catch{this.hideTypingIndicator(),this.addMessage({id:this.generateId(),content:"Sorry, something went wrong. Please try again.",role:"assistant",timestamp:new Date})}finally{this.isLoading=!1,this.input&&(this.input.disabled=!1,this.input.focus()),this.sendButton&&(this.sendButton.disabled=!1),this.updateSendButton()}}async sendGenericMessage(t){const e={id:this.generateId(),content:t,role:"user",timestamp:new Date};this.addMessage(e),this.showTypingIndicator(),this.isLoading=!0,this.input&&(this.input.disabled=!0),this.sendButton&&(this.sendButton.disabled=!0);try{const i=await this.api.sendMessage(t);this.hideTypingIndicator(),this.addMessage({id:this.generateId(),content:i.message,role:"assistant",timestamp:new Date})}catch{this.hideTypingIndicator(),this.addMessage({id:this.generateId(),content:"Sorry, something went wrong. Please try again.",role:"assistant",timestamp:new Date})}finally{this.isLoading=!1,this.input&&(this.input.disabled=!1,this.input.focus()),this.sendButton&&(this.sendButton.disabled=!1),this.updateSendButton()}}renderTrialInfo(){var e;if(!this.trialInfo||!this.chatWindow)return;const t=this.chatWindow.querySelector(".dct-chat-trial-info");t&&(t.innerHTML=`
      <button class="dct-chat-trial-toggle">
        <span class="dct-chat-trial-toggle-label">Trial Information</span>
        <span class="dct-chat-trial-toggle-icon">▼</span>
      </button>
      <div class="dct-chat-trial-body">
        <div class="dct-chat-trial-title">${this.escapeHtml(this.trialInfo.title)}</div>
        <div class="dct-chat-trial-badges">
          <span class="dct-chat-trial-badge phase">${this.escapeHtml(this.trialInfo.phase)}</span>
          <span class="dct-chat-trial-badge status">${this.escapeHtml(this.trialInfo.status)}</span>
        </div>
        <div class="dct-chat-trial-meta">
          <strong>Age:</strong> ${this.escapeHtml(this.trialInfo.minimum_age)} – ${this.escapeHtml(this.trialInfo.maximum_age)}<br>
          <strong>Gender:</strong> ${this.escapeHtml(this.trialInfo.gender)}<br>
          <strong>Conditions:</strong> ${this.escapeHtml(this.trialInfo.conditions.join(", "))}
        </div>
      </div>
    `,t.style.display="block",(e=t.querySelector(".dct-chat-trial-toggle"))==null||e.addEventListener("click",()=>{t.classList.toggle("expanded")}))}updateStageUI(t){switch(this.hideQuickReplies(),this.hideProgressBar(),this.hideContactForm(),this.hideProcessingIndicator(),this.hideCompletionScreen(),this.enableChatInput(),t){case"greeting":case"interest_check":this.showQuickReplies(["Yes, I'm interested","No, just questions"]);break;case"prescreening":this.prescreeningQuestionIndex++,this.showProgressBar("Screening Questions",this.prescreeningQuestionIndex,6);break;case"qualification_check":this.showProcessingIndicator("Evaluating your responses...");break;case"contact_collection":this.showContactForm(),this.disableChatInput();break;case"secondary_interest_check":this.showQuickReplies(["Yes, continue","No, that's enough"]);break;case"secondary_screening":this.secondaryQuestionIndex++,this.showProgressBar("Detailed Screening",this.secondaryQuestionIndex,12);break;case"completed":this.showCompletionScreen();break}}showQuickReplies(t){var i;const e=(i=this.chatWindow)==null?void 0:i.querySelector(".dct-chat-quick-replies");e&&(e.innerHTML="",t.forEach(n=>{const c=document.createElement("button");c.className="dct-chat-quick-reply-btn",c.textContent=n,c.addEventListener("click",()=>{this.hideQuickReplies(),this.sendPrescreeningMessage(n,!1)}),e.appendChild(c)}),e.style.display="flex")}hideQuickReplies(){var e;const t=(e=this.chatWindow)==null?void 0:e.querySelector(".dct-chat-quick-replies");t&&(t.style.display="none")}showProgressBar(t,e,i){var h;const n=(h=this.chatWindow)==null?void 0:h.querySelector(".dct-chat-progress");if(!n)return;const c=Math.min(e/i*100,100);n.innerHTML=`
      <div class="dct-chat-progress-header">
        <span class="dct-chat-progress-label">${this.escapeHtml(t)}</span>
        <span class="dct-chat-progress-count">Question ${e} of ${i}</span>
      </div>
      <div class="dct-chat-progress-track">
        <div class="dct-chat-progress-fill" style="width:${c}%"></div>
      </div>
    `,n.style.display="block"}hideProgressBar(){var e;const t=(e=this.chatWindow)==null?void 0:e.querySelector(".dct-chat-progress");t&&(t.style.display="none")}showQualificationBadge(t){var i;const e=(i=this.chatWindow)==null?void 0:i.querySelector(".dct-chat-qualification");e&&(t?(e.className="dct-chat-qualification qualified",e.innerHTML='<span class="dct-chat-qualification-icon">✓</span> <span>Potentially Eligible</span>'):(e.className="dct-chat-qualification not-qualified",e.innerHTML='<span class="dct-chat-qualification-icon">ℹ</span> <span>Not Eligible at This Time</span>'),e.style.display="flex")}showContactForm(){var e,i;const t=(e=this.chatWindow)==null?void 0:e.querySelector(".dct-chat-contact-form");t&&(t.innerHTML=`
      <input type="text" class="dct-contact-name" placeholder="Full Name" />
      <input type="email" class="dct-contact-email" placeholder="Email Address" />
      <input type="tel" class="dct-contact-phone" placeholder="Phone Number" />
      <button class="dct-chat-contact-submit">Submit</button>
    `,t.style.display="block",(i=t.querySelector(".dct-chat-contact-submit"))==null||i.addEventListener("click",()=>{var p,r,g;const n=((p=t.querySelector(".dct-contact-name"))==null?void 0:p.value)||"",c=((r=t.querySelector(".dct-contact-email"))==null?void 0:r.value)||"",h=((g=t.querySelector(".dct-contact-phone"))==null?void 0:g.value)||"";if(!n&&!c&&!h)return;const u=`Name: ${n}
Email: ${c}
Phone: ${h}`;this.hideContactForm(),this.sendPrescreeningMessage(u,!1)}))}hideContactForm(){var e;const t=(e=this.chatWindow)==null?void 0:e.querySelector(".dct-chat-contact-form");t&&(t.style.display="none")}disableChatInput(){this.input&&(this.input.disabled=!0,this.input.placeholder="Please use the form above"),this.sendButton&&(this.sendButton.disabled=!0)}enableChatInput(){var t;this.input&&(this.input.disabled=!1,this.input.placeholder=this.config.placeholder||"Type your message..."),this.sendButton&&(this.sendButton.disabled=!((t=this.input)!=null&&t.value.trim()))}showProcessingIndicator(t){var i;const e=(i=this.chatWindow)==null?void 0:i.querySelector(".dct-chat-progress");e&&(e.innerHTML=`
      <div class="dct-chat-processing">
        <div class="dct-chat-processing-spinner"></div>
        <span>${this.escapeHtml(t)}</span>
      </div>
    `,e.style.display="block")}hideProcessingIndicator(){}showCompletionScreen(){var i,n;const t=(i=this.chatWindow)==null?void 0:i.querySelector(".dct-chat-progress");if(!t)return;t.innerHTML=`
      <div class="dct-chat-completion">
        <div class="dct-chat-completion-icon">✓</div>
        <div class="dct-chat-completion-text">Screening Complete</div>
      </div>
    `,t.style.display="block";const e=(n=this.chatWindow)==null?void 0:n.querySelector(".dct-chat-input");e&&(e.placeholder="Ask any questions about the trial...",e.value=""),this.hideQuickReplies(),this.hideContactForm()}hideCompletionScreen(){}addMessage(t){var n;this.messages.push(t);const e=document.createElement("div");e.className=`dct-chat-message ${t.role==="user"?"user":""}`;const i=t.role==="assistant"?y(t.content):this.escapeHtml(t.content);e.innerHTML=`
      <div class="dct-chat-message-avatar">
        ${t.role==="user"?o.user:o.bot}
      </div>
      <div class="dct-chat-message-content">${i}</div>
    `,(n=this.messagesContainer)==null||n.appendChild(e),this.scrollToBottom()}showTypingIndicator(){var e;const t=document.createElement("div");t.className="dct-chat-typing",t.id="dct-typing-indicator",t.innerHTML=`
      <div class="dct-chat-message-avatar">
        ${o.bot}
      </div>
      <div class="dct-chat-typing-dots">
        <div class="dct-chat-typing-dot"></div>
        <div class="dct-chat-typing-dot"></div>
        <div class="dct-chat-typing-dot"></div>
      </div>
    `,(e=this.messagesContainer)==null||e.appendChild(t),this.scrollToBottom()}hideTypingIndicator(){const t=document.getElementById("dct-typing-indicator");t==null||t.remove()}scrollToBottom(){this.messagesContainer&&(this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight)}autoResizeInput(){this.input&&(this.input.style.height="auto",this.input.style.height=Math.min(this.input.scrollHeight,120)+"px")}updateSendButton(){this.sendButton&&this.input&&(this.sendButton.disabled=!this.input.value.trim())}escapeHtml(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}generateId(){return Math.random().toString(36).substring(2,11)}getConversationStage(){return this.conversationStage}getQualificationStatus(){return this.isQualified}isPrescreeningReady(){return this.prescreeningInitialized}destroy(){var t,e;(t=this.container)==null||t.remove(),(e=document.getElementById("dct-chat-styles"))==null||e.remove()}}window.DCTChat={init:s=>{const t=new m(s);return t.init(),t},ChatWidget:m};function x(){if(window.dctChatConfig){window.DCTChat.init(window.dctChatConfig);return}const s=document.currentScript||document.querySelector("script[data-dct-api-url]");if(s){const t=s.getAttribute("data-dct-api-url");if(t){const e={apiUrl:t,apiKey:s.getAttribute("data-dct-api-key")||void 0,trialNctId:s.getAttribute("data-dct-trial-nct-id")||void 0,title:s.getAttribute("data-dct-title")||void 0,subtitle:s.getAttribute("data-dct-subtitle")||void 0,placeholder:s.getAttribute("data-dct-placeholder")||void 0,welcomeMessage:s.getAttribute("data-dct-welcome")||void 0,primaryColor:s.getAttribute("data-dct-color")||void 0,position:s.getAttribute("data-dct-position")||void 0,showPoweredBy:s.getAttribute("data-dct-powered-by")!=="false",prescreeningMode:s.getAttribute("data-dct-prescreening-mode")==="true",promotionalText:s.getAttribute("data-dct-promo-text")||void 0,showPromotionalBanner:s.getAttribute("data-dct-show-promo")==="true"};window.DCTChat.init(e)}}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",x):x(),l.ChatWidget=m,Object.defineProperty(l,Symbol.toStringTag,{value:"Module"}),l}({});
