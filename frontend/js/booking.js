const bookings = [
  {
    table: "A1",
    start: 12,
    end: 14,
    name: "John",
  },
];

function renderBookings() {
  const rows = document.querySelectorAll(".timeline-table tbody tr");

  rows.forEach((row) => {
    const tableName = row.querySelector(".table-name").innerText;

    bookings.forEach((b) => {
      if (b.table === tableName) {
        const slots = row.querySelectorAll(".slot");

        const startIndex = b.start - 10;
        const span = b.end - b.start;

        const td = slots[startIndex];

        td.colSpan = span;

        td.innerHTML = `
        <div class="booking">
        ${b.name}
        <br>
        ${b.start}:00 - ${b.end}:00
        </div>
        `;

        for (let i = 1; i < span; i++) {
          slots[startIndex + i].remove();
        }
      }
    });
  });
}