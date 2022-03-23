import React, { PureComponent } from 'react';
import {
  FlatList, StyleSheet
} from 'react-native';
import Separator from './Separator';
import Placeholder from './Placeholder';

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.renderEmptyList = this.renderEmptyList.bind(this);
  }

  renderEmptyList() {
    const { imageSrc, message, hideButton } = this.props;
    return (
      <Placeholder
        imageSrc={imageSrc}
        message={message}
        hideButton={hideButton}
      />
    );
  }

  render() {
    const {
      data, extraData, onRefresh, refreshing, keyExtractor, style,
      hideSeparator, numColumns
    } = this.props;
    const vm = this;
    return (
      <FlatList
        data={data}
        contentContainerStyle={[styles.container, style]}
        style={style}
        numColumns={numColumns || 1}
        initialNumToRender={15}
        extraData={extraData}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={this.renderEmptyList}
        ListFooterComponent={() => !hideSeparator && !refreshing
          && <Separator customStyle={styles.separatorStyle} />}
        ItemSeparatorComponent={() => !hideSeparator
          && <Separator customStyle={styles.separatorStyle} />}
        renderItem={({ item, index }) => vm.props.renderItem({ item, index })
      }
        keyExtractor={keyExtractor}
      />
    );
  }
}

export default List;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  separatorStyle: {
    width: '100%',
  },
  viewEmpty: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
