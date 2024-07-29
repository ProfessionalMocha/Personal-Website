const baseURL = "https://pokeapi.co/api/v2/";
const currentPokemon = [];
const RecievedNumbers = [];
let maxNumber = 1 ;
let rootstyle;
let x;

function getRootStyles(){
    let tempRoot = document.querySelector(':root');
    return getComputedStyle(tempRoot);
}

async function getAllPokemon(){
    let temp = await terrariaFetch("pokemon?limit=1025&offset=0")
    maxNumber = temp.results.length;
}

async function terrariaFetch(requestedValue){
    try{
        let tempPokemon = await fetch(`${baseURL}${requestedValue}`)
        if(tempPokemon.ok){
            let data = await tempPokemon.json()
            return data;
        }
    }
    catch(error){
        throw new Error(error)
    }
}

function PokemonWeakness(types){
    let tempFindingMostWeak = [];
    let tempMostWeak = [{"type": "none" , "amount": 0}];
    let tempArrayWeak = [];

    let tempFindingMostEffective = [];
    let tempMostEffective = [{"type": "none" , "amount": 0}];
    let tempArrayEffective =[];

    for(let x = 0; x < types.length; x++){
        switch(types[x].type.name.toLowerCase()){
            case "bug":
                tempArrayEffective.push("grass", "psychic", "dragon");
                break;
            case "dark":
                tempArrayEffective.push("psychic", "ghost");
                break;
            case "dragon":
                tempArrayEffective.push("dragon");
                tempArrayWeak.push("fairy");
                break;
            case "electric":
                tempArrayEffective.push("water", "fly");
                tempArrayWeak.push("ground");
                break;
            case "fairy":
                tempArrayEffective.push("fighting", "dragon", "dark");
                break;
            case "fighting":
                tempArrayEffective.push("normal", "ice", "rock", "dark", "steel");
                tempArrayWeak.push("ghost");
                break;
            case "fire":
                tempArrayEffective.push("grass", "ice", "bug", "steel");
                break;
            case "ghost":
                tempArrayEffective.push("psychic", "ghost");
                tempArrayWeak.push("normal");
                break;
            case "grass":
                tempArrayEffective.push("water", "ground", "rock");
                break;
            case "ground":
                tempArrayEffective.push("fire", "electric" , "poison", "rock", "steel");
                tempArrayWeak.push("psychic");
                break;
            case "ice":
                tempArrayEffective.push("grass", "ground", "fly", "dragon");
                break;
            case "normal":
                tempArrayWeak.push("ghost");
                break;
            case "poison":
                tempArrayEffective.push("grass", "fairy");
                tempArrayWeak.push("steel");
                break;
            case "psychic":
                tempArrayEffective.push("fighting", "poison");
                break;
            case "rock":
                tempArrayEffective.push("water", "ice", "fly", "bug");
                break;
            case "steel":
                tempArrayEffective.push("ice", "fairy");
                break;
            case "water":
                tempArrayEffective.push("fire", "ground", "rock");
                break;
        }
    }
    if(tempArrayEffective.length){
        tempMostEffective = [{"type": `${tempArrayEffective[0]}` , "amount": 2}];
        for(let x = 0; x < tempArrayEffective.length; x++){
            if(tempFindingMostEffective.includes(tempArrayEffective[x])){
                tempMostEffective = [{"type": `${tempArrayEffective[x]}` , "amount": 4}];
            }
            tempFindingMostEffective.push(tempArrayEffective[x])
        }
    }

    if(tempArrayWeak.length){
        tempMostWeak =  [{"type": `${tempArrayWeak[0]}` , "amount": 2}]
        for(let x = 0; x < tempArrayWeak.length; x++){
            if(tempFindingMostWeak.includes(tempArrayWeak[x])){
                tempMostWeak = [{"type": `${tempArrayWeak[x]}` , "amount": 2}]
            }
            tempFindingMostWeak.push(tempArrayWeak[x])
        }
    }
    let returnValue = [];
    returnValue.push(tempMostWeak[0], tempMostEffective[0])
    return (returnValue)
}

function getRandonInt(ceilingNumber){
    let temptesting = Math.floor(Math.random()* ceilingNumber);
    console.log(temptesting)
    return temptesting;
}

function createElementandAppend(type, attributeValuePair, allTexts, parentElement){
    let tempElement = combineElementCreation(type, attributeValuePair,allTexts)
    parentElement.appendChild(tempElement);
}

function combineElementCreation(type, attributeValuePair, allTexts){
    let tempElement = document.createElement(type)
    for(x = 0; x < attributeValuePair.length; x++){
        tempElement.setAttribute(attributeValuePair[x].class, attributeValuePair[x].value)
    }
    for(x = 0; x < allTexts.length; x++){
        tempElement.appendChild(document.createTextNode(allTexts[x]))
    }
    return tempElement;
}

