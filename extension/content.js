// Central logic to auto-fill the page
const executeAutoFill = (data) => {
  let fieldsFilled = 0;

  const fillField = (selectors, value) => {
    if (!value) return;
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (el && !el.value && !el.disabled) {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
          fieldsFilled++;
          return;
        }
      }
    }
  };

  const selectDropdown = (selectors, matchTexts) => {
    for (const selector of selectors) {
      const selects = document.querySelectorAll(selector);
      for (const select of selects) {
        if (!select.disabled && select.value === "") {
          const options = Array.from(select.options);
          for (const text of matchTexts) {
            const matchingOption = options.find(opt => opt.text.toLowerCase().includes(text.toLowerCase()));
            if (matchingOption) {
              select.value = matchingOption.value;
              select.dispatchEvent(new Event('change', { bubbles: true }));
              fieldsFilled++;
              return;
            }
          }
        }
      }
    }
  };

  const firstName = data.full_name ? data.full_name.split(' ')[0] : '';
  const lastName = data.full_name ? data.full_name.split(' ').slice(1).join(' ') : '';

  fillField(['input[name*="first" i]', 'input[id*="first" i]', 'input[name*="given" i]'], firstName);
  fillField(['input[name*="last" i]', 'input[id*="last" i]', 'input[name*="family" i]'], lastName);
  fillField(['input[name="name" i]', 'input[id="name" i]', 'input[name*="fullname" i]', 'input[id*="fullname" i]'], data.full_name);
  fillField(['input[type="email" i]', 'input[name*="email" i]', 'input[id*="email" i]'], data.email);
  fillField(['input[type="tel" i]', 'input[name*="phone" i]', 'input[id*="phone" i]', 'input[name*="mobile" i]'], data.phone);
  fillField(['input[name*="linkedin" i]', 'input[id*="linkedin" i]', 'input[name*="url" i]'], data.linkedin_url);

  const wantsSponsorship = data.sponsorship && data.sponsorship.toLowerCase().includes('yes');
  if (wantsSponsorship) {
    selectDropdown(['select[name*="sponsor" i]', 'select[id*="sponsor" i]', 'select[name*="visa" i]'], ["yes", "require", "sponsor"]);
  } else {
    selectDropdown(['select[name*="sponsor" i]', 'select[id*="sponsor" i]', 'select[name*="visa" i]'], ["no", "do not require"]);
  }

  if (data.gender && data.gender.toLowerCase().includes('male') && !data.gender.toLowerCase().includes('female')) {
    selectDropdown(['select[name*="gender" i]', 'select[id*="gender" i]', 'select[name*="sex" i]'], ["male", "man"]);
  } else if (data.gender && data.gender.toLowerCase().includes('female')) {
    selectDropdown(['select[name*="gender" i]', 'select[id*="gender" i]', 'select[name*="sex" i]'], ["female", "woman"]);
  } else {
    selectDropdown(['select[name*="gender" i]', 'select[id*="gender" i]', 'select[name*="sex" i]'], ["decline", "prefer not", "not wish"]);
  }

  if (data.disability && data.disability.toLowerCase().includes('yes')) {
    selectDropdown(['select[name*="disability" i]', 'select[id*="disability" i]'], ["yes", "have a disability"]);
  } else if (data.disability && data.disability.toLowerCase().includes('no')) {
    selectDropdown(['select[name*="disability" i]', 'select[id*="disability" i]'], ["no", "do not have"]);
  } else {
    selectDropdown(['select[name*="disability" i]', 'select[id*="disability" i]'], ["decline", "prefer not", "not wish"]);
  }

  selectDropdown(['select[name*="race" i]', 'select[id*="race" i]', 'select[name*="ethni" i]', 'select[id*="ethni" i]'], ["decline", "prefer not", "not wish"]);
  selectDropdown(['select[name*="veteran" i]', 'select[id*="veteran" i]'], ["not a protected", "not a veteran", "decline", "prefer not"]);
  selectDropdown(['select[name*="previous" i]', 'select[name*="former" i]', 'select[id*="previous" i]'], ["no", "never"]);
  selectDropdown(['select[name*="hispanic" i]', 'select[id*="hispanic" i]'], ["no", "decline", "prefer not"]);

  return fieldsFilled;
};

// 1. Manual trigger from popup button
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    const fieldsFilled = executeAutoFill(request.data);
    sendResponse({ success: fieldsFilled > 0, count: fieldsFilled });
  }
  return true;
});

// 2. Autonomous trigger from React App / job_apply_agent.py
// Check if URL has our special tag
if (window.location.search.includes('agentos_autofill=true')) {
  console.log("🚀 AgentOS Autonomous Mode Triggered!");
  // Give React/SPA websites 1.5 seconds to load their dynamic forms
  setTimeout(async () => {
    try {
      // Connect to Python Backend directly from the background tab
      const res = await fetch('http://localhost:8000/profile');
      if (res.ok) {
        const profileData = await res.json();
        if (profileData && profileData.full_name) {
          executeAutoFill(profileData);
          
          console.log("✅ Auto-Fill Complete. Hunting for Submit Button...");
          // Hunt for the Submit Button and Click it (Wait another 1s to allow front-end validation to pass)
          setTimeout(() => {
            const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
            for (const btn of submitButtons) {
              const textMatch = btn.innerText && btn.innerText.toLowerCase().includes("submit");
              const idMatch = btn.id && btn.id.toLowerCase().includes("submit");
              if (textMatch || idMatch || submitButtons.length === 1) {
                console.log("🔥 Clicking Submit:", btn);
                btn.click();
                
                // Note: For safety during prototype phase, I am NOT calling window.close().
                // I will let the user see the "Application Submitted!" success page.
                break;
              }
            }
          }, 1500);
        }
      }
    } catch (err) {
      console.error("AgentOS Autonomous Mode couldn't connect to backend.", err);
    }
  }, 1500);
}
