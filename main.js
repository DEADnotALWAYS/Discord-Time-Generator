    const dt = document.getElementById("dt");
    const format = document.getElementById("format");
    const generateBtn = document.getElementById("generate");
    const code = document.getElementById("code");
    const preview = document.getElementById("preview");
    const copyBtn = document.getElementById("copy");
    const cardCountSelect = document.getElementById("card-count");
    const year = document.getElementById("year");
    const month = document.getElementById("month");
    const day = document.getElementById("day");
    const hour = document.getElementById("hour");
    const minute = document.getElementById("minute");
    const ampmEl = document.getElementById("ampm");
    const panels = document.querySelectorAll(".panel");
    const tabs = document.querySelectorAll(".tab-btn");
    const timezoneHeader = document.getElementById("timezone-header");
    const now = new Date("2025-09-01T17:25:00+05:30");


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

    for (let y = 2025; y <= 3000; y++) {
      year.innerHTML += `<option value="${y}">${y}</option>`;
    }
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    for (let m = 0; m < 12; m++) {
      month.innerHTML += `<option value="${m + 1}">${monthNames[m]}</option>`;
    }

    function updateDays() {
      const y = parseInt(year.value);
      const m = parseInt(month.value);
      const daysInMonth = new Date(y, m, 0).getDate();
      day.innerHTML = "";
      for (let d = 1; d <= daysInMonth; d++) {
        const val = d.toString().padStart(2, "0");
        day.innerHTML += `<option value="${d}">${val}/${new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long' })}</option>`;
      }
    }

    function populateDays(yearVal, monthVal) {
      day.innerHTML = "";
      const numDays = new Date(yearVal, monthVal, 0).getDate();
      for (let d = 1; d <= numDays; d++) {
        const dateObj = new Date(yearVal, monthVal - 1, d);
        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        day.innerHTML += `<option value="${d}">${d} / ${weekday}</option>`;
      }
    }

    for (let h = 1; h <= 12; h++) {
      hour.innerHTML += `<option value="${h}">${h.toString().padStart(2, "0")}</option>`;
    }
    for (let m = 0; m <= 59; m++) {
      minute.innerHTML += `<option value="${m}">${m.toString().padStart(2, "0")}</option>`;
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
        generateTimestamp();
      });
    });

    function updateTimezoneTime(card) {
      const searchInput = card.querySelector('.search-input');
      const timeDisplay = card.querySelector('.time-display');
      const timezone = searchInput.value;

      let selectedDate;
      if (document.getElementById("native").classList.contains("active")) {
        const value = dt.value;
        if (!value) {
          timeDisplay.innerHTML = '';
          return;
        }
        selectedDate = new Date(value);
      } else {
        let y = year.value;
        let m = month.value - 1;
        let d = day.value;
        let h = parseInt(hour.value);
        const min = minute.value;
        const ampm = ampmEl.value;

        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;

        selectedDate = new Date(y, m, d, h, min);
      }

      const dateFormatter = new Intl.DateTimeFormat(navigator.language || 'en', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const formattedDate = dateFormatter.format(selectedDate);

      const svg = `
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#cfc" stroke-width="2" fill="none"/>
          ${Array.from({ length: 12 }, (_, i) => `
            <line x1="50" y1="10" x2="50" y2="15" transform="rotate(${i * 30} 50 50)" stroke="#cfc" stroke-width="1"/>
          `).join('')}
          <line x1="50" y1="50" x2="50" y2="25" stroke="#cfc" stroke-width="3" transform="rotate(${((selectedDate.getUTCHours() + selectedDate.getUTCMinutes() / 60) * 30)} 50 50)"/>
          <line x1="50" y1="50" x2="50" y2="20" stroke="#cfc" stroke-width="2" transform="rotate(${((selectedDate.getUTCMinutes() + selectedDate.getUTCSeconds() / 60) * 6)} 50 50)"/>
        </svg>
      `;
      timeDisplay.innerHTML = `<span>${timezone}</span><span>${formattedDate}</span><div class="clock">${svg}</div>`;
    }

    function getPreviewString(date, formatType) {
      if (formatType === 'R') {
        const seconds = Math.floor((date - Date.now()) / 1000);
        const abs = Math.abs(seconds);
        const formatter = new Intl.RelativeTimeFormat(navigator.language || 'en', { numeric: 'auto' });

        if (abs >= 31536000) return formatter.format(Math.round(seconds / 31536000), 'year');
        if (abs >= 2592000) return formatter.format(Math.round(seconds / 2592000), 'month');
        if (abs >= 86400) return formatter.format(Math.round(seconds / 86400), 'day');
        if (abs >= 3600) return formatter.format(Math.round(seconds / 3600), 'hour');
        if (abs >= 60) return formatter.format(Math.round(seconds / 60), 'minute');
        return formatter.format(seconds, 'second');
      } else {
        const formatter = new Intl.DateTimeFormat(navigator.language || 'en', {
          ...(formatType.includes('d') ? { dateStyle: 'short' } : {}),
          ...(formatType.includes('D') ? { dateStyle: 'long' } : {}),
          ...(formatType.includes('f') ? { timeStyle: 'short', dateStyle: 'long' } : {}),
          ...(formatType.includes('F') ? { timeStyle: 'short', dateStyle: 'full' } : {}),
          ...(formatType === 't' ? { timeStyle: 'short' } : {}),
          ...(formatType === 'T' ? { timeStyle: 'medium' } : {}),
        });
        return formatter.format(date);
      }
    }

    function generateTimestamp() {
      let selectedDate;
      if (document.getElementById("native").classList.contains("active")) {
        const value = dt.value;
        if (!value) return;
        selectedDate = new Date(value);
      } else {
        let y = year.value;
        let m = month.value - 1;
        let d = day.value;
        let h = parseInt(hour.value);
        const min = minute.value;
        const ampm = ampmEl.value;

        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;

        selectedDate = new Date(y, m, d, h, min);
      }

      const timestamp = Math.floor(selectedDate.getTime() / 1000);
      const formatType = format.value;
      code.textContent = `<t:${timestamp}:${formatType}>`;
      preview.textContent = getPreviewString(selectedDate, formatType);

      const count = parseInt(cardCountSelect.value);
      if (count > 0) {
        timezoneCards.forEach(card => {
          const searchInput = card.querySelector('.search-input');
          if (searchInput.value) {
            updateTimezoneTime(card);
          }
        });
      }
    }

    window.addEventListener("load", () => {
      populateDays(now.getFullYear(), now.getMonth() + 1);
      document.querySelector(".tab-btn[data-tab='native']").classList.remove("active");
      document.getElementById("native").classList.remove("active");
      document.querySelector(".tab-btn[data-tab='custom']").classList.add("active");
      document.getElementById("custom").classList.add("active");
      year.value = now.getFullYear();
      month.value = now.getMonth() + 1;
      day.value = now.getDate();
      let hours = now.getHours();
      ampmEl.value = hours >= 12 ? "PM" : "AM";
      hour.value = ((hours + 11) % 12 + 1);
      minute.value = now.getMinutes();
      const savedCardCount = localStorage.getItem('timezone-card-count') || "2";
      cardCountSelect.value = savedCardCount;
      toggleTimezoneSection();
      generateTimestamp();
    });

    [dt, year, month, day, hour, minute, ampmEl, format].forEach(el =>
      el.addEventListener("change", generateTimestamp)
    );

    generateBtn.addEventListener("click", generateTimestamp);

    copyBtn.addEventListener("click", () => {
      const text = code.textContent;
      if (!text.startsWith("<t:")) return;
      navigator.clipboard.writeText(text).then(() => {
        alert("✅ Timestamp copied!");
      }).catch(() => {
        alert("⚠️ Failed to copy. Try selecting manually.");
      });
    });
  </script>
