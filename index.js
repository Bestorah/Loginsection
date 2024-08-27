const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")


const app = express()
dotenv.config()

const port = process.env.PORT || 5757

mongoose.connect(process.env.MONGODB_URL, {
    // useNewURLParser: true,
    // useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// registration schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    gender: String,
    phoneNumber: String,
    payVisit: String,
    knowUs: String,
    address: String,
    occupation: String,
    prayerRequest: String
})

// mode of registration
const registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.get("/", (req, res) => {
//     const filePath = path.join('./pages(1)/pages/index.html');
//     console.log('serving file from:', filePath);
//     res.sendFile(filePath)
// });

app.get("/", (req, res) => {
    const filePath = path.join(__dirname, 'pages(1)', 'pages', 'index.html');
    console.log('Serving file from:', filePath);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving file:', err);
            res.status(500).send('Error serving file.');
        }
    });
});


app.post("/register", async (req, res) => {
    try {
        const { name, email, password, gender, phoneNumber, payVisit, knowUs, address, occupation, prayerRequest } = req.body;
        // To check for an existing user
        const existingUser = await registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new registration({
                name,
                email,
                password,
                gender,
                phoneNumber,
                payVisit,
                knowUs,
                address,
                occupation,
                prayerRequest
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else {
            alert("User already exist");
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");

    }
});

app.get("/success", (req, res) => {
    const filePath = path.join(__dirname, './pages(1)/pages/success.html')
    console.log('serving file from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving file:', err);
            res.status(500).send('Error serving file.');
        }
    });

});
app.get("/error", (req, res) => {
    const filePath = path.join(__dirname, "./pages(1)/pages/error.html")
    console.log('serving file from:', filePath);
    res.sendFile(filePath);
});


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});