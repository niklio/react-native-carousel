import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, ScrollView } from 'react-native';
import styled from 'styled-components/native';

const CarouselStyle = {
  Root: styled(ScrollView)`
    display: flex;
    flex: 1;
  `,
  Page: styled.View`padding: 20px 50px;`,
  PageContent: styled(Animated.View)`
    display: flex;
    flex: 1;
  `,
};
type CarouselProps = {
  children: Array<PropTypes.element>,
  setSelectedChild: PropTypes.element,
};
export default class Carousel extends Component {
  constructor(props: PlanSelectorProps) {
    super(props);
    this.horizontalOffset = new Animated.Value(0);
  }

  componentDidMount() {
    const children = this.props.children;
    if (children.length != 0) {
      this.props.setSelectedChild(children[0]);
    }
  }

  onScroll = event => {
    const scrollX = event.nativeEvent.contentOffset.x;
    this.horizontalOffset.setValue(scrollX);

    const { width } = Dimensions.get('window');
    const selectedChildIdx = Math.round(scrollX / width);
    const selectedChild = this.props.children[selectedChildIdx];
    this.props.setSelectedChild(selectedChild);
  };

  render() {
    return (
      <CarouselStyle.Root
        scrollEventThrottle={16}
        onScroll={this.onScroll}
        horizontal
        centerContent
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {this.props.children.map((child, idx) => {
          const { width } = Dimensions.get('window');
          const transform = [
            { perspective: 800 },
            {
              rotateY: this.horizontalOffset.interpolate({
                inputRange: [(idx - 1) * width, idx * width, (idx + 1) * width],
                outputRange: ['60deg', '0deg', '-60deg'],
              }),
            },
            {
              scaleY: this.horizontalOffset.interpolate({
                inputRange: [(idx - 1) * width, idx * width, (idx + 1) * width],
                outputRange: [0.5, 1, 0.5],
              }),
            },
            {
              translateX: this.horizontalOffset.interpolate({
                inputRange: [(idx - 1) * width, idx * width, (idx + 1) * width],
                outputRange: [-150, 0, 150],
              }),
            },
          ];

          return (
            <CarouselStyle.Page style={{ width }} key={idx}>
              <CarouselStyle.PageContent style={{ transform }}>
                {child}
              </CarouselStyle.PageContent>
            </CarouselStyle.Page>
          );
        })}
      </CarouselStyle.Root>
    );
  }
}
