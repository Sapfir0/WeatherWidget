import { IconButton } from '@material-ui/core';
import React, { Component, CSSProperties } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { BsTrash } from 'react-icons/bs';
import { reorder } from '../../services/utils';
import { City } from '../../typings/OWM';


const getItemStyle = (isDragging: boolean, draggableStyle: any): CSSProperties => ({
    margin: `0 0 5px 0`,
    paddingLeft: '4px',
    background: isDragging ? 'grey' : 'darkgrey',
    ...draggableStyle,
});

export interface SortableCitiesListProps {
    items: City[];
}

export interface SortableCitiesListState {
    items: City[];
}

export class SortableCitiesList extends Component<SortableCitiesListProps, SortableCitiesListState> {
    constructor(props: SortableCitiesListProps) {
        super(props);
        this.state = {
            items: props.items,
        };
    }



    onDragEnd = (result: DropResult) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        this.setState({
            items: reorder(this.state.items, result.source.index, result.destination.index),
        });
    };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {this.state.items.map((item: City, index: number) => (
                                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                        >
                                            {item.name}
                                            <IconButton>
                                                <BsTrash />
                                            </IconButton>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}
