import "./index.css";
import {
  disableButton,
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import logoIcon from "../images/logo.svg";
import editProfileIcon from "../images/pencil.svg";
import newPostIcon from "../images/plus.svg";
import editModalCloseIcon from "../images/close.svg";
import newModalCloseIcon from "../images/close.svg";
import editAvatarIcon from "../images/pencil-light.svg";
import avatarModalCloseIcon from "../images/close.svg";
import { setButtonText } from "../utils/helpers.js";

const logoElement = document.getElementById("header__logo");
logoElement.src = logoIcon;

const avatarElement = document.getElementById("profile__avatar");

const editProfileButton = document.getElementById("profile__edit-btn-icon");
editProfileButton.src = editProfileIcon;

const newPostButton = document.getElementById("profile__add-btn-icon");
newPostButton.src = newPostIcon;

const editProfileModalCloseButton = document.getElementById(
  "modal__close-btn-icon"
);
editProfileModalCloseButton.src = editModalCloseIcon;

const editProfileButtonLight = document.getElementById(
  "profile__avatar-btn-img"
);
editProfileButtonLight.src = editAvatarIcon;

const newPostModalCloseButton = document.getElementById(
  "modal__close-btn-icon-2"
);
newPostModalCloseButton.src = newModalCloseIcon;

const avatarModalCloseButton = document.getElementById(
  "modal__close-btn-icon-3"
);

avatarModalCloseButton.src = avatarModalCloseIcon;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "9cb02ddb-be93-4f4d-acd7-bf55d0ac90f0",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.prepend(cardElement);
    });

    const { name, about, avatar } = user;
    profileName.textContent = name;
    descriptionName.textContent = about;
    avatarElement.src = avatar;
  })
  .catch((err) => {
    console.log(err);
  });

// Profile Section DOM Elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const descriptionName = document.querySelector(".profile__description");

// Edit Profile Modal DOM Elements
const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const editModalNameInput = editForm.elements["profile-name-input"];
const editModalDescriptionInput =
  editForm.elements["profile-description-input"];
const editAvatarButton = document.querySelector(".profile__avatar-btn");

// Add Card Modal DOM Elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardNameInput = cardForm.elements["add-card-name-input"];
const cardLinkInput = cardForm.elements["add-card-link-input"];
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");

// Cards Section DOM Elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Preview Modal DOM Elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

//Avatar Modal DOM Elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Delete Modal DOM Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__submit-btn_cancel"
);

//Delete Card Variables
let selectedCard, selectedCardId;

// ----------------------------------
// Open & Close Modal Functions
// ----------------------------------

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalOnEscape);
}

function handleLike(evt, id) {
  const cardLikeBtn = evt.target;
  const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      cardLikeBtn.classList.toggle("card__like-btn_liked");
    })
    .catch((err) => {
      console.error("Error handling like:", err);
    });
}

function closeModalOnEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

// ----------------------------------
// Card Creation & Deletion
// ----------------------------------

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImg = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardTitle.textContent = data.name;
  cardImg.alt = data.name;
  cardImg.src = data.link;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImg.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

const closeButtons = document.querySelectorAll(".modal__close-btn");
closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

const popups = document.querySelectorAll(".modal");
popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(popup);
    }
  });
});

// ----------------------------------
// Modal Form Handlers
// ----------------------------------

function handleEditFormSubmit(evt) {
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      descriptionName.textContent = data.about;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
  closeModal(editModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  api
    .editUserPost(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      cardForm.reset();
      disableButton(cardSubmitButton, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  api
    .editUserAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      avatarElement.src = data.avatar;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
  closeModal(avatarModal);
}

function handleDeleteSubmit(evt) {
  const deleteButton = evt.submitter;
  setButtonText(deleteButton, true, "Delete", "Deleting...");
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteButton, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

// ----------------------------------
// Event Listeners
// ----------------------------------

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = descriptionName.textContent;
  openModal(editModal);
  resetValidation(
    editForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
});

profileAddButton.addEventListener("click", () => {
  openModal(cardModal);
});

editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

editAvatarButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

enableValidation(settings);
