// Sélectionner tous les boutons dropdown
const dropdownButtons = document.querySelectorAll('.dropdownButton');
const dropdownMenus = document.querySelectorAll('.dropdownE');

// Parcourir tous les boutons dropdown
dropdownButtons.forEach((button) => {
    // Ajouter un écouteur d'événement au clic sur chaque bouton dropdown
    button.addEventListener('click', function () {
        // Récupérer le menu dropdown associé à ce bouton
        const dropdownMenu = this.nextElementSibling;

        // Vérifier si le menu dropdown est actuellement affiché ou caché
        const isMenuVisible = dropdownMenu.classList.contains('hidden');

        // Afficher ou cacher le menu dropdown en modifiant la classe CSS appropriée
        if (isMenuVisible) {
            dropdownMenu.classList.remove('hidden');
        } else {
            dropdownMenu.classList.add('hidden');
        }
    });
});

// Fermer le menu dropdown si l'utilisateur clique en dehors du menu
document.addEventListener('click', function (event) {
    // Vérifier si l'élément cliqué est à l'intérieur d'un menu dropdown ou d'un bouton dropdown
    const isClickedInsideMenu = Array.from(dropdownMenus).some(menu => menu.contains(event.target));
    const isClickedInsideButton = Array.from(dropdownButtons).some(button => button.contains(event.target));

    // Cacher tous les menus dropdown si l'élément cliqué est en dehors des menus et des boutons dropdown
    if (!isClickedInsideMenu && !isClickedInsideButton) {
        dropdownMenus.forEach(menu => {
            menu.classList.add('hidden');
        });
    }
});

// Sélectionner la carte d'ajout d'employé et la modale
const addEmployeeCard = document.getElementById('addEmployeeCard');
const addEmployeeModal = document.getElementById('addEmployeeModal');
const editEmployeeModal = document.getElementById('editEmployeeModal');

addEmployeeCard.addEventListener('click', function () {
    addEmployeeModal.classList.remove('hidden'); // Afficher la modale
});

function openModalModify(elem) {
    editEmployeeModal.classList.remove('hidden'); // Afficher la modale
    let dataEmployee = JSON.parse(elem.getAttribute('data-employee'))._doc;
    document.getElementById('modif-nom').value = dataEmployee.nom;
    document.getElementById('modif-fonction').value = dataEmployee.fonction;
    document.getElementById('editEmployeeForm').action = `/updateEmploye/${elem.getAttribute('data-employeeId')}`;
}

// Écouter le clic sur le bouton de fermeture de la modale
const closeModalButton = document.querySelectorAll('.closeModalButton');
closeModalButton.forEach(close => {
    close.addEventListener('click', function () {
        addEmployeeModal.classList.add('hidden'); // Masquer la modale
        editEmployeeModal.classList.add('hidden'); // Masquer la modale
    });
});

const deleteModal = document.querySelector('.popup-modal');
function confirmDelete(elem) {
    deleteModal.classList.remove('hidden'); // Afficher la modale
    document.querySelector(".deleteBtn").href = `/deleteEmploye/${elem.getAttribute('data-employeeId')}`
}

function closeModal() {
    deleteModal.classList.add('hidden'); // Masquer la modale
}

const fileInput = document.querySelector('.file-input');
const previewImage = document.querySelector('.preview-image');

fileInput.addEventListener('change', function () {
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
        previewImage.style.display = 'block';
    } else {
        previewImage.style.display = 'hidden';
    }
});