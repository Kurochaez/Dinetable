// เปลี่ยนหน้า + ไฮไลท์สี ตอนเลือกหน้านั้น 
function initNavbar() {
    const links = document.querySelectorAll(".menu-item");
    const currentPage = window.location.pathname;

    links.forEach( item => {
        item.classList.remove("menu-active");

        if(currentPage.includes(item.getAttribute("href"))){
            item.classList.add("menu-active");
        }
    })
}