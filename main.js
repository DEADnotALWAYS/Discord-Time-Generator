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
