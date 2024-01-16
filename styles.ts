import { COLORS } from "@theme/colors";
import { GST } from "@theme/globalStyles";
import { HP, RF, WP } from "@theme/responsive";
import { StyleSheet } from "react-native";

const { GRAY_II, GRADIENT_B, WHITE } = COLORS;

const styles = StyleSheet.create({
  headerContainer: {
    borderRadius: RF(24),
    alignItems: "center",
    height: HP(81),
    overflow: "hidden",
  },

  btnContainer: {
    backgroundColor: GRAY_II,
    width: RF(40),
    height: RF(40),
    borderRadius: RF(20),
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  editCardViewShot: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  previewCardMainContainer: {
    flex: 1,
    justifyContent: "center",
  },
  previewCardViewShot: {
    borderRadius: RF(16),
    backgroundColor: WHITE,
    padding: RF(10),
    width: WP(80),
  },
  previewCardHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...GST.mb2,
  },
  userRoleTxt: {
    marginTop: RF(2),
  },
  previewCardImage: {
    width: "100%",
    height: HP(30),
    alignSelf: "center",
  },
  topIconContainer: {
    backgroundColor: WHITE,
    width: RF(36),
    height: RF(36),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RF(18),
  },
  topIcon: {
    width: RF(22),
    height: RF(22),
  },
  backIcon: {
    left: RF(14),
    top: RF(14),
    position: "absolute",
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  editIcon: {
    right: RF(58),
    top: RF(14),
    position: "absolute",
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  tagIcon: {
    right: RF(14),
    top: RF(14),
    position: "absolute",
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  deleteIcon: {
    bottom: RF(16),
    left: WP(50) - RF(18),
    backgroundColor: GRADIENT_B,
    borderWidth: 1,
    borderColor: WHITE,
    position: "absolute",
  },
});

export default styles;
