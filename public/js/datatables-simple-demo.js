window.addEventListener("DOMContentLoaded", (event) => {
  // Simple-DataTables
  // https://github.com/fiduswriter/Simple-DataTables/wiki

  const datatablesSimple = document.getElementById("datatablesSimple");
  if (datatablesSimple) {
    new simpleDatatables.DataTable(datatablesSimple);
  }

  const listAccount = document.getElementById("listAccount");
  if (listAccount) {
    new simpleDatatables.DataTable(listAccount);
  }

  const listProduct = document.getElementById("listProduct");
  if (listProduct) {
    new simpleDatatables.DataTable(listProduct);
  }
  // $("#listProduct").DataTable();

  const listCategory = document.getElementById("listCategory");
  if (listCategory) {
    new simpleDatatables.DataTable(listCategory);
  }

  const listProducer = document.getElementById("listProducer");
  if (listProducer) {
    new simpleDatatables.DataTable(listProducer);
  }
});
