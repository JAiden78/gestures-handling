# gestures-handling
A module to demonstrate the handling of pinch, pan and rotate gestures using example of a story (Image/Video). The video/image pinch zoom and rotation is handled in EditCard.tsx file using react-native-gesture-handler. While the tags movement is also handled using react-native-gesture-handler but the pan event is completey customized to restrict the tag within story boundaries and detect if the tag is close to delete icon.

We also use babel module resolver to clean up the imports. So the import statemnent changes from import PrimaryBtn from "../../../../components/primaryBtn"; to import PrimaryBtn from "@components/primaryBtn";

A demo of how the profile screen would look like in an actual mobile app is shown in this [video](https://jmp.sh/FK945kTu).
