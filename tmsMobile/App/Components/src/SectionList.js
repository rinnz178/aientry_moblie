import React, { PureComponent } from 'react';
import {
  Text, SectionList, StyleSheet
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../../Themes';
import { Separator, Placeholder } from '..';

class sectionlist extends PureComponent {
  constructor(props) {
    super(props);
    this.renderEmptyList = this.renderEmptyList.bind(this);
  }

  renderHeader = (section) => {
    const { headerStyle } = this.props;
    return (
      <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.sectionHeader, headerStyle]}>
        { section }
      </Text>
    );
  };

  renderNoContent = (section) => {
    if (section.data.length === 0) {
      return this.renderEmptyList();
    }
    return null;
  }

  renderEmptyList() {
    const { imageSrc, message, hideButton } = this.props;
    return (
      <Placeholder
        imageSrc={imageSrc}
        message={message}
        hideButton={hideButton}
        onPress={() => this.navigate(null, 'Upgrade')}
      />
    );
  }

  render() {
    const {
      sections, onRefresh, refreshing, keyExtractor, style,
      hideSeparator, extraData, ListFooterComponent
    } = this.props;
    const vm = this;
    return (
      <SectionList
        sections={sections}
        extraData={extraData}
        stickySectionHeadersEnabled={false}
        initialNumToRender={15}
        renderSectionHeader={({ section }) => this.renderHeader(section.title)}
        renderSectionFooter={({ section }) => this.renderNoContent(section)}
        ItemSeparatorComponent={() => !hideSeparator && <Separator />}
        contentContainerStyle={[styles.container, style]}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={this.renderEmptyList}
        ListFooterComponent={ListFooterComponent || null}
        renderItem={({ item }) => vm.props.renderItem({ item })
      }
        keyExtractor={keyExtractor}
      />
    );
  }
}

export default sectionlist;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: '5%',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray
  },
  sectionHeader: {
    fontSize: responsiveFontSize(2.5),
    color: Colors.black,
    marginBottom: '3%'
  },
  emptyText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    paddingHorizontal: '4%'
  }
});
