function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

document.querySelectorAll(".tables button").forEach(btn => {
    btn.addEventListener("click", function() {
        document.querySelectorAll(".tables button").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
    });
});

async function loadBookings() {
  try {
    const search = document.querySelector('#search')?.value || '';
    const status = document.querySelector('#status')?.value; 

    const response = await api.reserve.dashboard({
      search,
      date
    });

    const data = response.data.data || [];

    console.log("API DATA:", data);

    //  render ใหม่
    renderBookings(data);

  } catch (error) {
    console.error('โหลด booking ไม่ได้:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBookings();
});

document.querySelector('.form-search').addEventListener('submit', function(e){
  e.preventDefault();
  loadBookings();
});
document.addEventListener('change', function(e){
  if(e.target.id === 'date'){
    loadBookings();
  }
});

function renderBookings(bookings) {
  const rows = document.querySelectorAll(".timeline-table tbody tr");

  console.log("book" , bookings)

  //  reset table ก่อน render
  rows.forEach(row => {
    const slots = row.querySelectorAll(".slot");
    slots.forEach(slot => {
      slot.innerHTML = "";
      slot.colSpan = 1;
      slot.style.display = ""; // เผื่อเคยซ่อน
    });
  });

  rows.forEach((row) => {
    const tableName = row.querySelector(".table-name").innerText;

    bookings.forEach((b) => {
      if (b.Table_Number === tableName) {
        const slots = row.querySelectorAll(".slot");

        const start = parseInt(b.Start_time.split(':')[0]);
        const end = parseInt(b.End_time.split(':')[0]);

        const startIndex = start - 10;
        const span = end - start;


        const td = slots[startIndex];

        td.colSpan = span;

        td.innerHTML = `
          <div class="booking">
            ${parseInt(b.Start_time.split(':')[0])}:00 - ${parseInt(b.End_time.split(':')[0])}:00
          </div>
        `;

        for (let i = 1; i < span; i++) {
          slots[startIndex + i].style.display = "none"; 
        }
      }
    });
  });
}