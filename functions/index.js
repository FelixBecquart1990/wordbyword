//import { request } from 'https';

const functions = require('firebase-functions');

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wordbywordapp.firebaseio.com"
});
/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */


// exports.createUss = functions.firestore
//     .document('words/{wordId}')
//     .onCreate((snap, context) => {
//         // Get an object representing the document
//         // e.g. {'name': 'Marie', 'age': 66}
//         //   const newValue = snap.data();
//         //   console.log(newValue)

//         // perform desired operations ...
//         db.collection('words').get().then(doc => {
//             console.log(doc.val())
//         })
//         return null
//     });



exports.every30Minutes = functions.https.onRequest((request, response) => {

    admin.firestore().collection('users').get()
        .then(snapshot => {
            let listOfUsers = []
            snapshot.forEach(user => {
                if (user.data().token && user.data().notificationsFrequency == "every 30 minutes") {
                    const data = { uid: user.id, token: user.data().token, language: user.data().language }
                    listOfUsers.push(data)
                }
            })
            //response.send(listOfUsers)
            return listOfUsers
        })
        .then(listOfUsers => {
            admin.firestore().collection('words').get()
                .then(snapshot => {
                    let listOfWords = []
                    snapshot.forEach(word => {
                        if (word.data().reported.length < 2) {
                            const data = { word: word.data().word, context: word.data().context, learners: word.data().learners }
                            listOfWords.push(data)
                        }
                    })
                    //response.send(listOfWords)
                    return listOfWords
                })
                .then(listOfWords => {
                    //response.send(listOfWords)
                    listOfWords = listOfWords.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);
                    // for each word
                    listOfWords.forEach(word => {
                        // for each learner
                        //response.send(word.learners)
                        for (let learner in word.learners) {
                            // for each user
                            listOfUsers.forEach((user, index) => {
                                // if user is learner

                                if (user.uid == learner /*&& user.language == word.language*/) {
                                    // send notif of the word
                                    let token = user.token

                                    const payload = {
                                        notification: {
                                            title: word.word,
                                            body: word.context,
                                            tag: 'one-notification-at-a-time',
                                            silent: "true",
                                            color: "#5EBCEE",
                                            badge: 'https://firebasestorage.googleapis.com/v0/b/wordbywordapp.appspot.com/o/favicon-16x16.png?alt=media&token=c4fb7368-83d5-4586-a7a8-9a11938c02ef',
                                            icon: 'https://firebasestorage.googleapis.com/v0/b/wordbywordapp.appspot.com/o/android-chrome-192x192.png?alt=media&token=f75e9376-0d10-4dd7-8f5d-5241accee641'
                                        }
                                    };

                                    // splice this user from listOfUsers
                                    listOfUsers.splice(index, 1)
                                    //response.send(payload)
                                    return admin.messaging().sendToDevice(token, payload);
                                }
                            })

                        }
                    })


                })
            response.send("success")

        })
        .catch(error => {
            //console.log(error)
            response.status(500).send(error)
        })

})

exports.everyDay = functions.https.onRequest((request, response) => {

    admin.firestore().collection('users').get()
        .then(snapshot => {
            let listOfUsers = []
            snapshot.forEach(user => {
                if (user.data().token && user.data().notificationsFrequency == "every day") {
                    const data = { uid: user.id, token: user.data().token, language: user.data().language }
                    listOfUsers.push(data)
                }
            })
            //response.send(listOfUsers)
            return listOfUsers
        })
        .then(listOfUsers => {
            admin.firestore().collection('words').get()
                .then(snapshot => {
                    let listOfWords = []
                    snapshot.forEach(word => {
                        if (word.data().reported.length < 2) {
                            const data = { word: word.data().word, context: word.data().context, learners: word.data().learners }
                            listOfWords.push(data)
                        }
                    })
                    //response.send(listOfWords)
                    return listOfWords
                })
                .then(listOfWords => {
                    //response.send(listOfWords)
                    listOfWords = listOfWords.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);
                    // for each word
                    listOfWords.forEach(word => {
                        // for each learner
                        //response.send(word.learners)
                        for (let learner in word.learners) {
                            // for each user
                            listOfUsers.forEach((user, index) => {
                                // if user is learner

                                if (user.uid == learner /*&& user.language == word.language*/) {
                                    // send notif of the word
                                    let token = user.token

                                    const payload = {
                                        notification: {
                                            title: word.word,
                                            body: word.context,
                                            click_action: "http://wordbywordapp.firebaseapp.com",
                                            tag: 'one-notification-at-a-time',
                                            silent: "true",
                                            color: "#5EBCEE",
                                            badge: 'https://firebasestorage.googleapis.com/v0/b/wordbywordapp.appspot.com/o/favicon-16x16.png?alt=media&token=c4fb7368-83d5-4586-a7a8-9a11938c02ef',
                                            icon: 'https://firebasestorage.googleapis.com/v0/b/wordbywordapp.appspot.com/o/android-chrome-192x192.png?alt=media&token=f75e9376-0d10-4dd7-8f5d-5241accee641'
                                        }
                                    };

                                    // splice this user from listOfUsers
                                    listOfUsers.splice(index, 1)
                                    //response.send(payload)
                                    return admin.messaging().sendToDevice(token, payload);
                                }
                            })

                        }
                    })


                })
            response.send("success")

        })
        .catch(error => {
            //console.log(error)
            response.status(500).send(error)
        })

})
