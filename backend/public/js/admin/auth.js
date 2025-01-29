// Hamburger Menu Toggle
        const menuBtn = document.getElementById('menuBtn');
        const menu = document.getElementById('menu');
        const hamburger = menuBtn.querySelector('.hamburger');
        const close = menuBtn.querySelector('.close');
        const navbar = document.getElementById('navbar');

        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            hamburger.classList.toggle('hidden');
            close.classList.toggle('hidden');
            // Add backdrop blur when menu is open
            if (!menu.classList.contains('hidden')) {
                navbar.classList.add('bg-purple-900/95');
            } else if (window.scrollY <= 50) {
                navbar.classList.remove('bg-purple-900/95');
            }
        });

        // Enhanced Navbar Scroll Effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-purple-900/95');
                navbar.classList.remove('bg-white/10');
            } else if (menu.classList.contains('hidden')) {
                navbar.classList.remove('bg-purple-900/95');
                navbar.classList.add('bg-white/10');
            }
        });

        // Add touch event handling for mobile
        document.addEventListener('touchstart', function () { }, false);

        // Improve scroll handling
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 10) {
                nav.classList.add('bg-purple-900/95');
            } else {
                nav.classList.remove('bg-purple-900/95');
            }
        }, { passive: true });

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
                animation: blob 7s infinite;
            }
            .animation-delay-2000 {
                animation-delay: 2s;
            }
            /* Add responsive font sizes */
            @media (max-width: 640px) {
                html { font-size: 14px; }
            }
            /* Improve touch targets on mobile */
            @media (max-width: 767px) {
                button, a { min-height: 44px; }
            }
        `;
        document.head.appendChild(style);

        document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
        
            try {
                const response = await fetch('/api/admin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });
        
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', JSON.stringify(data.user));
                    
                    // Set initial auth header for dashboard request
                    window.location.href = '/admin-dashboard';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed. Please try again.');
            }
        });

        // Add function to check if token exists and set headers on page load
        window.addEventListener('load', () => {
            const authToken = localStorage.getItem('authHeader');
            if (authToken) {
                const originalFetch = window.fetch;
                window.fetch = function() {
                    let [resource, config] = arguments;
                    if(config === undefined) {
                        config = {};
                    }
                    if(config.headers === undefined) {
                        config.headers = {};
                    }
                    config.headers.Authorization = authToken;
                    return originalFetch(resource, config);
                };
            }
        });
    