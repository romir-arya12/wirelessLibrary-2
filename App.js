import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import TransactionScreen from "./screens/TransactionScreen";
import SearchScreen from "./screens/SearchScreen";
import {createAppContainer} from "react-navigation";
import {createBottomTabNavigator} from "react-navigation-tabs";
import { Transition } from 'react-native-reanimated';

export default class App extends React.Component {
  render(){
    return(
      <AppContainer>

      </AppContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TabNavigator= createBottomTabNavigator({

  Transaction:{screen:TransactionScreen},
  Search:{screen:SearchScreen} 
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:()=>{
      const routeName=navigation.state.routeName;
      if(routeName==="Transaction"){
        return(
          <Image
          source={require("./assets/book.png")}
          style={{
            height:40,
            width:40
          }}/>
        )
      }
      else if(routeName==="Search"){
        return(
          <Image
          source={require("./assets/searchingbook.png")}
          style={{
            height:40,
            width:40
          }}/>
        )
      }
    }
  })
}
)
const AppContainer= createAppContainer(TabNavigator)