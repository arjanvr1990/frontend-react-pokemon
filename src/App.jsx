import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import pokemonImage from "./assets/Pokemon.png"

function App() {
    const [pokemonList, setPokemonList] = useState([]); // Initialize as an empty array
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const itemsPerPage = 20;
    const pageTitle = "POKEMON";


    async function getPokemon(pokemonId) {
        try {
            const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            console.log(result);
            return result.data; // Return the data
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    useEffect(() => {
        document.title = pageTitle;
        const startIdx = (currentPage - 1) * itemsPerPage + 1;
        const endIdx = currentPage * itemsPerPage;

        // Define the list of Pokémon you want to fetch for the current page
        const pokemonIds = Array.from({ length: itemsPerPage }, (_, index) => startIdx + index);

        // Fetch data for Pokémon and update the state
        Promise.all(pokemonIds.map(getPokemon)) // Fixed the function name here
            .then((pokemonDataList) => {
                // Filter out any null values (errors)
                const filteredPokemonData = pokemonDataList.filter((data) => data !== null);
                setPokemonList(filteredPokemonData);
            });
    }, [currentPage]);


    // Function to handle "Next" button click
    const handleNextClick = () => {
        setCurrentPage(currentPage + 1);
    };

    // Function to handle "Previous" button click
    const handlePreviousClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //Add capital first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <>
            <img
                src={pokemonImage}
                alt="pokemon"
                className="pokemon-image" // Voeg een CSS-klasse toe voor stijling
            />

            <div className="pagination">
                <button type="button" onClick={handlePreviousClick} disabled={currentPage === 1}>
                    Previous
                </button>
                <button type="button" onClick={handleNextClick}>Next</button>
            </div>

            <div className="pokemon-list">
                {pokemonList.map((pokemon) => (
                    <div key={pokemon.id} className="pokemon-details">

                        <h2>{capitalizeFirstLetter(pokemon.name)}</h2>

                        <img
                            src={pokemon.sprites.front_default}
                            alt={`Sprite of ${pokemon.name}`}
                        />
                        <div className="pokemon-list-info">

                        <p>
                            <h3>Moves:</h3>
                            {pokemon.moves.length}
                        </p>

                        <p>
                            <h3>Weight:</h3>
                            {pokemon.weight}
                        </p>

                        <h3>Abilities:</h3>
                        <ul>
                            {pokemon.abilities.map((ability, index) => (
                                <li key={index}>{capitalizeFirstLetter(ability.ability.name)}</li>
                            ))}
                        </ul>

                        </div>

                    </div>
                ))}


            </div>

            <div className="pagination">
                <button type="button" onClick={handlePreviousClick} disabled={currentPage === 1}>
                    Previous
                </button>
                <button type="button" onClick={handleNextClick}>Next</button>
            </div>
        </>
    );
}

export default App;
