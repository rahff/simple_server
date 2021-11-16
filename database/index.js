const mongoose = require('mongoose')


 mongoose.connect("mongodb+srv://rahff:knYD8qcU8fDcfQnS@cluster0.8uowz.mongodb.net/appChat?retryWrites=true&w=majority", ()=>{
    console.log("connected db");
})

