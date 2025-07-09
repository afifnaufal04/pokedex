let currentPage = 1;
const listwrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
//const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];
function fetchPokemon(page = 1) {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * 54}&limit=54`)
        .then(response => response.json())
        .then(data => {
            allPokemons= data.results;
            displayPokemons(allPokemons);
            updatePageInfo(page);
        });
}

async function fetchPokemonDataBeforeRedirect(id){
    try{
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()
        ),
    ]);
    return true;
    } catch (error){
        console.error("Failed to Fetch Pokemon data before redirect")
    }
}

function displayPokemons(pokemon){
    listwrapper.innerHTML= '';

    pokemon.forEach(pokemon => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className= "list-item card p-3 " ;
        listItem.innerHTML = `
        <div class="number-wrap text-left">
            <p class="caption-fonts">${pokemonID}</p>
        </div>
        <div class="img-wrap text-center" >
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" style=" width: 150px; height: 120px;"/>
        </div>
        <div class="name-wrap text-center">
            <p class="fw-medium text-capitalize">${pokemon.name}</p>
        </div>
        <div class="text-center">
            <button class="btn btn-primary" onclick="showDetails('${pokemon.url}')">View Details</button>
        </div>
        `;

        listwrapper.appendChild(listItem);
    });
}

searchInput.addEventListener("keyup",handleSearch);

function handleSearch(){
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;
    filteredPokemons= allPokemons.filter((pokemon) => 
        pokemon.name.toLowerCase().startsWith(searchTerm)
    );

    displayPokemons(filteredPokemons);
    if (filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}

// Show Pokémon details in modal
function showDetails(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {

            document.getElementById('pokemonName').textContent = data.name;
            document.getElementById('pokemonImage').src = data.sprites.other['official-artwork'].front_default;
            document.getElementById('pokemonHeight').textContent = data.height;
            document.getElementById('pokemonWeight').textContent = data.weight;
            document.getElementById('pokemonAbilities').textContent = data.abilities.map(a => a.ability.name).join(', ');

            const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
            pokemonModal.show();
        });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchPokemon(currentPage);
    }
}

function nextPage() {
    currentPage++;
    fetchPokemon(currentPage);
}

function updatePageInfo(page) {
    pageInfo.textContent = `Page ${page}`;
}

fetchPokemon();