// ===== CoverCraft — AI Cover Letter Generator =====
(function() {
  'use strict';

  let currentTemplate = 'modern';

  const sampleData = {
    yourName: 'Alex Johnson',
    yourEmail: 'alex@example.com',
    yourPhone: '+1 (555) 987-6543',
    yourTitle: 'Senior Product Designer',
    companyName: 'Spotify',
    jobTitle: 'Lead Product Designer',
    hiringManager: '',
    keyAchievements: [
      'Redesigned the mobile onboarding flow, increasing user activation by 35%',
      'Led a team of 4 designers across 3 product teams',
      'Shipped 12 major features in the last year with 98%+ user satisfaction',
    ],
    whyCompany: "I've been a Spotify user since day one and love how you've transformed music discovery. Your design system is world-class.",
    tone: 'professional',
    template: 'modern',
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadDraft();
  });

  // ===== Template Selection =====
  window.selectTemplate = function(name) {
    currentTemplate = name;
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
    event.target.closest('.template-card').classList.add('active');
  };

  // ===== Load Sample Data =====
  window.loadSample = function() {
    Object.keys(sampleData).forEach(key => {
      const el = document.getElementById(key);
      if (el) {
        if (el.tagName === 'SELECT') {
          el.value = sampleData[key];
        } else {
          el.value = sampleData[key];
        }
      }
    });
    showToast('Sample data loaded!');
  };

  // ===== Generate Cover Letter =====
  window.generateLetter = function() {
    const data = getFormData();
    if (!data.yourName || !data.companyName) {
      shakeElement(document.getElementById('yourName') || document.getElementById('companyName'));
      return;
    }

    document.getElementById('letterOutput').style.display = 'none';
    document.getElementById('letterLoading').style.display = 'block';

    setTimeout(() => {
      const letter = generateCoverLetter(data);
      renderLetter(letter, data);
      document.getElementById('letterOutput').style.display = 'block';
      document.getElementById('letterLoading').style.display = 'none';
      saveDraft();
    }, 800);
  };

  function getFormData() {
    return {
      yourName: document.getElementById('yourName').value.trim(),
      yourEmail: document.getElementById('yourEmail').value.trim(),
      yourPhone: document.getElementById('yourPhone').value.trim(),
      yourTitle: document.getElementById('yourTitle').value.trim(),
      companyName: document.getElementById('companyName').value.trim(),
      jobTitle: document.getElementById('jobTitle').value.trim(),
      hiringManager: document.getElementById('hiringManager').value.trim(),
      keyAchievements: document.getElementById('keyAchievements').value.split('\n').filter(a => a.trim()),
      whyCompany: document.getElementById('whyCompany').value.trim(),
      tone: document.getElementById('tone').value,
    };
  }

  function generateCoverLetter(data) {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const greeting = data.hiringManager ? `Dear ${data.hiringManager},` : 'Dear Hiring Manager,';

    // Opening paragraph based on tone
    const openings = {
      professional: `I am writing to express my strong interest in the ${data.jobTitle} position at ${data.companyName}. With my background in ${data.yourTitle || 'product design and development'}, I am confident that I can make a significant contribution to your team.`,
      enthusiastic: `I was thrilled to see the opening for a ${data.jobTitle} at ${data.companyName}! As someone who has followed your work closely and has spent years honing my craft as a ${data.yourTitle || 'designer'}, this role feels like the perfect next step in my career.`,
      confident: `${data.companyName} needs a ${data.jobTitle} who can hit the ground running — that's exactly who I am. With a proven track record of delivering results and leading teams, I'm ready to make an immediate impact on your product and your bottom line.`,
      concise: `I'm excited to apply for the ${data.jobTitle} role at ${data.companyName}. Here's why I'm a strong fit:`,
    };

    // Body paragraphs based on achievements
    let body = '';
    if (data.keyAchievements.length > 0) {
      body = '\nHere are a few highlights from my experience:\n\n';
      data.keyAchievements.forEach((achievement, i) => {
        const prefix = ['First,', 'Second,', 'Third,'][i % 3] || `${i + 1}.`;
        body += `• ${achievement}\n`;
      });
      body += '\n';
    }

    // Why company paragraph
    let whyParagraph = '';
    if (data.whyCompany) {
      whyParagraph = `\nWhat draws me to ${data.companyName} is ${data.whyCompany.toLowerCase().startsWith('i') ? 'your' : data.whyCompany}. `;
      if (!data.whyCompany.toLowerCase().endsWith('.')) whyParagraph += '. ';
      whyParagraph += `I'd be proud to contribute to a team that values innovation and excellence.`;
    }

    // Closing paragraph based on tone
    const closings = {
      professional: `\nThank you for considering my application. I would welcome the opportunity to discuss how my skills and experience align with ${data.companyName}'s goals. I look forward to hearing from you.\n\nSincerely,\n${data.yourName}`,
      enthusiastic: `\nI'm genuinely excited about the possibility of joining ${data.companyName} and contributing to your amazing team. I'd love to chat about how my background and passion could help take your product to the next level.\n\nBest regards,\n${data.yourName}`,
      confident: `\nI'm confident I can deliver results for ${data.companyName} from day one. Let's schedule a conversation — I'll bring ideas, you bring the challenges.\n\nRegards,\n${data.yourName}`,
      concise: `\nI'd welcome the chance to discuss how my experience at ${data.yourTitle || 'my previous roles'} can benefit ${data.companyName}. Thank you for your time.\n\nBest,\n${data.yourName}`,
    };

    return {
      header: `${data.yourName}\n${data.yourEmail} | ${data.yourPhone}\n${date}\n\n${greeting}`,
      body: (openings[data.tone] || openings.professional) + body + whyParagraph,
      closing: closings[data.tone] || closings.professional,
    };
  }

  function renderLetter(letter, data) {
    const output = document.getElementById('letterOutput');
    let html = '';

    if (currentTemplate === 'modern') {
      html = `<div class="letter-card" style="border-left: 4px solid #4f46e5;">${escapeHtml(letter.header)}\n\n${escapeHtml(letter.body)}\n\n${escapeHtml(letter.closing)}</div>`;
    } else if (currentTemplate === 'classic') {
      html = `<div class="letter-card" style="font-family: Georgia, serif; padding: 40px;">${escapeHtml(letter.header)}\n\n${escapeHtml(letter.body)}\n\n${escapeHtml(letter.closing)}</div>`;
    } else {
      html = `<div class="letter-card" style="background: linear-gradient(135deg, #f0f0ff 0%, #fff 100%); border-radius: 16px;">${escapeHtml(letter.header)}\n\n${escapeHtml(letter.body)}\n\n${escapeHtml(letter.closing)}</div>`;
    }

    output.innerHTML = html;
  }

  // ===== Copy & Download =====
  window.copyLetter = function() {
    const letterText = document.querySelector('.letter-card')?.textContent || '';
    if (!letterText) return;
    navigator.clipboard.writeText(letterText).then(() => showToast('Cover letter copied!'));
  };

  window.downloadPDF = function() {
    const letterContent = document.querySelector('.letter-card')?.innerHTML || '';
    if (!letterContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Cover Letter - ${getFormData().yourName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;padding:40px;font-size:13px;line-height:1.7;color:#1a1a2e}.letter-card{white-space:pre-wrap;word-break:break-word}</style>
      </head><body><div class="letter-card">${letterContent}</div></body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  // ===== Utilities =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:12px 24px;border-radius:8px;font-size:14px;z-index:9999;`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2000);
  }

  function getFormData() {
    return {
      yourName: document.getElementById('yourName').value.trim(),
      companyName: document.getElementById('companyName').value.trim(),
    };
  }

  // ===== Persistence =====
  function saveDraft() {
    try {
      const data = getFormData();
      localStorage.setItem('covercraft_draft', JSON.stringify({
        ...data,
        yourEmail: document.getElementById('yourEmail').value.trim(),
        yourPhone: document.getElementById('yourPhone').value.trim(),
        yourTitle: document.getElementById('yourTitle').value.trim(),
        hiringManager: document.getElementById('hiringManager').value.trim(),
        keyAchievements: document.getElementById('keyAchievements').value,
        whyCompany: document.getElementById('whyCompany').value,
        tone: document.getElementById('tone').value,
        template: currentTemplate,
        ts: Date.now()
      }));
    } catch (e) {}
  }

  function loadDraft() {
    try {
      const d = localStorage.getItem('covercraft_draft');
      if (!d) return;
      const data = JSON.parse(d);
      if (Date.now() - data.ts > 86400000) return;

      document.getElementById('yourName').value = data.yourName || '';
      document.getElementById('yourEmail').value = data.yourEmail || '';
      document.getElementById('yourPhone').value = data.yourPhone || '';
      document.getElementById('yourTitle').value = data.yourTitle || '';
      document.getElementById('companyName').value = data.companyName || '';
      document.getElementById('jobTitle').value = data.jobTitle || '';
      document.getElementById('hiringManager').value = data.hiringManager || '';
      document.getElementById('keyAchievements').value = data.keyAchievements || '';
      document.getElementById('whyCompany').value = data.whyCompany || '';
      document.getElementById('tone').value = data.tone || 'professional';

      if (data.template) {
        currentTemplate = data.template;
      }
    } catch (e) {}
  }

  // Auto-save on input
  document.querySelectorAll('.input-panel input, .input-panel textarea, .input-panel select').forEach(el => {
    el.addEventListener('change', saveDraft);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.addEventListener('input', () => {}); // Could add debounce here
    }
  });

})();
