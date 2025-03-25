document.addEventListener("DOMContentLoaded", function() {
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#4dabf7"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        }
      },
      "opacity": {
        "value": 0.7,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#4dabf7",
        "opacity": 0.5,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });

  // Set up dark mode toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const body = document.body;
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    updateParticlesColor('#74c0fc');
  }
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update icon
    if (body.classList.contains('dark-mode')) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'dark');
      updateParticlesColor('#74c0fc');
    } else {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'light');
      updateParticlesColor('#4dabf7');
    }
  });
  
  // Add click event to change particle colors randomly
  const particlesContainer = document.getElementById('particles-js');
  particlesContainer.addEventListener('click', (e) => {
    // Only if it's not coming from a form control
    if (!e.target.closest('input, button, select')) {
      const colors = ['#4dabf7', '#74c0fc', '#a5d8ff', '#228be6', '#1971c2', '#fd7e14', '#f76707', '#e8590c', '#fd7e14', '#40c057', '#2b8a3e', '#82c91e', '#66a80f'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      updateParticlesColor(randomColor);
    }
  });
  
  function updateParticlesColor(color) {
    if (window.pJSDom && window.pJSDom[0]) {
      const particles = window.pJSDom[0].pJS.particles;
      
      // Update particles color
      particles.array.forEach(p => {
        p.color.value = color;
        p.color.rgb = hexToRgb(color);
      });
      
      // Update line linked color
      particles.line_linked.color = color;
      particles.line_linked.color_rgb_line = hexToRgb(color);
    }
  }
  
  function hexToRgb(hex) {
    // Remove the '#' if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }
});
