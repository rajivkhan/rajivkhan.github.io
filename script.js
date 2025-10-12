// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all features
    initNavigation();
    initParticles();
    initScrollAnimations();
    initSkillBars();
    initCounterAnimations();
    initGitHubIntegration();
    initContactForm();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Initialize particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections for fade-in animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// Animate skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Counter animations for stats
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// GitHub API Integration
async function initGitHubIntegration() {
    try {
        // Fetch user repositories
        await fetchUserRepositories();

        // Fetch GitHub activity (contribution calendar)
        await fetchGitHubActivity();
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        showGitHubError();
    }
}

async function fetchUserRepositories() {
    const username = 'rajivkhan'; // Replace with actual username
    const projectsGrid = document.getElementById('projects-grid');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();

        if (repos.length > 0) {
            projectsGrid.innerHTML = '';

            repos.forEach(repo => {
                const projectCard = createProjectCard(repo);
                projectsGrid.appendChild(projectCard);
            });
        } else {
            showNoRepositories();
        }
    } catch (error) {
        console.error('Error fetching repositories:', error);
        showGitHubError();
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const languages = repo.language || 'Code';
    const description = repo.description || 'No description available';
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();

    card.innerHTML = `
        <div class="project-image">
            <i class="fas fa-code"></i>
        </div>
        <div class="project-content">
            <h3>${repo.name}</h3>
            <p>${description}</p>
            <div class="project-tech">
                <span class="tech-tag">${languages}</span>
                <span class="tech-tag">Updated: ${updatedDate}</span>
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View Code</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn btn-secondary">Live Demo</a>` : ''}
            </div>
        </div>
    `;

    return card;
}

async function fetchGitHubActivity() {
    const activityContainer = document.querySelector('.activity-container');

    try {
        // Create GitHub calendar embed
        const calendarDiv = document.createElement('div');
        calendarDiv.innerHTML = `
            <div class="github-calendar" 
                 data-user="rajivkhan" 
                 data-responsive="true"
                 data-color-scheme="dark">
            </div>
        `;

        // Load GitHub Calendar library
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js';
        script.onload = function () {
            if (typeof GitHubCalendar !== 'undefined') {
                GitHubCalendar('.github-calendar', 'rajivkhan', {
                    responsive: true,
                    tooltips: true,
                    global_stats: true
                });
            }
        };
        document.head.appendChild(script);

        // Load CSS for GitHub Calendar
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/github-calendar@latest/dist/github-calendar-responsive.css';
        document.head.appendChild(link);

        activityContainer.innerHTML = '';
        activityContainer.appendChild(calendarDiv);

    } catch (error) {
        console.error('Error loading GitHub calendar:', error);
        showGitHubError();
    }
}

function showGitHubError() {
    const projectsGrid = document.getElementById('projects-grid');
    const activityContainer = document.querySelector('.activity-container');

    if (projectsGrid) {
        projectsGrid.innerHTML = `
            <div class="project-card">
                <div class="project-content">
                    <h3>Unable to load repositories</h3>
                    <p>Please check your GitHub username or try again later.</p>
                </div>
            </div>
        `;
    }

    if (activityContainer) {
        activityContainer.innerHTML = `
            <div class="activity-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to load GitHub activity</h3>
                <p>Please check your GitHub username or try again later.</p>
            </div>
        `;
    }
}

function showNoRepositories() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = `
        <div class="project-card">
            <div class="project-content">
                <h3>No repositories found</h3>
                <p>Start building amazing projects and they'll appear here!</p>
            </div>
        </div>
    `;
}

// Contact form functionality
function initContactForm() {
    const form = document.querySelector('.contact-form form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const subject = form.querySelector('input[placeholder="Subject"]').value;
            const message = form.querySelector('textarea').value;

            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states and error handling
window.addEventListener('load', function () {
    // Remove loading states
    document.querySelectorAll('.loading').forEach(element => {
        element.classList.remove('loading');
    });

    // Add entrance animations
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
});

// Handle window resize
window.addEventListener('resize', function () {
    // Recalculate any layout-dependent features
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', 'particles-js');
    }
});

// Add typing animation for hero text
function initTypingAnimation() {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const text = nameElement.textContent;
        nameElement.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                nameElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        setTimeout(typeWriter, 1000);
    }
}

// Initialize typing animation after a delay
setTimeout(initTypingAnimation, 500);