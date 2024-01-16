import { atTheRate, chevLeft, newEditIcon, trashV2 } from "@assets/icons";
import CustomLoading from "@components/customLoading";
import PrimaryBtn from "@components/primaryBtn";
import Wrapper from "@components/wrapper";
import { RouteProp } from "@react-navigation/native";
import { COLORS } from "@theme/colors";
import { GST } from "@theme/globalStyles";
import React, { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import SingleTag from "./singleTag";
import styles from "./styles";
import EditCard from "./editCard";
const {
  SECONDARY_BLACK,
  GRADIENT_A,
  GRADIENT_B,
  BLACK,
  ICON_YELLOW,
  PRIMARY,
  WHITE,
} = COLORS;

interface Props {
  navigation: any;
  route: RouteProp<{
    params: {
      type?: any;
      item: any;
      post?: any;
      closeDrawer: () => void;
      index?: number;
    };
  }>;
}

const App = ({ navigation, route }: Partial<Props>) => {
  const { user } = useSelector((state: any) => state.root.user);
  const [post, setPost] = useState<any>(route?.params?.post);
  const mediaIndex = route?.params?.index || 0;
  const [item, setItem] = useState<any>(route?.params?.item);
  const [type, setType] = useState<any>(route?.params?.type);
  const [postSnip, setPostSnip] = useState<any>();
  const shouldUpdatePostSnipDimensions = useRef(true);
  const [mute, setmute] = useState<any>(false);
  const [isVideoPaused, setVideoPaused] = useState<boolean>(true);
  const [saveGesture, setSaveGesture] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [resetAngle, setResetAngle] = useState(false);
  const [addTags, setAddTags] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [postLoaded, setPostLoaded] = useState<boolean>(false);
  const [tagsList, setTagsList] = useState<any[]>([]);
  const tags: any = useRef({ list: [] }).current;
  const editViewRef: any = useRef();
  const postViewRef: any = useRef();

  const zIndex = useRef(1);

  useEffect(() => {
    if (item && type != "post") {
      setPostSnip(item);
    } else if (post && type == "post") {
      setPostSnip(post);
    }
  }, []);

  /**
   * Uploads story. And adds story to redux for local display untill it gets uploaded.
   */
  const addStorySubmit = async (item: any) => {
    //add Story code goes here
  };

  const addStoryHandler = () => {
    if (type?.includes("image") || type == "post") {
      setLoading(true);
      editViewRef.current.capture().then((uri: any) => {
        addStorySubmit({ uri });
      });
    } else {
      addStorySubmit(postSnip);
    }
  };

  /**
   * Edit story handler
   */
  const handleEditing = () => {
    //Edit story code goes here
  };

  const showAddTags = () => setAddTags(true);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Wrapper bgColor={SECONDARY_BLACK} barStyle={"light-content"}>
      <LinearGradient
        colors={[GRADIENT_A, GRADIENT_B]}
        style={styles.headerContainer}
      >
        {!addTags && (
          <>
            <CustomTopIcon
              icon={chevLeft}
              tintColor={BLACK}
              onPress={goBack}
              customStyle={styles.backIcon}
            />
            <CustomTopIcon
              icon={newEditIcon}
              tintColor={ICON_YELLOW}
              onPress={() => {
                handleEditing();
              }}
              customStyle={styles.editIcon}
            />
            <CustomTopIcon
              icon={atTheRate}
              tintColor={PRIMARY}
              onPress={showAddTags}
              customStyle={styles.tagIcon}
            />
          </>
        )}
        {postSnip && (
          <EditCard
            item={postSnip}
            shouldUpdatePostSnipDimensions={shouldUpdatePostSnipDimensions}
            setItem={setPostSnip}
            ref={editViewRef}
            index={mediaIndex}
            postRef={postViewRef}
            paused={isVideoPaused}
            setPaused={setVideoPaused}
            setPostLoaded={setPostLoaded}
            gestureHandler={(key: any, value: any) => {
              setSaveGesture((pre: any) => ({
                ...pre,
                [key]: value,
              }));
            }}
            {...{ resetAngle, setResetAngle, type, mute }}
          />
        )}
        <CustomLoading visible={loading} />

        {tagsList.map((item: any) => {
          if (item?.hide) {
            return null;
          }
          return (
            <SingleTag
              item={item}
              userId={user?.attorney?.id}
              setShowDelete={setShowDelete}
              setTagsList={setTagsList}
              tags={tags}
              zIndexRef={zIndex}
            />
          );
        })}

        {showDelete && (
          <CustomTopIcon
            icon={trashV2}
            tintColor={WHITE}
            onPress={showAddTags}
            customStyle={styles.deleteIcon}
          />
        )}
      </LinearGradient>
      {!addTags && (
        <PrimaryBtn
          title={"Post"}
          customStyle={GST.mx3}
          onPress={addStoryHandler}
          disabled={post && !postLoaded}
        />
      )}
    </Wrapper>
  );
};

const CustomTopIcon = ({
  icon,
  tintColor,
  onPress,
  customStyle,
  onLayout,
}: any) => {
  return (
    <Pressable
      style={[styles.topIconContainer, customStyle]}
      onPress={onPress}
      onLayout={({ nativeEvent }: any) => {
        if (!!onLayout) onLayout(nativeEvent.layout);
      }}
    >
      <FastImage source={icon} style={styles.topIcon} tintColor={tintColor} />
    </Pressable>
  );
};

export default App;
