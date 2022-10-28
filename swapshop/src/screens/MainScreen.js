import {StyleSheet, View, TextInput} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import { ScrollView } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { User_Account } from '../classes/User_Account';
import { Tag } from '../classes/Tag';
import SortBar from '../components/SortBar';
import DropDownPicker from 'react-native-dropdown-picker';
import Tab from '../components/Tab';
import themeContext from '../components/themeContext';
import Trade_List from '../components/Trade_List';
import { user_accounts_item_list, tags_list } from '../helpers/init.js';

// this is the main page
// this is the page the user is taken to after logging in
// the search bar and displayed items are handled here

async function initialise(setLoaded, setTags) {
    user_accounts_item_list.json_items = [];
    await user_accounts_item_list.fetchItems();
    user_accounts_item_list.loadItems(item => {
        return initialiseAccount(item);
    })

    tags_list.json_item = [];
    tags_list.items =[];
    await tags_list.fetchItems();
    tags_list.loadItems((item) => {
        return new Tag(item);
    })

    setLoaded(true);
    setTags(tags_list.getTags())
}

function initialiseAccount(item) {
    let tempUser = new User_Account();
    tempUser.setEmail(item["email"])
    .setFisrtName(item["fname"])
    .setLastName(item["lname"])
    .setID(item["id"])
    .setUsername(item["username"])
    .setInterests(item["tags"])
    .setPhoto(item["photo"]);
    return tempUser; 
}



const MainScreen = ({navigation}) =>{
    const isFocused = useIsFocused(); // check if the main screen is active on screen
    const [loaded, setLoaded] = useState(false);
    
    const [tagMenuOpen, setTagMenuOpen] = useState(false); // set the drop down menu for sorting to closed 
    const [tagValues, setTagValues] = useState([]);
    const [tags, setTags] = useState([]);
    const [sortIndex, setSortIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
     const theme = useContext(themeContext);

    // this function is run when a tracked value is changed
    // specifivally it is used to fetch and reload the list 
    // when the page is loaded
    useEffect(() => {
        initialise(setLoaded, setTags);
    }, [isFocused]);

    // this is used to refresh the list of items on the main screen when the
    // changes between this screen adn another screen or vice versa

    let screen = (<View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.search_Bar, { backgroundColor: theme.profileColor }]}>
            <View style={{flexDirection: 'row', zIndex: 50, paddingBottom: 10, width: "100%"}}>
                <TextInput 
                    style={[styles.TextInput, { backgroundColor: theme.inputColor }]}
                    placeholderTextColor="#3CB371" 
                    placeholder="search" 
                    onChangeText={(value => setSearchTerm(value))}
                />
                <View style={styles.sortMenu}>
                    <SortBar
                        setIndex={setSortIndex}
                        zIndex={50}
                     />
                </View>
            </View>

            <DropDownPicker
                style={[styles.tagMenu, { backgroundColor: theme.inputColor }]}
                open={tagMenuOpen}
                searchable={true}
                placeholder="filter by tag"
                multiple={true}
                itemKey="key"
                min={0}
                max={5}
                mode="BADGE"
                value={tagValues}
                items={tags}
                setOpen={setTagMenuOpen}
                setValue={setTagValues}
                setItems={setTags}
                zIndex={20}
            />
        </View>

        {loaded ? 
            <Trade_List
            available={true}
            sold={false}
            searchTerm={searchTerm}
            sortIndex={sortIndex}
            navigation={navigation}
            tags={tagValues}
        /> : <ScrollView style={styles.center}></ScrollView>}
        

        <Tab style={{position: 'absolute', top: '50'}} nav={navigation} activeTab="home"/>
        </View>);
    
        return screen;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        width:'90%',
        shadowColor: '#3CB371',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5,
        marginTop:10,
        marginTop: 0,
        marginBottom: 60,
        zIndex: -5,
    },
    addItemBtn:{
        width: "70%",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:10,
        backgroundColor:"#2E8B57",
        margin: 2,
      },
      search_Bar: {
        width: '100%',
        padding: 20,
        paddingTop: 50,
        backgroundColor:"#3CB371",
        borderRadius: 5,
      },

      TextInput:{
        padding: 10,
        paddingHorizontal:20,
        color:"gray",
        alignSelf:'center',
        backgroundColor:"#F5F5F5",
        borderRadius:10,
        width: '65%',
        marginHorizontal: 5,
      },
      sortMenu: {
        width: "30%",
        zIndex: 10
    },
});

export default MainScreen;
