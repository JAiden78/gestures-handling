import {COLORS} from '@theme/colors';
import {RF} from '@theme/responsive';
import {StyleSheet} from 'react-native';

const {MARKER} = COLORS;

const styles = StyleSheet.create({
  markerConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    overflow: 'visible',
    width: 1,
  },
  marker: {
    backgroundColor: '#041C2CB2',
    minWidth: 110,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RF(5),
  },
  markerPressable: {
    paddingHorizontal: RF(6),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  markerTop: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 7,
    borderBottomWidth: 10,
    borderLeftWidth: 7,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: MARKER,
    borderLeftColor: 'transparent',
    position: 'absolute',
    top: -10,
  },
});

export default styles;
