import axios from 'axios'

const Anki = {
    // The standard AnkiConnect url
    url: 'http://127.0.0.1:8765',

    // Basic AnkiConnect call boilerplate
    request: async (action, params) => {
        return axios
            .post(Anki.url, {
                "action": action,
                "version": 6,
                "params": params
            })
            .then(res => res.data.result);
    },

    // Searches for notes
    // Takes in a search string 
    // Returns array of note ids
    findNotes: (searchString) => {
        return Anki.request("findNotes", {
            "query": searchString
        });
    },

    // Get note informations
    // Takes in an array of Note IDs
    // Returns an array of note objects
    notesInfo: (noteIds) => {
        return Anki.request("notesInfo", {
            "notes": noteIds
        })
    },

    // Adds new notes to Anki
    // Takes in an array of notes
    addNotes: (notesArray) => {
        return Anki.request("addNotes", {
            "notes": notesArray
        })
    },

    // Deletes notes from Anki
    // Takes in an array of Note IDs
    deleteNotes: (noteIds) => {
        return Anki.request("deleteNotes", {
            "notes": noteIds
        })
    },

    // Searches for cards
    // Takes in a search string 
    // Returns array of note ids
    findCards: (searchString) => {
        return Anki.request("findCards", {
            "query": searchString
        })
    },

    // Get card informations
    // Takes in an array of card IDs
    // Returns an array of card objects
    cardsInfo: (cardIds) => {
        return Anki.request("cardsInfo", {
            "cards": cardIds
        })
    },

    // Move cards to a new deck
    // Takes in an array of card IDs and the name of the new deck
    changeDecks: (cardIds, newDeck) => {
        return Anki.request("changeDeck", {
            "cards": cardIds,
            "deck": newDeck
        })
    },

    // Recieve a list of user's tags
    // No input, returns an array of strings
    getTags: async () => {
        return await Anki.request("getTags");
    }
}

export default Anki;