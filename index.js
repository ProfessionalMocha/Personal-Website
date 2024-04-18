const baseURL = "https://pokeapi.co/api/v2/pokemon/";
const currentPokemon = [];
const RecievedNumbers = [];
let maxNumber = 1 ;

setup()
AddingButtons()

async function getAllPokemon(){
    let temp = await terrariaFetch("?limit=1025&offset=0")
    return temp.results.length;
}

async function setup(){
    maxNumber = await getAllPokemon();
}

async function terrariaFetch(requestedValue){
    try{
        let response = await fetch(`${baseURL}${requestedValue}`)
        if(response.ok){
            let data = await response.json()
            return data;
        }
    }
    catch(error){
        throw new Error(error)
    }
}

function getRandonInt(){
    return Math.floor(Math.random()* maxNumber);
}

function combineElementCreation(type, attributeValuePair, allTexts){
    let tempElement = document.createElement(type)
    for(let x = 0; x < attributeValuePair.length; x++){
        tempElement.setAttribute(attributeValuePair[x].class, attributeValuePair[x].value)
    }
    for(let x = 0; x < allTexts.length; x++){
        tempElement.appendChild(document.createTextNode(allTexts[x]))
    }
    return tempElement;
}

function addPokemonCard(tempPokemon){
    console.log(tempPokemon)
    let CardContainer = document.getElementById("CardContainer");
    let tempCard = combineElementCreation("div", [{class:"class", value: "Pokemon-card"},{class:"id",value:"testing"},{class:"style", value: `background-color:var(--${tempPokemon.types[0].type.name})`}], [])
    let tempTitle = combineElementCreation("h5", [{class:"class", value: "Pokemon-name"}, {class:"id",value:"Pokemon-header"}], [tempPokemon.name])
    let tempHP = combineElementCreation("h5", [{class:"class", value: "Pokemon-hp"}, {class:"id",value:"Pokemon-header"}, {class:"style", value: 'text-align:right'}], [`hp ${tempPokemon.stats[0].base_stat}`])
    tempCard.appendChild(tempTitle)
    tempCard.appendChild(tempHP)
    let tempCardBody = combineElementCreation("div", [{class:"class", value: "card-body"}], [])
    let tempPicture = combineElementCreation("img", [{class:"class", value: "pokemon-img"},{class:"src", value:tempPokemon.sprites.front_default}, {class:"alt", value:tempPokemon.name}], [])
    tempCardBody.appendChild(tempPicture)
    tempCard.appendChild(tempCardBody)
    let tempListContainer = combineElementCreation("ul", [{class:"class", value: "move-list"}], [])
    for(let x = 0; x < 2 ;x++){
        let tempList = combineElementCreation("li", [{class:"class", value: "move"}], [tempPokemon.moves[x].move.name])
        tempListContainer.appendChild(tempList)
    }
    tempCard.appendChild(tempListContainer)
    CardContainer.appendChild(tempCard)
}

async function addingPokemon(){
    let random = getRandonInt();
    let tempPokemon = await terrariaFetch(random)
    RecievedNumbers.push(random)
    currentPokemon.push(tempPokemon);
    addPokemonCard(tempPokemon)
}

function AddingButtons(){
    let firstButton = document.getElementById("flexButtonContainer");
    for(let x = 0; x < 5; x++){
        let tempButton = combineElementCreation("button", [{class:"id", value: `terraria-${x}`},{class:"class", value:"Button"}], ["terraria"])
        firstButton.append(tempButton)
        tempButton.addEventListener("click", (event) => {
            addingPokemon()
        })
    }
}