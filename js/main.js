/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Alex Chu    Student ID: 153954219    Date: 5/31/2023
 *  Assignment 1 API Backend Cyclic Link:      https://alexchu-web422-a1.cyclic.app/
 *  Assignment 2 Frontend Link: https://alexchu-dev.github.io/WEB422-Assignment2/
 ********************************************************************************/
let page = 1; //default current page is 1

const perPage = 10; //default items per page is 10

const baseUrl = "https://alexchu-web422-a1.cyclic.app/api/movies";

const loadMovieData = (title = null) => {
  const paginationController = document.querySelector(".pagination"); //define pagination controller for better organization
  const moviesTable = document.querySelector("#moviesTable");
  const currentPage = document.querySelector("#current-page");
  const detailsModal = document.querySelector("#detailsModal");

  let url = `${baseUrl}?page=${page}&perPage=${perPage}`;

  if (title) {
    title = encodeURIComponent(title);
    page = 1;
    url += `&title=${title}`;
    paginationController.classList.add("d-none"); //to hide the pagination control
  } else {
    paginationController.classList.remove("d-none"); //to show the pagination control
  }

  console.log(url);

  /* The following used a nested fetch which could be avoided by using only one fetch to
    query all the attributes from the data to some variables then manipulate. However, due
    to the assignment instructions, I use these nested fetches which is not as efficient.  
  */
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let movieRows = `
          ${data
            .map(
              (movie) =>
                `<tr data-id=${movie._id}>
                  <td>${movie.year}</td>
                  <td>${movie.title}</td>
                  <td>${movie.plot}</td>
                  <td>${movie.rated}</td>
                  <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60)
                  .toString()
                  .padStart(2, "0")}</td>
                </tr>`
            )
            .join("")}`;

      console.log(data); // Debug, checking data

      moviesTable.innerHTML = movieRows; // using querySelector to insert the movieRows generated above into the table
      currentPage.innerHTML = page; // updating the current page number
      updatedRows = moviesTable.querySelectorAll("tr"); // getting all tr elements only to the updatedRows

      updatedRows.forEach((row) => {
        row.addEventListener("click", (e) => {
          // click event is listened and manipulate the modal
          const movieId = row.getAttribute("data-id");
          fetch(`${baseUrl}/${movieId}`).then((res) => {
            res.json().then((data) => {
              let modalContent = `
             ${
               data.poster
                 ? `<img class="img-fluid w-100" src="${data.poster}"><br><br>`
                 : ""
             }
              <strong>Directed By:</strong> ${data.directors.join(", ")}<br><br>
              <p>${data.fullplot}</p>
              <strong>Cast:</strong> ${
                data.cast ? data.cast.join(", ") : "N/A"
              }<br><br>
              <strong>Awards:</strong> ${data.awards.text} <br>
              <strong>IMDB Rating:</strong> ${data.imdb.rating} (${
                data.imdb.votes
              } votes)
              `;

              detailsModal.querySelector(".modal-title").textContent =
                data.title;
              detailsModal.querySelector(".modal-body").innerHTML =
                modalContent;

              // Display the modal
              let modal = new bootstrap.Modal(
                document.getElementById("detailsModal"),
                {
                  backdrop: "static",
                  keyboard: false,
                }
              );

              modal.show();
            });
          });
        });
      });
    });
};

function paginationHandler() {
  const currentPage = document.querySelector("#current-page");
  document.querySelector("#previous-page").addEventListener("click", (e) => {
    console.log("previous page clicked");
    if (currentPage.innerHTML > 1) {
      currentPage.innerHTML = page--;
      loadMovieData();
    }
  });
  document.querySelector("#next-page").addEventListener("click", (e) => {
    console.log("next page clicked");
    currentPage.innerHTML = page++;
    loadMovieData();
  });
  document.querySelector("#searchForm").addEventListener("submit", (e) => {
    const searchInput = document.querySelector("#title").value;
    e.preventDefault();
    console.log("search clicked");
    console.log(searchInput);
    loadMovieData(searchInput);
  });
  document.querySelector("#clearForm").addEventListener("click", (e) => {
    console.log("clear clicked");
    document.querySelector("#title").value = "";
    loadMovieData();
  });
}
