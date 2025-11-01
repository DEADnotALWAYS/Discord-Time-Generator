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
