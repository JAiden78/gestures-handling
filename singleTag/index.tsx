import CustomText from "@components/customText";
import { navigate } from "@services/NavService";
import { COLORS } from "@theme/colors";
import { HP, RF, WP } from "@theme/responsive";
import { ROUTES } from "@utils/routes";
import React, { memo, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

const { WHITE } = COLORS;

const SingleTag = ({
  item,
  userId,
  setShowDelete,
  setTagsList,
  tags,
  zIndexRef,
}: any) => {
  const l = item?.x;
  const t = item?.y;
  const insets = useSafeAreaInsets();
  const deleteButtonLayoutRange = {
    xStart: WP(50) - RF(25),
    xEnd: WP(50) + RF(25),
    yStart: HP(81) + insets.top - RF(30) - RF(36),
    yEnd: HP(81) + insets.top - RF(10),
  };

  const deleteButtonLayoutRangeV2 = {
    xStart: WP(50) - RF(35),
    xEnd: WP(50) + RF(35),
    yStart: HP(81) + insets.top - RF(35) - RF(36),
    yEnd: HP(81) + insets.top,
  };
  const insideDeletePosition = {
    x: WP(50),
    y: HP(81) - RF(16) - RF(27),
  };
  const tagScale = useRef(new Animated.Value(1)).current;
  const scale = useRef({ val: 1 }).current;
  const insideDelete = useRef(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  let lowerXLimit = 0 + 55;
  let lowerYLimit = 0 + 10;
  let upperXLimit = WP(100) - 55;
  let upperYLimit = HP(81) - 28;
  const imageCoordinates = useRef({ x: l, y: t }).current;
  const lastChange = useRef({ x: 0, y: 0 }).current;
  const actualLastChange = useRef({ x: 0, y: 0 }).current;
  const panRef = useRef();

  /**
   * Checks if moved tag is above delete icon.
   * @param event
   * @returns boolean
   */
  const checkOnDelete = (event: any) => {
    let x = event.absoluteX;
    let y = event.absoluteY;
    let layoutRange = insideDelete.current
      ? deleteButtonLayoutRangeV2
      : deleteButtonLayoutRange;
    if (
      x >= layoutRange.xStart &&
      x <= layoutRange.xEnd &&
      y >= layoutRange.yStart &&
      y <= layoutRange.yEnd
    ) {
      return true;
    }
    return false;
  };

  /**
   * Handles gesture on Tag
   */
  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {},
      },
    ],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        if (checkOnDelete(event.nativeEvent)) {
          if (scale.val == 1) {
            insideDelete.current = true;
            let newDx = event.nativeEvent.translationX - actualLastChange.x;
            let toBePosition = imageCoordinates.x + newDx;
            let legalValueX = lastChange.x + newDx;
            legalValueX = legalValueX + (insideDeletePosition.x - toBePosition);
            newDx = legalValueX - lastChange.x;
            imageCoordinates.x = imageCoordinates.x + newDx;
            lastChange.x = legalValueX;

            let newDy = event.nativeEvent.translationY - actualLastChange.y;
            toBePosition = imageCoordinates.y + newDy;
            let legalValueY = lastChange.y + newDy;
            legalValueY = legalValueY + (insideDeletePosition.y - toBePosition);
            newDy = legalValueY - lastChange.y;
            imageCoordinates.y = imageCoordinates.y + newDy;
            lastChange.y = legalValueY;

            Animated.parallel([
              Animated.timing(translateX, {
                toValue: legalValueX,
                useNativeDriver: true,
                duration: 0,
              }),
              Animated.timing(translateY, {
                toValue: legalValueY,
                useNativeDriver: true,
                duration: 0,
              }),
              Animated.timing(tagScale, {
                toValue: 0.1,
                useNativeDriver: true,
                duration: 500,
              }),
            ]).start();
            scale.val = 0.1;
            setTimeout(() => {
              insideDelete.current = false;
            }, 500);
          }
        } else {
          if (scale.val == 0.1) {
            insideDelete.current = false;
            Animated.timing(tagScale, {
              toValue: 1,
              useNativeDriver: true,
              duration: 100,
            }).start();
            scale.val = 1;
          }
          let newDx = event.nativeEvent.translationX - actualLastChange.x;
          let legalValueX = lastChange.x + newDx;
          let updatedX = false;
          if (newDx <= 0) {
            let toBePosition = imageCoordinates.x + newDx;
            if (toBePosition < lowerXLimit) {
              let valueToBeAdded = lowerXLimit - toBePosition;
              legalValueX = legalValueX + valueToBeAdded;
              imageCoordinates.x = lowerXLimit;
              updatedX = true;
            }
            newDx = legalValueX - lastChange.x;
            if (!updatedX) {
              imageCoordinates.x = imageCoordinates.x + newDx;
            }
          } else if (newDx > 0) {
            let toBePosition = imageCoordinates.x + newDx;
            if (toBePosition > upperXLimit) {
              let valueToBeSubtracted = toBePosition - upperXLimit;
              legalValueX = legalValueX - valueToBeSubtracted;
              imageCoordinates.x = upperXLimit;
              updatedX = true;
            }
            newDx = legalValueX - lastChange.x;
            if (!updatedX) {
              imageCoordinates.x = imageCoordinates.x + newDx;
            }
          }
          lastChange.x = legalValueX;

          let newDy = event.nativeEvent.translationY - actualLastChange.y;
          let legalValueY = lastChange.y + newDy;
          let updatedY = false;
          if (newDy <= 0) {
            let toBePosition = imageCoordinates.y + newDy;
            if (toBePosition < lowerYLimit) {
              let valueToBeAdded = lowerYLimit - toBePosition;
              legalValueY = legalValueY + valueToBeAdded;
              imageCoordinates.y = lowerYLimit;
              updatedY = true;
            }
            newDy = legalValueY - lastChange.y;
            if (!updatedY) {
              imageCoordinates.y = imageCoordinates.y + newDy;
            }
          } else if (newDy > 0) {
            let toBePosition = imageCoordinates.y + newDy;
            if (toBePosition > upperYLimit) {
              let valueToBeSubtracted = toBePosition - upperYLimit;
              legalValueY = legalValueY - valueToBeSubtracted;
              imageCoordinates.y = upperYLimit;
              updatedY = true;
            }
            newDy = legalValueY - lastChange.y;
            if (!updatedY) {
              imageCoordinates.y = imageCoordinates.y + newDy;
            }
          }
          lastChange.y = legalValueY;

          Animated.parallel([
            Animated.timing(translateX, {
              toValue: legalValueX,
              useNativeDriver: true,
              duration: 0,
            }),
            Animated.timing(translateY, {
              toValue: legalValueY,
              useNativeDriver: true,
              duration: 0,
            }),
          ]).start();
          actualLastChange.y = event.nativeEvent.translationY;
          actualLastChange.x = event.nativeEvent.translationX;
        }
      },
    }
  );

  const handlePanStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state == State.END) {
      setShowDelete(false);
      //Check if icon is deleted
      if (scale.val == 0.1 || insideDelete.current == true) {
        setTagsList((pre: any[]) => {
          let temp = pre.map((elem: any) => {
            if (elem.localId == item.localId) {
              return {
                ...elem,
                hide: true,
              };
            } else return elem;
          });
          return temp;
        });
        let temp = tags.list.filter(
          (elem: any) => elem.localId != item.localId
        );
        tags.list = temp;
        insideDelete.current = false;
      } else {
        //If tag already exists update its location else add new tag
        let temp: any = [];
        let current: any = null;
        current = null;
        for (let i = 0; i < tags?.list?.length; i++) {
          let elem = tags?.list[i];
          if (elem.localId == item.localId) {
            current = {
              ...elem,
              x: imageCoordinates.x,
              y: imageCoordinates.y,
            };
          } else {
            temp.push(elem);
          }
        }
        temp.push(current);
        tags.list = temp;
      }
      translateY.setOffset(translateY._offset + lastChange.y);
      translateY.setValue(0);
      translateX.setOffset(translateX._offset + lastChange.x);
      translateX.setValue(0);
      lastChange.x = 0;
      lastChange.y = 0;
      actualLastChange.x = 0;
      actualLastChange.y = 0;
    } else if (event.nativeEvent.state == State.BEGAN) {
      setShowDelete(true);

      setTagsList((pre: any) => {
        let temp = pre.map((elem: any) => {
          if (elem.localId == item.localId) {
            return {
              ...elem,
              zIndex: zIndexRef.current + 1,
            };
          } else return elem;
        });
        return temp;
      });

      zIndexRef.current += 1;
    }
  };
  return (
    <PanGestureHandler
      onGestureEvent={onPanEvent}
      onHandlerStateChange={handlePanStateChange}
      ref={panRef}
      enabled={true}
      failOffsetX={[-1000, 1000]}
      activeOffsetX={[0, 0]}
    >
      <Animated.View
        key={item?.localId}
        style={[
          {
            top: t,
            left: l,
            transform: [{ translateX }, { translateY }],
            zIndex: item?.zIndex,
          },
          styles.markerConatiner,
        ]}
      >
        <Animated.View
          style={[
            styles.marker,
            {
              transform: [{ scale: tagScale }],
            },
          ]}
        >
          <Pressable
            style={styles.markerPressable}
            onPress={() => {
              if (item?.id != "") {
                if (item?.isCommunity) {
                  navigate(ROUTES.COMMUNITY_PROFILE, {
                    id: item?.id,
                    data: item,
                  });
                } else
                  navigate(ROUTES.USER_PROFILE, {
                    userId: item?.id,
                    publicView: item?.id != userId,
                  });
              }
            }}
          >
            <View style={styles.markerTop} />
            <CustomText color={WHITE} numberOfLines={1} size={12}>
              {item?.name}
            </CustomText>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

function arePropsEqual(prevProps: any, nextProps: any) {
  return (
    prevProps?.item?.localId == nextProps?.item?.localId &&
    prevProps?.item?.zIndex == nextProps?.item?.zIndex
  );
}
export default memo(SingleTag, arePropsEqual);
