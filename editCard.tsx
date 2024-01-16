import { useIsFocused } from "@react-navigation/native";
import { WP } from "@theme/responsive";
import { ANDROID } from "@utils/constants";
import React, { forwardRef, useEffect, useState } from "react";
import { Image, LayoutAnimation, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Video from "react-native-video";
import styles from "./styles";

const EditCard = forwardRef(
  (
    {
      item,
      setItem,
      shouldUpdatePostSnipDimensions,
      resetAngle,
      type,
      mute,
      gestureHandler,
      paused,
      setPaused,
    }: any,
    ref: any
  ) => {
    const rotation = useSharedValue(-Math.PI * 180);
    const savedRotation = useSharedValue(-Math.PI * 180);

    useEffect(() => {
      if (resetAngle) rotation.value = 0;
    }, [resetAngle]);

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    /**
     * Handles rotation gesture on Story
     */
    const rotationGesture = Gesture.Rotation()
      .onUpdate((e) => {
        rotation.value = savedRotation.value + e.rotation;
      })
      .onEnd(() => {
        savedRotation.value = rotation.value;
        runOnJS(gestureHandler)("rotationValue", rotation.value);
      })
      .runOnJS(true);

    /**
     * Handles pinch gesture on Story
     */
    const pinchGesture = Gesture.Pinch()
      .onUpdate((e) => {
        scale.value = savedScale.value * e.scale;
      })
      .onEnd(() => {
        savedScale.value = scale.value;
        runOnJS(gestureHandler)("scaleValue", scale.value);
      })
      .runOnJS(true);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          rotateZ: `${(rotation.value / Math.PI) * 180}deg`,
        },
        { scale: scale.value },
      ],
    }));
    const composed = Gesture.Simultaneous(rotationGesture, pinchGesture);
    let calculatedWidth = WP(80);
    let calculatedHeight = WP(90);
    if (item?.width && item?.height) {
      calculatedWidth = WP(100);
      calculatedHeight = (item?.height / item?.width) * calculatedWidth;
    }

    const [dimensions, setDimensions] = useState<any>({
      width: calculatedWidth,
      height: calculatedHeight,
    });

    const isFocused = useIsFocused();

    /**
     * Sets dimensions of video displayed so that aspect ratio is maintained.
     * @param naturalSize
     */
    const onVideoLoad = (naturalSize: {
      width: number;
      height: number;
      orientation: string;
    }) => {
      if (
        ANDROID &&
        (item?.deviceOrientation == 1 || item?.deviceOrientation == 2)
      ) {
        let naturalWidth = naturalSize?.width;
        let naturalheight = naturalSize?.height;

        if (naturalSize?.width >= naturalSize?.height) {
          naturalWidth = naturalSize?.height;
          naturalheight = naturalSize?.width;
        }
        let calculatedWidth = WP(80);
        let calculatedHeight = WP(90);

        calculatedWidth = WP(100);
        calculatedHeight = (naturalheight / naturalWidth) * calculatedWidth;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDimensions({
          width: calculatedWidth,
          height: calculatedHeight,
        });
        if (shouldUpdatePostSnipDimensions.current == true) {
          setItem({
            ...item,
            width: calculatedWidth,
            height: calculatedHeight,
          });
          shouldUpdatePostSnipDimensions.current = false;
        }
        setPaused(false);
      } else {
        let naturalWidth = naturalSize?.width;
        let naturalheight = naturalSize?.height;
        if (
          naturalSize.orientation == "portrait" &&
          naturalSize?.width >= naturalSize?.height
        ) {
          naturalWidth = naturalSize?.height;
          naturalheight = naturalSize?.width;
        }
        let calculatedWidth = WP(80);
        let calculatedHeight = WP(90);

        calculatedWidth = WP(100);
        calculatedHeight = (naturalheight / naturalWidth) * calculatedWidth;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDimensions({
          width: calculatedWidth,
          height: calculatedHeight,
        });
        if (shouldUpdatePostSnipDimensions.current == true) {
          setItem({
            ...item,
            width: calculatedWidth,
            height: calculatedHeight,
          });
          shouldUpdatePostSnipDimensions.current = false;
        }
        setPaused(false);
      }
    };

    /**
     * Sets dimensions of image displayed so that aspect ratio is maintained.
     * @param naturalSize
     */
    const onImageLoad = (width: number, height: number) => {
      let calculatedWidth = WP(80);
      let calculatedHeight = WP(90);
      calculatedWidth = WP(100);
      calculatedHeight = (height / width) * calculatedWidth;
      setDimensions({
        width: calculatedWidth,
        height: calculatedHeight,
      });
    };
    return (
      <View style={[styles.editCardViewShot]}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[animatedStyle, { overflow: "visible" }]}>
            {type?.includes("image") ? (
              <>
                {!item?.id && (
                  <Image
                    source={{ uri: item?.uri }}
                    onLoad={({
                      nativeEvent: {
                        source: { width, height },
                      },
                    }) => {
                      onImageLoad(width, height);
                    }}
                    style={{
                      width: dimensions.width,
                      height: dimensions.height,
                      overflow: "visible",
                    }}
                    resizeMode={"cover"}
                  />
                )}
              </>
            ) : (
              <>
                {isFocused && (
                  <Video
                    source={{ uri: item.uri }}
                    hideShutterView={true}
                    repeat={true}
                    muted={mute}
                    mixWithOthers={"mix"}
                    ignoreSilentSwitch="ignore"
                    resizeMode={"cover"}
                    autoplay={true}
                    style={{
                      width: dimensions.width,
                      height: dimensions.height,
                    }}
                    paused={paused}
                    onLoad={({ naturalSize }: any) => {
                      onVideoLoad(naturalSize);
                    }}
                  />
                )}
              </>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

export default EditCard;
