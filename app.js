const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

// init app & middleware

const app = express()
app.use(express.json())

// db connection
let db


connectToDb((err) =>{
   if (!err){
    app.listen(3000, ()=>{
        console.log('listening on port 3000');
    })
    db = getDb()
   } 
})



// routes myPronest
app.get('/myPronest', (req, res) => {

    // current page
    //const page = req.query.p || 0
    
    let myPronest = []


    db.collection('myPronest')
    .find()  // cursor toArray forEach 
    .sort({rank:-1})
    .forEach(myPrones => myPronest.push(myPrones))
    .then(()=> {
        res.status(200).json(myPronest)
    })
    .catch(()=> {
        res.status(500).json({error: 'Could not find the documents'})
    })
})

app.get('/myPronest/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)){

        db.collection('myPronest')
        .findOne({_id: ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not find the documents'})
        })

    }else {
        res.status(500).json({error: 'Not a valid doc id'})
    }

})

app.post('/myPronest',(req ,res)=>{
    const city = req.body

    db.collection('myPronest')
    .insertOne(city)
    .then(result => {
       res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({err:"could not create new document"})
    })
})

app.delete('/myPronest/:id',(req,res) => {

    if (ObjectId.isValid(req.params.id)){

        db.collection('myPronest')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not delete the documents'})
        })

    }else {
        res.status(500).json({error: 'Not a valid doc id'})
    }


})

app.patch('/myPronest/:id',(req,res)=>{
    const updates = req.body

    
    if (ObjectId.isValid(req.params.id)){

        db.collection('myPronest')
        .updateOne({_id: ObjectId(req.params.id)},{$set: updates})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not update the documents'})
        })

    }else {
        res.status(500).json({error: 'Not a valid doc id'})
    }

})