async function addPokemonCard(tempPokemon, pokemonNumber){
    let shiny = 4 == getRandonInt(5);
    let pokemonSpeciesInfo = await getPokemonSpeciesInfo(pokemonNumber, tempPokemon.name)
    let pokemonType = tempPokemon.types[0].type.name;
    let tempPokemonInfo = PokemonWeakness(tempPokemon.types);
    let CardContainer = document.getElementById("CardContainer");
    let tempCard = combineElementCreation("div", [{class:"class", value: "Pokemon-card"},{class:"id",value:"testing"},{class:"style", value: `background-color:var(--${pokemonType})`}], [])
    let closingIcon = combineElementCreation("img", [{class:"class", value: "closeCard"},{class:"src", value: "/assets/closeIcon.png"}], []);
    createElementandAppend("img", [{class:"class", value: "pokemon-img pokemonCardBack"},{class:"src", value: "assets/pokemonBack.png"}], [], tempCard);
    tempCard.appendChild(closingIcon)
    if(!(pokemonSpeciesInfo.previousEvolution.name == null)){
        let previousEvolutionContainer =  combineElementCreation("div", [{class:"class", value: "previousPokemon"}], [])
        createElementandAppend("h5", [{class:"class", value: "Pokemon-header Pokemon-Stage"}], [`Stage ${pokemonSpeciesInfo.stage}`], previousEvolutionContainer);
        createElementandAppend("img", [{class:"class", value: "pokemon-img previousPokemonImage"},{class:"src", value: `${pokemonSpeciesInfo.previousEvolution.picture}`}], [], previousEvolutionContainer);
        tempCard.appendChild(previousEvolutionContainer);
    }
    else{
        createElementandAppend("h5", [{class:"class", value: "Pokemon-header basicPokemon"}], ["BASIC"], tempCard);
    }
    createElementandAppend("h5", [{class:"class", value: "Pokemon-header"}], [tempPokemon.name], tempCard);
    createElementandAppend("h5", [{class:"class", value: "Pokemon-header Pokemon-hp"}], [` ${tempPokemon.stats[0].base_stat}`], tempCard);
    createElementandAppend("img", [{class:"class", value: "pokemon-img pokemonEnergy"},{class:"src", value: `/assets/${tempPokemon.types[0].type.name}.png`}], [], tempCard);
    let tempCardBody = combineElementCreation("div", [{class:"class", value: "card-body"}, {class:"alt", value:"X"}], [])
    createElementandAppend("img", [{class:"class", value: "pokemon-background"},{class:"src", value:"/assets/background.png"} , {class:"alt", value:tempPokemon.name}], [], tempCardBody)
    createElementandAppend("img", [{class:"class", value: "pokemon-img"},{class:"src", value:shiny?tempPokemon.sprites.front_shiny:tempPokemon.sprites.front_default}, {class:"alt", value:tempPokemon.name}], [], tempCardBody)
    tempCard.appendChild(tempCardBody)
    createElementandAppend("h1", [{class:"class", value: "Image-text"}], [`NO. ${pokemonNumber} ${tempPokemon.types[0].type.name} Pokemon HT:${convertHeight(tempPokemon.height)} WT:${(tempPokemon.weight/4.536).toFixed(1)} lbs`],tempCard)
    let tempListContainer = combineElementCreation("div", [{class:"class", value: "move-list"}], [])
    for(let x = 0; x < Math.min(2,tempPokemon.moves.length) ;x++){
        let tempMoveFlavor = await getMoveFlavorText(tempPokemon.moves[x].move.url);
        let tempMoveContainer = combineElementCreation("div", [{class:"class", value: "move-container"}], []);
        let tempAmmount = getRandonInt(3);
        for(let x = 0; x < 3; x++){
            if(x < tempAmmount){
                createElementandAppend("img", [{class:"class", value: "pokemon-img pokemonEnergy"},{class:"src", value: `/assets/${tempPokemon.types[0].type.name}.png`}], [], tempMoveContainer);
            }
            else{
                createElementandAppend("img", [{class:"class", value: "pokemon-img pokemonEnergy"},{class:"src", value: `/assets/normal.png`}], [], tempMoveContainer);
            }
        }
        createElementandAppend("h4", [{class:"class", value: "move"}], [tempPokemon.moves[x].move.name] ,tempMoveContainer)
        createElementandAppend("h4", [{class:"class", value: "move move-damage"}], [tempMoveFlavor.power] ,tempMoveContainer)
        createElementandAppend("h4", [{class:"class", value: "move move-flavor"}], [tempMoveFlavor.moveFlavorText] ,tempMoveContainer)
        tempListContainer.appendChild(tempMoveContainer);
    }
    tempCard.appendChild(tempListContainer)
    let tempBottomSection = combineElementCreation("div", [{class:"class", value: "Card-Bottom-Section"}], [])
    createElementandAppend("h5", [{class:"class", value: "Card-Buttom-Info Card-Bottom-Weak"}], [`Weak: ${tempPokemonInfo[0].amount? `${tempPokemonInfo[0].amount} X ${tempPokemonInfo[0].type}`: "none"}`], tempBottomSection)
    createElementandAppend("h5", [{class:"class", value: "Card-Buttom-Info Card-Bottom-Effective"}], [`Resist: ${tempPokemonInfo[1].amount? `${tempPokemonInfo[1].amount} X ${tempPokemonInfo[1].type}`: "none"}`] ,tempBottomSection)
    createElementandAppend("h5", [{class:"class", value: "Card-Bottom-FlavorText"}], [`${pokemonSpeciesInfo.FlavorText}`] ,tempBottomSection)
    tempCard.appendChild(tempBottomSection)
    tempCard.addEventListener("click", () =>{
        let tempAudio = new Audio(tempPokemon.cries.latest);
        tempAudio.volume = .2;
        tempAudio.play()
    })
    closingIcon.addEventListener("click", ()=>{
        tempCard.remove();
        removeFromCurrentPokemon(tempPokemon.name)
    })
    let tempCardContainer = combineElementCreation("div", [{class:"class", value: "PokemonCardContainer"}], [])
    tempCardContainer.appendChild(tempCard)
    CardContainer.appendChild(tempCardContainer)
}

