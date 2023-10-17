import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import pokemonImage from "./assets/Pokemon.png"

function App() {
    const [pokemonList, setPokemonList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false); // Added loading state
    const [error, setError] = useState(null); // Added error state
    const itemsPerPage = 20;
    const pageTitle = "POKEMON";

    async function getPokemon(pokemonId) {
        try {
            const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            return result.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    useEffect(() => {
        setLoading(true); // Set loading to true when fetching data
        setError(null); // Reset error state

        const startIdx = (currentPage - 1) * itemsPerPage + 1;
        const endIdx = currentPage * itemsPerPage;
        const pokemonIds = Array.from({ length: itemsPerPage }, (_, index) => startIdx + index);

        Promise.all(pokemonIds.map(getPokemon))
            .then((pokemonDataList) => {
                const filteredPokemonData = pokemonDataList.filter((data) => data !== null);
                setPokemonList(filteredPokemonData);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch((error) => {
                setError("Error fetching Pokémon data."); // Set error message
                setLoading(false); // Set loading to false in case of an error
            });
    }, [currentPage]);

    const handleNextClick = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <>
            <img
                src={pokemonImage}
                alt="pokemon"
                className="pokemon-image"
            />

            <div className="pagination">
                <button type="button" onClick={handlePreviousClick} disabled={currentPage === 1}>
                    Previous
                </button>
                <button type="button" onClick={handleNextClick}>Next</button>
            </div>

            {loading && <p>Loading...</p>} {/* Display loading indicator */}
            {error && <p>Error: {error}</p>} {/* Display error message */}

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
