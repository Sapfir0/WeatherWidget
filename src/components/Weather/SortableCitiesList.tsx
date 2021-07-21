import { IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { Component, CSSProperties } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { BiGridSmall } from 'react-icons/bi';
import { BsTrash } from 'react-icons/bs';
import container from '../../inversify/inversifyContainer';
import { TYPES } from '../../inversify/inversifyTypes';
import { reorder } from '../../services/utils';
import { City } from '../../typings/OWM';
import { WeatherStore } from './WeatherStore';

const getItemStyle = (isDragging: boolean, draggableStyle: any): CSSProperties => ({
    margin: `0 0 5px 0`,
    paddingLeft: '10px',
    background: isDragging ? 'darkgrey' : 'white',
    borderRadius: '5px',
    ...draggableStyle,
});

export interface SortableCitiesListProps {
    items?: City[];
}

export interface SortableCitiesListState {
    items: City[];
}

export const SortableCitiesList = observer(
    class SortableCitiesList extends Component<SortableCitiesListProps, SortableCitiesListState> {
        private weatherStore = container.get<WeatherStore>(TYPES.WeatherStore);
        constructor(props: SortableCitiesListProps) {
            super(props);
            this.state = {
                items: props.items ?? [],
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
            this.weatherStore.reorder(result.source.index, result.destination.index);
        };

        removeCity = (city: City) => {
            this.setState({
                items: this.state.items.filter((c) => c.id !== city.id),
            });
            this.weatherStore.removeCity(city);
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
                                                <div className="trash-button">
                                                    <BiGridSmall />
                                                    {item.name}
                                                    <IconButton onClick={() => this.removeCity(item)}>
                                                        <BsTrash />
                                                    </IconButton>
                                                </div>
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
    },
);
