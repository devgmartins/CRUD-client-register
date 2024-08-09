const openNewClients = document.getElementById("openModal");
const closeNewClients = document.getElementById("closeModal");

const tableBody = document.getElementById("tableBody");

const updateModal = document.getElementById("updateClientsModal");
const updateModalForm = document.getElementById("updateDataForm");
const leaveUpdateModal = document.getElementById("cancelUpdateButton");

const inputClientName = document.getElementById("inputClientName");
const inputClientEmail = document.getElementById("inputClientEmail");
const inputClientPhone = document.getElementById("inputClientPhone");
const inputClientCity = document.getElementById("inputClientCity");

const newClientsModal = document.getElementById("newClientsModal");
const newClientsForm = document.getElementById("newClientsForm");

const nameInput = document.getElementById("clientNameInput");
const emailInput = document.getElementById("clientEmailInput");
const phoneInput = document.getElementById("clientPhoneInput");
const cityInput = document.getElementById("clientCityInput");

let clients = [];

function addNewClient(name, email, phone, city) {
  clients.push({
    name,
    email,
    phone,
    city,
  });

  localStorage.setItem("clients", JSON.stringify(clients));
}

function updateClients() {
  const localClients = localStorage.getItem("clients");

  if (localClients) {
    clients = JSON.parse(localClients);

    updateTable();
  }
}

function updateTable() {
  clients.forEach((client, index) => {
    let { name, email, phone, city } = client;

    let modalIsVisible = updateModal.classList.contains("hidden");

    if (!modalIsVisible) {
      updateClient(index);
    }

    tableBody.innerHTML += `
      <tr class="flex items-center justify-around lg:justify-between">
        <td class="p-3 text-sm md:text-lg">${name}</td>
        <td class="p-3 text-sm md:text-lg">${email}</td>
        <td class="p-3 text-sm md:text-lg">${phone}</td>
        <td class="p-3 text-sm md:text-lg">${city}</td>
        <td class="flex flex-col lg:flex-row gap-2 p-3 md:text-md">
          <button 
            id="edit-${index}" 
            data-action="edit" 
            class="py-2 lg:py-3 px-3 lg:px-5 text-zinc-100 text-sm font-bold bg-orange-500 hover:ring-2 ring-orange-400 rounded-md lg:rounded-lg"
          >
            Editar
          </button>
          <button 
            id="delete-${index}" 
            data-action="delete" 
            class="py-2 lg:py-3 px-3 lg:px-5 text-zinc-100 text-sm font-bold bg-red-600 hover:ring-2 ring-red-500 rounded-md lg:rounded-lg"
          >
            Deletar
          </button>
        </td>
    </tr>
    `;
  });
}

function resetInputs(name, email, phone, city) {
  name.value = "";
  email.value = "";
  phone.value = "";
  city.value = "";
}

function toggleModals(modal) {
  modal.classList.toggle("hidden");
}

function updateClient(index) {
  clients[index].name = inputClientName.value;
  clients[index].email = inputClientEmail.value;
  clients[index].phone = inputClientPhone.value;
  clients[index].city = inputClientCity.value;
  toggleModals(updateModal);
  resetInputs(
    inputClientName,
    inputClientEmail,
    inputClientPhone,
    inputClientCity
  );

  localStorage.setItem("clients", JSON.stringify(clients));
}

function editClient(index) {
  const client = clients[index];
  let { name, email, phone, city } = client;

  inputClientName.value = name;
  inputClientEmail.value = email;
  inputClientPhone.value = phone;
  inputClientCity.value = city;

  toggleModals(updateModal);
}

function deleteClient(index) {
  clients.splice(index, 1);

  localStorage.setItem("clients", JSON.stringify(clients));
  window.location.reload();
}

function editDelete(e) {
  const type = e.target.dataset.action;
  const index = parseFloat(e.target.id.split("-").pop());

  if (type === "edit") {
    editClient(index);
  }
  if (type === "delete") {
    if (confirm(`Deseja mesmo deletar o(a) cliente ${clients[index].name}?`))
      deleteClient(index);
    else return;
  }
}

updateModalForm.addEventListener("submit", () => {
  if (confirm("Deseja salvar as alterações?")) {
    updateTable();
  } else {
    window.location.reload();
  }
});

newClientsForm.addEventListener("submit", () => {
  const clientName = nameInput.value;
  const clientEmail = emailInput.value;
  const clientPhone = phoneInput.value;
  const clientCity = cityInput.value;

  if (!clientName || !clientEmail || !clientPhone || !clientCity)
    return alert("Todos os campos são obrigatórios!");

  addNewClient(clientName, clientEmail, clientPhone, clientCity);
  toggleModals(newClientsModal);
  resetInputs(nameInput, emailInput, phoneInput, cityInput);
});

tableBody.addEventListener("click", (e) => {
  editDelete(e);
});

openNewClients.addEventListener("click", () => {
  toggleModals(newClientsModal);
});

window.addEventListener("click", (e) => {
  const target = e.target;

  if (target === newClientsModal || target === closeNewClients) {
    toggleModals(newClientsModal);
    resetInputs(nameInput, emailInput, phoneInput, cityInput);
  }
  if (target === updateModal || target === leaveUpdateModal) {
    toggleModals(updateModal);
  }
});

updateClients();
