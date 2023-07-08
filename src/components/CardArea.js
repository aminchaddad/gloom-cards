import React from 'react'
import { DropTarget } from 'react-dnd'
import Card from './Card';
import './CardArea.css';

const cardAreaTarget = {
	drop: (props, monitor, component) => {
		const { section, pushCard } = props;
		const sourceObj = monitor.getItem();		
		if ( section !== sourceObj.section ) pushCard(section, sourceObj.card);
		return {
			section
		};
	}
}

function collectTarget(connect, monitor) {
	return { 
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
		hoveredItem: monitor.getItem()
  }
}

const CardArea = ({
	connectDropTarget,
	isOver,
	canDrop,
	cards,
	section,
	title,
	moveCard,
	removeCard,
	isEditing,
	toggleCard,
	character,
	hoveredItem
}) => {
	const isActive = isOver && canDrop && hoveredItem.section !== section;
  return connectDropTarget(
		<div className="card-section">
			<h2 className="card-section__title">{title}</h2>
			<div className="card-area">
				{!isActive && cards.length === 0 &&
					<span>You don't have any cards selected</span>
				}

				{cards.map( (item, i) => (
					<Card
						key={section + item.id}
						character={character}
						id={item.id}
						section={item.section}
						index={i}
						card={item}
						moveCard={moveCard}
						removeCard={removeCard}
						showToggle={isEditing}
						visible={item.visible}
						toggleCard={toggleCard}
					/>
				))}

				{isActive &&
					<div className="card">
						<div className="dummy-card" />
					</div>
				}
			</div>
		</div>
	 
  );
}
export default DropTarget("card", cardAreaTarget, collectTarget)(CardArea);
