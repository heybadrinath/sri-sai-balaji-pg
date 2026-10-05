(() => {
  "use strict";

  const roomDetails = {
    1: {
      title: "Enquire about 1 sharing",
      description:
        "A room to yourself, with a bed, wardrobe and attached washroom.",
    },
    2: {
      title: "Enquire about 2 sharing",
      description:
        "Share with one other resident, with your own bed and wardrobe. Study table and chair included in 2-sharing rooms only.",
    },
    3: {
      title: "Enquire about 3 sharing",
      description:
        "A shared room for three residents, with individual beds and wardrobes.",
    },
    4: {
      title: "Enquire about 4 sharing",
      description:
        "A shared room for four residents, with individual beds and wardrobes.",
    },
  };
  const roomSelect = document.querySelector("#visit-room");
  const timingSelect = document.querySelector("#visit-timing");
  const enquiry = document.querySelector("#enquiry-whatsapp");
  const roomDialog = document.querySelector("#room-dialog");
  const roomTitle = document.querySelector("#room-dialog-title");
  const roomDescription = document.querySelector("#room-dialog-description");
  const roomLink = document.querySelector("#room-dialog-whatsapp");
  let roomOpener;
  let savedOverflow = "";

  if (roomDialog && typeof roomDialog.showModal === "function") {
    document.querySelectorAll("[data-room-option]").forEach((option) => {
      option.setAttribute("aria-haspopup", "dialog");
      option.setAttribute("aria-controls", "room-dialog");
      option.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        const details = roomDetails[option.dataset.roomOption];
        if (!details || roomDialog.open) return;
        event.preventDefault();
        roomTitle.textContent = details.title;
        roomDescription.textContent = details.description;
        roomLink.href = option.href;
        roomDialog.dataset.room = option.dataset.roomOption;
        roomOpener = option;
        savedOverflow = document.body.style.overflow;
        roomDialog.showModal();
        document.body.style.overflow = "hidden";
      });
    });

    roomDialog
      .querySelector("[data-room-close]")
      ?.addEventListener("click", () => {
        roomDialog.close();
      });
    roomDialog.addEventListener("close", () => {
      document.body.style.overflow = savedOverflow;
      roomOpener?.focus({ preventScroll: true });
    });
    roomDialog.addEventListener("click", (event) => {
      if (event.target !== roomDialog) return;
      const bounds = roomDialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        roomDialog.close();
    });
  }

  function updateEnquiry() {
    if (!enquiry || !roomSelect || !timingSelect) return;
    const preference =
      roomSelect.value === "Not sure yet"
        ? "I want to inquire about rooms at Sri Sai Balaji PG and would like help choosing a sharing option."
        : `I want to inquire about a ${roomSelect.value}-sharing room at Sri Sai Balaji PG.`;
    const text = `Hi! ${preference} My move-in plan: ${timingSelect.value.toLowerCase()}. Could you share the availability, rent, deposit details and a suitable time to visit?`;
    enquiry.href = `https://wa.me/918883399299?text=${encodeURIComponent(text)}`;
  }

  roomSelect?.addEventListener("change", updateEnquiry);
  timingSelect?.addEventListener("change", updateEnquiry);
  document
    .querySelector("#enquiry-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      enquiry?.click();
    });
  updateEnquiry();
})();
