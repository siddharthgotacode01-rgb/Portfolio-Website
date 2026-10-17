(() => {
  const menu = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menu && navLinks) {
    menu.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
    }));
  }
  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold: 0.12});
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));
  const goals = {
    job: {title:'Your starter roadmap: first job',steps:['Choose 1–2 entry-level roles that genuinely interest you.','Review 5–10 current job descriptions and note repeated skills.','Build or polish 2 relevant projects and document your contribution.','Tailor your CV and portfolio to the role; practise explaining your work.','Track applications and use feedback to improve your next attempt.']},
    skills: {title:'Your starter roadmap: build a skill',steps:['Pick one skill connected to a specific goal—not a long list of tools.','Choose one beginner-friendly learning path and set a weekly routine.','Practise through small exercises before moving to a complete project.','Build one project that demonstrates the skill and write a short case study.','Ask for feedback, revise your work and decide the next skill gap.']},
    career: {title:'Your starter roadmap: career clarity',steps:['Write down what interests you, what you are good at and what matters to you.','Explore three possible career paths and the day-to-day work in each.','Check typical entry requirements, learning costs and realistic pathways.','Speak to people with relevant experience and ask specific questions.','Choose one low-risk experiment—an introductory project, course or shadowing conversation.']}
  };
  let selectedGoal = 'job';
  const choices = document.querySelectorAll('.choice');
  choices.forEach(btn => btn.addEventListener('click', () => {
    selectedGoal = btn.dataset.goal;
    choices.forEach(item => { item.classList.toggle('active', item === btn); item.setAttribute('aria-pressed', String(item === btn)); });
    const result = document.getElementById('roadmap-result'); if (result) result.hidden = true;
    const badge = document.querySelector('.step-badge'); if (badge) badge.textContent = '01 / 02';
  }));
  const showRoadmap = document.getElementById('show-roadmap');
  if (showRoadmap) showRoadmap.addEventListener('click', () => {
    const data = goals[selectedGoal]; const result = document.getElementById('roadmap-result');
    result.innerHTML = `<h4>${data.title}</h4><ol>${data.steps.map(s => `<li>${s}</li>`).join('')}</ol><p class="result-note">General educational guidance only. This demo is not a personalised assessment or a promise of employment.</p>`;
    result.hidden = false; const badge = document.querySelector('.step-badge'); if (badge) badge.textContent = '02 / 02';
    result.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'nearest'});
  });
  const form = document.getElementById('lead-form'); const message = document.getElementById('form-message'); const toast = document.getElementById('toast');
  function showToast(text) { if (!toast) return; toast.textContent = text; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 4500); }
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const consent = document.getElementById('lead-consent');
    if (!consent.checked) { message.textContent = 'Please confirm consent before preparing your enquiry.'; consent.focus(); return; }
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim(); const email = String(data.get('email') || '').trim(); const goal = String(data.get('goal') || '');
    const subject = encodeURIComponent('Guidexa launch enquiry — ' + name);
    const body = encodeURIComponent(`Hello Guidexa,\n\nI'd like to register my interest in the launch.\n\nName: ${name}\nEmail: ${email}\nArea of interest: ${goal}\n\nPlease let me know about next steps.\n\nI consented to being contacted about Guidexa's launch.`);
    // Email contact is configured for the current launch. This does not store leads on a server.
    const recipient = document.body.dataset.contactEmail || 'guidexa505@gmail.com';
    message.textContent = 'Your enquiry will open in your email app. It is not stored on this website yet. You can also contact Guidexa through the WhatsApp links on this page.';
    showToast('Opening your email app to send your enquiry.');
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
})();
