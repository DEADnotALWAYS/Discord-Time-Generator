    const timezoneCards = document.querySelectorAll(".timezone-card");
    const timezonePanel = document.getElementById("timezone-panel");
    const timezones = Intl.supportedValuesOf('timeZone');

    function toggleTimezoneSection() {
      const count = parseInt(cardCountSelect.value);
      const isEnabled = count > 0;
      timezonePanel.style.display = isEnabled ? 'grid' : 'none';
      localStorage.setItem('timezone-card-count', count);
      if (isEnabled) {
        timezoneCards.forEach((card, index) => {
          card.style.display = index < count ? 'flex' : 'none';
        });
        timezoneCards.forEach(card => {
          const searchInput = card.querySelector('.search-input');
          if (searchInput.value) {
            updateTimezoneTime(card);
          }
        });
      }
      generateTimestamp();
    }

    cardCountSelect.addEventListener("change", toggleTimezoneSection);

timezoneCards.forEach((card, index) => {
      const addBtn = card.querySelector('.add-btn');
      const searchInput = card.querySelector('.search-input');
      const timezoneOptions = card.querySelector('.timezone-options');
      const timeDisplay = card.querySelector('.time-display');
      const clearBtn = card.querySelector('.clear-btn');
      searchInput.style.display = 'none';
      timezoneOptions.classList.remove('show');

      // Simple mapping of common city names to IANA timezones
      const cityToTimezoneMap = {
        "new york": "America/New_York",
        "los angeles": "America/Los_Angeles",
        "chicago": "America/Chicago",
        "london": "Europe/London",
        "tokyo": "Asia/Tokyo",
        "sydney": "Australia/Sydney",
        "paris": "Europe/Paris"
      };

      function updateTimezoneOptions(searchTerm = '') {
        timezoneOptions.innerHTML = '';
        let filteredTimezones = timezones.filter(tz => 
          tz.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Check if the search term matches a city name
        const normalizedSearch = searchTerm.toLowerCase().trim();
        if (cityToTimezoneMap[normalizedSearch]) {
          filteredTimezones.unshift(cityToTimezoneMap[normalizedSearch]);
        }

        filteredTimezones.forEach(tz => {
          const option = document.createElement('div');
          option.className = 'timezone-option';
          option.textContent = tz;
          option.addEventListener('click', () => {
            searchInput.value = tz;
            timezoneOptions.classList.remove('show');
            addTimezone(tz);
          });
          timezoneOptions.appendChild(option);
        });
        if (searchInput.style.display !== 'none' && filteredTimezones.length > 0) {
          timezoneOptions.classList.add('show');
        } else {
          timezoneOptions.classList.remove('show');
        }
      }

      addBtn.addEventListener('click', () => {
        if (searchInput.style.display === 'none' && !timezoneOptions.classList.contains('show')) {
          addBtn.style.display = 'none';
          searchInput.style.display = 'block';
          searchInput.focus();
          updateTimezoneOptions('');
        }
      });

      searchInput.addEventListener('input', () => {
        updateTimezoneOptions(searchInput.value);
      });

      document.addEventListener('click', (e) => {
        if (!card.contains(e.target) && e.target !== addBtn && !timezoneOptions.contains(e.target)) {
          timezoneOptions.classList.remove('show');
          if (!searchInput.value.trim()) {
            searchInput.style.display = 'none';
            addBtn.style.display = 'block';
            timeDisplay.innerHTML = '';
            clearBtn.style.display = 'none';
            localStorage.removeItem(`timezone-${index}`);
            generateTimestamp();
          }
        }
      });

      function addTimezone(tz) {
        searchInput.value = tz;
        timezoneOptions.classList.remove('show');
        searchInput.style.display = 'block';
        clearBtn.style.display = 'block';
        addBtn.style.display = 'none';
        localStorage.setItem(`timezone-${index}`, tz);
        updateTimezoneTime(card);
        generateTimestamp();
      }

      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        timeDisplay.innerHTML = '';
        clearBtn.style.display = 'none';
        addBtn.style.display = 'block';
        searchInput.style.display = 'none';
        timezoneOptions.classList.remove('show');
        localStorage.removeItem(`timezone-${index}`);
        generateTimestamp();
      });

      searchInput.addEventListener('blur', () => {
        setTimeout(() => {
          if (!searchInput.value.trim() && !timezoneOptions.contains(document.activeElement)) {
            timeDisplay.innerHTML = '';
            clearBtn.style.display = 'none';
            addBtn.style.display = 'block';
            searchInput.style.display = 'none';
            timezoneOptions.classList.remove('show');
            localStorage.removeItem(`timezone-${index}`);
            generateTimestamp();
          }
        }, 100);
      });

      const savedTimezone = localStorage.getItem(`timezone-${index}`);
      if (savedTimezone) {
        searchInput.value = savedTimezone;
        timeDisplay.innerHTML = `<span>${savedTimezone}</span>`;
        clearBtn.style.display = 'block';
        addBtn.style.display = 'none';
        searchInput.style.display = 'block';
        updateTimezoneTime(card);
      }
    });
window.updateTimezoneTime = updateTimezoneTime;
window.toggleTimezoneSection = toggleTimezoneSection;
