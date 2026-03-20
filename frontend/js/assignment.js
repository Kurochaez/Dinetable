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