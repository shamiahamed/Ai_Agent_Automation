document.addEventListener('DOMContentLoaded', async () => {
  const profileContainer = document.getElementById('profileContainer');
  const autoFillBtn = document.getElementById('autoFillBtn');
  const statusMsg = document.getElementById('statusMsg');

  let profileData = null;

  try {
    // Talk to the AgentOS FastApi Backend!
    const res = await fetch('http://localhost:8000/profile');
    if (!res.ok) throw new Error("Failed to fetch profile");
    
    profileData = await res.json();
    
    if (profileData && profileData.full_name) {
      // Display current profile
      const truncatedSkills = profileData.skills && profileData.skills.length > 30 
        ? profileData.skills.substring(0, 30) + '...' 
        : (profileData.skills || 'None listed');

      profileContainer.innerHTML = `
        <div style="margin-bottom: 6px;"><strong>Name:</strong> <span>${profileData.full_name}</span></div>
        <div style="margin-bottom: 6px;"><strong>Email:</strong> <span>${profileData.email || 'N/A'}</span></div>
        <div style="margin-bottom: 6px;"><strong>Phone:</strong> <span>${profileData.phone || 'N/A'}</span></div>
        <div style="margin-bottom: 6px;"><strong>LinkedIn:</strong> <span>${profileData.linkedin_url ? 'Linked' : 'N/A'}</span></div>
        <div><strong>Skills:</strong> <span>${truncatedSkills}</span></div>
      `;
      // Enable the magic button
      autoFillBtn.disabled = false;
    } else {
      profileContainer.innerHTML = "<div style='color: #fbbf24;'>No active profile found. Please set your AI Profile in the AgentOS dashboard first.</div>";
    }
  } catch (err) {
    profileContainer.innerHTML = `<div style="color: #ef4444; text-align: center;">Error connecting to AgentOS backend.<br>Make sure your FastAPI server is running!</div>`;
  }

  // Handle the Auto-Fill Click
  autoFillBtn.addEventListener('click', async () => {
    statusMsg.style.color = "#818cf8";
    statusMsg.innerText = "Injecting data into page...";
    
    // Find the currently active browser tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) return;
    
    // Explicitly inject the content.js script into that specific tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, () => {
      // After it's injected, send it a message holding our AI profile data
      chrome.tabs.sendMessage(tab.id, { action: "fillForm", data: profileData }, (response) => {
        if (chrome.runtime.lastError) {
          statusMsg.style.color = "#ef4444";
          statusMsg.innerText = "Error: Cannot fill this specific page (might be blocked by Chrome).";
          return;
        }
        
        if (response && response.success) {
          statusMsg.style.color = "#34d399";
          statusMsg.innerText = `Success! Auto-filled ${response.count} fields.`;
        } else {
          statusMsg.style.color = "#fbbf24";
          statusMsg.innerText = "Could not find standard form fields on this page.";
        }
      });
    });
  });
});
