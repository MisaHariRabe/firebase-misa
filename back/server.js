const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  preflightContinue: true
}));

const serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-awesome-project-6efcd-default-rtdb.firebaseio.com/"
});

const db = admin.firestore();
app.post('/addUser', async (req, res) => {
  try {
    const userData = req.body;
    const docRef = db.collection('Users').doc();
    await docRef.set(userData);
    res.status(200).send('User inséré avec succés');
  } catch (error) {
    console.error('Erreur sur insertion : ', error);
    res.status(500).send('Erreur sur insertion');
  }
});

app.get('/getUsers', async (req, res) => {
  try {
    const usersRef = db.collection('Users');
    const snapshot = await usersRef.get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error lors de la récupération : ', error);
    res.status(500).send('Erreur lors de la récupération');
  }
});

app.put('/editUser/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;
    await db.collection('Users').doc(id).update(userData);
    res.status(200).send('Utilisateur mis à jour avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).send('Erreur lors de la mise à jour');
  }
});

app.delete('/deleteUser/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('Users').doc(id).delete();
    res.status(200).send('Utilisateur supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).send('Erreur lors de la suppression');
  }
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

