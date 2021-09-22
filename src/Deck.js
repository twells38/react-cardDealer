import React, { Component } from "react";
import Card from "./Card";
import "./Deck.css";
import axios from "axios";

const API_BASE_URL = "https://www.deckofcardsapi.com/api/deck";

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = { deck: null, drawn: [] };
    this.getCard = this.getCard.bind(this);
  }
  async componentDidMount() {
    let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
    this.setState({ deck: deck.data });
  }
  async getCard() {
    let deck_id = this.state.deck.deck_id;
    try {
      let cardUrl = `${API_BASE_URL}/${deck_id}/draw/`;
      let cardRes = await axios.get(cardUrl);
      if (!cardRes.data.success) {
        throw new Error("No card remaining!");
      }

      let card = cardRes.data.cards[0];
      //setState to update the drawn array
      this.setState(st => ({
        drawn: [
          ...st.drawn,
          {
            id: card.code,
            image: card.image,
            name: `${card.value} of ${card.suit}`
          }
        ]
      }));
    } catch (err) {
      alert(err);
    }
  }

  render() {
    //map over all drawn cards from this.state
    //and create new card component from each one
    const cards = this.state.drawn.map(c => (
      <Card key={c.id} name={c.name} image={c.image} />
    ));
    return (
      <div className="Deck">
        <h1 className="Deck-title">🃑 card dealer 🃁</h1>
        <h2 className="Deck-title subtitle">♠︎ A project made with React ♦︎</h2>
        <button className="Deck-btn" onClick={this.getCard}>
          get card!
        </button>
        <div className="Deck-cardarea">{cards}</div>
      </div>
    );
  }
}

export default Deck;
