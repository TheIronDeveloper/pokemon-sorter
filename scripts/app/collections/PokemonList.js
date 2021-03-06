define(['backbone', 'backboneLocalStorage', 'app/models/Pokemon'],
	function(Backbone, BackboneLocalStorage, Pokemon){
	var PokemonList = Backbone.Collection.extend({
		initialize: function() {		
			this.fetch();
		},
		model: Pokemon,
		url: '/scripts/data/pokedex.json',
		localStorage: new Store("pokedex"),
		fetch: function(){
			var listContext = this;
			$.getJSON(listContext.url, function(result){
				// This is dirty and wrong, but I couldn't seem to get native collection.fetch working correctly...
				listContext.reset(result);				
				listContext.trigger('resetComplete');
			});
		},
		filterList: function(options){			
			var searchFilter = options.searchTerm || '',
				sortType = options.sort || 'all',
                pokedexFilter = options.pokedexFilter || 'id';
			searchFilter = searchFilter.toLowerCase();

			var filteredList = this.models.filter(function(pokemon){
				var pokemonName = pokemon.get("name").toLowerCase(),
                    isPokemonCaught = pokemon.get("caught");

				if(pokemonName.indexOf(searchFilter) !== -1 && pokemon.get(pokedexFilter) ) {
					if(sortType == "all") {
						return pokemon;
					} else if(sortType == "caught" && isPokemonCaught) {
						return pokemon;
					} else if(sortType == "missing" && !isPokemonCaught) {
						return pokemon;
					}
				}
			});

            if (pokedexFilter !== "id") {
                return _.sortBy(filteredList, function(pokemon){
                    return parseInt(pokemon.get(pokedexFilter));
                });
            } else {
                return filteredList;
            }
		}
	});

	return PokemonList;
});