function convertHeight(Height){
    let heightInches = Height/3.048;
    heightInches = heightInches.toFixed(1);
    let splitHeight = heightInches.toString().split(".")
    return (`${splitHeight[0]}'${Math.round(splitHeight[1]*1.2)}'' `)

}

async function addingPokemon(){
    let random = getRandonInt(maxNumber);
    if(RecievedNumbers.includes(random)){
        random += 1;
    }
    RecievedNumbers.push(random);
    terrariaFetch(`pokemon/${random}`).then( (tempPokemon) => { 
        currentPokemon.push(tempPokemon);
        addPokemonCard(tempPokemon, random);
    })
}

async function getMoveFlavorText(fetchURL){
    let returnValue = {moveFlavorText: null, power: 0} ;
    let response = await fetch(fetchURL);
    if(response.ok){
        response = await response.json();
        if(!(response.power == null)){
            returnValue.power = response.power;
        }
        for(let x = 0; x < response.flavor_text_entries.length; x++){
            if(response.flavor_text_entries[x].language.name === "en"){
                returnValue.moveFlavorText = response.flavor_text_entries[x].flavor_text;
                break;
            }
        }
    }
    return returnValue;
}

async function getPokemonSpeciesInfo(pokemonNumber, pokemonName){
    let tempFlavor = await terrariaFetch(`pokemon-species/${pokemonNumber}`);
    let returnValue = {"FlavorText": "","stage": await getStageNumber(tempFlavor.evolution_chain, pokemonName) , "previousEvolution":  await getPreviousEvolution(tempFlavor.evolves_from_species)};
    for(let x = 0; x < tempFlavor.flavor_text_entries.length; x++){
        if(tempFlavor.flavor_text_entries[x].language.name === "en"){
            if(tempFlavor.flavor_text_entries[x].flavor_text.length < 120){
                returnValue.FlavorText = tempFlavor.flavor_text_entries[x].flavor_text;
                break;
            }
            else if(returnValue.FlavorText.length == 0 || tempFlavor.flavor_text_entries[x].flavortext < returnValue.FlavorText.length){
                returnValue.FlavorText = tempFlavor.flavor_text_entries[x].flavor_text;
                returnValue.FlavorText = returnValue.FlavorText.split(".")[0]
            }
        }
    }
    return returnValue;
}

async function getStageNumber(Chain_info_Object, pokemonName){
    let tempFetch = await fetch(Chain_info_Object.url);
    if(tempFetch.ok){
        tempFetch = await tempFetch.json();
        return findingStage(tempFetch.chain, pokemonName, 0);
    }
}

function findingStage(chainObject, referenceName, stage){
    stage += 1;
    if(chainObject.evolves_to.length){
        if(chainObject.evolves_to[0].species.name === referenceName){
            return stage;
        }
    }
    else{
        return stage;
    }
    return findingStage(chainObject.evolves_to[0], referenceName, stage);
}

async function getPreviousEvolution(PokemonName){
    let returnValue = {"name": null, "picture":null};
    if(!(PokemonName == null)){
        try{
            let tempPokemon = await terrariaFetch(`pokemon/${PokemonName.name}`);
            returnValue = {"name": `${tempPokemon.name}` , "picture" : `${tempPokemon.sprites.front_default}`};
        }
        catch(error){
            console.log(error)
        }
    }
    return returnValue;
}

function removeFromCurrentPokemon(pokemonName){
    for(let x = 0; x < currentPokemon.length; x++){
        if(currentPokemon[x].name === pokemonName){
            currentPokemon.splice(x, 1)
            break;
        }
    }
}

function AddingButtons(){
    let firstButton = document.getElementById("flexButtonContainer");
    for(let x = 0; x < 5; x++){
        let tempButton = combineElementCreation("button", [{class:"id", value: `terraria-${x}`},{class:"class", value:"Button"}], ["terraria"])
        firstButton.append(tempButton)
        tempButton.addEventListener("click", (event) => {
            for(let x = 0; x < 6 - currentPokemon.length;x++){
                addingPokemon()
            }
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    AddingButtons();
    getAllPokemon();
    rootstyle = getRootStyles()
})