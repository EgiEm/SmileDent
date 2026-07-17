/* 
  SmileDent Javascript Interactive Logic
  Author: Antigravity
  Purpose: Navigation toggles, scroll behavior, Before/After image comparison slider, and booking forms.
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Navigation & Scroll Spy ---
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Sticky Header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy (Active Links)
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Mobile Hamburger Menu ---
  const burgerMenu = document.getElementById('burgerMenu');
  const navLinksContainer = document.getElementById('navLinks');

  if (burgerMenu && navLinksContainer) {
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navLinksContainer.classList.remove('active');
      });
    });
  }

  // --- Before/After Teeth Slider Logic ---
  const slider = document.getElementById('beforeAfterSlider');
  const beforeWrapper = document.getElementById('beforeImgWrapper');
  const beforeImg = document.getElementById('beforeImg');
  const handle = document.getElementById('sliderHandle');

  if (slider && beforeWrapper && beforeImg && handle) {
    let isDragging = false;

    // Synchronize the width of the before image to match the container's width
    function resizeBeforeImg() {
      const containerWidth = slider.getBoundingClientRect().width;
      beforeImg.style.width = `${containerWidth}px`;
    }

    // Call initially and on resize
    resizeBeforeImg();
    window.addEventListener('resize', resizeBeforeImg);

    // Adjust wrapper and handle left offsets
    function updateSlider(clientX) {
      const rect = slider.getBoundingClientRect();
      let percentage = ((clientX - rect.left) / rect.width) * 100;
      
      // Clamp between 0% and 100%
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      beforeWrapper.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    // Drag start
    function onDragStart() {
      isDragging = true;
    }

    // Drag end
    function onDragEnd() {
      isDragging = false;
    }

    // Drag move
    function onDragMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    }

    // Event Listeners for Handle
    handle.addEventListener('mousedown', onDragStart);
    handle.addEventListener('touchstart', onDragStart, { passive: true });

    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchend', onDragEnd);

    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('touchmove', onDragMove, { passive: false });

    // Prevent default touch behaviour when dragging on touch devices
    window.addEventListener('touchmove', (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    }, { passive: false });

    // Allow direct clicking on the slider background to set values
    slider.addEventListener('click', (e) => {
      // Don't register click if they click handle directly
      if (e.target.closest('#sliderHandle')) return;
      updateSlider(e.clientX);
    });
  }

});

// --- Modal Popup Operations ---
const bookingModal = document.getElementById('bookingModal');
const modalForm = document.getElementById('modalForm');
const successBanner = document.getElementById('modalSuccessBanner');

function openBookingModal(e) {
  if (e) e.preventDefault();
  bookingModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Disable background scrolling
}

function closeBookingModal() {
  bookingModal.classList.remove('active');
  document.body.style.overflow = ''; // Enable background scrolling
  
  // Reset modal state after transition closes
  setTimeout(() => {
    modalForm.style.display = 'block';
    modalForm.reset();
    successBanner.classList.remove('active');
  }, 400);
}

// Close modal when clicking outside of the content card
if (bookingModal) {
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeBookingModal();
    }
  });
}

// --- Form Submissions Handling ---

// 1. Landing Page Contact Form
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = document.getElementById('contactForm');
  const name = document.getElementById('formName').value;
  const phone = document.getElementById('formPhone').value;
  const service = document.getElementById('formService').value;
  
  // Find submit button and change styling to show success
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.style.backgroundColor = '#22c55e'; // Green feedback color
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> U dërgua me sukses!';
  
  // Reset button state and form fields after 4 seconds
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.style.backgroundColor = '';
    submitBtn.innerHTML = originalText;
    form.reset();
    alert(`Përshëndetje ${name}, kërkesa juaj për termin u regjistrua. Ne do t'ju kontaktojmë në numrin ${phone} së shpejti.`);
  }, 2000);
}

// 2. Modal Booking Form
function handleModalSubmit(e) {
  e.preventDefault();
  
  // Hide form, show success checkmark
  modalForm.style.display = 'none';
  successBanner.classList.add('active');
}

// --- Lightbox Image Viewer Logic ---
function openLightbox(imgSrc, altText) {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  if (lightbox && lightboxImg && lightboxCaption) {
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = altText;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Stop background page scroll
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Resume background page scroll
  }
}
