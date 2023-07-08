import React, { Component } from 'react'
import './App.css'
import update from 'immutability-helper'
import { Header } from './components/Header'
import { classes } from './data'
import CardArea from './components/CardArea'

class App extends Component {
  state = {
    character: '',
    handCards:[],
    roundCards: [],
    activeCards: [],
    discardedCards: [],
    burnedCards:[],
    editing: false,
  }

  save(character, data) {
    if (!character) character = this.state.character
    if (!data){
      data = {
        handCards: this.state.handCards,
        roundCards: this.state.roundCards,
        activeCards: this.state.activeCards,
        discardedCards: this.state.discardedCards,
        burnedCards: this.state.burnedCards,
      }
    }
    window.localStorage.setItem(character, JSON.stringify(data))
  }

  init(character) {
    if (!character) return false
    const {total, starting, order} = classes[character]
    //"starting = total - 16" instead of putting it in data?
    const handCards = [...Array(total)].map( (e, index) =>
      ({id: order ? order[index] : index+1,
        visible: starting > index, section: 'handCards' })
    )
    this.setState({ handCards }, this.save)
  }

  load(character) {
    const data = window.localStorage.getItem(character)
    if (data) {
      this.setState({ ...JSON.parse(data) })
    } else {
      this.init(character)
    }
  }

  componentDidMount() {
    const character = window.localStorage.getItem('character') || null;
    this.setState({ character })
    this.load(character)
  }

  pushCard(section, card) {
    const newCard = {
      ...card,
      section
    }
		this.setState(update(this.state, {
			[section]: {
				$push: [ newCard ]
			}
		}));
	}

  removeCard(section, index) {		
		this.setState(update(this.state, {
			[section]: {
				$splice: [
					[index, 1]
				]
			}
		}), this.save)
	}

  moveCard(dragIndex, hoverIndex, section) {
		const dragCard = this.state[section][dragIndex];

    this.setState(
      update(this.state, {
        [section]: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        }
      }), this.save)

  }

  switchCharacter(character) {
    this.setState({character: character});
    this.load(character)
    window.localStorage.setItem('character', character)
  }

  toggleCard(index, section) {
    this.setState(
			update(this.state, {
				[section]: {
					[index]: { visible: { $apply: (e) => !e } }
				},
			})
    , this.save)
  }

  toggleEditing() {
    this.setState({editing: !this.state.editing})
  }

  render() {
    const { character } = this.state
    return (
      <div className="App">
        <Header
          switchCharacter={(value) => this.switchCharacter(value)}
          toggleEditing={() => this.toggleEditing()}
          editing={this.state.editing}
          classes={classes}
          character={character}
        />

        <div className="wrapper">

          {!this.state.character &&
            <strong style={{fontSize: 44, color: '#ddd'}}>Pick a character</strong>
          }

          {this.state.character &&
            <>
              <CardArea 
                pushCard={this.pushCard.bind(this)}
                cards={this.state.handCards}
                section="handCards"
                title="Hand Cards"
                moveCard={this.moveCard.bind(this)}
                removeCard={this.removeCard.bind(this)}
                isEditing={this.state.editing}
                toggleCard={this.toggleCard.bind(this)}
                character={this.state.character}
              />
              <CardArea 
                pushCard={this.pushCard.bind(this)}
                cards={this.state.roundCards}
                section="roundCards"
                title="Round Cards"
                moveCard={this.moveCard.bind(this)}
                removeCard={this.removeCard.bind(this)}
                isEditing={this.state.editing}
                toggleCard={this.toggleCard.bind(this)}
                character={this.state.character}
              />
              <CardArea 
                pushCard={this.pushCard.bind(this)}
                cards={this.state.activeCards}
                section="activeCards"
                title="Active Cards"
                moveCard={this.moveCard.bind(this)}
                removeCard={this.removeCard.bind(this)}
                isEditing={this.state.editing}
                toggleCard={this.toggleCard.bind(this)}
                character={this.state.character}
              />
              <CardArea 
                pushCard={this.pushCard.bind(this)}
                cards={this.state.discardedCards}
                section="discardedCards"
                title="Discarded Cards"
                moveCard={this.moveCard.bind(this)}
                removeCard={this.removeCard.bind(this)}
                isEditing={this.state.editing}
                toggleCard={this.toggleCard.bind(this)}
                character={this.state.character}
              />
              <CardArea 
                pushCard={this.pushCard.bind(this)}
                cards={this.state.burnedCards}
                section="burnedCards"
                title="Burned Cards"
                moveCard={this.moveCard.bind(this)}
                removeCard={this.removeCard.bind(this)}
                isEditing={this.state.editing}
                toggleCard={this.toggleCard.bind(this)}
                character={this.state.character}
              />
            </>
          }

        </div>
        <div className="footer">
          Got a question, bug, or suggestion? &nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/aminchaddad/gloom-cards/issues">Submit a Github issue</a>.
        </div>
      </div>
    );
  }
}

export default App;
