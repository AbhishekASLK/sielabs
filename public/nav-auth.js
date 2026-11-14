(function() {
  var listenersAttached = false;

  function injectNavStyles() {
    if (document.getElementById('sie-nav-auth-css')) return;
    var style = document.createElement('style');
    style.id = 'sie-nav-auth-css';
    style.textContent = `
      .nav-auth-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .nav-auth-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        text-decoration: none;
        font-size: 13.5px;
        font-weight: 500;
        padding: 7px 16px;
        border-radius: 9999px;
        transition: all 0.2s ease;
        box-sizing: border-box;
      }
      .nav-auth-btn--primary {
        background: #141413;
        color: #FAF9F5 !important;
        border: 1px solid #141413;
        box-shadow: 0 1px 3px rgba(20, 20, 19, 0.12);
      }
      .nav-auth-btn--primary:hover {
        background: #2B2B28;
        border-color: #2B2B28;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(20, 20, 19, 0.16);
      }
      .nav-auth-btn--ghost {
        background: transparent;
        color: var(--text, #141413) !important;
        border: 1px solid transparent;
      }
      .nav-auth-btn--ghost:hover {
        color: var(--gold, #D97757) !important;
      }
      .mobile-menu-auth {
        display: none !important;
      }
      .mobile-user-box {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .mobile-user-link {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 8px 12px !important;
        background: #F6F4EE;
        border-radius: 12px;
        border: 1px solid #E8E5DD;
        text-decoration: none;
        color: #141413 !important;
      }
      .mobile-user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(217, 119, 87, 0.15);
        color: #D97757;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        border: 1px solid rgba(217, 119, 87, 0.4);
        flex-shrink: 0;
        overflow: hidden;
      }
      .mobile-user-name {
        font-size: 13.5px;
        font-weight: 600;
        color: #141413;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mobile-logout-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        color: #DC2626;
        background: rgba(220, 38, 38, 0.06);
        border: 1px solid rgba(220, 38, 38, 0.18);
        cursor: pointer;
        width: 100%;
        transition: all 0.15s ease;
        margin-top: 4px;
      }
      .mobile-logout-btn:hover {
        background: rgba(220, 38, 38, 0.12);
      }
      @media (max-width: 840px) {
        .mobile-menu-auth {
          display: flex !important;
          flex-direction: column;
          width: 100%;
          gap: 8px;
          margin-top: 10px;
          padding-top: 12px;
          border-top: 1px solid rgba(20, 20, 19, 0.08);
        }
        .desktop-auth {
          display: none !important;
        }
      }
      @keyframes inquiryWidgetFlyout {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes messagePopIn {
        from {
          opacity: 0;
          transform: translateY(6px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes nudgePopIn {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.92);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @media (max-width: 480px) {
        .inquiry-widget-card {
          right: 12px !important;
          left: 12px !important;
          width: auto !important;
          max-width: none !important;
          bottom: 82px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function playPopSound() {
    try {
      var audioEl = document.getElementById('siePopAudioTag') || new Audio('/assets/pop.wav');
      audioEl.volume = 0.85;
      audioEl.currentTime = 0;
      var p = audioEl.play();
      if (p !== undefined) {
        p.catch(function() {
          var playOnGesture = function() {
            try {
              var retryAudio = document.getElementById('siePopAudioTag') || new Audio('/assets/pop.wav');
              retryAudio.volume = 0.85;
              retryAudio.currentTime = 0;
              retryAudio.play().catch(function() { playWebAudioPop(); });
            } catch (e) {
              playWebAudioPop();
            }
            window.removeEventListener('click', playOnGesture);
            window.removeEventListener('keydown', playOnGesture);
            window.removeEventListener('scroll', playOnGesture);
            window.removeEventListener('touchstart', playOnGesture);
          };

          window.addEventListener('click', playOnGesture, { once: true });
          window.addEventListener('keydown', playOnGesture, { once: true });
          window.addEventListener('scroll', playOnGesture, { passive: true, once: true });
          window.addEventListener('touchstart', playOnGesture, { passive: true, once: true });

          playWebAudioPop();
        });
      }
    } catch (e) {
      playWebAudioPop();
    }
  }

  function playWebAudioPop() {
    try {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      var ctx = new AudioContextClass();

      var triggerTones = function() {
        var now = ctx.currentTime;
        var osc1 = ctx.createOscillator();
        var gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659, now);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.22);

        var osc2 = ctx.createOscillator();
        var gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.06);
        osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
        gain2.gain.setValueAtTime(0.001, now);
        gain2.gain.setValueAtTime(0.2, now + 0.06);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.06);
        osc2.stop(now + 0.35);
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(triggerTones).catch(function() {});
      } else {
        triggerTones();
      }
    } catch (e) {}
  }

  function injectInquiryModal() {
    if (document.getElementById('sieInquiryWidgetCard')) return;

    var backdrop = document.createElement('div');
    backdrop.id = 'sieInquiryModalOverlay';
    backdrop.style.cssText = 'display: none; position: fixed; inset: 0; background: transparent; z-index: 99998;';

    var modal = document.createElement('div');
    modal.id = 'sieInquiryWidgetCard';
    modal.className = 'inquiry-widget-card';
    modal.style.cssText = 'display: none; position: fixed; bottom: 84px; right: 24px; width: 325px; max-width: calc(100vw - 28px); background-color: #FAF9F5; border: 1px solid #E5E3DC; border-radius: 18px; box-shadow: 0 14px 40px rgba(0, 0, 0, 0.16), 0 3px 12px rgba(0, 0, 0, 0.05); z-index: 99999; flex-direction: column; overflow: hidden; transform-origin: bottom right; animation: inquiryWidgetFlyout 0.2s cubic-bezier(0.16, 1, 0.3, 1);';
    modal.innerHTML = `
      <div style="width: 100%; display: flex; flex-direction: column; overflow: hidden;">
        <!-- Header -->
        <div style="padding: 12px 14px 9px; border-bottom: 1px solid #EDE9DF; position: relative; background-color: #FFFFFF; flex-shrink: 0;">
          <div style="display: inline-flex; align-items: center; background-color: rgba(217, 119, 87, 0.12); border-radius: 9999px; padding: 1px 8px; font-size: 10px; font-weight: 600; color: #D97757; margin-bottom: 3px;">
            <span>SieLabs Academy</span>
          </div>
          <button type="button" id="sieInquiryCloseBtn" aria-label="Close" style="position: absolute; top: 10px; right: 10px; width: 24px; height: 24px; border-radius: 50%; background: #F3F1EC; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6E6D68;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <h3 style="font-family: var(--font-serif, Georgia, serif); font-size: 16.5px; font-weight: 500; color: #141413; margin: 0 0 1px 0;" id="sieInquiryTitle">Connect with SieLabs</h3>
          <p style="font-size: 11px; color: #6E6D68; margin: 0;" id="sieInquirySubtitle">We'll call or WhatsApp you directly.</p>
        </div>

        <!-- Body -->
        <div style="padding: 11px 14px 13px; overflow-y: auto; max-height: 420px;" id="sieInquiryBody">
          <form id="sieInquiryForm" style="display: flex; flex-direction: column; gap: 8px;">
            <div id="sieInquiryError" style="display: none; padding: 6px 9px; background-color: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.25); border-radius: 7px; color: #DC2626; font-size: 11px;"></div>

            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; color: #141413; margin-bottom: 2px;">
                Your Name <span style="color: #D97757;">*</span>
              </label>
              <input type="text" id="sieInqName" required placeholder="e.g. Alex Johnson" style="width: 100%; padding: 6px 9px; font-size: 12.5px; border-radius: 7px; border: 1px solid #DCD8CD; background: #FFFFFF; color: #141413; outline: none; box-sizing: border-box;" />
            </div>

            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; color: #141413; margin-bottom: 2px;">
                Phone / WhatsApp Number <span style="color: #D97757;">*</span>
              </label>
              <input type="tel" id="sieInqPhone" required placeholder="+91 98765 43210" style="width: 100%; padding: 6px 9px; font-size: 12.5px; border-radius: 7px; border: 1px solid #DCD8CD; background: #FFFFFF; color: #141413; outline: none; box-sizing: border-box;" />
            </div>

            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; color: #141413; margin-bottom: 2px;">
                Program
              </label>
              <select id="sieInqProgram" style="width: 100%; padding: 6px 9px; font-size: 12px; border-radius: 7px; border: 1px solid #DCD8CD; background: #FFFFFF; color: #141413; outline: none; box-sizing: border-box; cursor: pointer;">
                <option value="Python with Machine Learning (4 Months)">Python with Machine Learning</option>
                <option value="Open Source Mindset">Open Source Mindset</option>
                <option value="General Inquiry / Mentorship">General Inquiry / Mentorship</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 11px; font-weight: 600; color: #141413; margin-bottom: 2px;">
                Message <span style="font-size: 10px; font-weight: 400; color: #9C9A92;">(Optional)</span>
              </label>
              <textarea id="sieInqMessage" rows="2" placeholder="Ask a question or request callback..." style="width: 100%; padding: 5px 9px; font-size: 12px; border-radius: 7px; border: 1px solid #DCD8CD; background: #FFFFFF; color: #141413; outline: none; resize: none; box-sizing: border-box; font-family: inherit;"></textarea>
            </div>

            <button type="submit" id="sieInqSubmitBtn" style="width: 100%; padding: 8px 14px; background-color: #D97757; color: #FFFFFF; border: none; border-radius: 9999px; font-size: 12.5px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 6px rgba(217, 119, 87, 0.25); margin-top: 2px;">
              Request Callback →
            </button>
            <p style="text-align: center; font-size: 10px; color: #9C9A92; margin: 0;">
              We'll contact you on WhatsApp / Phone.
            </p>
          </form>

          <div id="sieInquirySuccess" style="display: none; text-align: center; padding: 6px 0 2px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background-color: rgba(217, 119, 87, 0.12); color: #D97757; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; border: 1.5px solid rgba(217, 119, 87, 0.3);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h4 style="font-size: 15px; font-weight: 600; color: #141413; margin: 0 0 4px;">Request Received!</h4>
            <p id="sieInquirySuccessText" style="font-size: 12px; color: #6E6D68; line-height: 1.45; margin: 0 0 14px;">
              Thank you! Our mentors will message or call you shortly.
            </p>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <a href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1" target="_blank" rel="noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; background-color: #D97757; color: #FFFFFF; border-radius: 9999px; font-weight: 600; font-size: 12.5px; text-decoration: none;">
                Join WhatsApp Community
              </a>
              <button type="button" id="sieInquiryDoneBtn" style="padding: 7px 14px; background: transparent; border: 1px solid #DCD8CD; border-radius: 9999px; color: #6E6D68; font-weight: 500; font-size: 12px; cursor: pointer;">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    function closeModal() {
      backdrop.style.display = 'none';
      modal.style.display = 'none';
      var form = document.getElementById('sieInquiryForm');
      var succ = document.getElementById('sieInquirySuccess');
      if (form) form.style.display = 'flex';
      if (succ) succ.style.display = 'none';
    }

    function openModal() {
      backdrop.style.display = 'block';
      modal.style.display = 'flex';
      var nudge = document.getElementById('sieSupportNudge');
      if (nudge) nudge.style.display = 'none';
      playPopSound();
    }

    window.openInquiryModal = openModal;
    window.closeInquiryModal = closeModal;

    backdrop.addEventListener('click', closeModal);
    document.getElementById('sieInquiryCloseBtn')?.addEventListener('click', closeModal);
    document.getElementById('sieInquiryDoneBtn')?.addEventListener('click', closeModal);

    // Form submit
    var form = document.getElementById('sieInquiryForm');
    form?.addEventListener('submit', async function(e) {
      e.preventDefault();
      var errDiv = document.getElementById('sieInquiryError');
      var submitBtn = document.getElementById('sieInqSubmitBtn');
      if (errDiv) errDiv.style.display = 'none';

      var name = (document.getElementById('sieInqName')?.value || '').trim();
      var phone = (document.getElementById('sieInqPhone')?.value || '').trim();
      var program = (document.getElementById('sieInqProgram')?.value || '').trim();
      var message = (document.getElementById('sieInqMessage')?.value || '').trim();

      if (!name || !phone) {
        if (errDiv) {
          errDiv.textContent = 'Please enter your name and phone number.';
          errDiv.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        var res = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, phone: phone, program: program, message: message })
        });

        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit request.');

        if (form) form.style.display = 'none';
        var succ = document.getElementById('sieInquirySuccess');
        var succText = document.getElementById('sieInquirySuccessText');
        if (succ) succ.style.display = 'block';
        if (succText) {
          succText.innerHTML = 'Thank you, <strong>' + name + '</strong>! Our mentors will message or call you at <strong>' + phone + '</strong>.';
        }
      } catch (err) {
        if (errDiv) {
          errDiv.textContent = err.message || 'Something went wrong. Please try again.';
          errDiv.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Callback →';
        }
      }
    });

    // Intercept .claude-support-bubble clicks across all pages (toggles open/close)
    document.querySelectorAll('.claude-support-bubble').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (modal.style.display === 'flex') {
          closeModal();
        } else {
          openModal();
        }
      });
    });

    injectSupportNudge();
  }

  function injectSupportNudge() {
    if (document.getElementById('sieSupportNudge')) return;
    var bubble = document.querySelector('.claude-support-bubble');
    if (!bubble) return;

    var triggered = false;

    function showNudge() {
      if (triggered) return;
      triggered = true;

      var modal = document.getElementById('sieInquiryWidgetCard');
      if (modal && modal.style.display === 'flex') return;
      if (document.getElementById('sieSupportNudge')) return;

      var nudge = document.createElement('div');
      nudge.id = 'sieSupportNudge';
      nudge.className = 'claude-support-nudge';
      nudge.style.cssText = 'position: fixed; bottom: 86px; right: 24px; background-color: #FFFFFF; border: 1px solid #E5E3DC; border-radius: 14px; padding: 9px 12px 9px 11px; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04); z-index: 998; display: flex; align-items: center; gap: 8px; cursor: pointer; animation: nudgePopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: bottom right; max-width: 240px;';
      nudge.innerHTML = `
        <div style="position: relative; flex-shrink: 0;">
          <img src="/favicon.ico" alt="SieLabs Advisor" style="width: 22px; height: 22px; border-radius: 50%; object-fit: contain; display: block;" />
          <span style="position: absolute; bottom: -1px; right: -1px; width: 6.5px; height: 6.5px; background-color: #16A34A; border: 1px solid #FFFFFF; border-radius: 50%;"></span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #141413; line-height: 1.3;">
            How can I help you? 👋
          </p>
        </div>
        <button type="button" id="sieDismissNudgeBtn" aria-label="Dismiss hint" style="border: none; background: transparent; color: #9C9A92; cursor: pointer; padding: 2px; display: flex; align-items: center; justify-content: center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div style="position: absolute; bottom: -5px; right: 20px; width: 10px; height: 10px; background-color: #FFFFFF; border-right: 1px solid #E5E3DC; border-bottom: 1px solid #E5E3DC; transform: rotate(45deg);"></div>
      `;

      document.body.appendChild(nudge);
      playPopSound();

      nudge.addEventListener('click', function() {
        if (window.openInquiryModal) window.openInquiryModal();
        nudge.remove();
      });

      document.getElementById('sieDismissNudgeBtn')?.addEventListener('click', function(e) {
        e.stopPropagation();
        nudge.remove();
      });
    }

    var timer = setTimeout(showNudge, 1200);

    var onFirstGesture = function() {
      clearTimeout(timer);
      showNudge();
      window.removeEventListener('scroll', onFirstGesture);
      window.removeEventListener('click', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
      window.removeEventListener('mousemove', onFirstGesture);
    };

    window.addEventListener('scroll', onFirstGesture, { passive: true, once: true });
    window.addEventListener('click', onFirstGesture, { once: true });
    window.addEventListener('touchstart', onFirstGesture, { passive: true, once: true });
    window.addEventListener('mousemove', onFirstGesture, { once: true });
  }

  function renderNavAuth() {
    injectNavStyles();
    injectInquiryModal();

    var container = document.getElementById('navAuthSection');
    var navLinks = document.getElementById('navLinks');
    var mobileAuth = document.getElementById('navMobileAuthGroup');

    if (navLinks && !mobileAuth) {
      mobileAuth = document.createElement('div');
      mobileAuth.id = 'navMobileAuthGroup';
      mobileAuth.className = 'mobile-menu-auth';
      navLinks.appendChild(mobileAuth);
    }

    var user = null;
    var userRole = null;
    var userEmail = null;
    try {
      user = localStorage.getItem('user');
      userRole = localStorage.getItem('user_role');
      userEmail = localStorage.getItem('user_email');
    } catch (e) {
      user = null;
    }
    var isAdmin = (userRole === 'admin');

    if (user && user.trim().length > 0) {
      var initial = (user.trim().charAt(0) || 'U').toUpperCase();
      var avatarStyle = 'fun-emoji';
      var avatarSeed = user;
      try {
        avatarStyle = localStorage.getItem('user_avatar_style') || 'fun-emoji';
        avatarSeed = localStorage.getItem('user_avatar_seed') || user;
      } catch (e) {}
      var avatarUrl = 'https://api.dicebear.com/9.x/' + avatarStyle + '/svg?seed=' + encodeURIComponent(avatarSeed) + '&radius=50';

      if (container) {
        container.innerHTML = `
          <div style="position: relative;" id="navUserDropdownWrapper">
            <button
              type="button"
              id="navUserAvatarBtn"
              aria-label="User profile menu"
              aria-expanded="false"
              aria-haspopup="true"
              style="width: 36px; height: 36px; border-radius: 50%; background-color: rgba(218, 119, 86, 0.15); border: 1px solid rgba(218, 119, 86, 0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--gold, #D97757); font-weight: 700; font-size: 14px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); transition: all 0.2s ease; outline: none; overflow: hidden; padding: 0;"
            >
              <img src="${avatarUrl}" alt="${user}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <span style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">${initial}</span>
            </button>

            <div
              id="navUserDropdownMenu"
              style="display: none; position: absolute; right: 0; top: calc(100% + 8px); width: 204px; background-color: #FFFFFF; border-radius: 14px; box-shadow: 0 14px 40px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04); border: 1px solid #E5E3DC; padding: 5px; z-index: 9999;"
              role="menu"
            >
              <!-- Anthropic-style User Info Header with Avatar Alignment -->
              <div style="display: flex; align-items: center; gap: 10px; padding: 7px 10px 6px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(217, 119, 87, 0.12); border: 1px solid rgba(217, 119, 87, 0.3); overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                  <img src="${avatarUrl}" alt="${user}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                  <span style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #D97757;">${initial}</span>
                </div>
                <div style="min-width: 0; flex: 1;">
                  <p style="margin: 0; font-size: 13px; font-weight: 600; color: #141413; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.25;">
                    ${user}
                  </p>
                  <p style="margin: 1px 0 0; font-size: 11px; color: #8E8D88; font-weight: 400; line-height: 1.2;">
                    ${isAdmin ? 'Administrator' : 'Personal'}
                  </p>
                </div>
              </div>

              <div style="height: 1px; background-color: rgba(20, 20, 19, 0.08); margin: 4px 6px 5px;"></div>

              ${isAdmin ? `
              <!-- Admin Panel Item -->
              <a
                href="/admin"
                style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: #141413; text-decoration: none; transition: background 0.15s;"
                onmouseover="this.style.backgroundColor='#F3F1EC';"
                onmouseout="this.style.backgroundColor='transparent';"
                role="menuitem"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #6E6D68; flex-shrink: 0;">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 3v18"></path>
                  <path d="m14 9 3 3-3 3"></path>
                </svg>
                <span>Admin Panel</span>
              </a>
              ` : ''}

              <!-- My Profile Item -->
              <a
                href="/profile"
                style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: #141413; text-decoration: none; transition: background 0.15s;"
                onmouseover="this.style.backgroundColor='#F3F1EC';"
                onmouseout="this.style.backgroundColor='transparent';"
                role="menuitem"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #6E6D68; flex-shrink: 0;">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                </svg>
                <span>My Profile</span>
              </a>

              <!-- My Courses Item -->
              <a
                href="/programs/index.html"
                style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: #141413; text-decoration: none; transition: background 0.15s;"
                onmouseover="this.style.backgroundColor='#F3F1EC';"
                onmouseout="this.style.backgroundColor='transparent';"
                role="menuitem"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #6E6D68; flex-shrink: 0;">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>My Courses</span>
              </a>

              <!-- Certificates Item -->
              <a
                href="/certificate"
                style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: #141413; text-decoration: none; transition: background 0.15s;"
                onmouseover="this.style.backgroundColor='#F3F1EC';"
                onmouseout="this.style.backgroundColor='transparent';"
                role="menuitem"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #6E6D68; flex-shrink: 0;">
                  <circle cx="12" cy="8" r="6"></circle>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                </svg>
                <span>Certificates</span>
              </a>

              <div style="height: 1px; background-color: rgba(20, 20, 19, 0.08); margin: 6px 6px;"></div>

              <!-- Logout Item -->
              <button
                type="button"
                id="navLogoutBtn"
                style="width: 100%; display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: #141413; background: transparent; border: none; cursor: pointer; text-align: left; transition: background 0.15s, color 0.15s;"
                onmouseover="this.style.backgroundColor='#F3F1EC'; this.style.color='#DC2626';"
                onmouseout="this.style.backgroundColor='transparent'; this.style.color='#141413';"
                role="menuitem"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: inherit; flex-shrink: 0;">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log out</span>
              </button>
            </div>
          </div>
        `;

        var avatarBtn = document.getElementById('navUserAvatarBtn');
        var dropdownMenu = document.getElementById('navUserDropdownMenu');
        var logoutBtn = document.getElementById('navLogoutBtn');

        var isOpen = false;
        function toggleMenu(show) {
          isOpen = (typeof show === 'boolean') ? show : !isOpen;
          if (dropdownMenu) {
            dropdownMenu.style.display = isOpen ? 'block' : 'none';
          }
          if (avatarBtn) {
            avatarBtn.style.border = isOpen ? '2px solid var(--gold, #D97757)' : '1px solid rgba(218, 119, 86, 0.4)';
            avatarBtn.setAttribute('aria-expanded', String(isOpen));
          }
        }

        avatarBtn?.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleMenu();
        });

        logoutBtn?.addEventListener('click', function() {
          try {
            localStorage.removeItem('user');
          } catch (e) {}
          renderNavAuth();
        });
      }

      if (mobileAuth) {
        mobileAuth.innerHTML = `
          <div class="mobile-user-box">
            <a href="/profile" class="mobile-user-link">
              <div class="mobile-user-avatar">
                <img src="${avatarUrl}" alt="${user}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <span style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">${initial}</span>
              </div>
              <div style="min-width: 0; flex: 1;">
                <div class="mobile-user-name">${user}</div>
                <div style="font-size: 11px; color: #D97757; font-weight: 500;">${isAdmin ? 'Administrator' : 'View Profile'} →</div>
              </div>
            </a>
            ${isAdmin ? `
            <a href="/admin" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600; color: #FFFFFF; background: #141413; text-decoration: none;">
              <span>Open Admin Panel</span>
            </a>
            ` : ''}
            <button type="button" id="navMobileLogoutBtn" class="mobile-logout-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="21" x2="9" y2="12"></line>
              </svg>
              <span>Log out</span>
            </button>
          </div>
        `;
        document.getElementById('navMobileLogoutBtn')?.addEventListener('click', function() {
          try {
            localStorage.removeItem('user');
          } catch (e) {}
          renderNavAuth();
        });
      }
    } else {
      if (container) {
        container.innerHTML = `
          <div class="nav-auth-group desktop-auth">
            <a href="/login" class="nav-auth-btn nav-auth-btn--ghost" style="color: var(--text, #141413); font-weight: 500;">Sign in</a>
          </div>
        `;
      }

      if (mobileAuth) {
        mobileAuth.innerHTML = `
          <div class="mobile-auth-guest" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
            <a href="/login" class="nav-auth-btn nav-auth-btn--ghost" style="width: 100%; text-align: center; justify-content: center; padding: 10px 16px; font-size: 13.5px; border-radius: 9999px; background: #F6F4EE; border: 1px solid #E8E5DD;">Sign in</a>
          </div>
        `;
      }
    }

    if (!listenersAttached) {
      listenersAttached = true;
      document.addEventListener('click', function(e) {
        var wrapper = document.getElementById('navUserDropdownWrapper');
        if (wrapper && !wrapper.contains(e.target)) {
          var menu = document.getElementById('navUserDropdownMenu');
          var btn = document.getElementById('navUserAvatarBtn');
          if (menu) menu.style.display = 'none';
          if (btn) {
            btn.style.border = '1px solid rgba(218, 119, 86, 0.4)';
            btn.setAttribute('aria-expanded', 'false');
          }
        }

        // Close mobile menu when clicking outside
        var navLinks = document.getElementById('navLinks');
        var hamburger = document.querySelector('.hamburger-btn');
        if (navLinks && navLinks.classList.contains('show')) {
          if (!navLinks.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
            navLinks.classList.remove('show');
          }
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          var menu = document.getElementById('navUserDropdownMenu');
          var btn = document.getElementById('navUserAvatarBtn');
          if (menu) menu.style.display = 'none';
          if (btn) {
            btn.style.border = '1px solid rgba(218, 119, 86, 0.4)';
            btn.setAttribute('aria-expanded', 'false');
          }
          var navLinks = document.getElementById('navLinks');
          if (navLinks) navLinks.classList.remove('show');
          if (window.closeInquiryModal) window.closeInquiryModal();
        }

        // Global Ctrl+K / Cmd+K to focus search box
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          var searchInput = document.getElementById('courseSearchInput') || document.querySelector('.claude-search-box input');
          if (searchInput) {
            e.preventDefault();
            searchInput.focus();
            if (searchInput.select) searchInput.select();
          }
        }
      });

      // Global search submit handler
      document.addEventListener('keydown', function(e) {
        var s = document.getElementById('courseSearchInput');
        if (e.target === s && e.key === 'Enter') {
          var val = (s.value || '').trim();
          if (!window.location.pathname.includes('/programs/index.html') && val) {
            window.location.href = '/programs/index.html?search=' + encodeURIComponent(val);
          }
        }
      });

      // Prevent redundant page reload when clicking currently active page link
      document.addEventListener('click', function(e) {
        var activeLink = e.target && e.target.closest && e.target.closest('.nav-links a.active');
        if (activeLink) {
          e.preventDefault();
        }
      });

      window.addEventListener('storage', renderNavAuth);
      window.addEventListener('sie_avatar_updated', renderNavAuth);
    }
  }

  window.renderNavAuth = renderNavAuth;

  if (document.getElementById('navAuthSection') || document.getElementById('navLinks')) {
    renderNavAuth();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavAuth);
  } else {
    renderNavAuth();
  }
})();
