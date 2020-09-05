import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TextInput } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import db from '../config';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId:'',
        scannedStudentId:'',
        buttonState: 'normal',
        transationMessage:''
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState}=this.state
      if(buttonState==="BookId"){
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: 'normal'
      });
    }
    else if(buttonState==="StudentId"){
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: 'normal'
      });
    }
    }
    initiateBookIssue=async()=>{
      db.collection('transaction').add({
        'studentId':this.state.scannedStudentId,
        'bookId':this.state.scannedBookId,
        'data':firebase.firestore.Timestamp.now().toDate(),
        'transationType':'Issue'
      })
      db.collection('books').doc(this.state.scannedBookId).update({
        'bookAvailability':false
      })
      db.collection('students').doc(this.state.scannedStudentId).update({
        'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
      })
      this.setState({
        scannedStudentId:'',
        scannedBookId:''
      })
    }
    initiateBookReturn=async()=>{
    db.collection('transaction').add({
      'studentId':this.state.scannedStudentId,
      'bookId':this.state.scannedBookId,
      'data':firebase.firestore.Timestamp.now().toDate(),
      'transationType':'Return'
    })
    db.collection('books').doc(this.state.scannedBookId).update({
      'bookAvailability':true
    })
    db.collection('students').doc(this.state.scannedStudentId).update({
      'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
    })
    this.setState({
      scannedStudentId:'',
      scannedBookId:''
    })
  }
    handleTransaction=async()=>{
      var transationMessage=null
      db.collection('books').doc(this.state.scannedBookId).get()
      .then((doc)=>{
        var book=doc.data()
          if(book.bookAvailability){
            this.initiateBookIssue();
            transationMessage='Book Issued'
          }
        else {
          this.initiateBookReturn();
          transationMessage=('Book Returened')
        }
      })
      this.setState({transationMessage:transationMessage})
    }
    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <View> 
              <Image 
              source={require("../assets/booklogo.jpg")}
              style={{
                height:200,
                width:200
              }}/>
            </View>
            <View style={styles.inputView}>
              <TextInput
              style={styles.inputBox}
              placeholder="Book Id"
              value={this.state.scannedBookId}/>
              <TouchableOpacity
            onPress={()=>{
              this.getCameraPermissions("Book Id")
            }}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
            </View>
            <View style={styles.inputView}>
              <TextInput
              style={styles.inputBox}
              placeholder="Student Id"
              value={this.state.scannedStudentId}/>
              <TouchableOpacity
            onPress={()=>{
              this.getCameraPermissions("Student Id")
            }}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
            </View>
            <TouchableOpacity stlye={styles.submitButton}
            onPress={async()=>{this.handleTransaction()}}>
              <Text stlye={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
        );
      }
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
      textAlign:"center",
      marginTop:10
    },
    inputBox:{
      width:200,
    height:40,
    borderWidth:1.5,
    borderRightWidth:0,
    fontSize:20
    },
    scanButton:{
      backgroundColor:"#66bb6a",
      width:50,
      borderWidth:0.5,
      borderLeftWidth:0
    },
    inputView:{
      flexDirection:"row",
      margin:20
    },
    submitButtonText:{
      padding: 10,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white'
    },
    submitButton:{
      backgroundColor: '#fbc02d',
      width: 100,
      height: 50
    }

  });