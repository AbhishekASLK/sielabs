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
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.02em;
        padding: 8px 18px;
        border-radius: 8px;
        transition: all 0.2s ease;
        border: 1px solid transparent;
        box-sizing: border-box;
      }
      .nav-auth-btn--primary {
        background: #9A7B1A;
        color: #FFFFFF !important;
        border-color: #9A7B1A;
        box-shadow: 0 2px 8px rgba(154, 123, 26, 0.15);
      }
      .nav-auth-btn--primary:hover {
        background: #7A6015;
        border-color: #7A6015;
        box-shadow: 0 4px 16px rgba(154, 123, 26, 0.25);
        transform: translateY(-1px);
      }
      .nav-auth-btn--ghost {
        background: transparent;
        color: #1A1A1A !important;
        border-color: rgba(0, 0, 0, 0.12);
      }
      .nav-auth-btn--ghost:hover {
        background: #F3F2EE;
        border-color: rgba(0, 0, 0, 0.2);
        color: #1A1A1A !important;
      }
      .mobile-menu-auth {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 8px;
        margin-top: 10px;
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
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
        padding: 7px 12px !important;
        background: #F3F2EE;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        text-decoration: none;
        color: #1A1A1A !important;
      }
      .mobile-user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: rgba(154, 123, 26, 0.15);
        color: #9A7B1A;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        border: 1.5px solid rgba(154, 123, 26, 0.35);
        flex-shrink: 0;
      }
      .mobile-user-name {
        font-size: 13.5px;
        font-weight: 600;
        color: #1A1A1A;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mobile-logout-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        color: #DC2626;
        background: rgba(220, 38, 38, 0.08);
        border: 1px solid rgba(220, 38, 38, 0.15);
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s;
      }
      .mobile-logout-btn:hover {
        background: rgba(220, 38, 38, 0.15);
      }
      @media (min-width: 901px) {
        .mobile-menu-auth {
          display: none !important;
        }
      }
      @media (max-width: 900px) {
        header nav {
          padding: 18px 0 !important;
        }
        header nav > div:last-child {
          margin-left: auto !important;
          gap: 10px !important;
        }
      }
      @media (max-width: 640px) {
        #navAuthSection .nav-auth-group {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function renderNavAuth() {
    injectNavStyles();

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
      var avatarUrl = 'https://api.dicebear.com/9.x/' + avatarStyle + '/svg?seed=' + encodeURIComponent(avatarSeed) + '&radius=16';

      if (container) {
        container.innerHTML = `
          <div style="position: relative;" id="navUserDropdownWrapper">
            <button
              type="button"
              id="navUserAvatarBtn"
              aria-label="User profile menu"
              aria-expanded="false"
              aria-haspopup="true"
              style="width: 38px; height: 38px; border-radius: 9px; background-color: rgba(154, 123, 26, 0.12); border: 1.5px solid rgba(154, 123, 26, 0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #9A7B1A; font-weight: 700; font-size: 15px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); transition: all 0.2s ease; outline: none; overflow: hidden; padding: 0;"
              onmouseover="this.style.backgroundColor='rgba(154, 123, 26, 0.2)'; this.style.borderColor='#9A7B1A';"
              onmouseout="if(this.getAttribute('aria-expanded') !== 'true'){ this.style.backgroundColor='rgba(154, 123, 26, 0.12)'; this.style.borderColor='rgba(154, 123, 26, 0.35)'; }"
            >
              <img src="${avatarUrl}" alt="${user}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <span style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">${initial}</span>
            </button>

            <div
              id="navUserDropdownMenu"
              style="display: none; position: absolute; right: 0; top: calc(100% + 10px); width: 240px; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.08); padding: 8px; z-index: 200;"
              role="menu"
            >
              <!-- User Profile Header Card (Clickable to Profile Page) -->
              <a
                href="/profile"
                id="navProfileHeaderLink"
                style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background-color: #FAFAF8; border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.06); margin-bottom: 6px; text-decoration: none; cursor: pointer; transition: background 0.15s, border-color 0.15s;"
                onmouseover="this.style.backgroundColor='rgba(154, 123, 26, 0.08)'; this.style.borderColor='rgba(154, 123, 26, 0.3)';"
                onmouseout="this.style.backgroundColor='#FAFAF8'; this.style.borderColor='rgba(0, 0, 0, 0.06)';"
                title="Click to view Profile"
              >
                <div style="width: 36px; height: 36px; border-radius: 8px; background-color: rgba(154, 123, 26, 0.15); color: #9A7B1A; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; border: 1px solid rgba(154, 123, 26, 0.3); overflow: hidden;">
                  <img src="${avatarUrl}" alt="${user}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                  <span style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">${initial}</span>
                </div>
                <div style="min-width: 0; flex: 1;">
                  <p style="margin: 0; font-size: 13px; font-weight: 600; color: #1A1A1A; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${user}
                  </p>
                  <p style="margin: 2px 0 0; font-size: 11px; color: #9A7B1A; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                    <span>${isAdmin ? 'Administrator' : 'User Profile'}</span>
                    <span>→</span>
                  </p>
                </div>
              </a>

              <div style="height: 1px; background-color: rgba(0, 0, 0, 0.06); margin: 4px 0;"></div>

              ${isAdmin ? `
              <!-- Admin Panel Item -->
              <a
                href="/admin"
                style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 600; color: #9A7B1A; background-color: rgba(154, 123, 26, 0.08); text-decoration: none; transition: background 0.15s; margin-bottom: 4px;"
                onmouseover="this.style.backgroundColor='rgba(154, 123, 26, 0.16)';"
                onmouseout="this.style.backgroundColor='rgba(154, 123, 26, 0.08)';"
                role="menuitem"
              >
                <div style="width: 30px; height: 30px; border-radius: 8px; background-color: #9A7B1A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M9 3v18"></path>
                    <path d="m14 9 3 3-3 3"></path>
                  </svg>
                </div>
                <span>Admin Panel</span>
              </a>
              <div style="height: 1px; background-color: rgba(0, 0, 0, 0.06); margin: 4px 0;"></div>
              ` : ''}

              <!-- My Profile Item -->
              <a
                href="/profile"
                style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 500; color: #1A1A1A; text-decoration: none; transition: background 0.15s, color 0.15s;"
                onmouseover="this.style.backgroundColor='rgba(154, 123, 26, 0.08)'; this.style.color='#9A7B1A';"
                onmouseout="this.style.backgroundColor='transparent'; this.style.color='#1A1A1A';"
                role="menuitem"
              >
                <div style="width: 30px; height: 30px; border-radius: 8px; background-color: rgba(154, 123, 26, 0.1); color: #9A7B1A; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span>My Profile</span>
              </a>

              <div style="height: 1px; background-color: rgba(0, 0, 0, 0.06); margin: 4px 0;"></div>

              <!-- My Courses Item -->
              <a
                href="/programs/index.html"
                style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 500; color: #1A1A1A; text-decoration: none; transition: background 0.15s, color 0.15s;"
                onmouseover="this.style.backgroundColor='rgba(154, 123, 26, 0.08)'; this.style.color='#9A7B1A';"
                onmouseout="this.style.backgroundColor='transparent'; this.style.color='#1A1A1A';"
                role="menuitem"
              >
                <div style="width: 30px; height: 30px; border-radius: 8px; background-color: rgba(154, 123, 26, 0.1); color: #9A7B1A; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <span>My Courses</span>
              </a>

              <div style="height: 1px; background-color: rgba(0, 0, 0, 0.06); margin: 4px 0;"></div>

              <!-- Logout Item -->
              <button
                type="button"
                id="navLogoutBtn"
                style="width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 500; color: #DC2626; background-color: transparent; border: none; cursor: pointer; text-align: left; font-family: inherit; transition: background 0.15s;"
                onmouseover="this.style.backgroundColor='rgba(220, 38, 38, 0.08)';"
                onmouseout="this.style.backgroundColor='transparent';"
                role="menuitem"
              >
                <div style="width: 30px; height: 30px; border-radius: 8px; background-color: rgba(220, 38, 38, 0.1); color: #DC2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                <span>Logout</span>
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
            avatarBtn.style.border = isOpen ? '2px solid #9A7B1A' : '1.5px solid rgba(154, 123, 26, 0.35)';
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
              <div class="mobile-user-avatar" style="overflow: hidden; padding: 0;">
                <img src="${avatarUrl}" alt="${user}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <span style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">${initial}</span>
              </div>
              <div style="min-width: 0; flex: 1;">
                <div class="mobile-user-name">${user}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9A7B1A; opacity: 0.75; flex-shrink: 0;">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
            ${isAdmin ? `
            <a href="/admin" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600; color: #FFFFFF; background: #9A7B1A; text-decoration: none;">
              <span>Open Admin Panel</span>
            </a>
            ` : ''}
            <button type="button" id="navMobileLogoutBtn" class="mobile-logout-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
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
            <a href="/login" class="nav-auth-btn nav-auth-btn--ghost">Log in</a>
            <a href="/signup" class="nav-auth-btn nav-auth-btn--primary">Sign up</a>
          </div>
        `;
      }

      if (mobileAuth) {
        mobileAuth.innerHTML = `
          <div class="mobile-auth-guest" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
            <a href="/login" class="nav-auth-btn nav-auth-btn--ghost" style="width: 100%; text-align: center; justify-content: center; padding: 12px 16px; font-size: 14px; border-radius: 10px;">Log in</a>
            <a href="/signup" class="nav-auth-btn nav-auth-btn--primary" style="width: 100%; text-align: center; justify-content: center; padding: 12px 16px; font-size: 14px; border-radius: 10px;">Sign up</a>
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
            btn.style.border = '1.5px solid rgba(154, 123, 26, 0.35)';
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
            btn.style.border = '1.5px solid rgba(154, 123, 26, 0.35)';
            btn.setAttribute('aria-expanded', 'false');
          }
          var navLinks = document.getElementById('navLinks');
          if (navLinks) navLinks.classList.remove('show');
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
