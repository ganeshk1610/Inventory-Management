// const mongoose = require("mongoose");
// const uri = "mongodb+srv://GaneshKonga:Ganesh@8688@mycluster.5tbb8.mongodb.net/InventoryManagementApp?retryWrites=true&w=majority";


// function main() {
//     mongoose.connect(uri).then(() => {
//         console.log("Succesfull")
    
//     }).catch((err) => {
//         console.log("Error: ", err)
//     })
// }

// module.exports = { main };


const mongoose = require("mongoose");
const uri = "mongodb+srv://GaneshKonga:Ganesh%408688@mycluster.5tbb8.mongodb.net/InventoryManagementApp?retryWrites=true&w=majority";

function main() {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error: ", err);
    });
}

// main();

module.exports = { main };
