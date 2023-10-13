//initializing the app
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsementsfeed-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

// functional variables for user inpu
const endorsementInput = document.getElementById("endorsementInput")
const fromInput = document.getElementById("fromInput")
const toInput = document.getElementById("toInput")
const publishEndorsementBtn = document.getElementById("publishEndorsementBtn")
const endorsementOutputContainer = document.getElementById("endorsementsOutputContainer")
let likeBtn = document.querySelectorAll("likes");




//creating and pushing the database object
publishEndorsementBtn.addEventListener("click", function(){
    let endorsementMessageValue = endorsementInput.value    
    let fromInputValue = fromInput.value
    let toInputValue = toInput.value
    let likesValue = ""
    // creating object utilizing the variables
    let endorsementMessage = {
        message: endorsementMessageValue,
        from: fromInputValue,
        to: toInputValue,
        likes: likesValue
    }

    clearInputs()
    push(endorsementListInDB, endorsementMessage)
})

//getting the data form the database

onValue(endorsementListInDB, function(snapshot){
    if (snapshot.exists()) {
        let messagesObject = Object.values(snapshot.val())
      
        endorsementOutputContainer.innerHTML = ""

        for (let i = 0; i < messagesObject.length; i++) {
            let currentObject = messagesObject[i];
            //console.log(currentObject)
            appendEndorsement(currentObject)
        }
    }

})

function clearInputs() {
    endorsementInput.value = "" 
    fromInput.value = ""
    toInput.value = ""
}

function appendEndorsement(object) {
    let message = object.message;
    let fromWhom = object.from
    let toWhom = object.to
    //console.log(`Ich bin die aktuelle Nachricht ${message}`)
    //console.log(`Ich bin der Absender ${fromWhom}`)
    //console.log(`Ich bin der Empfänger ${toWhom}`)

    let endorsementCard = document.createElement("div");
    endorsementCard.className = "endorsementCard"

    let endorsementFooter = document.createElement("div");
    endorsementFooter.classList.add("endorsementFooter", "flex")

    //toUser initialization
    let toUserText = document.createElement("p");
    toUserText.className = "toUser"
    toUserText.textContent = `To ${toWhom}`

    //message initialization 
    let endorsementText = document.createElement("p")
    endorsementText.className = "endorsementText"
    endorsementText.textContent = message

    //from initialization 

    let fromUserText = document.createElement("p");
    fromUserText.className = "fromUser"
    fromUserText.textContent = `From ${fromWhom}`

    // likes initialization

    let likes = document.createElement("p");
    likes.className = "likes"
    likes.textContent = "❤️"

    //outputting the elements in order of appearance in the DOM
    endorsementOutputContainer.appendChild(endorsementCard);
    endorsementCard.appendChild(toUserText)
    endorsementCard.appendChild(endorsementText)
    endorsementCard.appendChild(endorsementFooter)
    endorsementFooter.appendChild(fromUserText)
    endorsementFooter.appendChild(likes)
}



// Event listener to update the likes value for each endorsement card
endorsementOutputContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('likes')) {
        // Find the specific endorsement card element
        let endorsementCard = event.target.closest('.endorsementCard');
        if (endorsementCard) {
            // Find the corresponding like count
            let likesElement = endorsementCard.querySelector('.likes');
            // Update the likes value
            let currentLikes = parseInt(likesElement.dataset.likes || 0);
            currentLikes++;
            // Update the likes value in the dataset
            likesElement.dataset.likes = currentLikes;
            // Update the visual likes display
            likesElement.textContent = `❤️ ${currentLikes}`;

            // Update the likes value in the database
            let key = endorsementCard.getAttribute('data-key');
            if (key) {
                const endorsementRef = ref(database, `endorsementList/${key}/likes`);
                set(endorsementRef, currentLikes);
            }
        }
    }
});
